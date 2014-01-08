/*
 * Simple script to check the information saved on local storage and 
 * compare it to the information submitted by the user. If the two are
 * the same, log the user in. Then set the global scope to inform the app
 * the user is logged in
 */
'use strict';

angular.module('findDeviceApp').controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'UserService', 'localStorageService', 'Base64', function($scope, $rootScope, $location, UserService, localStorageService, Base64) {

    $scope.login = function(data) {
	
	if ((Base64.encode(data.username) === localStorageService.get('fduser.username')) &&
		    (Base64.encode(data.password) === localStorageService.get('fduser.password'))) {

		// Username and password is correct, pass this information onto user service,
		// so the user can access restricted pages
		UserService.isLogged = true;
		UserService.username = data.username;
		
		// Set the global variables
		$rootScope.isLoggedin = true;
		
		// Redirect back to the main route 
		$location.path('/main');

	    } else {
		// Do no let the user log in
		UserService.isLogged = false;
		UserService.username = '';
		// TO DO: Display error message
		$scope.error = 'Username or password is incorrect. Please try again';
	    }

    };

}]);