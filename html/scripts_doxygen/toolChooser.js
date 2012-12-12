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