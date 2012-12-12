/**
 * @fileOverview	Search mover
 * @module 			template/moveSearch
 * @exports			template/moveSearch
 * @author			mehrwert
 * @version			$Id: moveSearch.js 2603 2012-09-19 09:02:38Z m.straschek $
 */
define('template/moveSearch', ['jquery'], function($){

	var exports = {

		/**
		 * The search mover function
		 * @param	{String}	to		'back' or leave empty
		 * @return	void
		 */
		move: function( to ){
				var search = $('#main_search_wrapper');
				var searchWrapper = $('#dtag_search');
				switch (to) {
					case 'back':
						search.prependTo(searchWrapper);
						searchWrapper.show();
						break;
					default:
						search.prependTo('#dtag_brandlevel .dtag-grid-col-right');
						searchWrapper.hide();
						break;
				}
		}
	};
	return exports;

});