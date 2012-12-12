/**
 * Initialize jquery.dtag_validate
 */

// TODO make dependency management consistent

define('components/validate', ['jquery', 'libs/jquery/jquery.validate', 'libs/jquery/jquery.dtag_validate'], function ($) {

  $(function () {
    // initialize plugin using defaults
    $('.DTExperience form.validate').dtag_validate();
  });

});