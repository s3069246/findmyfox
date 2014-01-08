'use strict';

angular.module('findDeviceApp').factory('messageCommands', function($rootScope, $window,
	$timeout, $filter, activateSettings, geolocation, sendMessage) {

    return {
	
	/*
	 * Check to see which function should be runned when the command is called
	 *  
	 * @param {type} cmd
	 * @param {type} sms
	 * @returns {undefined}
	 */callCommand: function(cmd, sms) {

	    switch (cmd) {

		// If the device is marked as lost...
		// This will get the device's geolocation and send it back
		// to the person to triggered the device as lost
		case 'lost':
		    this.startTracking(sms);
		    break;
		    
		// If the device is found
		case 'found':
		    this.stopTracking(sms);
		    break;
		
		// TO DO:
		// Lock the device so no one can use it without the password
		case 'lock':
		    this.lockDevice();
		    break;
		    
		 // TO DO:
		 // Sound a loud alarm, ensuring the device can be heard even
		 // if it's on silent mode
		 case 'alarm':
		     this.soundAlarm();
		     break;
		
		 // TO DO:
		 // Display an custom message on the lock screen to alert anyone
		 // using the phone that the device is lost or stolen, and how
		 // to contact the owner
		 case 'alert':
		    this.setAlert();
		    break;
		    
		// TO DO:
		// Wipe the device clean
		case 'wipe':
		    this.wipeDevice();
		    break;

		default:
		    console.log('Command is not understood');

	    }

	},
	// Start tracking the phone
	startTracking: function(sms) {
    
	    // Pass an alert up the scope to display on the home page
	    // that the device is currently missing. Display information
	    // about the report, including timestamp and who isssued the command
	    var $alert = {
		status: true,
		type: 'lost',
		class: 'alert-error',
		timestamp: $filter('date')(sms.timestamp, ['medium']),
		sender: sms.sender
	    };

	    $rootScope.alert = $alert;

	    // Turn on all the settings that are needed to track the device
	    activateSettings.activateTrackingSettings().then(function(messages) {
		console.log(messages);
	    }, function(error) {
		console.log('ERROR turning on settings for tracking: ' + error);
	    });

	    // Start tracking the device, which is wrappe in a timeout funtion, 
	    // allowing the geolocation and other settings to be fully activated
	    // before the search for the Geolocation starts
	    $timeout(function() {
		var googleMapLink = '';
		var message = '';

		// Get the current location of the device, and pass this 
		// information through variable 'position'
		geolocation.getCurrentPosition().then(function(position) {
		    
		    // Update the location of the device on the main page for testing purposes
		    $rootScope.position = position;

		    // Send a message out to the sender, notifying them of 
		    // the device's loation. Include a link to Google Maps with the
		    // lat and long information. 
		    googleMapLink = 'http://maps.google.com/?q=' + position.coords.latitude + ',' + position.coords.longitude;
		    message = 'We have located your device, ' + googleMapLink +
			    '\n(Time: ' + $filter('date')(position.timestamp, ['medium']) + ', ' +
			    'Accuracy: ' + position.coords.accuracy + 'm)';
		    
		    // Send the geolocation information to the person who triggered this command
		    var promise = sendMessage.sendMessage(sms.sender, message);
		    promise.then(function(status) {
			console.log('SMS with Geolocation has been: ' + status);
		    }, function(error) {
			console.log('Error sending SMS with Geolocation: ' + error);
		    });

		}, function(error) {
		    
		    // Inform the sender that the geolocation of the device 
		    // was unable to be found
		    message = 'We are unable to track the device, please wait a bit and try again';
		    
		    var promise = sendMessage.sendMessage(sms.sender, message);
		    promise.then(function(status) {
			console.log('SMS has been: ' + status);
		    }, function(error) {
			console.log('Error sending SMS: ' + error);
		    });
		    
		    // TO DO: 
		    // Report the issue of not being able to get the geolocation
		    console.log('Unable to load the device\'s location (' + error + ')');

		});

	    }, 4000);

	    /*
	     * This will run the following code every 6 seconds,
	     * until the cancelInterval functoin is called. 
	     * The idea of this method will be to keep calling the function
	     * to get the location of the device, until the GPS is found,
	     * then send a message to the Sender. 
	     *	     
	     var interval = setInterval(function() {
	     findDevice(interval, sms)
	     }, '6000');
	     */

	},
	// Disable the tracking of the phone, and set the alert of 
	// the device back to normal 
	stopTracking: function(sms) {
	    
	    // Set the alert back to normal, and pass it back up the scope, 
	    // to the main page
	    var $alert = {
		status: false,
		class: ''
	    };
	    
	    $rootScope.alert = $alert;
	    
	    // Let the sender know the device is no longer being tracked
	    var message = 'We are no longer tracking the phone.';
	    var promise = sendMessage.sendMessage(sms.sender, message);
	    promise.then(function(status) {
		console.log('Stop tracking: ' + status);
	    }, function(error) {
		console.log('Error sending SMS that phone no longer being tracked: ' + error);
	    });

	    //$window.alert('Stop tracking the device');
	},
	lockDevice: function() {
	    $window.alert('Lock the device so no one else can use it');
	},
	soundAlarm: function(){
	    $window.alert('Sound a really loud alarm / audio file');
	},
	setAlert: function() {
	    $window.alert('This device is missing! Please hand it into the police');
	},
	wipeDevice: function() {
	    $window.alert('Warning - Device will be wipped clean');
	}

    };
});
