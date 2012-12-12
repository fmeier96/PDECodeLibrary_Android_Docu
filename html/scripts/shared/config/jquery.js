/**
 * @fileOverview	Config module for jQuery
 * @module 			config/jquery
 * @exports 		config/jquery
 * @description		Config module for jQuery
 * @requires 		jQuery
 * @author			mehrwert
 * @version			$Id: jquery.js 2559 2012-08-24 17:23:40Z m.straschek $
 */
define('shared/config/jquery', [
	'jquery'
], function($){

	var exports = {

		/**
		 * Init function
		 */
		init: function() {
			exports.toggleHtmlClass();
			exports.replaceAnimateFn();
			exports.emitDtagReadyEvent();
		},

		/**
		 * Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		 */
		replaceAnimateFn: function() {
			if ($.support.transition) {
				// save animate for dtag_tooltip
				$.fn.animate_orig = $.fn.animate;
				$.fn.animate = $.fn.transition;
			}
		},

		toggleHtmlClass: function() {
			$('html').removeClass('no-js').addClass('js');
		},

		emitDtagReadyEvent: function () {
			/* Emit ready event, because everything should be loaded now. User-JS can now start running.
			 * Could evaluate if this emit-call can go higher up in the dependency-chain,
			 * to start running User-JS earlier. Need to make sure that everything relevant is loaded, though.
			 */
			window.dtag.emit('ready');
		}
  };

	(function ($) {
		exports.init();
	})($);

});



