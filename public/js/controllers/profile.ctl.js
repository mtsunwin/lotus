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
                        $scope.User.accountGG = data.data.info.accountGoogle;
                        $scope.User.accountFb = data.data.info.accountFacebook;
                        $scope.User.username = data.data.info.username;
                        $scope.listNews = [];
                        Service.checkFriends(data.data.info.username, function (data) {
                            if (data.data.listFriends) {
                                $scope.follow = false;
                            } else {
                                $scope.follow = true;
                            }
                        });
                        Service.getYourNewsFeeds(data.data.info._id, getDate(), function (data2) {
                            console.log("this", data2.data);
                            for (var i = 0; i < data2.data.listNews.length; i++) {

                                $scope.listNews.push({
                                    'url': data2.data.listNews[i].imageName.S,
                                    'time': data2.data.listNews[i].time.S,
                                    'content': data2.data.listNews[i].status.S,
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
            $scope.listFriend = [];
            Service.getListFriend(function (data) {
                if (data.data.listFriends.Count > 0) {
                    for (var i = 0; i < data.data.listFriends.Count; i++) {
                        var id = data.data.listFriends.Items[i]._id.S;
                        console.log("show", data.data.listFriends.Items[i]);
                        Service.goFriends(data.data.listFriends.Items[i].usernamefriend.S, function (data2) {
                            if (typeof (data2.data.info) != 'undefined' && data2.data.info.username.length > 0) {
                                console.log("list friends:", data2);
                                $scope.listFriend.push(data2.data.info);
                            }
                        });
                    }
                }
            });
            Service.getOwnInfor(function (data) {
                console.log("this data", data);
                $scope.follow = false;
                $scope.User.avatar = data.data.user.avatar;
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
                        console.log("check", data.data.listNews[i]);
                        $scope.listNews.push({
                            'url': data.data.listNews[i].imageName,
                            'time': data.data.listNews[i].time,
                            'content': data.data.listNews[i].status,
                        });
                        console.log("mmm", $scope.listNews);
                    }
                });
                for (var i = 1; i <= 10; i++) {
                    Service.getNewsFeeds(calDate(i), function (data) {
                        console.log("tmt", data.data.listNews);
                        for (var i = 0; i < data.data.listNews.length; i++) {
                            $scope.listNews.push({
                                'url': data.data.listNews[i].imageName,
                                'time': data.data.listNews[i].time,
                                'content': data.data.listNews[i].status,
                            });
                        }
                    });
                }
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
        $scope.gopagefriends = function (_data) {
            window.location.assign('/profile?name=' + _data);
        };
        var calDate = function (_after) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            month = (month < 10 ? "0" : "") + month;
            day = (day < 10 ? "0" : "") + day;
            day -= _after;
            if (day <= 0) {
                day = 31;
                month--;
                if (month <= 0) {
                    month = 12;
                    year--;
                }
            }
            console.log("cal date", year + ":" + month + ":" + day);
            return year + ":" + month + ":" + day;
        }
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
        $scope.src = "null";
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

