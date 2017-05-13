// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
    angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)

        if ($( window ).width() < '736'){
          var selectedLat = 8.60;
          var selectedLong = -83.00;
          $('<div id="map" style="width:100%; height:200px;">').prependTo("#thumbnails");
          var mapZoom = 2;
          var minMapZoom = 2;
        }
        else {
          var selectedLat = 39.50;
          var selectedLong = -90.35;
          var mapZoom = 3;
          var minMapZoom = 3;
        }


        // Handling Clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){
            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){
                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {
                // Perform an AJAX call to get all of the records in the db.
                $http.get('/posts').success(function(response){

                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };
        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var post = response[i];

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    id: post._id,
                    latlon: new google.maps.LatLng(post.location[1], post.location[0]),
                    city: post.city,
                    province: post.province,
                    country: post.country,
                    region: post.region,
                    accommodation: post.accommodation,
                    accommodation_alt: post.accommodation_alt,
                    activities: post.activities,
                    comments: post.comments
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};


    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: mapZoom,
            options: {
              minZoom: minMapZoom,
              maxZoom: 15
            },
            center: myLatLng,
            disableDefaultUI: true
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Planning Map",
            icon: {
              path: fontawesome.markers.CIRCLE,
              scale: 0.2,
              strokeWeight: 0.2,
              strokeColor: 'black',
              strokeOpacity: 1,
              fillColor: '#CB6678',
              fillOpacity: 0.8,
          },
          id: n.id,
          city: n.city,
          province: n.province,
          country: n.country,
          region: n.region,
          accommodation: n.accommodation,
          accommodation_alt: n.accommodation_alt,
          activities: n.activities,
          comments: n.comments
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            googleMapService.clickID = marker.id;
            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            googleMapService.clickCity = marker.city;
            googleMapService.clickCountry = marker.country;
            googleMapService.clickProvince = marker.province;
            googleMapService.clickRegion = marker.region;
            googleMapService.clickAccommodation = marker.accommodation;
            googleMapService.clickAccommodationAlt = marker.accommodation_alt;
            googleMapService.clickActivities = marker.activities;
            googleMapService.clickComments = marker.comments;
            $rootScope.$broadcast("clicked");
        });

    });

};


// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
