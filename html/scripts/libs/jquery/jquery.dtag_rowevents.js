/*! DTAG Row Events - v0.1.0 - 2012-12-12
* Copyright (c) 2012 Jonas Ulrich | ruhmesmeile; Licensed MIT */
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

  /*
   * Generic Row Click/Hover Behaviour
   * emulates hover and active states, forwards click event to link_selector
   *
   * link_selector: String - jQuery selector for target link
   * button_selector: String - jQuery selector for elements that disable hover/click effect on parent
   *
   * TODO perhaps make accessible globally?
   * enable rebinding or live binding
   */
  $.fn.dtag_rowevents = function (link_selector, button_selector) {
    var $row = this;
    var $links = $row.find(link_selector);
    button_selector = button_selector || 'button, .button';

    $row.attr('title', function () {
      // set title to target link's title if none is already set
      return !$(this).attr('title') ? $links.first().attr('title') : $(this).attr('title');
    })
      .on('mouseenter', function (){
        $row.addClass('hover');
      }).on('mouseleave', function (){
        $row.removeClass('hover').removeClass('click');
      }).on('mouseenter', button_selector, function () {
        $row.removeClass('hover').removeClass('click');
      }).on('mouseleave', button_selector, function () {
        $row.addClass('hover');
      }).on('mousedown', function (ev) {
        if ($(ev.target).parents(button_selector).length === 0) {
          $row.addClass('click');
        }
      }).on('mouseup', function (ev) {
        if ($(ev.target).parents(button_selector).length === 0) {
          $row.removeClass('click');
        }
      }).on('click', function (ev) {
        if($links.length && !$(ev.target).is('a')) {
          // trigger click on target link

          // TODO resolve conflict with row_events function
          // @see components/scripts
          //if ($links.length) {
          //  $links[0].click();
          //}
          // workaround:
          window.location = $links.prop('href');
        }
      });

    return this;
  };

  $.dtag_rowevents = function (config) {

    var cfg = $.extend({}, $.dtag_rowevents.settings, config);

    // Tables
    $(cfg.table_selector).find(cfg.table_row_selector).each(function () {
      $(this).dtag_rowevents(cfg.table_link_selector);
    });

    // Lists
    $(cfg.list_selector).find(cfg.list_row_selector).each(function () {
      $(this).dtag_rowevents(cfg.list_link_selector);
    });

    /**
     * Temporary clipboard event binding function
     * TODO refactor, rewrite, find solutions
     */
    $(cfg.clipboard_selector).on('click', function (event){
      event.preventDefault();
    });
  };

  $.dtag_rowevents.settings = {
    table_selector: '.DTExperience table tbody',
    table_row_selector: 'tr:has(a.tr-title)',
    table_link_selector: 'a.tr-title',
    list_selector: '.DTExperience ul:not(:has(ul))',
    list_row_selector: 'li:has(a)',
    list_link_selector: 'a:first',
    clipboard_selector: '.DTExperience a.clipboard-link'
  };


}));
