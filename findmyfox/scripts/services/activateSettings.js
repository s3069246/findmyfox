/*
 * An automatic process that will turn on the Wifi, Geolocation and Mobile Data
 * once the device has been reported as missing. This will allow for more 
 * accurate GPS location in the report send back to the user. 
 */
'use strict';

angular.module('findDeviceApp').factory('activateSettings', function($q, $timeout, updateDeviceSetting) {

    /*
     * Turn on all the appropriate settings
     * that are needed to track the device 
     */
    var activateTrackingSettings = function() {

	var deferred = $q.defer();

	var geo = null;
	var wifi = null;
	var mData = null;

	// Turn on Geolocation 
	updateDeviceSetting.enableSetting('geolocation.enabled').then(function(status) {
	    geo = status;
	}, function(error) {
	    deferred.reject('Error updating the status of Geolocation: ' + error);
	});

	// Turn on Wifi
	updateDeviceSetting.enableSetting('wifi.enabled').then(function(status) {
	    wifi = status;
	}, function(error) {
	    deferred.reject('Error updating the status of Wifi: ' + error);
	});

	// Turn on Mobile Data
	updateDeviceSetting.enableSetting('ril.data.enabled').then(function(status) {
	    mData = status;
	}, function(error) {
	    deferred.reject('Error updating the status of Mobile Data: ' + error);
	});

	// TO DO:
	// Check to see if Roaming needs to be turned on
	// Need to create a settin first to see if the user approves of roaming
	// being activated, then enable the setting.

	// Wrap the promise in a timer, to ensure that all the functions are correctly
	// instigated before we return the promise. 
	$timeout(function() {
	    deferred.resolve([
		// Need to create an array to be able to pass through all the
		// values throuh a promise.
		{key: 'geo', value: geo},
		{key: 'wifi', value: wifi},
		{key: 'mData', value: mData}
	    ]);
	}, 2000);

	return deferred.promise;

    };
    
    // Create a easy to call method in the parent factory
    return {
	activateTrackingSettings: activateTrackingSettings
    };

});