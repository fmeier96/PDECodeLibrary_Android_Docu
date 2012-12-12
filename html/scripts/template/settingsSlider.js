/**
 * @fileOverview	Settings slider
 * @module 			template/settingsSlider
 * @exports			template/settingsSlider
 * @author			mehrwert
 * @version			$Id: settingsSlider.js 3483 2012-12-10 16:30:30Z m.straschek $
 */
define('template/settingsSlider', ['jquery'], function($){

	var exports = {

		/**
		 * Flag if drawer slider is attached
		 */
		isAttached: false,
		drawerSliderObject: {},
		setDrawerSliderObject: function(obj) {
			if (typeof obj === 'object') {
				exports.drawerSliderObject = obj;
			} else {
				if (window.console && dtag.debug === true) {
					console.error('Could not identify a drawer object!');
				}
			}
		},

		/**
		 * The settings object
		 */
		settings: {},

		/**
		 * Set function
		 */
		setSettings: function() {
			exports.settings = $('#dtag_settings');
		},

		/**
		 * Attach function
		 *
		 * @return 		void
		 */
		attach: function() {
			if (exports.isAttached === false) {
				exports.setSettings();
				$(exports.settings).css({
					'overflow': 'hidden',
					'height': 0
				});

				$(document).on('click', '[data-is-settings-caller="true"]', function(event) {
					event.preventDefault();
					if ($(exports.settings).height() != 0) {
						exports.close();
					} else {
						exports.open();
					}
				});
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
				$(exports.settings).hide(); // .insertAfter('#dtag_drawer');
				$(document).off('click', '[data-is-settings-caller="true"]');
				// $('.dtag-settings-caller').off('click');
				exports.isAttached = false;
			}
		},

		/**
		 * Open function
		 *
		 * @return 		void
		 */
		open: function() {
			if (exports.isAttached === true) {
				exports.setSettings();
				exports.drawerSliderObject.close();
				$(exports.settings).insertAfter('#dtag_drawer').show().animate({
					height: $('.dtag-inner', $(exports.settings)).height()
				}, 250, function(){
					$(exports.settings).css('height','auto');
				});
			}
		},

		/**
		 * Close function
		 *
		 * @return 		void
		 */
		close: function() {
			if (exports.isAttached === true) {
				exports.setSettings();
				$(exports.settings).css({
					height: $(exports.settings).height()
				});
				$(exports.settings).animate({
					height: '0'
				}, 250);
			}
		}
	};
	return exports;

});