'use strict'
angular.module('myApp.controller', [])
    .controller('index', ["$scope", "Service", "$location", function ($scope, Service, $location) {
        $scope.registerAccount = {
            login: false,
            click: function () {
                this.login = !this.login;
            },
            createAccount: {
                username: "",
                nickname: "",
                name: "",
                password: ""
            },
            buttonCreateAccount: function () {
                console.log("1", this.createAccount);
                Service.registerAccount(this.createAccount.username, this.createAccount.name, this.createAccount.nickname, this.createAccount.password, function (data) {
                    console.log("factory: ", data.data);
                    if (data.data == 1) {
                        alert("thành công");
                    } else {
                        alert("thất bại");
                    }
                });
            }
        };
        $scope.login = {
            loginAccount: {
                username: "",
                password: ""
            },
            buttonLogin: function () {
                Service.checkLogin(this.loginAccount.username, this.loginAccount.password);
            }
        }
    }]);