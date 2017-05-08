
// var TwitterApi = (function(options) {
// 	var shared = {};
// 	var options = options || {};

// 	function setupListeners() {
// 		console.log('setupListeners()');
// 	}

// 	function processTweetResults(results) {
// 		console.log('got results', results);
// 	}

// 	var init = function() {
// 		console.log('init()');

// 		$.ajax('twitter-proxy.php?op=search_tweets&q=france')
// 		.done(processTweetResults);
// 	};
// 	shared.init = init;

// 	return shared;
// }());

// TwitterApi.init();


var TwitterApi = (function(options) {
	var shared = {};
	var options = options || {};
	var searchTerm;

	// 	get input from user
	

	function setEventListeners() {
		//$.ajax({url: url, dataType: ‘json’})

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

	// function regExifyInput(input) {
	// 	var input = searchTerm;
		
	// 	console.dir(input);
	// 	return input;
	// }

	function populateResults(results) {
		console.log(searchTerm);
		if ( $('.search-results').has("div") ) {
			$('.search-results').empty();
		}
		
		// 	convert twitter-speak to object
		if (results.length) {
			
			console.log(searchTerm);

			for (i = 0; i < results.length; i++) {

				username = results[i].user.screen_name;
				tweetText = results[i].text;

				function highlightTerms(e) {

					var searchForThis = new RegExp(searchTerm, 'gi');

					var replaceWithThis = '<span class="highlight">' + searchTerm + '</span>';

					return e.replace(searchForThis, replaceWithThis);
				}

				function makeURLS(e) {
					var searchForThis = new RegExp(/(http|www)[^ ]*/, 'gi');
					console.log(e.replace(searchForThis, 'THIS IS A URL'));
				}

				function linkToUser(e) {
					var searchForThis = new RegExp(/(?=@).*?\b/);
					var username = e.match(searchForThis);
					console.log(e.match(searchForThis('a @username bunch of shit @username is not a @username URL')));
				}

				linkToUser();

				var usernameToPost = $("<h5>");
					usernameToPost.html(highlightTerms(username));
				var tweetTextContainer = $("<p>");
					tweetTextContainer.append(highlightTerms(tweetText));
				var tweetToPost = $("<div>");

				tweetToPost.append(usernameToPost, tweetTextContainer);

				

				// regExProcess(tweetToPost);

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

function makeURLS(e) {
					// var searchForThis = new RegExp(/\/*(http|www)\w+[.]\b/, 'gi');
					// var searchForThis = new RegExp(/((\b(http|www|https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))+?/, 'gi');

					console.log(e.replace(searchForThis, 'REPLACED'));
				}
