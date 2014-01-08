/*
 * Allows you to change the status of the settings (ie: wifi, gps and mobile data
 * as well as check the status of the settings (ie: turned on or off). 
 * The settings are passed through the variable 's', where 's' is the array key
 * to the setting that can be found on MDN API
 * https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/Platform/Settings_list
 * 
 * More information about settings's API .lock() and .get() :
 * https://developer.mozilla.org/en-US/docs/WebAPI/Settings
 */

'use strict';

angular.module('findDeviceApp').factory('updateDeviceSetting', function($q, $timeout) {

    return {
	/*
	 * Check to see if a Setting is turned on or off, and return the status
	 *  
	 * @param {string} setting
	 * @returns {@exp;deferred@pro;promise}
	 */
	checkSettingStatus: function(setting) {

	    // Create a promise, which will be used to return to
	    // the function that calls this method, and ask it to wait
	    // for an answer
	    var deferred = $q.defer();
	    
	    // Lock the setting, ensuring that the status cannot be changed 
	    // whilst we are checking the status
	    var lock = navigator.mozSettings.createLock();
	    var status = lock.get(setting);

	    // if we are able to read the status of the setting...
	    status.onsuccess = function() {
		// Wrap the return in a timer, allowing the status to be
		// checked and ensures that any async issues will be resolved
		$timeout(function() {
		    // Return the status of the setting
		    deferred.resolve(status.result[setting]);
		}, 500);
	    };

	    // Warn the parent method that there was an issue checking the status
	    status.onerror = function() {
		deferred.reject('Unable to get setting');
	    };

	    // Return the promise
	    return deferred.promise;

	},
	/*
	 * Enable a setting 
	 * 
	 * @param {string} setting
	 * @returns {@exp;deferred@pro;promise}
	 */
	enableSetting: function(setting) {

	    // Create a promise, which will be used to return to
	    // the function that calls this method, and ask it to wait
	    // for an answer
	    var deferred = $q.defer();

	    // Check to see the status of the Setting
	    this.checkSettingStatus(setting).then(function(status) {

		// Only activate the setting if it's already turned off
		if (!status) {

		    // Create an object, to pass in the setting that
		    // needs to be on, otherwise the variable 's' will
		    // be seen as a string, if it's been used as the key
		    // for example .set({ s: true}) would cause an error
		    var key = setting;
		    var obj = {};
		    obj[key] = true;

		    // Activate Setting
		    var lock = navigator.mozSettings.createLock();
		    var result = lock.set(obj);

		    // If the Setting has successfully been turned on, report it
		    result.onsuccess = function() {
			// Wrap the return in a timer, allowing the status to be
			// checked and ensures that any async issues will be resolved
			$timeout(function() {
			    deferred.resolve(true);
			}, 500);
		    };

		    // Error Handling, let the parent method know there was an error
		    result.onerror = function() {
			deferred.reject('Unable to update setting');
		    };

		} else {
		    // The setting is already turned on
		    deferred.resolve(true);
		}

		// TO DO:
		// Error handling, passing the error up the chain

	    });

	    // Return the promise
	    return deferred.promise;
	},
	/*
	 * Disable Setting
	 * Mainly used for testing, as once
	 * setting has been turned on, it is sometimes difficult
	 * to turn it off again manually within the simulator
	 * 
	 * @param {string} setting
	 * @returns {@exp;deferred@pro;promise}
	 */
	disableSetting: function(setting) {
	    var deferred = $q.defer();

	    this.checkSettingStatus(setting).then(function(status) {

		// Only need to disable the setting if it's turned on
		if (status) {
		    // Create an object, to pass in the setting that
		    // needs to be on, otherwise the variable 's' will
		    // be seen as a string, if it's been used as the key
		    // for example .set({ s: true}) would cause an error
		    var key = setting;
		    var obj = {};
		    obj[key] = false;

		    // Deactivate the Setting
		    var lock = navigator.mozSettings.createLock();
		    var result = lock.set(obj);

		    // If succesfully turned off the setting, report it as false
		    result.onsuccess = function() {
			// Wrap the return in a timer, allowing the status to be
			// checked and ensures that any async issues will be resolved
			$timeout(function() {
			    deferred.resolve(false);
			}, 500);
		    };

		    // Error Handling
		    result.onerror = function() {
			deferred.reject('Unable to get setting');
		    };

		} else {
		    // Setting is already turned off
		    deferred.resolve(false);
		}

		// TO DO:
		// Error handling, passing the error up the chain

	    });

	    return deferred.promise;
	}
    };

});