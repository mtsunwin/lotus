'use strict'
angular.module('myApp.controller', [])
    .controller('index', ["$scope", "Service", "$location", function ($scope, Service, $location) {
        $scope.registerAccount = {
            completed: false,
            login: false,
            click: function () {
                this.login = !this.login;
                this.createAccount.username = "";
                this.createAccount.nickname = "";
                this.createAccount.name = "";
                this.createAccount.password = "";
            },
            createAccount: {
                username: "",
                nickname: "",
                name: "",
                password: ""
            },
            buttonCreateAccount: function () {
                Service.registerAccount(this.createAccount.username, this.createAccount.name, this.createAccount.nickname, this.createAccount.password, function (data) {
                    console.log("tai sao?", data.data);
                    if (data.data == 1) {
                        alert("thành công 2");
                        $scope.registerAccount.click();
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