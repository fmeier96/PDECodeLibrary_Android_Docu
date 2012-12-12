/**
 * Initialize jquery.dtag_rowevents
 */
define('components/rowevents', ['jquery', 'libs/jquery/jquery.dtag_rowevents'], function($) {

  $(function () {
    // initialize plugin
    $.dtag_rowevents({
      list_selector: 'ul:not(:has(ul)):not(.tree)',
      clipboard_selector: '#dtag_content a.clipboard-link'
    });
  });

});
