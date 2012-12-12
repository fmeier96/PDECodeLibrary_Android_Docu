/*! DTAG Toolbar - v0.1.0 - 2012-12-12
* Copyright (c) 2012 Aki Alexandra Nofftz; Licensed MIT */
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

  // initialize toolbar
  function init(toolbar) {

    // look for existing drop down menu buttons
    var $dropdowns = $(toolbar.children('.dropdown'));
    // never hide dropdowns
    $dropdowns.each(function () {
      $(this).addClass('unreduceable');
    });

    // create "more" button if not present
    if ($dropdowns.length === 0) {

      // generate dropdown HTML code
      var dropdown = $(
        '<li class="unreduceable dropdown">' +
          '<button class="icon-only icon-context-menu"><span class="icon"></span></button>' +
          '<menu type="list"></menu>' +
        '</li>');
      toolbar.data('dtag_toolbar_dropdown', dropdown);
      toolbar.data('dtag_toolbar_dropdown_menu', dropdown.children('menu'));

      // check for magenta class and add, if necessary
      if (toolbar.find('li > button.magenta').length > 0) {
        dropdown.children('button').addClass('magenta');
      }
    } else {

      // define menu for reduced element (very last one), note that .last() is important
      toolbar.data('dtag_toolbar_dropdown_menu', $dropdowns.find('menu[type=list]:last').last());
    }

    // mark all existing buttons as reducable
    toolbar.children('li').each(function() {
      var $e = $(this);
      if (!$e.hasClass('unreduceable')) {
        $e.addClass('reduceable');
      }
    });

    // bind and trigger resize event
    $(window).bind('resize.dtag_toolbar', function() {
      resize(toolbar);
    });
    resize(toolbar);
  }

  // calculate toolbar size and move buttons into dropdown, if necessary
  function resize($toolbar) {

    // if no visible children present, there's nothing to do
    if ($toolbar.children('li:visible').length === 0) {
      return;
    }

    // Look for elements that have different top offsets than
    // the first what means that they are wrapped.
    // Repeat until nothing is reduced in that pass.
    var wrapped_elements = false;
    var had_reduced = false;
    do {
      var elems = $toolbar.children('li:visible');
      var i = elems.length;
      had_reduced = false;

      while (i > 0) {
        var $ele = $(elems[--i]);

        // If element's offset top is larger than first element's offset top
        // it is obviously wrapped.
        if ($ele.offset().top > $(elems[0]).offset().top) {

          wrapped_elements = true;

          // if reduceable, do it
          if ($ele.hasClass('reduceable')) {
            had_reduced = true;
            reduce($toolbar, $ele);
          } else {

            // special case: if last element is unreduceable and wrapped,
            // but there are reduceable elements present, reduce the most
            // left of them (wrapped or not)
            if (i === elems.length - 1) {
              do {
                $ele = $(elems[--i]);
                if ($ele.hasClass('reduceable')) {
                  had_reduced = true;
                  reduce($toolbar, $ele);
                  break;
                }
              } while (i > 0);
            }
          }
        }
      }
    } while (had_reduced);

/*      // special case: first element reduceable, still
      // wrapped unreduceable elements present and no more
      // reduceable elements
      if ($(elems[0]).hasClass('reduceable') && !do_unreduce && $toolbar.children('li.reduceable').length === 1) {

        // search for wrapped unreduceable elements
        var wrapped = false;
        $toolbar.children('li.unreduceable:visible').each(function() {
          if ($(this).offset().top > top) {
            wrapped = true;
          }
        });

        // something unreduceable wrapped: reduce first element
        if (wrapped) {
          reduce($toolbar, $(elems[0]));
        }
      }
    }*/

    // nothing wrapped, so try expanding
    if (!wrapped_elements && $toolbar.data('dtag_toolbar_dropdown_menu').children('li.reduceable').length > 0) {
      return unreduce($toolbar);
    }
  }

  // Reduce toolbar by moving element into dropdown
  function reduce($toolbar, $ele) {

    // if dropdown isn't visible yet, it would, so add its width
    var $dropdown = $toolbar.data('dtag_toolbar_dropdown');
    if ($dropdown && $dropdown.is(':hidden')) {
      $dropdown
      // attach and show dropdown
      .appendTo($toolbar)
      .show();
      // but hide dropdown menu
      // $toolbar.data('dtag_toolbar_dropdown_menu').hide();
    }

    // save element's position
    $ele.data('dtag_toolbar_position', $ele.prev());

    // check if text links exists
    if ($ele.children('a.list-item-title').length === 0) {
      var $btn = $ele.children('button');
      $('<a class="list-item-title">' + $btn.text() + '</a>')
        .attr('href', $btn.attr('action') ? $btn.attr('action') : '#')
        .appendTo($ele);
    }

    // move element into dropdown
    $ele.detach();
    $toolbar.data('dtag_toolbar_dropdown_menu').prepend($ele);

    // hide button and show text link
    $ele.children('button').hide();
    $ele.children('a.list-item-title').show();
  }

  // (Re-)Expand toolbar by moving elements into dropdown
  function unreduce($toolbar) {
    // move any reduced elements back to toolbar and then
    // call resize() to reduce odd elements again

    var $menu = $toolbar.data('dtag_toolbar_dropdown_menu');

    while (true) {
      var $ele = $menu.children('li.reduceable:first');

      // element left?
      if ($ele.length === 0) {
        break;
      }

      // move element back into saved position in toolbar
      $ele.detach();
      if ($ele.data('dtag_toolbar_position').length === 0) {
        // no saved position, should be first
        $toolbar.prepend($ele);
      } else {
        $ele.insertAfter($ele.data('dtag_toolbar_position'));
      }

      // hide text link and show button
      $ele.children('a.list-item-title').hide();
      $ele.children('button').show();
    }

    // check if dropdown is empty and remove
    if ($menu.children('li').length === 0 && $toolbar.data('dtag_toolbar_dropdown')) {
      $toolbar.data('dtag_toolbar_dropdown').hide().detach();
    }

    // call resize to avoid wrappings
    return resize($toolbar);
  }

  // Initialize toolbar tweeks on selected objects
  $.fn.dtag_toolbar = function() {
    return this.each(function() {
      init($(this));
    });
  };

  // quick default initializer, tries to find toolbars by itself
  $.dtag_toolbar = function(options) {

    if (typeof options === 'string') {
      options = { selector: options };
    }

    var settings = $.extend( {
      selector: 'menu[type=toolbar]'
    }, options);

    return $(document).find(settings.selector).dtag_toolbar();
  };

}));
