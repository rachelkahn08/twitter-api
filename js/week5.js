var TwitterApi = (function(options) {
	var shared = {};
	var options = options || {};
	var searchTerm;

	function setEventListeners() {

		$('.search__field--username').on('submit', function(e){
			e.preventDefault();
			searchTerm = $('.user-input--username').val();

			// 	convert input to twitter-speak & GET
			$.ajax({
				url: 'twitter-proxy.php?op=user_timeline&screen_name=' + searchTerm,
				dataType: 'json'})
			.done(populateResults);
			return searchTerm;
		});

		$('.search__field--keyword').on('submit', function(e){
			e.preventDefault();
			searchTerm = $('.user-input--quick-search').val();

			// 	convert input to twitter-speak & GET
			$.ajax({
				url: 'twitter-proxy.php?op=search_tweets&q=' + searchTerm,
				dataType: 'json'})
			.done(ditchMetadata);
			return searchTerm;
		});

		$('.search__field--custom-search').on('submit', function(e){
			e.preventDefault();
			searchTerm = $('.user-input--custom-search').val();
			
			// 	convert input to twitter-speak & GET
			$.ajax({
				url: 'twitter-proxy.php?op=search_tweets&q=' + searchTerm + "&count=" + $('.user-input--custom-search__count').val() + "&result_type=" + $('.user-input--custom-search-type-select').val(),
				dataType: 'json'})
			.done(ditchMetadata);
			return searchTerm;
		});	
	}

	function ditchMetadata(results) {
		results = results.statuses;
		populateResults(results);
	}

	function populateResults(results) {
		if ( $('.search-results').has("div") ) {
			$('.search-results').empty();
		}
		
		// 	convert twitter-speak to object
		if (results.length) {

			for (i = 0; i < results.length; i++) {
				username = results[i].user.screen_name;
				tweetText = results[i].text;

				function highlightTerms(e) {
					var searchForThis = new RegExp(searchTerm, 'gi');
					var replaceWithThis = '<span class="highlight">' + searchTerm + '</span>';
					return e.replace(searchForThis, replaceWithThis);
				}

				function linkToUser(e) {
					var searchForThis = new RegExp('((http|https|www).+\\w+)', 'gi');
					tweetText = e.replace(searchForThis, '<a href="$1">$1<a>');
					
					function searchForTags(e) {
						var searchForThis = RegExp('@((\\w+))?', "ig");
						tweetText = e.replace(searchForThis, '<a href="https://twitter.com/$1">$1</a>'); 
						
						function searchForHash(e) {
							var searchForThis = RegExp('\\#((\\w+))?', "ig");
							tweetText = e.replace(searchForThis, '<a href="https://twitter.com/$1">$1</a>');
						}
						return searchForHash(tweetText);
					}

					return searchForTags(tweetText);
				}

				linkToUser(tweetText);

				var usernameToPost = $("<h5>");
					usernameToPost.html(highlightTerms(username));
				var tweetTextContainer = $("<p>");
					tweetTextContainer.append(highlightTerms(tweetText));
				var tweetToPost = $("<div>");

				tweetToPost.append(usernameToPost, tweetTextContainer);

				$('.search-results').append(tweetToPost);
				
			}
		} else {
			window.alert("Sorry! We don't have any results for you.");
		}
	}

	var init = function() {
		setEventListeners();	
	};

	shared.init = init;
	return shared;

}());

TwitterApi.init();

