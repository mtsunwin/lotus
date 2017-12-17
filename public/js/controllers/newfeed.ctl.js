'use strict'
angular.module('myApp.controller.newfeed', [])
    .controller('newfeed', ["$scope", "Service", function ($scope, Service) {
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
        Service.getOwnInfor(function (data) {
            console.log("info", data);
            if (typeof (data.data.user.avatar) != "undefined" && data.data.user.avatar != null) {
                $scope.User.avatar = data.data.user.avatar;
            }
            $scope.User.fullname = data.data.user.fullname;
            $scope.User.id = data.data.user._id;
            $scope.User.phone = data.data.user.phone;
            $scope.User.email = data.data.user.email;
            $scope.User.birthday = data.data.user.birthday;
            $scope.User.username = data.data.user.username;
            $scope.User.address = typeof (data.data.user.address) != "undefined" ? data.data.user.address : "";
            Service.getNewsFeeds(getDate(), function (data) {
                for (var i = 0; i < data.data.listNews.length; i++) {
                    $scope.listnews.push({
                        gopage: $scope.User.username,
                        name: $scope.User.fullname,
                        avatar: $scope.User.avatar,
                        image: data.data.listNews[i].imageName,
                        time: data.data.listNews[i].time,
                        content: data.data.listNews[i].status
                    });
                }
            });
        });
        Service.getListFriend(function (data) {
            if (data.data.listFriends.Count > 0) {
                for (var i = 0; i < data.data.listFriends.Count; i++) {
                    var id = data.data.listFriends.Items[i]._id.S;
                    Service.goFriends(data.data.listFriends.Items[i].usernamefriend.S, function (data2) {
                        if (typeof (data2.data.info) != 'undefined' && data2.data.info.username.length > 0) {
                            var avatar = data2.data.info.avatar;
                            var name = data2.data.info.fullname;
                            var user = data2.data.info.username;
                            Service.getYourNewsFeeds(id, getDate(), function (data) {
                                for (var i = 0; i < data.data.listNews.length; i++) {
                                    $scope.listnews.push({
                                        gopage: user,
                                        name: name,
                                        image: data.data.listNews[i].imageName,
                                        time: data.data.listNews[i].time,
                                        content: data.data.listNews[i].status,
                                        avatar: avatar
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
        Service.getAllNewsFeeds(function (data) {
            console.log("tmt222", data);
        });
        $scope.listnews = [];
        // $scope.listnews = [
        //     {
        //         avatar: '../public/images/instagram/profile.jpg',
        //         name: 'Minh Thang',
        //         time: '8h30 27/11',
        //         image: '../public/images/instagram/profile.jpg',
        //         countLike: 1200,
        //         comment: [
        //             {name: "Nghĩa", content: "Tó!"},
        //             {name: "Nghĩa", content: "Tó!"}
        //         ]
        //     }];
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
    }]);