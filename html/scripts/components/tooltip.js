/**
 * Initialize jquery.dtag_tooltip
 */

//Add qTip dependency, don't compile into plugin itself
//define(['jquery', 'libs/jquery/jquery.qtip.min', 'libs/jquery.dtag_tooltip'], function ($) {

define('components/tooltip', ['jquery', 'libs/jquery/jquery.qtip.min', 'libs/jquery/jquery.dtag_tooltip'], function ($) {

  $(function () {
    $.dtag_tooltip({
      container_classes: 'DTExperience',
      tooltip_classes: 'dtag-tooltip-style'
    });
  });

});