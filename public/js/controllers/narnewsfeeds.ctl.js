'use strict'
angular.module('myApp.controller.test', [])
    .controller('testertmt', ["$scope", "Service", function ($scope, Service) {
        $scope.narkeyname = "";
        $scope.myFunct = function (keyEvent) {
            if (keyEvent.which === 13) {
                Service.findFriends($scope.narkeyname, function (data) {
                    console.log(data);
                });
            }
        };
        $scope.listFind = [];
        $scope.onExit = function () {
            window.location.assign('/logout');
        }
    }]);