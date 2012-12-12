/*! DTAG Tooltip - v0.1.0 - 2012-12-12
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

  // default initializer of tooltips; for config see settings below
  $.dtag_tooltip = function(config) {

    var settings = $.extend({}, $.dtag_tooltip.settings, config);

    // resave extended settings
    $.dtag_tooltip.settings = settings;

    // look for tooltip container and create, if not present
    if ($('#' + settings.container_id).length === 0) {
      $('body').append('<div id="' + settings.container_id + '" class="' +
        settings.container_classes + '"></div>');
    }

    // search for tooltips and set render position and render hook
    $(settings.selector).dtag_tooltip();
  };

  /*
   * Tooltip Settings
   *
   * each of these can be overwritten by calling the initializer:
   *
   *  $.dtag_tooltip({
   *    selector: '.mytooltips'
   *  });
   */
  $.dtag_tooltip.settings =  {
  
    // selector of tooltips
    // (all elements with class "tooltip" and attribute "title" present)
    selector: '.tooltip[title]',
    
    // class of elements containing tooltip content
    //
    // <div class="tooltip" title="fallback tooltip">
    //   <span class="tooltip-content">rich tooltip content ...</span>
    //   normal content
    // </div>
    content_class: 'tooltip-content',
    
    // class of tooltip icon, will be created as <span class="NAME"></span>
    icon_class: 'tooltip-icon',
    
    // id of tooltip container, will be created als <div> if not already present
    container_id: 'tooltip-container',
    
    // additional classes of tooltip container, only used when container will
    // be created by initializer
    container_classes: '',
    
    // additional classes of tooltip, note that "tooltip-display-DIRECTION" is
    // always added
    tooltip_classes: '',
    
    // default position of tooltips with no direction class present (top)
    default_position: 'top',
    
    // animation speed while showing/hiding tooltips
    // ("slow", "middle", "fast", msec)
    animation_speed: 'middle',

    // unit of tooltip position x/y/dx/dy in pixels,
    // should be 2/3 of stylesheet's $building_unit
    unit: 10
  };

  // defined position of tooltips (cf. CSS definitions)
  // - my, at: as defined by qTip2 (see qTip2 doc)
  // - x, y: adjust.x/y as defined by qTip in tooltipUnit (see qTip2 docs)
  // - dx, dy: "fly" start position als delta in tooltipUnit
  // see also http://craigsworks.com/projects/qtip2/docs/position/
  var tooltipPositions = {
    top:          { my: 'bottom center', at: 'top center',    x:  0, y: -1, dx:  0, dy: -1 },
    right:        { my: 'left center',   at: 'right center',  x:  1, y:  0, dx:  1, dy:  0 },
    bottom:       { my: 'top center',    at: 'bottom center', x:  0, y:  1, dx:  0, dy:  1 },
    left:         { my: 'right center',  at: 'left center',   x: -1, y:  0, dx: -1, dy:  0 },
    top_right:    { my: 'bottom left',   at: 'top right',     x: -3, y: -1, dx:  0, dy: -1 },
    top_left:     { my: 'bottom right',  at: 'top left',      x:  3, y: -1, dx:  0, dy: -1 },
    bottom_right: { my: 'top left',      at: 'bottom right',  x: -3, y:  1, dx:  0, dy:  1 },
    bottom_left:  { my: 'top right',     at: 'bottom left',   x:  3, y:  1, dx:  0, dy:  1 }
  };


  /*
   * event hook for showing tooltips
   * @see http://craigsworks.com/projects/qtip2/docs/api/events/#render
   */
  function tooltipRender(event, api) {
    var ele = $(api.elements.target);
    var settings = $.dtag_tooltip.settings;
    
    // do something with `event` to prevent lint errors
    if (event) {}

    // check for markup tooltip content
    var content = ele.find('.' + settings.content_class).html();
    if (! content) {
      // use title attribute as fallback
      content = ele.attr('title');
    }

    api.set('content.text', '<span class="content">'+content+'</span>' + '<span class="'+settings.icon_class+'"></span>');

    // check for tooltip position
    var pos = settings.default_position;
    for (var p in tooltipPositions) {
      if (ele.hasClass(p.replace('_', '-'))) {
        pos = p;
      }
    }

    // set classes and positions
    api.set('style.classes', settings.tooltip_classes +
      ' tooltip-display-' + pos.replace('_', '-'));
    api.set('position.my', tooltipPositions[pos].my);
    api.set('position.at', tooltipPositions[pos].at);
    api.set('position.adjust.x', tooltipPositions[pos].x * settings.unit);
    api.set('position.adjust.y', tooltipPositions[pos].y * settings.unit);

    // set custom show effect
    api.set('events.show', function() {
      api.set('show.effect', function() {
        $(this)
        .show()
        .css('opacity', 0)
        .css('margin-top', -1 * tooltipPositions[pos].dy * settings.unit)
        .css('margin-left', -1 * tooltipPositions[pos].dx * settings.unit)
        .stop(true, true);
        
        // ugly hack to allow overriding animate by jquery.transit
        if ($.fn.animate_orig) {
          $(this).animate_orig(
            {opacity: 1, marginTop: 0, marginLeft: 0},
            settings.animation_speed
          );
        } else {
          $(this).animate(
            {opacity: 1, marginTop: 0, marginLeft: 0},
            settings.animation_speed
          );
        }
      });
    });
  }
  
  // jQuery function to initialize a tooltip, please do not call qtip() directly
  $.fn.dtag_tooltip = function (config) {
    var settings = $.extend({
      position: {
        container: $('#' + $.dtag_tooltip.settings.container_id)
      },
      events: {
        render: tooltipRender
      }
    }, config);
    
    return this.qtip(settings);
  };

}));
