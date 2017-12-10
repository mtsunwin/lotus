'use strict'
angular.module('myApp.service', [])
    .factory('Service', ['$http', function ($http) {
        return {
            registerAccount: function (_username, _fullname, _nickname, _password, callback) {
                var boolean;
                $http({
                    method: "POST",
                    url: "/insertuser",
                    headers: {"content-type": "application/json"},
                    dataType: "json",
                    data: JSON.stringify({
                        name: _fullname,
                        nickname: _nickname,
                        username: _username,
                        password: _password
                    }),
                }).then(callback);
            },
            checkLogin: function (_username, _password, callback) {
                $http({
                    method: "POST",
                    url: "/login",
                    headers: {"content-type": "application/json"},
                    dataType: "json",
                    data: JSON.stringify({
                        username: _username,
                        password: _password
                    }),
                }).then(callback);
            },
            findFriends: function (_keySearch, callback) { // Tìm kiếm bạn bè
                $http({
                    method: "POST",
                    url: "/findfriends",
                    headers: {"content-type": "application/json"},
                    dataType: "json",
                    data: JSON.stringify({
                        getkey: _keySearch
                    })
                }).then(callback);
            },
            getOwnInfor: function (callback) { // get thong tin của mình
                $http({
                    method: "POST",
                    url: "/getinfo",
                    headers: {"content-type": "application/json"},
                    dataType: "json"
                }).then(callback);
            },
            getListFriend: function (callback) {
                $http({
                    method: "POST",
                    url: "/getListFriends",
                    headers: {"content-type": "application/json"},
                    dataType: "json"
                }).then(callback);
            },
            getNewsFeeds: function (callback) {
                $http({
                    method: "POST",
                    url: "/getNewsFeeds",
                    headers: {"content-type": "application/json"},
                    dataType: "json"
                }).then(callback);
            },
            goFriends: function (_username, callback) { // truy cập profile
                $http({
                    method: "POST",
                    url: "/findFrieds",
                    headers: {"content-type": "application/json"},
                    dataType: "json",
                    data: JSON.stringify({
                        usernametmt: _username
                    })
                }).then(callback);
            },
        };
    }]);