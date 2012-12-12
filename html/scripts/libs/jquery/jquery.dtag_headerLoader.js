(function($) {

	var	opts,
		exports = {

			/**
			 * Init function, merges option and dispatches
			 *
			 * @param {Object} options
			 */
			initialize: function(options) {

				opts = $.extend({}, $.fn.dtag_headerLoader.defaults, options);

				$.ajax({
					url: opts.baseUrl + opts.fileName,
					success: function(data) {
						if (typeof opts.onResponse == 'function'){
							content = opts.onResponse.call(this, data);
						} else {
							exports.error('There is no valid onResponse callback in jQuery.dtag_headerLoader.' +
								'Current type is ' + typeof opts.onResponse);
						}
					},
					statusCode: {
						404: function() {
							exports.error('Remote header could not be found! ' +
								'Please verify the request url.');
						},
						500: function() {
							exports.error('The access to the remote header might be denied. ' +
								'Please try to log in to the Experience Toolbox.');
						}
					}
				});

			},

			/**
			 * Error wrapper
			 * @param debug
			 */
			error: function(debug) {
				if (window.console && dtag.debug === true) {
					console.error(debug);
				}
			}

		};

	$.fn.dtag_headerLoader = function(method) {

		if (exports[method]) {
			return exports[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return exports.initialize.apply(this, arguments);
		} else {
			exports.error('Method ' +  method + ' does not exist on jQuery.dtag_headerLoader');
		}

	};

	$.fn.dtag_headerLoader.defaults = {
		fileName: 'unify_header.html',
		baseUrl: $('body').data('toolUrl'),
		onResponse: function() {
			exports.error('There is no custom onResponse callback defined for jQuery.dtag_headerLoader');
		}
	};

}(jQuery));