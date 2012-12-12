/*! DTAG Treelist - v0.1.0 - 2012-12-12
* Copyright (c) 2012 Jonas Ulrich | ruhmesmeile; Licensed MIT */
/**
 * @fileOverview  Component: Tree list
 * @module      components/tree
 * @exports     components/tree
 * @requires    jQuery
 * @author      mehrwert
 * @version     $Id$
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

  // attaches toggle events to list
  $.fn.dtag_treelist = function (options) {
    var tree = this;

    // merge defaults
    var cfg = $.extend({}, $.dtag_treelist.defaults, options);

    // find and mark parents
    var parentElements =
      $(cfg.parent_element_selector, tree).addClass(cfg.class_hasSubelements);

    // attach events to toggles
    $(cfg.toggle_selector, parentElements).on(cfg.toggle_events,
      function (event) {

      // do not prevent link action!
      // we also need to access those parent pages
      if ($(this).attr('href') === '#' || $(this).attr('href') === undefined) {
        event.preventDefault();
      }

      // get relevant elements
      var toggle = $(this),
          subtree = $(cfg.toggle_elements,
          $(this).parent(cfg.toggle_parent_element_selector));

      // check if active and show or hide element
      if (toggle.hasClass(cfg.class_active)) {
        // Remove jQuery animation function here because they fail in merged js
        // subtree.slideUp(cfg.animation_speed, function() {
        subtree.css('display','none');
        toggle.removeClass(cfg.class_active);
          //});
      } else {
        // Remove jQuery animation function here because they fail in merged js
        //subtree.slideDown(cfg.animation_speed, function() {
        subtree.css('display','block');
        toggle.addClass(cfg.class_active);
          //});
      }
    });

    // hide inactive subelements
    $(cfg.toggle_selector, parentElements).each(function() {
      if (!$(this).hasClass(cfg.class_active)) {
        $(cfg.toggle_elements,
          $(this).parent(cfg.toggle_parent_element_selector)).hide();
      }
    });
  };

  // default initializer
  $.dtag_treelist = function(options) {

    // merge defaults
    var cfg = $.extend({}, $.dtag_treelist.defaults, options);

    // attach events to all lists
    $(cfg.list_selector).dtag_treelist(cfg);
  };

  // default settings
  $.dtag_treelist.defaults = {

    // selector of lists that plugins attaches to
    list_selector: 'ul.tree',

    // selector of elements having toggleable children
    parent_element_selector: 'li:has(ul)',

    // CSS class name of elements selected by parent_element_selector
    class_hasSubelements: 'has-sublist',

    // CSS class name of active toggles
    class_active: 'active',

    // toggle selector
    toggle_selector: '> a, > strong',

    // event(s) that toggle subelements
    toggle_events: 'click',

    // list element selector of toggles
    toggle_parent_element_selector: 'li',

    // element(s) that should be toggled
    toggle_elements: '> ul',

    // animation speed of slideUp / slideDown
    animation_speed: 300
  };

}));
