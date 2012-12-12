/**
 * @module 			main
 * @description		This is the main js module included via require.js
 * @copyright		mehrwert
 * @version			$Id: main.js 3478 2012-12-10 15:30:48Z m.straschek $
 */
require.config({

	// @TODO This should not be necessary:
	paths: {
		jquery: 'libs/jquery/jquery',
		breakpoint: 'libs/jquery/jquery.mw_breakpoint',
		pageHandler: 'libs/jquery/jquery.dtag_pageHandler',
		headerLoader: 'libs/jquery/jquery.dtag_headerLoader',
		dialogHandler: 'libs/jquery/jquery.dtag_dialogHandler',
		transit: 'libs/jquery/jquery.transit',
		chosen: 'libs/jquery/chosen.jquery'
	}
});

/**
 * Main require function
 * Actually does nothing more but require wrapper module
 *
 * @requires wrapper
 */
define([
  'jquery',
  'shared/config/jquery',
  'template/drawerSlider',
  'template/helpdesk',
  'transit',
  'template/headerLoader',
  'components/rowevents',
  'components/forms',
  'components/tables',
  'breakpoint',
  'components/tooltip',
  'components/toolbar',
  'components/treelist',
  'components/dialogHandler',
  'components/dialog',
  'components/validate'
], function(
  $,
  cfg,
  drawerSlider,
	helpdesk
  ) {
  var settingsSlider,
    settingsDropdown,
    exports = {

    /**
     * Callback functions
     */
    callbacks: {

      /**
       * Smartphone view
       * @scope exports
       */
      smartphone: function() {

        /**
         * @requires    template/moveSearch
         * @requires    template/moveSettings
         * @requires    template/moveTitleBar
         * @requires    template/settingsSlider
         */
        require([
          'template/moveSearch',
          'template/moveSettings',
          'template/moveTitleBar',
          'template/settingsSlider'
        ], function(
          moveSearch,
          moveSettings,
          moveTitleBar,
          settingsSliderObj
          ) {

          moveSearch.move('back');
          moveSettings.move();
          moveTitleBar.move();

          settingsSlider = settingsSliderObj;
          settingsSlider.setDrawerSliderObject(drawerSlider);
			// detach due to possible headerLoader issues
			settingsSlider.detach();
			settingsSlider.attach();

          if ( typeof settingsDropdown === 'object' ) {
            settingsDropdown.detach();
          }

        });
        drawerSlider.moveCaller('#dtag_brandlevel .dtag-grid-col-right');

      },

      /**
       * Tablet view
       * @scope exports
       */
      tablet: function() {

        /**
         * @requires    template/moveSearch
         * @requires    template/moveSettings
         * @requires    template/moveTitleBar
         * @requires    template/settingsDropdown
         */
        require([
          'template/moveSearch',
          'template/moveSettings',
          'template/moveTitleBar',
          'template/settingsDropdown'
        ], function(
          moveSearch,
          moveSettings,
          moveTitleBar,
          settingsDropdownObj
          ) {
          moveSearch.move();
          moveSettings.move('back');
          moveTitleBar.move('back');

          settingsDropdown = settingsDropdownObj;
			// detach due to possible headerLoader issues
			settingsDropdown.detach();
			settingsDropdown.attach();

          if ( typeof settingsSlider === 'object' ) {
            settingsSlider.detach();
          }

        });

        drawerSlider.moveCaller('#dtag_brandlevel .dtag-grid-col-center');

      },

      /**
       * Desktop view
       * @scope exports
       *
       */
      desktop: function() {

        /**
         * @requires    template/moveSearch
         * @requires    template/settingsDropdown
         */
        require([
          'template/moveSearch',
          'template/settingsDropdown'
        ], function(
          moveSearch,
          settingsDropdownObj
          ) {
          moveSearch.move();

          settingsDropdown = settingsDropdownObj;
			// detach due to possible headerLoader issues
			settingsDropdown.detach();
			settingsDropdown.attach();

        });

      }

    },

    /**
     * Init function
     */
    init: function() {

      $('#dtag_jumpmarks').hide();
      $('#dtag_wrapper').css('padding-bottom', '2em');

      drawerSlider.attach();

	  if ($('body.dtag-start-page').length > 0) {
		  helpdesk.appendToTitleBar();
	  } else {
		  helpdesk.appendToServiceLevel();
	  }

      // due to jumpmark issues (having addressed element on top of screen)
      // the wrapper was css-ed with a huge padding bottom
      $('#wrapper').css('padding-bottom', 0);

      $.fn.mw_breakpoint({
        callback: function(device) {

          switch (device) {
            case 'smartphone':
              exports.callbacks.smartphone();
              break;

            case 'tablet':
              exports.callbacks.tablet();
              break;

            case 'desktop':
              exports.callbacks.desktop();
              break;

            default:
              // do nothing;
              break;
          }
        }
      });

    }

  };

  $(function() {
    exports.init();
  });

});
