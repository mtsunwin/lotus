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
            // Upload Images
            service: function ($http) {
                this.uploadFiletoServer = function (file, uploadUrl) {
                    var fd = new FormData();
                    fd.append('file', file);
                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined, 'Process-Data': false}
                    })
                        .success(function (data) {
                            alert(data);
                        })
                        .error(function () {
                            alert("Error");
                        });
                }
            },
            findFriends: function (_keySearch, callback) {
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
            getOwnInfor: function (callback) {
                $http({
                    method: "POST",
                    url: "/getinfo",
                    headers: {"content-type": "application/json"},
                    dataType: "json",
                    data: JSON.stringify({
                        getkey: _keySearch
                    })
                }).then(callback);
            }
        };
    }]);