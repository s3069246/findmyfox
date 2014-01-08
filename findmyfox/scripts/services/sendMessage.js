/*
 * Send a text message to a receiver 
 */

'use strict';

angular.module('findDeviceApp').factory('sendMessage', function($q, $timeout) {

    return {
	/*
	 * Send a SMS Message, and return the message's
	 * DOMRequest Object if has been sent or not. 
	 * 
	 * @param {type} num
	 * @param {type} message
	 * @returns {@exp;deferred@pro;promise}
	 */
	sendMessage: function(receiver, message) {
	    
	    var deferred = $q.defer();
	    var sMM = window.navigator.mozMobileMessage;
	    var request;

	    // Send a message using the MDN API call 
	    request = sMM.send(receiver, message);

	    $timeout(function() {

		// If the meesage succuessfully send, pass the confirmation up the chain
		// function onSuccess(event) {
		request.onsuccess = function onSuccess() {
		    // console.log(event);
		    deferred.resolve(true);
		};

		// Error Handling - pass the error up the chain 
		request.onerror = function onError(event) {
		    deferred.reject('Unable to get setting' + event);
		};

	    }, 500);

	    return deferred.promise;
	}

    };

});