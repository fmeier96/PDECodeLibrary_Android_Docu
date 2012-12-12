/***************************************************************
 * Copyright notice
 *
 * (c) 2012 mehrwert (typo3@mehrwert.de)
 * All rights reserved
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 * Simple breakpoint detection
 * Appends a div element to <body>
 *     which can respond to trivial media queries
 *     here we will use the css property "font-family" because it can
 *     contain a custom sting like "smartphone" or "small-screen"
 *     so we can deal with our breakpoints in a semantical way
 *
 *     example scss:
 *
 *    	#mq_helper {
 *     		display: none;
 *     		font-family: smartphone;
 *     		@media screen and (min-width: 481px) {
 *     			font-family: tablet;
 *     		}
 *			@media screen and (min-width: 960px) {
 *     			font-family: desktop;
 *     		}
 *     	}
 *
 * @author		Michael Straschek <typo3@mehrwert.de>
 * @version		$Id: jquery.mw_breakpoint.js 3482 2012-12-10 16:30:08Z m.straschek $
 * @license		GPL
 */

(function($) {
	$.fn.mw_breakpoint =
		function (params) {

			// Merge options into defaults
			var options = $.extend({}, $.fn.mw_breakpoint.defaults, params),
				currentDevice = undefined,
				detectedDevice = undefined;

			// Add helper div if not existent
			if ($('#' + options.helperElementId).length < 1) {
				$('<div></div>')
					.prop('id',options.helperElementId)
					.appendTo(document.body);
			}

			// Our custom breakpointChange event
			// will call the callback option function
			$(document).on('breakpointChange.' + options.eventNamespace, function(event, device) {
				if (typeof options.callback == 'function') {
					options.callback.call(this, device);
				}
			});

			// Get the font-family of helper element
			// alter currentDevice when changed
			var detectDeviceChange = function() {
				detectedDevice = $('#' + options.helperElementId).css('font-family');
				if (detectedDevice != currentDevice) {
					currentDevice = detectedDevice;
					$(document).trigger('breakpointChange.' + options.eventNamespace, currentDevice);
				}
			};

			// resize event binding and initial triggering
			$(window).on('orientationchange resize', function(){
				detectDeviceChange();
			});
			$(window).trigger('resize');

		};

	/**
	 * Plugin defaults
	 */
	$.fn.mw_breakpoint.defaults = {
		eventNamespace: 'default',
		helperElementId: 'mq_helper',
		callback: function(device){
			if (window.console && dtag.debug === true) {
				console.log('detected device change to '+ device);
			}
		}
	};

})(jQuery);