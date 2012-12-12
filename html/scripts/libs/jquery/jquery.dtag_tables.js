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

  /**
   * Add responsiveness to table
   *
   * @param header_class string Class name of duplicated headers
   */
  $.fn.dtag_tables = function (header_class) {
    
    // check config
    header_class = header_class || 'no-more-table-header';
    
    // get headers
    var headers = [];
    this.find('thead tr th').each(function() {
      headers.push($(this).text());
    });
    
    // add headers to cells
    this.find('tbody tr').each(function() {
      $(this).find('td').each(function(index) {
        $(this).prepend('<span class="' + header_class + '">' +
          headers[index] + '</span>');
      });
    });
  };
  
  /**
   * Add reposiveness to all tables with given class name
   * 
   * @param responsive_table_class string class name to look for
   * @param header_class string Class name of duplicated headers
   */
  $.dtag_tables = function (responsive_table_class, header_class) {
    
    // check config
    if (typeof responsive_table_class === 'object') {
      header_class = responsive_table_class.header_class;
      responsive_table_class = responsive_table_class.responsive_table_class;
    }
    responsive_table_class = responsive_table_class || 'no-more-table';
    
    // search tables and add responsiveness
    if($('.DTExperience .' + responsive_table_class).length) {
      $('.DTExperience table.' + responsive_table_class).dtag_tables(header_class);
    }
  };

}));
