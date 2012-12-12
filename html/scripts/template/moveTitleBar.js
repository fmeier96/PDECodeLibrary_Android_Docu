/**
 * @fileOverview	Title bar mover
 * @module 			template/moveTitleBar
 * @exports			template/moveTitleBar
 * @author			mehrwert
 * @version			$Id: moveTitleBar.js 3159 2012-11-16 17:16:34Z m.straschek $
 */
define('template/moveTitleBar', ['jquery'], function($){

	var exports = {

		/**
		 * The title bar mover function
		 * @param	{String}	to		'back' or leave empty
		 * @return	void
		 */
		move:  function( to ){
			var serviceLevel = $('#dtag_servicelevel .dtag-inner');
			var mainTitleBar = $('#dtag_initial_content .title-bar');
			// mainTitleBar.prop({'data-iinitial-title-bar': 'true'});
			switch (to) {
				case 'back':
//					mainTitleBar = $('#dtag_servicelevel .title-bar');
//					mainTitleBar.prependTo('#dtag_initial_content');
//					mainTitleBar.find('.icon-only-manipulated')
//						.removeClass('icon-only')
//						.removeClass('icon-only-manipulated')
//						.addClass('minimal');
					// serviceLevel.show();

					// search.prependTo(searchWrapper);
					// searchWrapper.show();
					break;
				default:
					// serviceLevel.hide();
//					mainTitleBar.insertAfter(serviceLevel);
//					mainTitleBar.find('button:not(.icon-only),.button:not(.icon-only)')
//						.addClass('icon-only')
//						.addClass('icon-only-manipulated')
//						.removeClass('minimal');
					// mainTitleBar.prop({'data-initial-title-bar': 'true'});

					break;
			}
		}
	};

	return exports;

});