/**
 * @fileOverview  Component: Forms
 * @module      components/forms
 * @exports     components/forms
 * @requires    jQuery
 * @author      mehrwert
 * @version     $Id$
 */
define('components/forms', [
  'jquery',
  'components/validate',
  'libs/jquery/jquery.dtag_replaceForms',
  'chosen'
], function ($) {
  var exports = {
    replaceUiElements: function() {
      // Replace checkboxes
      var $checkBoxes = $(".DTExperience input[type=checkbox]");
      $checkBoxes.formReplace({
        markup: '<span class="checkbox"><span aria-hidden="true" class="icon-checkmark"></span></span>'
      });

      // Replace radio buttons
      var $radioButtons = $(".DTExperience input[type=radio]");
      $radioButtons.formReplace({
        markup: '<div class="radiobutton"><span aria-hidden="true" class="icon-radiobutton_shadow" role="radio" aria-checked="false"></span> <span aria-hidden="true" class="icon-radiobutton_inner" role="radio" aria-checked="true"></span> <span aria-hidden="true" class="icon-radiobutton_outer" role="radio" aria-checked="false"></span> <span aria-hidden="true" class="icon-radiobutton_outer after" role="radio" aria-checked="false"></span></div>'
      });

      // Configure chosen
      $(".DTExperience .tk-dropdown").chosen({
        disable_search_threshold: 100
      });
    },

    init: function() {
      exports.replaceUiElements();
    }
  };

  $(function() {
    exports.init();
  });

  return exports;
});