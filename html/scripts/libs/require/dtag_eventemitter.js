/*
 * This small mixin allows for emitting our own ready-event, when our require.js part is all finished.
 * Depends on jQuery to be present.
 *
 * Additional client-side JavaScript should always be wrapped into an ready-handler, like this:
 *
 *  dtag.on('ready', function ($) {
 *    // YOUR CODE GOES HERE
 *  })
 *
 * Library-code has to ensure that the ready-Event is only called once everything is finished loading.
 */

(function($){
    /* Proxies a function by name (String) to our own EventHandler, based on the jQuery.eventEmitter */
    function makeProxy( name ) {
      return function() {
        ( this._JQ || ( this._JQ = $( this ) ) )[name].apply( this._JQ, arguments );
      };
    }

    /* Those are the functions we need to be proxied for our own EventEmitter to work like jQueries' */
    $.eventEmitter = {
      emit: makeProxy( 'trigger' ),
      once: makeProxy( 'one' ),
      on: makeProxy( 'on' ),
      off: makeProxy( 'off' )
    };
})(jQuery);
