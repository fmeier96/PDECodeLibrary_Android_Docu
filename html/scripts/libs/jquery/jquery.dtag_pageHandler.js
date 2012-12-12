
(function($) {

	/**
	 * Extend JS native Array() to return last element
	 * @type {Function}
	 */
	Array.prototype.last = Array.prototype.last || function() {
		var l = this.length;
		return this[l-1];
	};

	var $navigation = $('#dtag_left'),
		$content = $('#dtag_initial_content'),
		$main = $('#dtag_main'),
		$mainInner = $('#dtag_main > .dtag-inner'),
		$serviceLevel = $('#dtag_servicelevel'),
		$transitionWrapper,
		opts,
		exports = {

			/**
			 * The pages array
			 *
			 * @type {Array}
			 */
			sections: {},

			/**
			 * The number of active section
			 * since we start with the first pane
			 * this must be 1
			 *
			 * @type {Integer}
			 */
			activeSection: 1,

			/**
			 * The section wrap
			 *
			 * @type {Object}
			 */
			pageWrap: $('<section></section>'),

			/**
			 * If application should be blocked, e.g. when entering from child pages
			 *
			 * @type {Boolean}
			 */
			blockApplication: true,

			/**
			 * Sets a data attribute to the body tag containing the url of the
			 * "first" page - Will be needed to detect if we have to reload the
			 * page when responsive breakpoints are called
			 *
			 * @param {String} url
			 */
			setEnteredOnPageProperty: function(url) {
				$('body').data('enteredOnPage', url);
			},

			/**
			 * Init function, merges option an dispatches
			 *
			 * @param {Object} options
			 */
			initialize: function(options) {

				opts = $.extend({}, $.fn.dtag_pageHandler.defaults, options);

				opts.pageWrap = $(opts.pageWrap);
				opts.pageWrapTagName = opts.pageWrap.prop('tagName').toLowerCase();

				exports.destroy(function() {

					/**
					 * If is not tool root (so maybe children page or non tool-related)
					 * block plugin
					 * TODO replace with URL comparison (data('toolRootUrl'))
					 */
					if ($('body').data('isToolRoot') !== 0) {
						exports.blockApplication = false;
					}

					if (exports.blockApplication === false) {
						exports.setEnteredOnPageProperty(window.location.href);

						$mainInner.css('overflow','hidden');
						if ($('#dtag_transitionwrapper').length === 0) {
							$mainInner.wrapInner($('<div></div>').prop('id','dtag_transitionwrapper'));
							$transitionWrapper = $('#dtag_transitionwrapper');

							// @see http://stackoverflow.com/questions/10416026/what-is-the-ideal-way-to-handle-window-onpopstate-for-all-browsers
							window.setTimeout(function(){
								$(window).on('popstate', function(event) {
									exports.removePage();
								});
							}, 100);

							exports.helpers.wrapInitialContent();
							exports.helpers.setInitialSections();
							exports.helpers.bindLinks();
							exports.isInitialized = true;
						}


					}

				});
			},

			/**
			 * Transition detacher method
			 *
			 * @param {Function} callback
			 */
			destroy: function(callback) {
				exports.helpers.unWrapInitialContent();
				exports.helpers.unBindLinks();

				if (typeof callback == 'function'){
					callback.call(this);
				}
			},

			/**
			 * Append page as last
			 *
			 * @param {Object} page
			 */
			appendPage: function(page) {
				exports.helpers.appendToSectionsArray(page);
				exports.helpers.appendToDom(function(){
					exports.transitToNextPage();
					exports.helpers.updateTitle();
					exports.helpers.updateState();

					if (typeof opts.onPageAppend == 'function'){
						content = opts.onPageAppend.call(this, page);
					} else {
						exports.error('There is no valid onPageAppend callback in jQuery.dtag_pageHandler.' +
							'Current type is ' + typeof opts.onPageAppend);
					}

				});
			},

			/**
			 * Remove the last page
			 */
			removePage: function() {
				if (exports.sections.length > 1) {
					exports.transitToPrevPage(function() {
						exports.helpers.removeFromSectionsArray();
						exports.helpers.removeFromDom();
						exports.helpers.updateTitle();
						exports.helpers.updateState();
					});
				}

			},

			/**
			 * Transition to next page
			 */
			transitToNextPage: function() {
				var length = exports.sections.length;
				exports.activeSection = length;

				switch(opts.transition) {
					case 'slide':
						this.helpers.setDimensions();
						$($transitionWrapper).animate({
							'margin-left': (-(length- 1)*100) + '%'
						});
						break;
					default:
						$('> ' + opts.pageWrapTagName, $transitionWrapper).hide();
						$('> ' + opts.pageWrapTagName + ':last', $transitionWrapper).fadeIn(250);
						break;
				}

				exports.helpers.backButton.handleAppearance();

				// scroll to top
				// TODO ensure that we get old scroll position view when going back to previous pane
				window.scrollTo(0, 0);
			},

			/**
			 * Transition to previous page
			 *
			 * @param {Function} callback
			 */
			transitToPrevPage: function(callback) {
				var length = exports.sections.length;
				exports.activeSection = length - 1;

				var runCallbacks = function() {
					if (typeof callback == 'function'){
						callback.call(this);
					}
				};

				switch(opts.transition) {
					case 'slide':
						$($transitionWrapper).animate({
							'margin-left': (-(length-2)*100 ) + '%'
						}, 250, function() {
							exports.helpers.setDimensions();
							runCallbacks();
						});
						break;
					default:
						$('> ' + opts.pageWrapTagName, $transitionWrapper).hide();
						$('>  ' + opts.pageWrapTagName + ':eq(' + (length-2) + ')', $transitionWrapper).fadeIn(250, function() {
							runCallbacks();
						});
						break;
				}
				exports.helpers.backButton.handleAppearance();


			},

			/**
			 * Helpers/tools
			 */
			helpers: {

				/**
				 * Append page array to sections array
				 *
				 * @param {Array} page
				 */
				appendToSectionsArray: function(page) {
					exports.sections.push(page);
				},

				/**
				 * Append page html & section to DOM
				 *
				 * @param {Function} callback
				 */
				appendToDom: function(callback) {
					var page = exports.sections.last();
					$transitionWrapper.append(page.content);

					if(typeof callback == 'function'){
						callback.call(this);
					}
				},

				/**
				 * Remove last page array from sections array
				 */
				removeFromSectionsArray: function() {
					exports.sections.pop();
				},

				/**
				 * Remove page html & section from DOM
				 */
				removeFromDom: function() {
					$('> ' + opts.pageWrapTagName + ':last', $transitionWrapper).remove();
				},

				/**
				 * Update title in service level
				 */
				updateTitle: function() {
					if (opts.updateTitle === true) {
						var page = exports.sections.last();

						if (typeof opts.onUpdateTitle == 'function'){
							opts.onUpdateTitle.call(this, page);
						} else {
							exports.error('There is no valid onUpdateTitle callback in jQuery.dtag_pageHandler.' +
								'Current type is ' + typeof opts.onUpdateTitle);
						}

					}
				},

				/**
				 * Update browser address bar
				 */
				updateState: function() {
					if (typeof history.pushState === 'function') {
						var page = exports.sections.last();
						window.history.pushState('next page', page.title, page.url);
					}
				},

				/**
				 * Set dimensions of sections!
				 */
				setDimensions: function() {
					var length = exports.sections.length;

					$($transitionWrapper).css({
						'width': length * 100 + '%'
					});

					$($transitionWrapper).find('> ' + opts.pageWrapTagName).css({
						'width': 100 / length + '%'
					});

				},

				/**
				 * Wrap initial content with section wrap
				 */
				wrapInitialContent: function() {
					$content.wrap(opts.pageWrap);
					$('#dtag_left').insertBefore($content);
					$($content.parent()).attr({
						'data-section': 'initial-content'
					});
				},

				/**
				 * Set initial sections
				 */
				setInitialSections: function() {
					// var title = $('.title-bar .headline', $content).html();
					var title = $('.headline', $serviceLevel).html();
					var url = window.location.href;
					exports.sections = [
						{
							title: title,
							url: url,
							content: $content.html()
						}
					];
				},

				/**
				 * Bind content links with ajax events
				 * TODO make link selector configurable
				 */
				bindLinks: function() {

					if (typeof opts.linkBinding == 'function'){
						opts.linkBinding.call(this);
					} else {
						$main.on('click.pagetransition', 'a', function(event) {
							event.preventDefault();
							var trigger = this;

							if (typeof opts.onLinkBinding == 'function'){
								var linkHref = opts.onLinkBinding.call(this);
							} else {
								exports.error('There is no valid onLinkBinding callback in jQuery.dtag_pageHandler.' +
									'Current type is ' + typeof opts.onLinkBinding);
							}

							if (linkHref != '' && linkHref != '#') {
								$.ajax({
									url: linkHref,
									data: opts.ajaxParams,
									success: function(data) {
										if ( data != '' ) {

											if (typeof opts.onResponse == 'function'){
												content = opts.onResponse.call(this, data);
											} else {
												exports.error('There is no valid onResponse callback in jQuery.dtag_pageHandler.' +
													'Current type is ' + typeof opts.onResponse);
											}

											exports.appendPage({
												title: $(data).find('.headline:eq(0)').html(),
												url: linkHref,
												content: content
											});
										}
									}
								});
							}

							return false;
						});
					}
				},

				/**
				 * Reset content to initial styles
				 * Used by detachTransition() function
				 */
				unWrapInitialContent: function() {
					/*if ($content.parent(opts.pageWrapTagName).length > 0) {
						$content.unwrap();
					}
					$($transitionWrapper).removeAttr('style');
					$('> ' + opts.pageWrapTagName, $transitionWrapper).removeAttr('style');*/
				},

				/**
				 * Unbind content links
				 */
				unBindLinks: function() {
					$main.off('click.pagetransition', 'a');
				},

				/**
				 * Back button hndling
				 */
				backButton: {

					/**
					 * The element to attach
					 * TODO make configurable
					 *
					 * @type {Object}
					 */
					element: $('<a href="#" class="back-button button minimal icon-scroll-left clean icon"></a>')
						.append('<span class="icon"></span><span class="buttontext">Back</span>').hide(),

					getEementsInDom: function() {
						return $('.back-button');
					},

					/**
					 * Flag if back button is initialized
					 */
					isInitialized: false,

					/**
					 * Append back button to page
					 * TODO make target container configurable
					 */
					appendToPage: function() {
						var backButtonContainer = $('[data-back-button="true"]');
						backButtonContainer.html(this.element);
						// $(this.element).clone().appendTo(backButtonContainer);
					},

					/**
					 * Event binding for back button
					 * @param {Function} callback
					 */
					bindEvent: function(callback) {
						var backButton = this;
						$(this.getEementsInDom()).on('click', function(event) {
							event.preventDefault();
							if(typeof callback == 'function'){
								callback.call(this);
							}
						});
					},


					/**
					 * Event unbinding for back button
					 */
					unBindEvent: function() {
						$(this.getEementsInDom()).off('click');
						$(this.element).off('click');
					},

					/**
					 * Check if back button should be attached or not
					 */
					handleAppearance: function() {
						if (exports.activeSection > 1) {
							this.attach();
						} else {
							this.detach();
						}
					},

					/**
					 * Back button attacher method
					 */
					attach: function() {
						// if (this.isInitialized === false) {
							this.unBindEvent();
							this.appendToPage();
							this.bindEvent(function() {
								$(window).trigger('popstate');
							});
							$(this.element).show();
							this.isInitialized = true;
						//}
					},

					/**
					 * Back button detacher method
					 */
					detach: function() {
						$(this.getEementsInDom()).hide();
						this.unBindEvent();
						this.isInitialized = false;
					}

				}

			},

			error: function(debug) {
				if (window.console && dtag.debug === true) {
					console.error(debug);
				}
			}

		};

	$.fn.dtag_pageHandler = function(method) {

		if (exports[method]) {
			return exports[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return exports.initialize.apply(this, arguments);
		} else {
			exports.error('Method ' +  method + ' does not exist on jQuery.dtag_pageHandler');
		}

	};

	$.fn.dtag_pageHandler.defaults = {
		pageWrap: '<section></section>',
		transition: 'fade',
		ajaxParams: {'type': 78},
		updateTitle: false,
		onUpdateTitle: function(page) {
			$('.headline:visible', $serviceLevel).html(page.title);
		},
		// overrideLinkBinding: function() {},
		onLinkBinding: function() {
			return $(this).prop('href');
		},
		onResponse: function(data) {
			return data;
		},
		onPageAppend: function(page) {
			/*$.dtag_rowevents({
				list_selector: 'ul:not(:has(ul)):not(.tree)'
			});*/
			// $.dtag_treelist();
		}
	};

}(jQuery));