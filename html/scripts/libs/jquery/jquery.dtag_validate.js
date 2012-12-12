/*! DTAG Form Validator - v0.1.0 - 2012-12-12
* Copyright (c) 2012 Jonas Ulrich | ruhmesmeile; Licensed MIT */
/*
 * jquery.dtag_validate
 *
 * Copyright (c) 2012 Jonas Ulrich | ruhmesmeile
 *                    refactored by Aki Alexandra Nofftz
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

  // attach a tooltip message to an element
  function attachMessage($element, message, show) {
  
    // if message empty, remove tooltip, else attach
    if (message === undefined || message === '' || message.length === 0) {
      $element.qtip('destroy').attr('title', '');
    } else {

      // get text if no string
      if (typeof message !== 'string') {
        message = $(message).text();
      }

      // attach message
      $element.attr('title', message);
      
      // initialize tooltip
      $element.dtag_tooltip();

      // optionally show tooltip
      if (show) {
        $element.qtip('show');
      }
    }
  }

  // sets a tooltip for submit button
  function submitButtonMessage(element, message) {
    $(element)

      // search submit button(s)
      .closest('form')
      .find($.fn.dtag_validate.settings.submitSelector)
    
      // attach or remove tooltips
      .each(function() {
        attachMessage($(this), message, false);
      });
  }

  // redefine errorPlacement
  function errorPlacement(error, element) {

    // Set positioning based on the elements position in the form
    var $elem = $(element);

    // Check we have a valid error message
    if(!error.is(':empty')) {
      // Apply the tooltip only if it isn't valid
      if (!$elem.hasClass('valid')) {
        attachMessage($elem, error, true);
      }
    }
    // If the error is empty, remove the qTip
    else {
      attachMessage($elem, '', false);
    }
  }
  
  // redefine showErrors
  function showErrors(errorMap, errorList) {
  
    // prevent linting errors
    errorList = errorList;
  
    // attach first error message to submit button(s)
    if (errorMap.length > 0) {
      submitButtonMessage($(this), errorMap[0].message);
    } else {
      submitButtonMessage($(this), '');
    }

    // call default display method
    this.defaultShowErrors();
  }

  // attach validator
  $.fn.dtag_validate = function (options) {

    // Merge options into defaults
    $.fn.dtag_validate.settings =
      $.extend($.fn.dtag_validate.defaults, options);

    // attach validator
    return this.validate($.fn.dtag_validate.settings);
  };
  
  $.fn.dtag_validate.defaults = {
    submitButtonSelector: 'input[type=submit]',
    errorClass: 'validate-negative',
    showErrors: showErrors,
    errorPlacement: errorPlacement,
    success: $.noop // Odd workaround for errorPlacement not firing!
  };

}));
