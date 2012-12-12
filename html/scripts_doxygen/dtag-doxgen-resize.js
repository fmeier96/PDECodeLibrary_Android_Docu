var cookie_namespace = 'doxygen'; 
var sidenav,navtree,content,header;
var fullScreen = false;
var transitionEnd;
var toggleFullscreenButton;

function readCookie(cookie) 
{
  var myCookie = cookie_namespace+"_"+cookie+"=";
  if (document.cookie) 
  {
    var index = document.cookie.indexOf(myCookie);
    if (index != -1) 
    {
      var valStart = index + myCookie.length;
      
     
      
      var valEnd = document.cookie.indexOf("@", valStart);
      var valEndB = document.cookie.indexOf("$", valStart); 
   	
      if (valEnd == -1) 
      {
        valEnd = document.cookie.length;
      }
      var val = document.cookie.substring(valStart, valEnd);
      var valB = document.cookie.substring(valEnd+1, valEndB);
      
      if (valB == "true"){ 
      	fullScreen = true;
      } else if(valB == "false"){
      	fullScreen = false;
      
      }
      
      
      
      return val;
    }
  }
  return 0;
}

function writeCookie(cookie, val, expiration) 
{
  if (val==undefined) return;
  if (expiration == null) 
  {
    var date = new Date();
    date.setTime(date.getTime()+(10*365*24*60*60*1000)); // default expiration is one week
    expiration = date.toGMTString();
  }
  document.cookie = cookie_namespace + "_" + cookie + "=" + $(sidenav).width() + "@"+fullScreen+"$; expires=" + expiration+"; path=/";
}
 
function resizeWidth() 
{
  var windowWidth = $(window).width() + "px";
  var sidenavWidth = $(sidenav).width();
  content.css({marginLeft:parseInt(sidenavWidth)+40+"px"}); //account for 6px-wide handle-bar
  $('#headline-position-fix').css({marginLeft:parseInt(sidenavWidth)+40+"px"})
  $('#doxygen-wrapper').removeClass('doxygen-wrapper-animate');
  //$('.dtag-inner').removeClass('doxygen-wrapper-animate');
  resizeHeader();
  writeCookie('width',sidenavWidth, null);

}


function restoreWidth(navWidth)
{
  var windowWidth = $(window).width() + "px";
  content.css({marginLeft:parseInt(navWidth)+40+"px"});
  $('#headline-position-fix').css({marginLeft:parseInt(navWidth)+40+"px"})
  
  resizeHeader();
  sidenav.css({width:navWidth + "px"});
  
 
}



function resizeHeader(){
	
	var docWidth = $(document).width();
	if(fullScreen == false){
	
		$('#doxygen-wrapper').css('max-width','960px');
		$('.dtag-inner').css('max-width','940px');

	} else if (fullScreen == true){
	
		if (docWidth > 960) { 
			$('.dtag-grid-col-left').css({width: '29.787%'});
			$('.dtag-grid-col-right').css({width: '29.787%'});
			$('.dtag-grid-col-center').css({width: '36.17%'});
		} else {
			$('.dtag-grid-col-left, .dtag-grid-col-right, .dtag-grid-col-center').removeAttr('style');
		}
	
		if (docWidth > 1040){
			
			$('#doxygen-wrapper').css('max-width', $(window).width()-80 +'px');
			$('.dtag-inner').css('max-width', $(window).width()-80 +'px');
		
		} else if(docWidth <= 1040) {
			$('#doxygen-wrapper').css('max-width', '960px');
		}
	}

	var sideNav = $(sidenav).width()
	var contentWidth = parseInt($('#doxygen-wrapper').width()-sideNav)-60;
	var widthSummary = $('.summary').width();

	contentWidth -=60;
	
	$('.title').css ('width', (100 - (100/ contentWidth * widthSummary * 2)) + '%');
	$('.title').css ('margin-left', (100/ contentWidth * widthSummary )+'%');

}



function resizeHeight() 
{

	setVars();
	var windowHeight = (window.innerHeight ? window.innerHeight : $(window).height() )  - 340 - 0;
  content.css({height:windowHeight + "px"});
  navtree.css({height:windowHeight+"px"});
  
  sidenav.css({height:windowHeight+"px",top: 0+"px"});
  
  /*var heightResizehandele = resizehandle.height()/2 ;
  resizehandle.css('margin-top',(windowHeight/2  - heightResizehandele) + "px");*/
  
}

function repositioningSearchResults() 
{
	
	var searchResults = $('#MSearchResultsWindow')
		, searchField = $('#MSearchField');

	searchResults.css({ 'left' : searchField.offset().left + 'px' });

}

function setVars(){
	sidenav = $("#side-nav");
	content = $("#doc-content");
	navtree = $("#nav-tree");
	contentheader = $(".header");
	headlineFix = $('#headline-position-fix');
	
}


