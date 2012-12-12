/*
 * Singleton class emit and listen to events with a Dtag namespace.
 * Used to get the current ready-state of the component-lib,
 * but further uses are encouraged.
 *
 * Require 'config/dtag' anywhere you want to either emit an event,
 * or want to listen to it:
 *
 *   require(['config/dtag'], function (dtag) {
 *     dtag.on('eventType', function () {
 *       // YOUR CODE GOES HERE
 *     })
 *   });
 *
 * If you attach to a ready-event after it was already fired, the
 * callback you passed will be called immediately. This is a special
 * case amongst the events handled by this EventEmitter.
 */
(function ($) {
  'use strict';

  /* Declare a Constructor by self invoking module-pattern */
  var Dtag = (function () {
    // instance holds a reference to the singleton
    // ready persists the ready-state of the component-lib
    var instance,
        ready = false;

    /*
     * Singleton Constructor
     * Ensures that only ever one instance of this class exists
     */
    function Singleton () {
      // If we were called already, return the instance created before
      if(instance) {
        return instance;
      }

      // Otherwise extend this class with the jQuery.eventEmitter
      $.extend(this, $.eventEmitter);

      // Rebind the on-handler, such that ready-event bindings
      // can be intercepted when ready was already emitted before
      // the handler was attached (combats race-conditions).
      this._on = this.on;

      // Our own on-handler. If the eventType was 'ready' and ready
      // was emitted before, we just immediately call the given callback.
      // Otherwise, we just refer back to the standard jQuery on-handler.
      this.on = function (eventType, cb) {
        if(eventType === 'ready' && ready) {
          cb();
        } else {
          this._on(eventType, cb);
        }
      };

      // Make sure that the internal ready-state is set to true,
      // when the first ready-event is emitted.
      this._on('ready', function () {
        ready = true;
      });

      // Set the singleton-instance
      instance = this;
      window.dtag = this;
    }

    // Instance accessor, convenience method to explicitly get an instance
    Singleton.getInstance = function () {
        return instance || new Singleton();
    };

    // Return constructor for outside use
    return Singleton;
  })();

  // return or create the Singleton instance, module pattern
  return new Dtag();
})(jQuery);