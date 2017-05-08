// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){


    // Initializes Variables
    // ----------------------------------------------------------------------------
    var newActivityCounter = 0;

    // Functions
    // ----------------------------------------------------------------------------
      // Get only the distinct activities from the Post model
      getDistinctActivities = function(){

      $http.get('/distinct').then(function(response){
         var data = response.data;
         var select = document.getElementById("activities");
         // Removes all child elements
         select.innerHTML = '';
               for( var i = 0; i < data.length; i++ ){
                      var o = data[i];
                      var option = document.createElement("option");
                      option.appendChild(document.createTextNode(o));
                      select.appendChild(option);
                    };
      }).catch(function(){});
    };

    getDistinctActivities();

    // Add a new activity when the queryForm button is clicked; Adds a new activity to the select node
    $scope.addActivity = function(){
      var newActivity = $scope.formData.activity_new;
      var select = document.getElementById("activities");
      var option = document.createElement("option");
      option.appendChild(document.createTextNode(newActivity));
      select.appendChild(option);
      option.style.color = "#76BEDB";
      newActivityCounter = newActivityCounter + 1;
      var activityLabel = document.getElementById("activities_label");
      if (newActivityCounter < 2) {
        activityLabel.innerHTML = ('Activities: ' + newActivityCounter + ' new activity');
      }
      else {
        activityLabel.innerHTML = ('Activities: ' + newActivityCounter + ' new activities');
      }
      var newActivityInput = document.getElementById("activity_new");
      newActivityInput.value = '';
      }

    // Creates a new user based on the form fields
    $scope.createPost = function() {
                    console.log('Hooray!');

        // Grabs all of the text box fields
        var postData = {
            city: $scope.formData.city,
            province: $scope.formData.province,
            country: $scope.formData.country,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            region: $scope.formData.region,
            accommodation: $scope.formData.accommodation,
            accommodation_alt: $scope.formData.accommodation_alt,
            activities: $scope.formData.activities,
            comments: $scope.formData.comments
        };

        // Saves the user data to the db
        $http.post('/posts', postData)
            .then(function (data) {
                // Once complete, clear the form (except location)
                $scope.formData.city = "";
                $scope.formData.province = "";
                $scope.formData.country = "";
                $scope.formData.region = "";
                $scope.formData.accommodation = "";
                $scope.formData.accommodation_alt = "";
                $scope.formData.activities = "";
                $scope.formData.comments = "";
            })

            .catch(function (data) {
                console.log('Error: ' + data);
            });

            // Refresh the map with new data
            gservice.refresh(Number($scope.formData.latitude), Number($scope.formData.longitude));
    };
});
