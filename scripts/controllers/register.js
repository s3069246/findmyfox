/*
 * A quick and simple script for user registration.
 * Needs to be cleaned up and introduce error validation
 * First check to see if there is already a user saved in local storage, so 
 * the user's information isn't overwritten. Then save the info to local storage
 * and log te user in
 */
'use strict';

angular.module('findDeviceApp').controller('RegisterCtrl', function($scope, $rootScope, $location, Base64, $filter, localStorageService, UserService) {

    $scope.register = function(user) {

	// Delete previous stored information in the local storage
	//localStorageService.clearAll();
	
	// encode username
	var username = Base64.encode(user.username);
	/// encode password
	var password = Base64.encode(user.password);
	// Email Address
	var emailAddress = user.emailAddress;
	// Add a timestamp for when the account was created
	var timestamp = $filter('date')(new Date(), 'medium');

	// Just make sure that username is empty in local storage before saving
	if (localStorageService.get('fduser.username') !== null) {
	    // ERROR! There is a username and 
	    // TO DO: Display error
	    console.log('Cannot save user as there is a user already existing!');
	} else {
	    // Save user details to local storage
	    var store_username = localStorageService.add('fduser.username', username),
		    store_password = localStorageService.add('fduser.password', password),
		    store_emailAddress = localStorageService.add('fduser.emailAddress', emailAddress);

	    localStorageService.add('fduser.dateCreated', timestamp);
	    
	    // If information didn't save correctly...
	    if (!store_username || !store_password || !store_emailAddress) {
		// TO DO: Display saving error to local storage
		// end command
	    }

	    // If information saved correctlys
	    if (store_username && store_password && store_emailAddress) {
		// Set the User Service controller to reflect the user's details
		// and that they have logged in
		UserService.isLogged = true;
		UserService.hasUser = true;
		UserService.username = user.username;
		
		// Mark as logged in, and that there is now a user
		$rootScope.hasUser = true;
		$rootScope.isLoggedin = true;
		
		// Direct user to the settings page
		$location.path("/settings");
	    }

	}

    };
});