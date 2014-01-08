/*
 * Uses the MDN API call - getCurrentPosition() to get the device's geolocation. 
 * 
 * NOTE: Might use the function watchPosition(). getCurentPosition() produces a
 * faster response on the device's geolcation, it however reduces the accuracy.
 * Whilst watchPosition provides higher accuracy, it uses more battery, and 
 * conatantly updating the location - which isn't needed for this version
 * 
 * Geolocation's API calls: 
 * 
 * Latitude:		position.coords.latitude
 * Longitude:	        position.coords.longitude
 * Altitude:		position.coords.altitude
 * Accuracy:		position.coords.accuracy
 * Altitude Accuracy:	position.coords.altitudeAccuracy
 * Heading:		position.coords.heading
 * Speed:		position.coords.speed
 * Timestamp:		position.timestamp
 */

'use strict';
angular.module('findDeviceApp').factory('geolocation', function($q, $timeout) {

    var getCurrentPosition = function() {

	var deferred = $q.defer();

	// Options to pass into the getCurrentPosition
	var options = {
	    // Currently there is no need to check the altitude for the device,
	    // however might incorporate this in future milestones
	    // enableHighAccuracy: true,

	    // If the GPS is not found within 180 seconds, time out and send an error
	    timeout: 180000,
	    // Ensure that the geolocation is up to date, and not cached
	    maximumAge: 0
	};

	function success(position) {
	    // Allow the promise to have time to find the geolocation before 
	    // passing it up to the parent function 
	    $timeout(function() {
		deferred.resolve(position);
	    }, 2000);
	}

	// Report any issues, including timeout
	function error(err) {
	    deferred.reject(err.message);
	}

	// Get the Geolocation for the device
	navigator.geolocation.getCurrentPosition(success, error, options);

	// Ensure the parent method knows that we have something to return 
	// to it. Also fixes any issues that the app might have thanks to async.
	return deferred.promise;

    };

    // Create a easy to call method in the parent factory
    return {
	getCurrentPosition: getCurrentPosition
    };

});