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
            Service.getNewsFeeds(function (data) {
                console.log("tmt", data.data.listNews);
                for (var i = 0; i < data.data.listNews.length; i++) {
                    $scope.listnews.push({
                        avatar: $scope.User.avatar,
                        image: data.data.listNews[i].imageName.S,
                        time: data.data.listNews[i].time.S,
                        content: data.data.listNews[i].status.S,
                    });
                }
            });
        });

        Service.getAllNewsFeeds(function (data) {
            console.log("tmt222", data);
        });

        $scope.listnews = [
            {
                avatar: '../public/images/instagram/profile.jpg',
                name: 'Minh Thang',
                time: '8h30 27/11',
                image: '../public/images/instagram/profile.jpg',
                countLike: 1200,
                comment: [
                    {name: "Nghĩa", content: "Tó!"},
                    {name: "Nghĩa", content: "Tó!"}
                ]
            }];
    }]);