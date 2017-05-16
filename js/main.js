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
		populateResults(results);
	}

	function populateResults(results) {
		if ( $('.search-results').has("div") ) {
			$('.search-results').empty();
		}
		
		// 	convert twitter-speak to object
		if (results.length) {

			for (i = 0; i < results.length; i++) {

				var username = results[i].user.screen_name;
					username = RegExProcesses.highlightTerms(searchTerm, username);
				var tweetText = results[i].text;
					tweetText = RegExProcesses.makeLinks(searchTerm, tweetText);
				GoogleApi.createMarker(results[i], username, tweetText);

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

	shared.setEventListeners = setEventListeners;
	return shared;

}());

var RegExProcesses = (function(options) {
	var shared = {};
	var options = options || {};

	function highlightTerms(searchTerm, e) {
		var searchForThis = new RegExp(searchTerm, 'gi');
		var replaceWithThis = '<span class="highlight">' + searchTerm + '</span>';
		return e.replace(searchForThis, replaceWithThis);
	}

	function httpLinks(e) {
		var searchForThis = new RegExp('((http|https|www).+\\w+)', 'gi');
		e = e.replace(searchForThis, '<a href="$1">$1<a>');
		return e;
	}
		
	function searchForTags(e) {
		var searchForThis = RegExp('@((\\w+))?', "ig");
		e = e.replace(searchForThis, '<a href="https://twitter.com/$1">$1</a>');
		return e;
	}
			
	function searchForHash(e) {
		var searchForThis = RegExp('\\#((\\w+))?', "ig");
		e = e.replace(searchForThis, '<a href="https://twitter.com/$1">$1</a>');
		return e;
	}

	function makeLinks(searchTerm, e) {
		console.log(e);
		var stepOne = highlightTerms(searchTerm, e);
		console.log(e);
		var stepTwo = httpLinks(stepOne);
		console.log(e);
		var stepThree = searchForTags(stepTwo);
		console.log(e);
		var lastStep = searchForHash(stepThree);
		console.log(e);
		return lastStep;
	}
	
	shared.highlightTerms = highlightTerms;
	shared.makeLinks = makeLinks;
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
			zoom: 12,
			center:{lat:0, lng:0}
		});
	}


	var createMarker = function(data, username, text) {
		console.log(text);

		if (data.coordinates != null) {

			lng = data.coordinates.coordinates[0];
			lat = data.coordinates.coordinates[1];

			markerLocation = {lat: lat, lng: lng};

			if (!newCenter) {
				map.setCenter(markerLocation);
				var newCenter;
			}

			var infowindow = new google.maps.InfoWindow({
			    content: '<h5>' + username + ':</h5>' + '<br>' + '<p>' + text + '</p>'
			});

			var marker = new google.maps.Marker({
				position: markerLocation,
				map: map
			});

			marker.addListener('click', function() {
			    infowindow.open(map, marker);
			});
		}
	}

	shared.createMarker = createMarker;
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








