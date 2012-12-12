/**
 * @fileOverview	Settings mover
 * @module 			template/moveSettings
 * @exports			template/moveSettings
 * @author			mehrwert
 * @version			$Id: moveSettings.js 2678 2012-10-02 16:13:58Z m.straschek $
 */
define('template/moveSettings', ['jquery'], function($){

	var exports = {
		/**
		 * The settings mover function
		 * @param	{String}	to		'back' or leave empty
		 * @return	void
		 */
		move: function( to ){
			var settingsButton = $('[data-is-settings-caller="true"]');
			switch (to) {
				case 'back':
					settingsButton.appendTo('#dtag_brandlevel .dtag-grid-col-right');
					break;
				default:
					settingsButton.insertBefore('#dtag_jumpmarks');
					break;
			}
		}
	};
	return exports;

});