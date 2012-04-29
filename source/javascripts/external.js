(function($){
	var host = location.host;

	$('body').on('click', 'a', function(e){
		var href = $(this).attr('href'),
			link = href.replace(/(https?:\/\/)(.*)\/(.*)/, '$2');

		if (href.match('https?') && link != host){
			window.open(href);
			e.preventDefault();
		}
	});
})(jQuery);