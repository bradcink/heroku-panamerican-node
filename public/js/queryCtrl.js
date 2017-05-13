// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, $location, geolocation, gservice){

  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.formData = {};
  var viewData ={};
  var coords = {};
  var lat = 0;
  var long = 0;
  var queryBody = {};
  var editBody = {};
  var queryID = {};
  var newActivityCounter = 0;

  // Set initial coordinates to the center of the US
  $scope.formData.latitude = 10.500;
  $scope.formData.longitude = -98.350;

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
    var newActivityInput = getElementById("")
  }

  // Get attributes based on mouse click. When a click event is detected....
  $rootScope.$on("clicked", function(){
      // Run the gservice functions associated with identifying attributes
      $scope.$apply(function(){
        var viewData = {
          id: $scope.formData.id = (gservice.clickID),
          latitude: $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3),
          longitude: $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3),
          city: $scope.formData.city = (gservice.clickCity),
          province: $scope.formData.province = (gservice.clickProvince),
          country: $scope.formData.country = (gservice.clickCountry),
          region: $scope.formData.region = (gservice.clickRegion),
          accommodation: $scope.formData.accommodation = (gservice.clickAccommodation),
          accommodation_alt: $scope.formData.accommodation_alt = (gservice.clickAccommodationAlt),
          activities: $scope.formData.activities = (gservice.clickActivities),
          comments: $scope.formData.comments = (gservice.clickComments)
        }
      });
  });
  // Take query parameters and incorporate into a JSON queryBody
  $scope.queryPosts = function(){
      // Assemble Query Body
      queryBody = {

          keyword: $scope.formData.keyword
      };

      // Post the queryBody to the /query POST route to retrieve the filtered results
      $http.post('/search', queryBody)
          // Store the filtered results in queryResults
          .then(function(queryResults){
              // Pass the filtered results to the Google Map Service and refresh the map
              gservice.refresh(queryResults.data[0].location[1], queryResults.data[0].location[0], queryResults.data);
              $scope.queryCount = queryResults.length;
              // Pass the filtered results to the Google Map Service and refresh the map
          })
          .catch(function(queryResults){
              console.log('Error ' + queryResults);
          })
  };

  prepareToEdit = function() {
        $('#deleteButton').before('<button type="submit" id = "saveButton" class="btn btn-success btn-block">Save</button>');
        $('#editButton').remove();
        document.getElementById("latitude").removeAttribute('readonly');
        document.getElementById("longitude").removeAttribute('readonly');
        document.getElementById("city").removeAttribute('readonly');
        document.getElementById("province").removeAttribute('readonly');
        document.getElementById("city").removeAttribute('readonly');
        document.getElementById("province").removeAttribute('readonly');
        document.getElementById("country").removeAttribute('readonly');
        document.getElementById("region").removeAttribute('readonly');
        document.getElementById("accommodation").removeAttribute('readonly');
        document.getElementById("accommodation_alt").removeAttribute('readonly');
        document.getElementById("activities").disabled=false;
        document.getElementById("activity_new").removeAttribute('readonly');
        document.getElementById("comments").removeAttribute('disabled');
  };
  $( "#formButtons" ).on("click", "#editButton", function(){
    prepareToEdit();
  });

  $( "#formButtons" ).on("click", "#saveButton", function(){
    postEdit();
  });

  postEdit = function() {
        // Assemble Query Body
        // Grabs all of the text box fields
        var editBody = {
          id: $scope.formData.id,
          latitude: $scope.formData.latitude,
          longitude: $scope.formData.longitude,
          city: $scope.formData.city,
          province: $scope.formData.province,
          country: $scope.formData.country,
          region: $scope.formData.region,
          accommodation: $scope.formData.accommodation,
          accommodation_alt: $scope.formData.accommodation_alt,
          activities: $scope.formData.activities,
          comments: $scope.formData.comments
        };
        console.log('Edit body ID: ' + editBody.id);
        var thePost = ('the post: '+ '/posts/'+editBody.id);
        $http.put('/posts/' + editBody.id, editBody)
        // Store the filtered results in queryResults
        .then(function(editResults){
        })
        .catch(function(queryResults){
            console.log('Error ' + queryResults);
        })

        $('#saveButton').remove();
        $('#deleteButton').before('<button type="submit" id = "editButton" class="btn btn-warning btn-block">Edit</button>');
        document.getElementById("latitude").setAttribute('readonly');
        document.getElementById("longitude").setAttribute('readonly');
        document.getElementById("city").setAttribute('readonly');
        document.getElementById("province").setAttribute('readonly');
        document.getElementById("city").setAttribute('readonly');
        document.getElementById("province").setAttribute('readonly');
        document.getElementById("country").setAttribute('readonly');
        document.getElementById("region").setAttribute('readonly');
        document.getElementById("accommodation").setAttribute('readonly');
        document.getElementById("accommodation_alt").setAttribute('readonly');
        document.getElementById("activities").disabled=true;
        document.getElementById("activity_new").setAttribute('readonly');
        document.getElementById("comments").setAttribute('disabled');

        var myNode = document.getElementById("activities");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        getDistinctActivities();

        gservice.refresh(Number($scope.formData.latitude), Number($scope.formData.longitude));
  };

  $scope.deletePost = function() {
    function alertDeleteFunction() {
        var txt;
        if (confirm("Do you really want to delete this post?") == true) {
            deleteFunction();
            alert('Post deleted');
            gservice.refresh(Number($scope.formData.latitude), Number($scope.formData.longitude));
        } else {
            console.log('Delete canceled');
        }
    }

    function deleteFunction() {
      $http.delete('/posts/' + $scope.formData.id)
      // Store the filtered results in queryResults
      .then(function(res){
      })
      .catch(function(res){
          console.log('Error ' + res);
      })
    }

    alertDeleteFunction();
  };
});
