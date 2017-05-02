
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

	// 	get input from user
	

	function setEventListeners() {
		$('.search__field--username').on('submit', function(e){
			e.preventDefault();
			// 	convert input to twitter-speak & GET
			$.ajax('twitter-proxy.php?op=user_timeline&screen_name=' + $('.user-input--username').val())
			.done(populateResults);
		});

		$('.search__field--keyword').on('submit', function(e){
			e.preventDefault();
			console.log('quick search');

			// 	convert input to twitter-speak & GET
			$.ajax('twitter-proxy.php?op=search_tweets&q=' + $('.user-input--quick-search').val())
			.done(ditchMetadata);
		});

		$('.search__field--custom-search').on('submit', function(e){
			e.preventDefault();
			console.log('quick search');

			// 	convert input to twitter-speak & GET
			$.ajax('twitter-proxy.php?op=search_tweets&q=' + $('.user-input--custom-search').val() + "&count=" + $('.user-input--custom-search__count').val() + "&result_type=" + $('.user-input--custom-search-type-select').val())
			.done(ditchMetadata);
		});



		
	}

	function ditchMetadata(results) {
		results = JSON.parse(results);
		results = results.statuses;
		results = JSON.stringify(results);
		populateResults(results);
	}

	function populateResults(results) {
		if ( $('.search-results').has("div") ) {
			$('.search-results').empty();
		}
		
		// 	convert twitter-speak to object
		results = JSON.parse(results);

		if (results.length) {
			// 	populate page with info
			for (i = 0; i < results.length; i++) {
				username = results[i].user.screen_name;
				tweetText = results[i].text;

				var usernameToPost = $("<h5>");
					usernameToPost.html(username);
				var tweetTextContainer = $("<p>");
					tweetTextContainer.append(tweetText);
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

	// GAME PLAN: 

	
	
