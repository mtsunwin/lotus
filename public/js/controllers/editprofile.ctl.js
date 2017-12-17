'use strict'
angular.module('myApp.controller.editprofile', [])
    .controller('editprofile', ["$scope", "Service", function ($scope, Service) {
        $scope.thang = "oke";
        $scope.info = {
            phone: "",
            birth: "",
            fb: "",
            gd: "",
            address: "",
            avatar: "../public/images/instagram/avatar.png"
        };
        $scope.src = "../public/images/instagram/avatar.png";
        Service.getOwnInfor(function (data) {
            $scope.info.fullname = data.data.user.fullname;
            $scope.src = typeof (data.data.user.avatar) != "undefined" ? data.data.user.avatar : "../public/images/instagram/avatar.png";
            $scope.info.phone = data.data.user.phone;
            $scope.info.birth = data.data.user.birthday;
            $scope.info.address = typeof (data.data.user.address) != "undefined" ? data.data.user.address : "";
            $scope.info.fb = typeof (data.data.user.accountFacebook) != "undefined" ? data.data.user.accountFacebook : "";
            $scope.info.gd = typeof (data.data.user.accountGoogle) != "undefined" ? data.data.user.accountGoogle : "";
            console.log(data);
        })
        $scope.submit = function () {
            Service.editProfile($scope.info.phone, $scope.info.birth, $scope.info.gd, $scope.info.fb, $scope.info.address, function (data) {
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

