// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var viewCtrl = angular.module('viewCtrl', ['geolocation', 'gservice']);
viewCtrl.controller('viewCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var viewData ={};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 10.500;
    $scope.formData.longitude = -98.350;

    // Functions
    // ----------------------------------------------------------------------------
    // Get attributes based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying attributes
        $scope.$apply(function(){
          var viewData = {
            latitude: $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3),
            longitude: $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3),
            city: $scope.formData.city = (gservice.clickCity),
            province: $scope.formData.province = (gservice.clickProvince),
            country: $scope.formData.country = (gservice.clickCountry),
            region: $scope.formData.region = (gservice.clickRegion),
            accommodation: $scope.formData.accommodation = (gservice.clickAccommodation),
            //[$scope.formData.accommodation_alt],
            //activities: [$scope.formData.activities],
            comments: $scope.formData.comments = (gservice.clickComments)
          }
        });
    });
    // Refresh the map with new data
    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
});
