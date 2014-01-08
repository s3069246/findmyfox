/*
 * A list of functions that validate the message as well as search the message
 * to see if there is any commands within the message.
 */
'use strict';

angular.module('findDeviceApp').factory('messageManager', function($q, $timeout, Base64, commandSettings) {

    return {
	/*
	 * Check to see if the text mesage contains the passkey to issue
	 * any commands, or work out of it's a normal text message
	 *   
	 * @param {type} sender
	 * @param {type} message
	 * @returns {@exp;deferred@pro;promise}
	 */
	validateMessage: function(message) {

	    var deferred = $q.defer();

	    // Get the keypass that the user saved
	    //var passkey = localStorageService.get('commandSettings.passkey');
	    var passkey = commandSettings.passkey();

	    // Clean the white space around the message
	    message = message.trim();

	    // Split the message up by using white spaces to find the passphrase
	    var list = message.split(' ');

	    // Get the last item in the list to determine to the passkey
	    var msgPasskey = list.pop();

	    // Check to see if the Passkey in the message matches the saved Passkey
	    if ((Base64.encode(msgPasskey)) === passkey) {
		// By wrapping this in a timeout function, it fixes the bug 
		// where the device wasn't able to sync the response up with
		// the parent function. 
		$timeout(function() {
		    deferred.resolve({valid: true, key: msgPasskey});
		}, 1000);
	    } else {
		// The paskey is not a match
		deferred.reject('The passkeys do not match, this is not a valid message');
	    }

	    return deferred.promise;

	},
	/*
	 * Check to see if the text mesage contains the passkey to issue
	 * any commands, or work out of it's a normal text message
	 *   
	 * @param {type} message
	 * @param {type} passkey
	 * @returns {@exp;deferred@pro;promise}
	 */
	findMsgCommand: function(message, passkey) {

	    var deferred = $q.defer();

	    var command = null;

	    // Get the object of commands 
	    var cmdObject = commandSettings.getCommands();

	    // Delete the keyphase from the message, 
	    // making it easier to search for the command key
	    var phase = message.substring(0, message.indexOf(passkey));

	    // Trim the message of any white space
	    phase = phase.trim();

	    // Loop through the object to determine if the message contains any commands
	    for (var key in cmdObject) {
		var obj = cmdObject[key];
		// Match allows for a substring to be located in a string, however
		// it has the issue that the match() is case sensitive
		if (phase.match(obj.cmd)) {
		    // Pass the command type to the parent message, and break the loop
		    deferred.resolve(obj.type);
		    break;
		}

		// Whilst this option might be better, it may have issues in different languages,
		// so using regular expression's .match() provides a safer string comparision 
		// if(cmd[i]['key'].toLowerCase() === phase.toLowerCase()){}

	    }

	    // Return an error if there is no commands found
	    if (!command) {
		deferred.reject('There is no command found in the message');
	    }

	    return deferred.promise;
	}
    };

});