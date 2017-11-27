'use strict'
angular.module('myApp.directiveNewsFeed', [])
    .directive('navnewsfeed', function(){
        return {
            restrict: 'E',
            templateUrl: '../public/template/navNewsFeed.html'
        }
    });