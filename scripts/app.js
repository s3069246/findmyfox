'use strict';

var findDeviceApp = angular.module('findDeviceApp', ['LocalStorageModule', 'UserValidation']);

findDeviceApp.config(function($routeProvider) {
    $routeProvider
	    .when('/', {
	templateUrl: 'views/main.html',
	controller: 'MainCtrl',
	access: {
	    isFree: true
	}
    })
	    .when('/login', {
	templateUrl: 'views/login.html',
	controller: 'LoginCtrl',
	access: {
	    isFree: true
	}
    })
	    .when('/settings', {
	templateUrl: 'views/settings.html',
	controller: 'SettingsCtrl',
	access: {
	    isFree: false
	}
    })
	    .when('/register', {
	templateUrl: 'views/register.html',
	controller: 'RegisterCtrl',
	access: {
	    isFree: true
	}
    })

	    .otherwise({
	redirectTo: '/'
    });

})
	// When a page is loaded, it will first see if you need "access" to load the page. 
	// This means if you are not logged in, you won't be able to laod the page. 
	// If you are not logged in, it will redirect you to the login page, else 
	// you are continue to use the app freely 
	// script from: http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app
	.run(['$rootScope', '$route', '$location', 'UserService', function($rootScope, $route, $location, UserService) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {

	    // NOTE:
	    // next.access produces an undefine error on some routes
	    // for now, the error is being ignored as it doesn't 
	    // seem to be crashing the application
	    if (!next.access.isFree && !UserService.isLogged) {
		// reload the login route
		if (UserService.isLogged) {
		    $location.path('/');
		} else {
		    $location.path('/login');
		}
	    }
	});
    }]);

