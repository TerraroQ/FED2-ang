(function() {

	angular.module('movieApp', ['ngRoute', 'angular.filter', 'ngTouch', 'ngUnderscore'])

	angular.module('movieApp').config(function( $routeProvider ){
		$routeProvider
		.when('/home', {
			templateUrl: 'views/about.html'
		})
		.when('/movies', {
			templateUrl: 'views/movies.html',
			controller: 'MoviesController'
		})
		.when('/movies/:id', {
			templateUrl: 'views/movie-detail.html',
			controller: 'SingleMovieController'
		})
		.when('/movies/genres/:genre', {
			templateUrl: 'views/genre.html',
			controller: 'filterGenre'
		})
		.otherwise({
			redirectTo: '/home'
		})
	})


	angular.module('movieApp').service('HTTPService', function( $http, $rootScope ) {
		$rootScope.loader = {
			loading: false,
		};
		return {
			getMovies: function () {
				$rootScope.loader.loading = true ;
				return $http({method: 'GET', url: 'http://www.dennistel.nl/movies'})
			},
			getSingleMovie: function ( id ) {
				$rootScope.loader.loading = true ;
				return $http({method: 'GET', url: 'http://www.dennistel.nl/movies/' + id})
			}
		}
	});

	angular.module('movieApp').controller('aboutCtrl', function ( $scope, HTTPService ) {
		$scope.about = {
			"aboutText": [{
				title: 'About this app',
				p_1: 'Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let\'s get him some rocks. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. bruce... i\'m god. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can\'t now, being dead and all. rehabilitated? well, now let me see. you know, i don\'t have any idea what that means. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. rehabilitated? well, now let me see. you know, i don\'t have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can\'t now, being dead and all.',
				p_2: 'I did the same thing to gandhi, he didn\'t eat for three weeks. bruce... i\'m god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i\'m god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn\'t eat for three weeks.',
				p_3: 'Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man\'s ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don\'t want to tell me exactly what you\'re doing, when i\'m asked, i don\'t have to lie. but don\'t think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.',
				p_4: 'That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn\'t eat for three weeks. the man likes to play chess; let\'s get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that\'s how much he thinks he loves you. i don\'t think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.'
			}]
		};
	})

angular.module('movieApp').controller('MoviesController', function ( $scope, HTTPService, underscore, $timeout ) {
	HTTPService.getMovies()
	.success(function (data) {
		$timeout(function() {
			$scope.loader.loading = false ;

			if (localStorage.getItem('movieAPI') === null) {
				$scope.saved = localStorage.setItem('movieAPI', angular.toJson(data));
			} else{
				$scope.get = localStorage.getItem('movieAPI');
			}

			$scope.movies = JSON.parse($scope.get) && data;

			console.log($scope.movies);

			result = _.map(data, function(movies, i) {
				movies.reviewsAvg = _.reduce(movies.reviews, function(memo, review) {
					return  memo + review.score;
				}, 0) /  _.size(movies.reviews);

				return movies;
			}, 0);

			$scope.viewLimit = 2;

			$scope.viewMore = function(num){
				$scope.viewLimit += num;
			}

			$scope.descending = false;

		}, 1000);

	})
})

angular.module('movieApp').controller('SingleMovieController', function ( $scope, HTTPService, $routeParams, $timeout ) {
	HTTPService.getSingleMovie( $routeParams.id )
	.success(function (data) {
		$timeout(function() {
			$scope.loader.loading = false ;
			$scope.movie = data;
		}, 1000);

		
	})
})

angular.module('movieApp').controller('filterGenre', function ( $scope, HTTPService, $routeParams, $timeout ) {
	HTTPService.getGenre( $routeParams.id )
	.success(function (data) {
		$timeout(function() {
			$scope.loader.loading = false ;
			$scope.movie = data;
		}, 1000);
		
		
	})
})

})()