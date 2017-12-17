'use strict'
angular.module('myApp.controller.profile', [])
    .controller('profile', ["$scope", "Service", "$location", function ($scope, Service, $location) {
        var paramValue = $location.search().name;
        var objUser = [];
        $scope.follow = false;
        $scope.User = {
            avatar: '../public/images/instagram/avatar.png',
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
        $scope.checkOwnPage = false;
        $scope.listNews = [];
        if (typeof (paramValue) != 'undefined') {
            console.log("oke");
            Service.goFriends(paramValue, function (data) {
                if (typeof (data.data.info) != 'undefined' && data.data.info.username.length > 0) {
                    if (data.data.info.username != $scope.User.username) {
                        console.log("thang test", data.data.info);
                        $scope.User.id = data.data.info._id;
                        $scope.User.avatar = data.data.info.avatar;
                        $scope.User.fullname = data.data.info.fullname;
                        $scope.User.localcreate = data.data.info.localcreate;
                        $scope.User.birthday = data.data.info.birthday;
                        $scope.User.phone = data.data.info.phone;
                        $scope.User.email = data.data.info.email;
                        $scope.User.username = data.data.info.username;
                        $scope.listNews = [];
                        Service.checkFriends(data.data.info.username, function (data) {
                            if (data.data.listFriends) {
                                $scope.follow = false;
                            } else {
                                $scope.follow = true;
                            }
                        });
                        Service.getYourNewsFeeds(data.data.info._id, getDate(), function (data) {
                            for (var i = 0; i < data.data.listNews.length; i++) {
                                $scope.listNews.push({
                                    'url': data.data.listNews[i].imageName.S,
                                    'time': data.data.listNews[i].time.S,
                                    'content': data.data.listNews[i].status.S,
                                });
                            }
                        });
                    } else {
                        window.location.assign('/profile');
                    }
                } else {
                    window.location.assign('/profile');
                }
            });
        } else {
            $scope.checkOwnPage = true;
            Service.getListFriend(function (data) {
                console.log("list friends:", data);
                $scope.listFriend = data.data.listFriends.Items;
            });
            Service.getOwnInfor(function (data) {
                console.log("this data", data);
                $scope.follow = false;
                $scope.User.fullname = data.data.user.fullname;
                $scope.User.id = data.data.user._id;
                $scope.User.phone = data.data.user.phone;
                $scope.User.email = data.data.user.email;
                $scope.User.birthday = data.data.user.birthday;
                $scope.User.username = data.data.user.username;
                $scope.User.address = typeof (data.data.user.address) != "undefined" ? data.data.user.address : "";
                $scope.listNews = [];

                Service.getNewsFeeds(getDate(), function (data) {
                    console.log("tmt", data.data.listNews);
                    for (var i = 0; i < data.data.listNews.length; i++) {
                        $scope.listNews.push({
                            'url': data.data.listNews[i].imageName.S,
                            'time': data.data.listNews[i].time.S,
                            'content': data.data.listNews[i].status.S,
                        });
                    }
                });
            });
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
        }
        $scope.addFriend = function () {
            console.log("oke chưa");
            Service.addFriend($scope.User.id, $scope.User.username, $scope.User.fullname, function (data) {
                if (data.data.a) {
                    $scope.follow = false;
                }
            });
        };

        /**
         * Lấy ngày tháng hiện tại
         * @return {string}
         */
        var getDate = function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = (month < 10 ? "0" : "") + month;
            var day = date.getDate();
            day = (day < 10 ? "0" : "") + day;
            return year + ":" + month + ":" + day;
        }
        /**
         * Lấy giờ phút hiện tại
         * @return {string}
         */
        var getTime = function () {
            var date = new Date();
            var hour = date.getHours();
            hour = (hour < 10 ? "0" : "") + hour;
            var min = date.getMinutes();
            min = (min < 10 ? "0" : "") + min;
            var sec = date.getSeconds();
            sec = (sec < 10 ? "0" : "") + sec;
            return hour + ":" + min + ":" + sec;
        }
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

