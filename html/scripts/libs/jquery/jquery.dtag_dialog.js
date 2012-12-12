
(function($) {

	var opts,
		exports = {

			/**
			 * The pages array
			 *
			 * @type {Array}
			 */
			dialogs: {},

			/**
			 * Init function, merges option an dispatches
			 *
			 * @param {Object} options
			 */
			initialize: function(options) {

				opts = $.extend({}, $.fn.dtag_dialog.defaults, options);
				exports.destroy(function() {

					if(!$('#dialog-wrapper').length > 0) {
						$('body').append($(opts.markup).hide());
					}

					exports.helpers.bindLinks();

				});
			},

			/**
			 * Dialog destroy method
			 *
			 * @param {Function} callback
			 */
			destroy: function(callback) {
				exports.helpers.unBindLinks();
				if (typeof callback == 'function'){
					callback.call(this);
				}
			},

			/**
			 * Open dialog
			 * @param {Object} dialogParams
			 */
			open: function(dialogParams) {

				var dialog = $.extend({}, $.fn.dtag_dialog.defaults.dialog, dialogParams);

				if (typeof opts.onOpen == 'function'){
					content = opts.onOpen.call(this, dialog);
				} else {
					exports.error('There is no valid onOpen callback in jQuery.dtag_dialog.' +
						'Current type is ' + typeof opts.onOpen);
				}

				// TODO: Do this much more smarter
				$('.dialog-wrapper').attr('id', dialog.eventName);
				$('#dialog').css('width', dialog.width+'em');
				$('#dialog_content').html(dialog.content);

				var closeButton = $(opts.closeButtonMarkup).prependTo('#dialog').on('click', function() {
					exports.close();
				});

				$('.dialog-wrapper').show();

				// the voodoo - emit custom event
				dtag.emit(dialog.eventName);

			},

			/**
			 * Close dialog
			 *
			 */
			close: function() {

				if (typeof opts.onClose == 'function'){
					content = opts.onClose.call(this);
				} else {
					exports.error('There is no valid onClose callback in jQuery.dtag_dialog.' +
						'Current type is ' + typeof opts.onClose);
				}

				// TODO: Do this much more smarter
				$('.dialog-wrapper').removeAttr('id');
				$('#dialog_content').empty();
				$('#dialog_footer').remove();
//				$('#dialog_bg').hide();
				$('.dialog-wrapper').hide();

				$('.ui-tooltip').hide();

			},

			/**
			 * Helpers/tools
			 */
			helpers: {

				/**
				 * Set dimensions of sections!
				 */
				setDimensions: function() {

				},

				/**
				 * Bind dialog links with ajax events
				 */
				bindLinks: function () {

					if (typeof opts.linkBinding === 'function'){
						opts.linkBinding.call(this);
					} else {
						$(document).on('click.dialog', '[data-is-dialog-link="true"]', function(event) {
							event.preventDefault();
							var trigger = this;

							var linkHref;
							if (typeof opts.onLinkBinding === 'function'){
								linkHref = opts.onLinkBinding.call(this);
							} else {
								exports.error('There is no valid onLinkBinding callback in jQuery.dtag_dialog.' +
									'Current type is ' + typeof opts.onLinkBinding);
							}

							if (linkHref !== '' && linkHref !== '#') {
								$.ajax({
									url: linkHref,
									data: opts.ajaxParams,
									success: function(response) {
										if (response !== '') {

											if (typeof opts.onResponse === 'function'){
												// var content = opts.onResponse.call(this, data);
											} else {
												exports.error('There is no valid onResponse callback in jQuery.dtag_dialog.' +
													'Current type is ' + typeof opts.onResponse);
											}

											var dialog = {
												content: response,
												eventName: $(trigger).data('dialogEvent'),
												width: $(trigger).data('dialogWidth') / 10
											};

											exports.open(dialog);

										} else {
											exports.error('There was no valid response!');											
										}
									}
								});
							} else {
							}

							return false;
						});
					}
				},

				/**
				 * Unbind content links
				 */
				unBindLinks: function () {
					$(document).off('click.dialog', '[data-is-dialog-link="true"]');
				}
				
			},

			error: function(debug) {
				if (window.console && dtag.debug === true) {
					console.error(debug);
				}
			}

		};

	$.fn.dtag_dialog = function(method) {

		if (exports[method]) {
			return exports[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return exports.initialize.apply(this, arguments);
		} else {
			exports.error('Method ' +  method + ' does not exist on jQuery.dtag_dialog');
		}

	};

	$.fn.dtag_dialog.defaults = {

		/**
		 * The dialog markup
		 */
		markup: '<div class="dialog-wrapper">' +
			'		<div id="dialog_window">' +
			'			<div id="dialog"><div id="dialog_content"></div></div>' +
			'		</div>' +
			'		<div id="dialog_bg"></div>' +
			'	</div>',

		/**
		 * The close button markup
		 */
		closeButtonMarkup: '<button class="icon-only icon-cancel small clean" id="dialog_close">' +
			'<span aria-hidden="true" class="icon"></span>' +
			'<span class="buttontext">Close</span>' +
			'</button>',

		dialog: {
			content: '<div class="box-content"><p><strong>dialog.content:</strong><br /> This is custom dialog content. You should overide this!</div>',
			eventName: 'dtag_dialog_open',
			width: 50
		},

		ajaxParams: {'type': 78},
		onLinkBinding: function() {
			return $(this).prop('href');
		},
		onResponse: function(data) {
			return data;
		},
		onClose: function(page) {

		},
		onOpen: function(page) {

		}
	};

}(jQuery));