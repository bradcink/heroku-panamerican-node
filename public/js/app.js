// Declares the initial angular module "mean_panamerican". Module grabs other controllers and services. Note the use of ngRoute.
var app = angular.module('mean_panamerican', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute'])

    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

        // Join Team Control Panel
        $routeProvider.when('/add', {
            controller: 'addCtrl',
            templateUrl: 'views/addForm.ejs',
        })
        .when('/search', {
            controller: 'queryCtrl',
            templateUrl: 'views/searchForm.ejs',
        })
        .otherwise({redirectTo:'/search'})
    });
