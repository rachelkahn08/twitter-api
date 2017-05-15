var TwitterApi = (function(options) {
	var shared = {};
	var options = options || {};
	var searchTerm;

	var setEventListeners = function() {

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
	}

	function ditchMetadata(results) {
		results = results.statuses;
		GoogleApi.plotMarkers(results);
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

				return tweetText;
				
			}
		} else {
			window.alert("Sorry! We don't have any results for you.");
		}
	}

	shared.setEventListeners = setEventListeners;
	return shared;

}());

var GoogleApi = (function(options) {
	var shared = {};
	var options = options || {};
	var map;
	// var  coordinates = {};


	var initMap = function() {
		console.log("initmap");
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center:{lat:0, lng:0}
		});
	}


	var plotMarkers = function(data) {	

		var newCenter = false; 

		TwitterApi.populateResults(results);

		for (i=0; i<data.length; i++) {
			 if (data[i].coordinates != null) {
			 	console.log(data[i]);

				lng = data[i].coordinates.coordinates[0];
				lat = data[i].coordinates.coordinates[1];
				
				markerLocation = {lat: lat, lng: lng};

				if (newCenter == false) {
					map.setCenter(markerLocation);
					newCenter = true;
				}



				var marker = new google.maps.Marker({
					position: markerLocation,
					map: map
					
				});
			}
		}

	}

	shared.plotMarkers = plotMarkers;
	shared.initMap = initMap;
	return shared;

}());

var PageloadFunctions = (function(options) {
	var shared = {};
	var options = options || {};

	var init = function() {
		TwitterApi.setEventListeners();	
	};

	shared.init = init;

	return shared;

}());

PageloadFunctions.init();