function initResizable(c, _reinit)
{
	var re = _reinit || false;

	setVars();

	if ($.browser.webkit) {
		vP = "-webkit-";
		transitionEnd = "webkitTransitionEnd";
	} else if ($.browser.msie) {
		vP = "-ms-";
	} else if ($.browser.mozilla) {
		vP = "-moz-";
		transitionEnd = "transitionend";
	} else if ($.browser.opera) {
		vP = "-o-";
		transitionEnd = "oTransitionEnd";
	}

	/* Wrap the Doyxgen content for centering */


	$('#side-nav').addClass('wrapper-identifier');
	$('#doxygen-search').addClass('wrapper-identifier');
	$('#doc-content').addClass('wrapper-identifier')	

	if(!re) {
		$('.wrapper-identifier').wrapAll('<div id="doxygen-wrapper" style="max-width:960px; margin:auto;">');
	}

	//Dtag Header Fix for Fullscreen
	
	$('.dtag-inner').css({
		'margin': 'auto',
		'width': '100%',
	});	

	$('#side-nav').css({
		'position':'relative',
		'float':'left',
		'margin-top': -1+'px'
	})  
	if(!re) {
		$('#side-nav').before($('<div id="headline-position-fix"></div>'));
		$('.header').appendTo('#headline-position-fix');	
		$(".side-nav-resizable").resizable({minWidth:"200",maxWidth:"640", resize: function(e, ui) { resizeWidth(); } });
	}

	$(window).bind('resize', function() { 
		resizeHeight();
		resizeHeader();
		repositioningSearchResults();
		$('#doxygen-wrapper').removeClass('doxygen-wrapper-animate');
		$('.dtag-inner').removeClass('doxygen-wrapper-animate');
	});

	var width = readCookie('width');
	if (width) { restoreWidth(width); } else { resizeWidth(); }
	resizeHeight();
	resizeHeader();

	implementToggleFullscreenButton();

	fullscreen();

	var url = location.href;
	var i=url.indexOf("#");
	
	if (i>=0) window.location.hash=url.substr(i);

  if(!re) {
		var _preventDefault = function(evt) { evt.preventDefault(); };
		$("#splitbar").bind("dragstart", _preventDefault).bind("selectstart", _preventDefault);
	}

	$(document).bind('touchmove',function(e){
		try {
			var target = e.target;
			while (target) {
				if ($(target).css('-webkit-overflow-scrolling')=='touch') return;
				target = target.parentNode;
			}
			e.preventDefault();
		} catch(err) {
			e.preventDefault();
		}
	});

	$(document).bind(transitionEnd,function(e){
		resizeHeader();
	})
}


function implementToggleFullscreenButton() {

	setTimeout(function() {
		var container = $('#dtag_servicelevel .dtag-grid-col-right');
		if($('#toggle-fullscreen').length > 0) {
			$('#toggle-fullscreen').remove();
		}
		var toggleFullscreenButton = $('<a href="#" id="toggle-fullscreen" class="button icon-only">' +
		'	<span class="icon" aria-hidden="true"></span>' +
		'	<span class="buttontext">Fullscreen</span>' +
		'</a>');
		$(toggleFullscreenButton).prependTo(container).on('click', toggleFullscreen);

		if(fullScreen == false){
			toggleFullscreenButton.removeClass('icon-minimize');
			toggleFullscreenButton.addClass('icon-maximize');
		} else if (fullScreen == true){
			toggleFullscreenButton.removeClass('icon-maximize');
			toggleFullscreenButton.addClass('icon-minimize');
		}
	}, 100);
}

function toggleFullscreen(e) {
	
	e.preventDefault();

	if(fullScreen == true){
		$('#toggle-fullscreen').addClass('icon-maximize');
		$('#toggle-fullscreen').removeClass('icon-minimize');
		fullScreen = false;
		setTimeout(function(){ $('.dtag-grid-col-left, .dtag-grid-col-center').removeClass('scaled-header'); }, 300);
	} else if(fullScreen == false){
		$('#toggle-fullscreen').addClass('icon-minimize');
		$('#toggle-fullscreen').removeClass('icon-maximize');
		fullScreen = true;
	}

	$('#doxygen-wrapper').addClass('doxygen-wrapper-animate');
	$('.dtag-inner').addClass('doxygen-wrapper-animate');
	
	resizeHeader();
	
	writeCookie('width',$(sidenav).width(), null);
}

function fullscreen(){
	
	
	
	if(fullScreen == false){
		$('#doxygen-wrapper').css('max-width','960px');
		
	
	} else if (fullScreen == true){
		var docWidth = $(document).width();
	
		if (docWidth > 1040){
			
			$('#doxygen-wrapper').css('max-width', $(window).width()-80 +'px');
		
		} else if(docWidth <= 1040){
		
			$('#doxygen-wrapper').css('max-width', 960 +'px');
		}
		
	}

	
	
}



