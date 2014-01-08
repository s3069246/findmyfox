/*
 * Really simple script to allow the app to see if there is a user logged in,
 * and what permissions they have. 
 * This script has been adopted from
 * http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app
 */
'use strict';

angular.module('findDeviceApp').factory('UserService', ['localStorageService', function(localStorageService) {
	
	// Simple hack to see if there is a user in the system and pass 
	// it this information to other controllers 
	var hasUser = false;
	if(localStorageService.get('fduser.username')){
	    hasUser = true;
	}
	
	// An array to call to check if the user is logged in
	var sdo = {
		isLogged: false,
		username: '',
		hasUser: hasUser
	};
	return sdo;
}]);