'use strict'
angular.module('myApp.controller.profile', [])
    .controller('profile', ["$scope", "Service", "$location", function ($scope, Service, $location) {
        var paramValue = $location.search().name;
        var objUser = [];
        $scope.follow = false;
        $scope.User = {
            avatar: '../public/images/instagram/profile.jpg',
            fullname: 'Chờ trong giây lát...',
            image: '../public/images/instagram/profile.jpg',
            countLike: 0,
            nickname: 'Nick Name',
            phone: 'Cập nhật thông tin giới thiệu về mình..',
            email: 'thang@gmail.com',
            birthday: 'Cập nhật thông tin giới thiệu về mình..',
            address: 'Cập nhật thông tin giới thiệu về mình..',
            introduce: "Cập nhật thông tin giới thiệu về mình..",
        };
        Service.getListFriend(function (data) {
            console.log(data);
            $scope.listFriend = data.data.listFriends;
        });
        Service.getOwnInfor(function (data) {
            console.log("this data", data);
            $scope.follow = false;
            $scope.User.fullname = data.data.user.nickname;
            $scope.User.phone = data.data.user.phone;
            $scope.User.email = data.data.user.email;
            $scope.User.birthday = data.data.user.birthday;
            $scope.User.username = data.data.user.username;
        });
        $scope.checkOwnPage = false;
        if (typeof (paramValue) != 'undefined') {
            console.log("run this");
            Service.goFriends(paramValue, function (data) {
                console.log("aaa", data);
                if (typeof (data.data.info) != 'undefined' && data.data.info.username.length > 0) {
                    if (data.data.info.username != $scope.User.username) {
                        console.log("in fforrr", data);
                        $scope.User.avatar = data.data.info.avatar;
                        $scope.User.fullname = data.data.info.fullname;
                        $scope.User.localcreate = data.data.info.localcreate;
                        $scope.User.birthday = data.data.info.birthday;
                        $scope.User.phone = data.data.info.phone;
                        $scope.User.email = data.data.info.email;
                        $scope.User.username = data.data.info.username;
                        $scope.follow = true;
                    }
                }
            });
        } else {
            $scope.checkOwnPage = true;
        }
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
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

