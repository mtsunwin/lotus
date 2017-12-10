'use strict'
angular.module('myApp.controller.profile', [])
    .controller('profile', ["$scope", "Service", "$location", function ($scope, Service, $location) {
        var paramValue = $location.search().name;
        var objUser = [];
        $scope.follow = false;
        $scope.User = {
            avatar: '../public/images/instagram/profile.jpg',
            fullname: 'Minh Thang',
            image: '../public/images/instagram/profile.jpg',
            countLike: 0,
            nickname: 'Nick Name',
            phone: 'Cập nhật thông tin giới thiệu về mình..',
            email: 'thang@gmail.com',
            birthday: 'Cập nhật thông tin giới thiệu về mình..',
            address: 'Cập nhật thông tin giới thiệu về mình..',
            introduce: "Cập nhật thông tin giới thiệu về mình..",
        };
        Service.getOwnInfor(function (data) {
            console.log("this data", data);
            $scope.User.fullname = data.data.user.nickname;
            $scope.User.phone = data.data.user.phone;
            $scope.User.email = data.data.user.email;
            $scope.User.birthday = data.data.user.birthday;
        });
        Service.getListFriend(function (data) {
            $scope.listFriend = data.data.listFriends;
        });
        $scope.checkOwnPage = false;
        if (typeof (paramValue) != 'undefined') {
            Service.findFriends(paramValue, function (data) {
                if (typeof (data.data.a) != 'undefined' && data.data.a.Count == 1) {
                    console.log(data.data.a.Items[0]);
                    $scope.User.avatar = data.data.a.Items[0].avatar;
                    $scope.User.fullname = data.data.a.Items[0].fullname;
                    $scope.User.localcreate = data.data.a.Items[0].localcreate;
                    $scope.User.birthday = data.data.a.Items[0].birthday;
                    $scope.User.phone = data.data.a.Items[0].phone;
                    $scope.User.email = data.data.a.Items[0].email;
                    $scope.User.username = data.data.a.Items[0].username;

                } else {
                    window.location.assign('/err');
                }
            });
        } else {
            $scope.checkOwnPage = true;
        }
        $scope.uploadFile = function () {
            $scope.myFile = $scope.files[0];
            var file = $scope.myFile;
            var url = "URL THIS";
            console.log(file);
            // Service.uploadFiletoServer(file, url);
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
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

