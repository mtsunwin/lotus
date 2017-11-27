'use strict'
angular.module('myApp.controller', [])
    .controller('newfeed', ["$scope", "Service", "$location", "navbar", function ($scope, Service, $location, navbar) {
        $scope.minhthang = "thang tran";
        console.log("run this");
    }]);