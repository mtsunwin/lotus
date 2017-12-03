'use strict'

angular.module('myApp.controller.test', [])
    .controller('profile', ["$scope", "Upload", function ($scope, Upload) {
        $scope.profile = "oke";
    }]);