/*
 * Script orginally from
 * http://jsfiddle.net/thomporter/UZrex/1/
 * 
 * A script to check if the password and confirm password matches
 * It takes the Form name (createForm) and gets the value from first password field
 * then passing in the value from the confirm password under 'viewValue', it compares
 * the two values. If they do not match, it sets the controller of the confirm
 * password to set a form error. 
 */


var userValidation = angular.module('UserValidation', []);
	    
userValidation.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue !== scope.createForm.password.$viewValue;
                ctrl.$setValidity('noMatch', !noMatch);
            });
        }
    };
});