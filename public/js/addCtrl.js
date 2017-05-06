// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------

    // Functions
    // ----------------------------------------------------------------------------
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
            accommodation_alt: [$scope.formData.accommodation_alt],
            activities: [$scope.formData.activities],
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
