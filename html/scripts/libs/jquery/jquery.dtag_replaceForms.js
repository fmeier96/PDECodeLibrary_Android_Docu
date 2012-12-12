/*! DTAG FormReplace - v0.1.0 - 2012-12-12
* Copyright (c) 2012 Jonas Ulrich | ruhmesmeile; Licensed MIT */
/*
 * jquery.dtag_replaceForms
 *
 *
 * Copyright (c) 2012 Jonas Ulrich | ruhmesmeile
 * Licensed under the MIT license.
 */

// use AMD if present
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

  $.fn.formReplace =
    function (options) {
      // Merge options into defaults
      $.fn.formReplace.opts = $.extend({}, $.fn.formReplace.defaults, options);

      // Iterate through form elements
      return this.each(function (index , formElement) {
        index = index; // do something with `index` due linting errors

        var $replacementElement = $($.fn.formReplace.opts.markup),
            $formElement = $(formElement);

        // Move original form element out of viewport
        $(formElement).addClass('replaced-form-element')
          .css({
            'position': 'absolute',
            'top': '-99999px',
            'left': '-99999px'
          });

        // Iterate over events & proxy them
        $.each(['click'], function (index, type) {
          index = index; // do something with `index` due linting errors

          $replacementElement.on(type, function (event) {
            event.preventDefault();
            event.stopPropagation();

            if($(this).parent().hasClass('unavailable')) { return; }

            var $targetElement = $formElement;
            $targetElement.trigger($.Event(event));
            $targetElement.blur();
          });
        });

        $.each(['change'], function (index, type) {
          index = index; // do something with `index` due linting errors

          $formElement.on(type, function () {
            var $fE = $(this);
            if($fE.is(':checked')) {
              if($fE.is('input[type=radio]')) {
                $('.DTExperience input[name='+$fE.prop('name')+']').parent().removeClass('checked');
              }
              $fE.parent().addClass('checked');
            } else {
              $fE.parent().removeClass('checked');
            }
          });
        });

        // Insert replacement into DOM
        $formElement.after($replacementElement);
      });
    };

  /* Empty function for form elements that don't have any jQuery event-handlers */
  $.fn.formReplace.emptyFn = function () {};

  /* Plugin defaults */
  $.fn.formReplace.defaults = {
    markup: '<span class="replacement-form-element"></span>',
    handlers: ['change']
  };

}));
