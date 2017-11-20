'use strict'
angular.module('myApp.directive', [])
    .directive('navbar', function(){
        return {
            restrict: 'E',
            templateUrl: '../public/template/navbar.html'
        }
    });