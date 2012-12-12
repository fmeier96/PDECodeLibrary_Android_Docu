/**
 * @fileOverview	Helpdesk mover
 * @module 			template/helpdesk
 * @exports			template/helpdesk
 * @author			mehrwert
 * @version			$Id: helpdesk.js 3345 2012-12-04 10:08:10Z m.straschek $
 */
define('template/helpdesk', ['jquery'], function($){

	var exports = {

		/**
		 * Storage variable for helpdesk button
		 */
		helpdeskCaller: {},

		/**
		 * Init function
		 * Store helpdesk button
		 * @return	void
		 */
		init: function(){
			// button beveled icon-only icon-help dialog-external-link
			exports.helpdeskCaller = $('[data-is-helpdesk-caller="true"]').addClass('button icon-only icon-help_2');
		},

		/**
		 * Append helpdesk button to service level
		 */
		appendToServiceLevel: function() {
			$('[data-is-helpdesk-caller="true"]').remove();
			$(exports.helpdeskCaller)
				.prependTo('#dtag_servicelevel .dtag-grid-col-right');
			exports.handleDropdown();
		},

		/**
		 * Append helpdesk button to titleBar
		 */
		appendToTitleBar: function() {
			$('[data-is-helpdesk-caller="true"]').remove();
			$(exports.helpdeskCaller)
				.prependTo('.title-bar .right');
			exports.handleDropdown();
		},

		/**
		 * TODO: refactor
		 */
		handleDropdown: function() {
			var helpdesk = $('#dtag_helpdesklist');
			helpdesk.hide();
			$(document).on('click', '[data-is-helpdesk-caller="true"]', function(event) {
				event.preventDefault();
				if (helpdesk.is(':hidden')) {
					helpdesk.show();
					$(document).on('click.helpdeskDropdown', function(event) {
						$(document).off('click.helpdeskDropdown');
						helpdesk.hide();
					});
				} else {
					helpdesk.hide();
				}
			});
		}

	};
	(function ($) {
		exports.init();
	})($);

	return exports;
});