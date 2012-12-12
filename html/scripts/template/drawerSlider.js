/**
 * @fileOverview	Drawer slider
 * @module 			template/drawerSlider
 * @exports			template/drawerSlider
 * @author			mehrwert
 * @version			$Id: drawerSlider.js 3477 2012-12-10 15:30:02Z m.straschek $
 * @todo			refactor to "tool chooser", not "drawer"
 */
define('template/drawerSlider', ['jquery'], function($){

	/**
	 * @type	{Object}	The tool chooser
	 */
	var drawer,
		exports = {

			/**
			 * Flag if drawer slider is attached
			 */
			isAttached: false,

			/**
			 * Check if tool chooser should not be closed
			 * @return {Boolean}
			 */
			doNotCloseDrawerOnInit: function() {
				var flag = false;
				if ($('body').data('doNotCloseDrawer') === true) {
					flag = true;
				}
				return flag;
			},

			/**
			 * Check if tool icon tiles should be aligne left
			 * Actually this shall be the caes if more than 6
			 * are aneabled for the current user
			 *
			 */
			reAlignToolChooser: function() {
				var $toolChooser = $('#dtag_toolchooser');
				var toolChooserItemsLength = $('.tool-tile', $toolChooser).length;
					if (toolChooserItemsLength > 6) {
					$toolChooser.addClass('aligned-left');
				}
			},

			/**
			 * Attach function
			 *
			 * @return 		void
			 */
			attach: function() {
				if (exports.isAttached === false ) {
					exports.reAlignToolChooser();
					drawer = $('#dtag_drawer');
					drawer.css({'overflow': 'hidden'});

					$(document).on('click', '[data-is-drawer-caller="true"]', function(event) {

						event.preventDefault();

						if (drawer.height() != 0) {
							exports.close(250);
						} else {
							exports.open();
						}

					});

					var doNotClose = exports.doNotCloseDrawerOnInit();
					if (doNotClose === false) {
						exports.close(0);
					} else {
						$('[data-is-drawer-caller="true"]').addClass('active');
						exports.open(0);
					}
					exports.isAttached = true;

				}
			},

			/**
			 * Detach function
			 *
			 * @return 		void
			 */
			detach: function () {
				if (exports.isAttached === true) {
					$(document).off('click', '[data-is-drawer-caller="true"]');
					exports.isAttached = false;
				}
			},

			/**
			 * Open function
			 *
			 * @return 		void
			 */
			open: function() {
				require(['template/settingsSlider'], function(settingsSlider) {
					if (settingsSlider.isAttached === true) {
						settingsSlider.close();
					}
				});
				$('[data-is-drawer-caller="true"]').addClass('active');

				drawer.animate({
					height: $('.dtag-inner',drawer).height()
				}, 250, function(){
					drawer.css('height','auto');
				});
			},

			/**
			 * Close function
			 *
			 * @return 		void
			 */
			close: function(duration) {
				$('[data-is-drawer-caller="true"]').removeClass('active');
				drawer.css({
					height: $(drawer).height()
				});
				// set minimal timeout to ensure that drawer height has been really set
				// due to problems in merges JS
				setTimeout(function(){
					drawer.animate({
						height: '0'
					}, duration);
				}, 20);
			},

			/**
			 * Caller mover  function
			 * Prepends calling element to element given param
			 *
			 * @param		{string}	to		the sizzle selector
			 * @return 		void
			 */
			moveCaller: function(to) {
				$('[data-is-drawer-caller="true"]').prependTo($(to));
			}

		};

	return exports;

});
