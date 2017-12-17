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
                Service.registerAccount(
                    $scope.registerAccount.createAccount.username,
                    $scope.registerAccount.createAccount.name,
                    $scope.registerAccount.createAccount.nickname,
                    $scope.registerAccount.createAccount.password,
                    function (data) {
                        if (data.data.status) {
                            $scope.registerAccount.click();
                        } else {
                            alert("Sai!");
                        }
                    });
            },
        };
        $scope.login = {
            loginAccount: {
                username: "",
                password: ""
            },
            buttonLogin: function () {
                Service.checkLogin(this.loginAccount.username, this.loginAccount.password, function (data) {
                    if (data.data.status == 1) {
                        window.location.assign('/home');
                    } else {
                        $scope.login.loginAccount.username = "";
                        $scope.login.loginAccount.password = "";
                        alert("Đăng nhập không thành công!");
                    }
                });
            }
        }
    }]);