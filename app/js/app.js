// var movieApp = angular.module('movieApp', ['ui.router', 'LocalForageModule', 'underscore', 'ngRoute']) || {};
var movieApp = angular.module('movieApp', ['ngRoute', 'movieApp']) || {};

// movieApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
//   $urlRouterProvider.otherwise("/");
//   //HTML5 mode
//   // $locationProvider.html5Mode(true);
//   $stateProvider
//     .state('aboutState', {
// 		url: "/",
// 		templateUrl: "./views/about.html",
// 		controller: 'aboutCtrl'
//     })
//     .state('movies', {
// 		url: "/movies",
// 		templateUrl: "./views/movies.html",
// 		controller: 'movieCtrl'
//     })
//     .state('movies/:id', {
// 		url: "/movies/:id",
// 		templateUrl: "./views/movie-detail.html",
// 		controller: 'movieDetailCtrl'
//     });
// }]);

movieApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: './views/about.html',
        controller: 'aboutCtrl'
      }).
      when('/movies', {
        templateUrl: './views/movies.html',
        controller: 'movieCtrl'
      }).
      when('/movies/:id', {
      	templateUrl: './views/movie-detail.html',
      	controller: 'movieDetailCtrl'
      }).
      otherwise({
        redirectTo: '/movies'
      });
  }]);





movieApp.service('data', ['$http', function ($http){
	"use strict"
	this.get = function(url, callback){
		var obj = {content:null};
		$http({method: 'GET', url: 'http://dennistel.nl/movies.json'})
		.success(function(data, status, headers, config){
			callback(data);
			obj.content = data;
			localforage.setItem('movieAPI', data[0].title, function(err, value) {
			    console.log("The value " + value + " has been successfully stored");
			});
			localforage.getItem('movieAPI').then(function(value) {
			    // The same code, but using ES6 Promises.
			    console.log("The value " + value + " has been successfully retrieved");
			});
			console.log(obj);
		})
		.error(function(data, status, headers, config){
			throw "no data returned";
		});
	};
	this.post = function(url, callback, obj){
		$http({method: 'POST', url: 'http://dennistel.nl/movies.json', data: obj})
		.success(function(data, status, headers, config){
			callback(data);
		})
		.error(function(data, status, headers, config){
			throw "no data returned"
		});
	};
}]);

movieApp.controller('movieDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
  	$scope.movieData = $routeParams.id;
  	console.log($scope.movieData);
  }]);

movieApp.controller('movieCtrl', ['$scope', 'data', function($scope, data){
	"use strict";
	$scope.setData = function(data){
		$scope.movies = data;
	}
	data.get('http://dennistel.nl/movies.json', $scope.setData);

	$scope.viewLimit = 2;

	$scope.viewMore = function(num){
		$scope.viewLimit += num;
	}

	$scope.descending = false;


}]);


movieApp.controller('aboutCtrl', ['$scope', 'data', function($scope, data){
            $scope.about = {
	            "aboutText": [{
		                title: 'About this app',
		                p_1: 'Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let\'s get him some rocks. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. bruce... i\'m god. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can\'t now, being dead and all. rehabilitated? well, now let me see. you know, i don\'t have any idea what that means. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. rehabilitated? well, now let me see. you know, i don\'t have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can\'t now, being dead and all.',
		                p_2: 'I did the same thing to gandhi, he didn\'t eat for three weeks. bruce... i\'m god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i\'m god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn\'t eat for three weeks.',
		                p_3: 'Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.',
		                p_4: 'That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn\'t eat for three weeks. the man likes to play chess; let\'s get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. i don\'t think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.'
		            }]
	        };
}]);


movieApp.factory('_', function() {
	return window._; // assumes underscore has already been loaded on the page
});  

movieApp.controller('MainCtrl', function ( $scope, myService ) {
  $scope.loading = true;
  myService.get().then( function ( response ) {
    $scope.items = response.data;
    $scope.loading = false;
  }, function ( response ) {
    // TODO: handle the error somehow
    $scope.loading = false;
  });
});
