/*
 * A user setting page, that allows the user to set the commands used in text messages
 * as well as update the passkey
 */
'use strict';

angular.module('findDeviceApp').controller('SettingsCtrl', function($scope, UserService, commandSettings) {

    // Get the Object of commands 
    var cmdArray = commandSettings.getCommands();
    
    /*
     * Pass the saved commands into the input fields via the $scope method
     *   
     * @param {type} $scope
     * @returns {undefined}
     */
    function init($scope) {
	$scope.settings = {};
	$scope.settings.lostCmd = cmdArray.lost.cmd;
	$scope.settings.foundCmd = cmdArray.found.cmd;
	$scope.settings.lockCmd = cmdArray.lock.cmd;
	$scope.settings.alertCmd = cmdArray.alert.cmd;
	$scope.settings.wipeCmd = cmdArray.wipe.cmd;
    }

    init($scope);

    /*
     * Save the input entered via the user.
     * Get the input entered into the field's via the $scope.setting array.
     * And then write it to local storage
     *  
     * @param {type} settings
     */
    $scope.saveCmd = function(settings) {

	// Save the commands 
	commandSettings.setCmd('fdsettings.lostCmd', settings.lostCmd);
	commandSettings.setCmd('fdsettings.foundCmd', settings.foundCmd);
	commandSettings.setCmd('fdsettings.lockCmd', settings.lockCmd);
	commandSettings.setCmd('fdsettings.alertCmd', settings.alertCmd);
	commandSettings.setCmd('fdsettings.wipeCmd', settings.wipeCmd);
    };
    
    $scope.savePasskey = function(settings) {
	
	// Only save the passkey if the field isn't empty
	var passkey = settings.passkey;
	if (passkey) {
	    commandSettings.setPasskey(passkey);
	}
	
	// TO DO:
	// Display an notivation to inform the user that the settings have been saved
	
	/*
	 // Load the User Controller to insert the local storage into the User Object
	 $location.path( "/login" ); 
	 */
    };

});
