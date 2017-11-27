'use strict'
angular.module('myApp.controller.newfeed', [])
    .controller('newfeed', ["$scope", function ($scope) {
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
            },
            {
                avatar: '../public/images/instagram/profile.jpg',
                name: 'Minh Thang',
                time: '8h30 27/11',
                image: '../public/images/instagram/profile.jpg',
                countLike: 1200
            },
            {
                avatar: '../public/images/instagram/profile.jpg',
                name: 'Minh Thang',
                time: '8h30 27/11',
                image: '../public/images/instagram/profile.jpg',
                countLike: 1200
            }];
    }])