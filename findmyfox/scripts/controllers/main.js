/*
 * The main user page, allowing for a number of different testing methods
 */
'use strict';

angular.module('findDeviceApp')
	.controller('MainCtrl', function($scope, $rootScope, $window, UserService, updateDeviceSetting,
	receivedMessage, sendMessage, localStorageService) {

console.log('user: ' + localStorageService.get('fduser.username'));

    /*
     * NASTY HACK
     * Check to see if there is a user in the system already
     */    
    if(UserService.hasUser){
	$rootScope.hasUser = true;
    } else {
	$rootScope.hasUser = false;	
    }

    /*
     * System Event Handler, used to listen to any incoming text messages
     * and will issue a command upon the text message being received 
     * by the device 
     */
    navigator.mozSetMessageHandler('sms-received', function onSMS(sms) {
	receivedMessage.scanMessageReceived(sms);
    });

    function init() {

	/*
	 * Load the GPS coordinates for the device
	 */
	
	/*
	 geolocation.getCurrentPosition().then(function(position) {
	 console.log('FOUND! The geolocation of the device.');
	 console.log(position);
	 $scope.position = position;
	 }, function(error) {
	 console.log('ERROR Getting geolocation of the device: ' + error);
	 });
	 */

    }

    init();
    
    /*
     * Basic button to stop the tracking alert
     */
    $scope.stopTracking = function(){
	// Set the alert back to normal, and pass it back up the scope, 
	    // to the main page
	    var $alert = {
		status: false,
		class: ''
	    };
	    
	    $rootScope.alert = $alert;
    };

    /*
     * Test the Lost Phone command 
     */
    $scope.startTrackingMsg = function() {
	console.log('-------------------------');
	console.log('TEST: Incoming SMS with a command message');
	console.log('-------------------------');

	var sms = {
	    sender: '1234',
	    body: 'will you find me please! myPassKey',
	    timestamp: new Date().getTime()
	};

	receivedMessage.scanMessageReceived(sms);

    };

    /*
     * Test the Commands for found the phone
     */
    $scope.stopTrackingMsg = function() {
	console.log('-------------------------');
	console.log('TEST: Stop Tracking SMS');
	console.log('-------------------------');

	var sms = {
	    sender: '1234',
	    body: 'found you myPassKey',
	    timestamp: new Date().getTime()
	};

	receivedMessage.scanMessageReceived(sms);

    };

    /*
     * Send a text message
     */
    $scope.sendSMS = function() {

	console.log('-------------------------');
	$window.alert('going to send a text message now');

	var receiver = '1234';
	var message = 'Hello from the app';

	var promise = sendMessage.sendMessage(receiver, message);

	promise.then(function(status) {
	    console.log('SMS has been: ' + status);
	    $window.alert('Promise: SMS has been: ' + status);
	}, function(error) {
	    console.log('Error sending SMS: ' + error);
	    $window.alert('Error trying to send SMS ' + error);
	});

    };


    /*
     * Get the status of the setting 
     * @param {type} s
     */
    $scope.getSettingStatus = function(s) {

	console.log('-------------------------');

	var promise = updateDeviceSetting.checkSettingStatus(s);
	promise.then(function(status) {
	    console.log('SETTING : ' + s + ': ' + status);
	    $window.alert(s + ' is currently turned ' + status);
	}, function(error) {
	    console.log('error getting setting status ' + error);
	});

    };

    /*
     * Activate GPS 
     */
    $scope.activateSetting = function(s) {

	console.log('-------------------------');
	console.log('Activate ' + s);

	var promise = updateDeviceSetting.enableSetting(s);

	promise.then(function(status) {
	    console.log('SETTING : ' + s + ': ' + status);
	    $window.alert(s + ' is now: ' + status);
	}, function(error) {
	    console.log('error getting setting status ' + error);
	});

    };

    /*
     * Turn off the Setting 
     */
    $scope.disableSetting = function(s) {

	console.log('-------------------------');
	console.log('Disable ' + s);

	updateDeviceSetting.disableSetting(s).then(function(status) {
	    console.log('SETTING : ' + s + ': ' + status);
	    $window.alert(s + ' is now: ' + status);
	});

    };

});