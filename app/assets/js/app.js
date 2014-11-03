//anonymous self invoking function
(function(){
	//create app, put module in variable
	var app = angular.module('movieApp', ['ui.router', 'ngAnimate', 'ngTouch', 'ngUnderscore']) || {} //namespace

	//use stateProvider instead of older routeProvider
	app.config(function( $stateProvider, $urlRouterProvider ){
		$urlRouterProvider.otherwise('about');
		
		//this is the linking of the whole app, the :id and :genre is dynamic and change on basis of the situation
		$stateProvider
			.state('about', { //links can be retrieved by using ui-sref="about"
				url: "/about",
				templateUrl: 'views/about.html',
				controller: 'AboutController'
		    })
			.state('movies', {
				url: '/movies',
				templateUrl: 'views/movies.html',
				controller: 'MoviesController'
			})
			.state('movieDetail', {
				url: '/movies/:id',
				templateUrl: 'views/movie-detail.html',
				controller: 'SingleMovieController'
			})
			.state('moviesGenre', {
				url: '/movies/genres/:genre',
				templateUrl: 'views/genre.html',
				controller: 'FilterGenre'
			});
	});

	//put API info in constants, so it can be called upon every function in the service with API_URL
	app.constant('API_URL', { 
		movies: "http://www.dennistel.nl/movies",
	});

	app.run(function($rootScope, $state) {
		//run this function when state changes
		$rootScope.$state = $state;
		$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState){
			//enable loading, the loader appears on the page
			$rootScope.loading = true ;
		});
		$rootScope.stopLoading = function(){
			//disable loading, the loader disappears
			$rootScope.loading = false;
		}
	});

	//the service creates functions that are called in the controllers, the data of the constant is used to create the http request, which is then returned
	app.service('MovieService', function( $http, $q, API_URL ) { 
		
		var getMovies = function () {
			var deferred = $q.defer(); //new instance of deferred is contructed 

			//check if localstorage contains movieAPI, if not execute http request and on succes place it in localstorage as JSON
			if (localStorage.getItem('movieAPI') === null) {
				$http({method: 'GET', url: API_URL.movies}).success(function(data){
					localStorage.setItem('movieAPI', angular.toJson(data));
					deferred.resolve(data); //the data is added to the deferred variable
				});
			} else{
				deferred.resolve(JSON.parse(localStorage.getItem('movieAPI')));
			}
			return deferred.promise; //the promise takes care of giving interested parties access to the result of the deferred task when it completes
		};

		//gets the data of a single movie by returning the API URL + the id of the movie objects
		var getSingleMovie = function ( id ) {
			return $http({method: 'GET', url: API_URL.movies + '/' + id})
		};

		//
		var getGenre = function ( genre ) {
			var deferred = $q.defer(); //new instance of deferred is contructed 
			getMovies().then(function (data) {
				var filteredGenre = _(data).filter(function (item) { return _.contains(item.genres, genre) ;}); //filters the data that belongs to the genre
				deferred.resolve(filteredGenre); 
			});
			return deferred.promise; 
		};
		//returning all the functions
		return {
			getMovies: getMovies,
			getSingleMovie: getSingleMovie,
			getGenre: getGenre
		}
	});

	//the Aboutcontroller has an object with 5 keys and 5 values, these can be called in the html because of the $scope. aboutText is has to be used there.
	app.controller('AboutController', function ( $scope, $rootScope ) {
		$rootScope.stopLoading();
		$scope.aboutText = {
			title: 'About this app',
			p_1: 'Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let\'s get him some rocks. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. bruce... i\'m god. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can\'t now, being dead and all. rehabilitated? well, now let me see. you know, i don\'t have any idea what that means. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. rehabilitated? well, now let me see. you know, i don\'t have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can\'t now, being dead and all.',
			p_2: 'I did the same thing to gandhi, he didn\'t eat for three weeks. bruce... i\'m god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i\'m god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn\'t eat for three weeks.',
			p_3: 'Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.',
			p_4: 'That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn\'t eat for three weeks. the man likes to play chess; let\'s get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. i don\'t think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.'
		};
	});
	
	//
	app.controller('MoviesController', function ( $scope, $rootScope, MovieService, $timeout ) {
		MovieService.getMovies() //reaches out to the service and in that service to the getMovies function
		.then(function (data) { //when the deferred object returns success
			$timeout(function() { //timeout to show loader, the timeout is 1000 ms, see end of function
				$rootScope.stopLoading();
				$scope.movies = data;
				$scope.descending = true; //gives true so, it starts with the newest movies
				$scope.viewLimit = 3;

				//this is a function for the 'more' and 'less' buttons. The standard is 3 and by clicking on the more button the num parameter defines how many are added. This can be defined in the HTML
				$scope.viewMore = function(num){
					$scope.viewLimit += num;
				}

				//this is a map and reduce function, it iterates over the data, finds reviews.score from all the review objects and put them together as a new value reviewsAvg 
				result = _.map(data, function(movies, i) {
					movies.reviewsAvg = _.reduce(movies.reviews, function(memo, review) {
						return  memo + review.score;
					}, 0) /  _.size(movies.reviews);

					return movies;
				}, 0);

			}, 1000);
		});
	});

	//here the $stateParams.id is added to the succes function, so it knows that when the actual movie page is opened, when the id is in the URL, it has to return the movie scope instead of movies scope 
	app.controller('SingleMovieController', function ( $scope, $rootScope, MovieService, $stateParams ) {
		MovieService.getSingleMovie( $stateParams.id ).success(function (data) {
			$rootScope.stopLoading();
			$scope.movie = data;		
		})
	});

	app.controller('FilterGenre', function ( $scope, $rootScope, MovieService, $stateParams ) {
		MovieService.getGenre( $stateParams.genre ).then(function(data){
			$rootScope.stopLoading();
			$scope.movies = data;
		});
	});

	//create movieLoader directive which displays the loader
	app.directive('movieLoader', function(){
		return{
			restrict: 'EA', //use as element or attribute and displays the following in the HTML:
			template: '<div ng-show="loading"><div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div></div>'
		}
	});
})()