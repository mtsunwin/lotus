'use strict'
angular.module('myApp.controller.editprofile', [])
    .controller('editprofile', ["$scope", "Service", function ($scope, Service) {
        $scope.thang = "oke";
        $scope.info = {
            phone: "",
            birth: "",
            fb: "",
            gd: "",
            address:""
        };
        $scope.submit = function () {
            Service.editProfile($scope.info.phone, $scope.info.birth, $scope.info.gd, $scope.info.fb, $scope.info.address,function (data) {
                console.log("oke");
            });
        }
        ;
        $scope.uploadedFile = function (element) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.$apply(function ($scope) {
                    $scope.files = element.files;
                    $scope.src = event.target.result
                });
            }
            reader.readAsDataURL(element.files[0]);
        }
    }]);

