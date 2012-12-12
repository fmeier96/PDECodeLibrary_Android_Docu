/**
 * @fileOverview	Header loader
 * @module 			template/headerLoader
 * @exports			template/headerLoader
 * @author			mehrwert
 */
define('template/headerLoader', [
	'jquery',
	'template/drawerSlider',
	'template/helpdesk',
	'headerLoader',
	'breakpoint'
], function(
	$,
	drawerSlider,
	helpdesk
	){


	/**
	 * The options object
	 * Options here can look like this:

	 **
	 * The response function
	 * defaults to exports.onResponse
	 *
	 * @var {Function}
	 *
	onResponse:function() {},

	 **
	 * The replacement mode
	 * 'drawer'
	 * 'brandlevel+drawer'
	 * 'fullheader'
	 * defaults to 'fullheader'
	 *
	 * @var {String}
	 *
	replace: '',

	 **
	 * The file name or parameters for the header to request
	 * original jquery.dtag_headerLoader option
	 * toolbox related can be as following:
	 * 'unify_header.html'
	 * 'unify_drawer.html'
	 * 'unify_brandlevel_drawer.html'
	 * defaults to 'unify_header.html'
	 *
	 * @var {String}
	 *
	fileName: '',

	 **
	 * The base url for ajax request
	 * original jquery.dtag_headerLoader option
	 * defaults to $('body').data('toolUrl')
	 *
	 * @var {String}
	 *
	baseUrl: '',

	 *
	 * @var {Object}
	 */
	var opts,
		exports = {

			/**
			 * Merge module options with jquery.dtag_headerLoader
			 * Initialize jquery.dtag_headerLoader
			 *
			 * @param {Object} options
			 */
			load: function(options){
				var moduleOptions = {
					onResponse: exports.onResponse,
					replace: 'fullheader'
				};
				opts = $.extend({}, moduleOptions, options);
				$.fn.dtag_headerLoader(opts);
			},

			/**
			 * Response callback for jquery.dtag_headerLoader
			 * Replace header DOM elements
			 * Handle de-/attaching of drawerSlider and helpdesk*
			 * Trigger breakpoint
			 *
			 * @param {String} data
			 */
			onResponse: function(data) {
				if (data != '') {
					drawerSlider.detach();

					exports.replaceInDom(data);

					$.fn.mw_breakpoint('detectBreakpoint', function() {
						$.fn.mw_breakpoint('triggerBreakpoint');
					});
					drawerSlider.attach();
					
					helpdesk.init();
					helpdesk.appendToServiceLevel();
				}
			},

			/**
			 * Replace header in DOM
			 * depending on given string
			 *
			 * @param {String} data response data from jquery.dtag_headerLoader callback
			 */
			replaceInDom: function(data) {

				switch (opts.replace) {

					case 'drawer':
						$('#dtag_drawer').replaceWith(data);
						break;

					case 'brandlevel+drawer':
						$('#dtag_settings').remove();
						$('#dtag_settingslist').remove();
						$('#dtag_brandlevel').remove();
						$('#dtag_drawer').remove();
						$(data).prependTo('#dtag_header');
						$('#dtag_settings').hide();
						break;

					case 'fullheader':
					default:
						$('#dtag_settingslist').remove();
						$('#dtag_settings').remove();
						$('#dtag_header').replaceWith(data);
						$('#dtag_settings').hide();
						break;

				}

				window.dtag.emit('headerLoaded');

			}

		};

	return exports;
});