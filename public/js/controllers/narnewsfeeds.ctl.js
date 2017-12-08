'use strict'
angular.module('myApp.controller.test', [])
    .controller('testertmt', ["$scope", "Service", function ($scope, Service) {
        $scope.narkeyname = "";
        $scope.listFind = [];
        $scope.myFunct = function (keyEvent) {
            $scope.listFind = [];
            if (keyEvent.which === 13) {
                Service.findFriends($scope.narkeyname, function (data) {
                    if (typeof (data.data.a) != 'undefined') {
                        var count = data.data.a.Count;
                        for (var i = 0; i < count; i++) {
                            $scope.listFind.push(data.data.a.Items[i]);
                        }
                    }
                });
            }
        };
        $scope.onExit = function () {
            window.location.assign('/logout');
        }
    }]);