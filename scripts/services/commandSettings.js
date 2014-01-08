/*
 * Allow the user to set their own passkey and message command,
 * which are then saved on the device's local storage. 
 * The script also checks to see if the app is run for the first time, 
 * it will set the default commands.
 * 
 * The passkey will be encypted, ensuring for an added level of security. 
 */
'use strict';

angular.module('findDeviceApp').factory('commandSettings', function(Base64, localStorageService) {

    // Create an array of commands
    var getCommands = function() {

	var cmd = {
	    lost: {
		type: 'lost',
		cmd: this.lostCmd(),
		storage: 'fdsettings.lostCmd'
	    },
	    found: {
		type: 'found',
		cmd: this.foundCmd(),
		storage: 'fdsettings.foundCmd'
	    },
	    lock: {
		type: 'lock',
		cmd: this.lockCmd(),
		storage: 'fdsettings.lockCmd'
	    },
	    alert: {
		type: 'alert',
		cmd: this.alertCmd(),
		storage: 'fdsettings.alertCmd'
	    },
	    wipe: {
		type: 'wipe',
		cmd: this.wipeCmd(),
		storage: 'fdsettings.wipeCmd'
	    }
	};

	return cmd;
    };

    /*
     * Get the passkey saved in local storage, and if there is no passkey,
     * use the default passkey
     * 
     * @return (string) passkey
     */
    var getPasskey = function() {

	var passkey;

	// Check to see if a passkey exists in local storage
	if (localStorageService.get('fdsettings.passkey') === null && localStorageService.get('fdsettings.passkey') !== '') {
	    // TO DO: 
	    // Save the default passkey into local storage
	    passkey = 'myPassKey';
	    passkey = Base64.encode(passkey);
	} else {
	    // Get the passkey from storage
	    passkey = localStorageService.get('fdsettings.passkey');
	}

	return passkey;
    };

    /*
     * Encrypt the passkey before saving it onto local stoage 
     * And return confirmation that it was saved into local storage correctly 
     * 
     * @return (boolean) localstorage.add() 
     */
    var setPasskey = function(p) {
	console.log('save: ' + p);
	var passkey = Base64.encode(p);
	return localStorageService.add('fdsettings.passkey', passkey);
    };

    /*
     * Get the command to find a lost device that is stored on local storage.
     * If there is no command saved, use the default command
     * 
     * @return (string) lostCmd
     */
    var getLostCmd = function() {
	var lostCmd;

	// Check to see if the command exists in local storage
	if (localStorageService.get('fdsettings.lostCmd') === null && localStorageService.get('fdsettings.lostCmd') !== '') {
	    // TO DO: 
	    // Save the default passkey into local storage
	    lostCmd = 'find me';
	} else {
	    // Get the command from local storage
	    lostCmd = localStorageService.get('fdsettings.lostCmd');
	}

	return lostCmd;
    };

    /*
     * Get the command to set the device as found, that is stored on local storage.
     * If there is no command saved, use the default command
     * 
     * @return (string) foundCmd
     */
    var getFoundCmd = function() {
	var foundCmd;

	// Check to see if the command exists in local storage
	if (localStorageService.get('fdsettings.foundCmd') === null && localStorageService.get('fdsettings.foundCmd') !== '') {
	    // TO DO: 
	    // Save the default passkey into local storage
	    foundCmd = 'found you';
	} else {
	    // Get the command from local storage
	    foundCmd = localStorageService.get('fdsettings.foundCmd');
	}

	return foundCmd;
    };

    /*
     * Get the command to lock the device, that is stored on local storage.
     * If there is no command saved, use the default command
     * 
     * @return (string) foundCmd
     */
    var getLockCmd = function() {
	var lockCmd;

	// Check to see if the command exists in local storage
	if (localStorageService.get('fdsettings.lockCmd') === null && localStorageService.get('fdsettings.lockCmd') !== '') {
	    // TO DO: 
	    // Save the default passkey into local storage
	    lockCmd = 'lock up';
	} else {
	    // Get the command from local storage
	    lockCmd = localStorageService.get('fdsettings.lockCmd');
	}

	return lockCmd;
    };

    /*
     * Get the command to display an alert on the device, that is stored on local storage.
     * If there is no command saved, use the default command
     * 
     * @return (string) foundCmd
     */
    var getAlertCmd = function() {
	var alertCmd;

	// Check to see if the command exists in local storage
	if (localStorageService.get('fdsettings.alertCmd') === null && localStorageService.get('fdsettings.alertCmd') !== '') {
	    // TO DO: 
	    // Save the default passkey into local storage
	    alertCmd = 'my alert';
	} else {
	    // Get the command from local storage
	    alertCmd = localStorageService.get('fdsettings.alertCmd');
	}

	return alertCmd;
    };

    /*
     * Get the command to display an alert on the device, that is stored on local storage.
     * If there is no command saved, use the default command
     * 
     * @return (string) foundCmd
     */
    var getWipeCmd = function() {
	var wipeCmd;

	// Check to see if the command exists in local storage
	if (localStorageService.get('fdsettings.wipeCmd') === null && localStorageService.get('fdsettings.wipeCmd') !== '') {
	    // TO DO: 
	    // Save the default passkey into local storage
	    wipeCmd = 'self destruct';
	} else {
	    // Get the command from local storage
	    wipeCmd = localStorageService.get('fdsettings.wipeCmd');
	}

	return wipeCmd;
    };

    /*
     * Saving the command onto local stoage 
     * And return confirmation that it was saved into local storage correctly 
     * 
     * @return (boolean) localstorage.add() 
     */
    var setCmd = function(storage, cmd) {
	return localStorageService.add(storage, cmd);
    };

    // Create a easy to call method in the parent factory
    return {
	getCommands: getCommands,
	passkey: getPasskey,
	setPasskey: setPasskey,
	lostCmd: getLostCmd,
	foundCmd: getFoundCmd,
	lockCmd: getLockCmd,
	alertCmd: getAlertCmd,
	wipeCmd: getWipeCmd,
	setCmd: setCmd
    };

});