/*! DTAG Dialog Handler - v0.1.0 - 2012-12-12
* Copyright (c) 2012 Jonas Ulrich | ruhmesmeile; Licensed MIT */
/*global console */

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
  var opts,
    exports = {
      name: 'dtag_dialogHandler',
      title: 'Modal Window',

      dialogHtml: [
        '<div id="modal-window">',
          '<div id="modal">',
            '<h2 class="underline">Modal Window</h2>',
            '<div class="modal-content">',
            '</div>',
            '<div class="modal-footer"></div>',
          '</div>',
        '</div>',

        '<div id="modal-bg"></div>'
      ].join('\n'),
      closeButtonHtml: [
        '<button class="icon-only icon-cancel small clean modal-close">',
          '<span aria-hidden="true" class="icon"></span>',
          '<span class="buttontext">Button</span>',
        '</button>'
      ].join('\n'),
      contentHtml: [
        '<p class="font-size-default">Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec.</p>'
      ].join('\n'),

      transition: 'fade',
      dataAttribute: 'dialoghandler',
      lazy: false,
      modal: false,
      shown: false,
      maxWidth: 'none',

      init: function (options) {
        $('.DTExperience a[data-'+this.dataAttribute+'=true]')[exports.name](options);
      },

      /**
       * Init function, merges option and dispatches
       *
       * @param {Object} options
       */
      initialize: function ($els) {
        var a = this;

        if(!$('#modal-window').length && !$('#modal-bg').length) {
          $('body').append($(a.dialogHtml).hide());
        }

        $els.each(function (i) {
          var $el = $els.eq(i);
          var pluginInstance = $el.data(exports.dataAttribute);

          var lazy = $el.data(pluginInstance.dataAttribute+'Lazy');
          if(lazy) {
            pluginInstance.lazy = true;
          }

          var clickHandler = function () {
            pluginInstance.open.call(pluginInstance);
          };

          if(!pluginInstance.lazy) {
            $el.on("click." + pluginInstance.name, null, pluginInstance.data, clickHandler);
          }
        });
      },

      /**
       * Dialog detacher method
       *
       * @param {Function} callback
       */
      destroy: function () {
      },

      /**
       * Dialog open function
       */
      open: function () {
        var pluginInstance = this;
        var $modalWindow = $('#modal-window');

        var closeHandler = function (ev) {
          pluginInstance.close.call(pluginInstance, ev);
        };

        pluginInstance.shown = true;

        pluginInstance.setTitle(pluginInstance.title);
        pluginInstance.setContent(pluginInstance.contentHtml);
        if(pluginInstance.maxWidth) {
          pluginInstance.setMaxWidth(pluginInstance.maxWidth);
        }

        if(pluginInstance.modal) {
          $modalWindow.find('.modal-close').remove();
        } else {
          if(!$modalWindow.find('.modal-close').length) {
            var $closeButton = $(pluginInstance.closeButtonHtml);
            $closeButton.on('click.' + pluginInstance.name, null, null, closeHandler);
            $modalWindow.find('#modal').prepend($closeButton);
          }
        }

        $('#modal-window, #modal-bg').show();
      },

      /**
       * Dialog close function
       */
      close: function () {
        this.shown = false;
        $('#modal-window, #modal-bg').hide();
      },

      setTitle: function (text) {
        if(this.shown) {
          $('#modal-window').find('h2').text(text);
        }

        this.title = text;
      },

      setContent: function (html) {
        if(this.shown) {
          $('#modal-window').find('.modal-content').html(html);
        }

        this.contentHtml = html;
      },

      setMaxWidth: function (width) {
        var $modal = $('#modal-window #modal');
        var marginLeft, marginRight;

        marginLeft = marginRight = (this.maxWidth !== 'none') ? 'auto' : '';

        if(this.shown) {
          $modal.css({
            'max-width': width,
            'margin-left': marginLeft,
            'margin-right': marginRight
          });
        }

        this.maxWidth = width;
      },

      /**
       * Helpers/tools
       */
      helpers: {

        /**
         * Possible dialog dimension manipulation?
         */
        setDimensions: function () {

        },

        /**
         * Bind dialog links with ajax events
         */
        bindLinks: function () {

          if (typeof opts.linkBinding === 'function'){
            opts.linkBinding.call(this);
          } else {
            $(document).on('click.dialog', '[data-is-dialog-link="true"]', function(event) {
              event.preventDefault();
              // var trigger = this;

              var linkHref;
              if (typeof opts.onLinkBinding === 'function'){
                linkHref = opts.onLinkBinding.call(this);
              } else {
                exports.error('There is no valid onLinkBinding callback in jQuery.dtag_dialogHandler.' +
                  'Current type is ' + typeof opts.onLinkBinding);
              }

              if (linkHref !== '' && linkHref !== '#') {
                $.ajax({
                  url: linkHref,
                  data: opts.ajaxParams,
                  success: function(data) {
                    if ( data !== '' ) {

                      if (typeof opts.onResponse === 'function'){
                        // var content = opts.onResponse.call(this, data);
                      } else {
                        exports.error('There is no valid onResponse callback in jQuery.dtag_dialogHandler.' +
                          'Current type is ' + typeof opts.onResponse);
                      }

                      // open dialog here

                    }
                  }
                });
              } else {
              }

              return false;
            });
          }
        },

        /**
         * Unbind content links
         */
        unBindLinks: function () {
          // $main.off('click.dialog', '[data-is-dialog-link="true"]');
        }

      },

      error: function (debug) {
        if (window.console) {
          console.error(debug);
        }
      }

    };

  $.fn[exports.name] = function (opts) {
    var $els = this;
    var method = $.isPlainObject(opts) || !opts ? "" : opts;

    if (method && exports[method]) {
      exports[method].apply($els, Array.prototype.slice.call(arguments, 1));
    } else if (!method) {
      $els.each(function(i) {
        var pluginInstance = $.extend(true, { $el: $els.eq(i) }, exports, opts);
        // Write to data object for easy retrieval
        $els.eq(i).data(exports.dataAttribute, pluginInstance);
      });
      exports.initialize($els);
    } else {
      exports.error('Method ' +  method + ' does not exist on jQuery.' + exports.name);
    }
  };

  $[exports.name] = function () {
    exports.init.apply(exports, Array.prototype.slice.call(arguments));
  };
}));