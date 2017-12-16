'use strict'
angular.module('myApp.controller.editprofile', [])
    .controller('editprofile', ["$scope", "Service", function ($scope, Service) {
        $scope.thang = "oke";
        $scope.info = {
            phone: "",
            birth: "",
            fb: "",
            gd: ""
        };
        $scope.submit = function () {
            Service.editProfile($scope.info.phone, $scope.info.birth, $scope.info.gd, $scope.info.fb, function (data) {
                console.log("oke");
            });
        }
        ;

    }]);

