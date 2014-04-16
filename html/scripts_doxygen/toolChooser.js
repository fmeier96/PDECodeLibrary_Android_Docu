dtag.on('ready', function() {
	require(
		['template/headerLoader'],
		function(headerLoader) {
			headerLoader.load({
				replace : 'fullheader',
				baseUrl : headerBaseUrl
			});
		}
	);
});

dtag.on('headerLoaded', function() {
	initResizable(null, true); // -> scripts_doxygen/dtag-doxygen-resize.js
});


// XTB-1375
dtag.on('headerLoadFailure', function(event) {
	var productionHostName = 'www.design.telekom.com';

	// only if on production system
	if (window.location.hostname === productionHostName) {
		window.location = window.location.protocol + '//' + productionHostName + '/?redirect_url=' + window.location.pathname;
	}

});