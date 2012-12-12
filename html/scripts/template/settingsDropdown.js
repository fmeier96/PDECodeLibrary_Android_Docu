/**
 * @fileOverview	Settings dropdown
 * @module 			template/settingsDropdown
 * @exports			template/settingsDropdown
 * @author			mehrwert
 * @version			$Id: settingsDropdown.js 3252 2012-11-27 10:04:08Z m.straschek $
 */
define('template/settingsDropdown', ['jquery'], function($){

	var exports = {

			/**
			 * Flag if drawer slider is attached
			 */
			isAttached: false,

			/**
			 * The settings list
			 */
			settingsList: {},

			/**
			 * Set function
			 */
			setSettingsList: function() {
				exports.settingsList = $('#dtag_settingslist');
			},

			/**
			 * Attach function
			 *
			 * @return 		void
			 */
			attach: function() {
				if (exports.isAttached === false ) {
					exports.setSettingsList();
					$('#dtag_settings').hide();
					$('> ul', exports.settingsList).removeClass('list-decorated');
					$('> ul', exports.settingsList).addClass('dropdown-decorated');
					$(document).on('click', '[data-is-settings-caller="true"]', function(event) {
						event.preventDefault();
						if(exports.settingsList.is( ':visible' )) {
							exports.close();
						} else {
							exports.settingsList.insertAfter(this);
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
			detach: function() {
				if (exports.isAttached === true ) {
					$('> ul', exports.settingsList).removeClass('dropdown-decorated');
					$('> ul', exports.settingsList).addClass('list-decorated');
					exports.settingsList.appendTo('#dtag_settings .dtag-inner');
					$('#dtag_settings').show();
					$('#dtag_settingslist').show();
					$(document).off('click', '[data-is-settings-caller="true"]');

					exports.isAttached = false;
				}
			},

			/**
			 * Open function
			 *
			 * @return 		void
			 */
			open: function() {
				exports.settingsList.show();
				$(document).on('click.settingsDropdown', function() {
					exports.settingsList.hide();
					$(document).off('click.settingsDropdown');
				});
			},

			/**
			 * Close function
			 *
			 * @return 		void
			 */
			close: function() {
				exports.settingsList.hide();
			}

		};

	return exports;

});