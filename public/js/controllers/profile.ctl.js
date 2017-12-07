'use strict'
angular.module('myApp.controller.profile', [])
    .controller('profile', ["$scope", "Service", function ($scope, Service) { //, "Upload"
        $scope.profile = "oke";
        $scope.User = {
            avatar: '../public/images/instagram/profile.jpg',
            fullname: 'Minh Thang',
            image: '../public/images/instagram/profile.jpg',
            countLike: 1200,
            nickname: 'Thắng Đẹp Zaii',
            phone: '0989900814',
            email: 'thang@gmail.com',
            birthday: '010101 1996',
            address: 'Hồ Chí Minh',
            introduce: "Khó tính.. hay lười.. mê gái :D",
        };
        $scope.uploadFile = function () {
            $scope.myFile = $scope.files[0];
            var file = $scope.myFile;
            var url = "URL THIS";
            Service.uploadFiletoServer(file, url);
        };
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