/*
 * When a message has been send to the device, it will disect the message
 * to see if it contains both the passkey to authenticate the message,
 * and the command to run a function
 */

'use strict';

angular.module('findDeviceApp').factory('receivedMessage', function(messageCommands, messageManager) {

    return {
	/*
	 * Scan a message to see if it contains the passkey and any commands
	 * 
	 * @param {type} sms
	 * @returns none
	 */
	scanMessageReceived: function(sms) {
	    
	    var validMsg = false;
	    var passkey = null;

	    // Get the important information from the SMS
	    var body = sms.body;
	    // var sender = sms.sender;
	    // var timestamp = sms.timestamp;
	    // timestamp = $filter('date')(timestamp, ['medium']);
	   
	    // Check to see the message is valid, and contains the passkey
	    messageManager.validateMessage(body).then(function(v) {
		
		// Return the values from the validate message function
		validMsg = v.valid;
		passkey = v.key;
		
		// If the message is valid...
		if (validMsg) {
		    
		    // Check to see if the message contains any commands
		    messageManager.findMsgCommand(body, passkey).then(function(cmd) {
			// Run the corrosponding command that is found in the message
			messageCommands.callCommand(cmd, sms);
		    }, function(reason) {
			//Display the error why the message command was not found
			console.log('Find Message Command Error: ' + reason);
		    });
		}

	    }, function(reason) {
		// Display the error why the message was not validated
		console.log('Validate Message Error: ' + reason);
	    });

	}

    };

});