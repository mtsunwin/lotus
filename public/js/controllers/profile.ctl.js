'use strict'
angular.module('myApp.controller.profile', [])
    .controller('profile', ["$scope", "Service", function ($scope, Service) { //, "Upload"
        $scope.profile = "oke";
        $scope.User = {
            avatar: '../public/images/instagram/profile.jpg',
            fullname: 'Minh Thang',
            image: '../public/images/instagram/profile.jpg',
            countLike: 1200,
            nickname: 'Thắng Đẹp Zaii',
            phone: '0989900814',
            email: 'thang@gmail.com',
            birthday: '010101 1996',
            address: 'Hồ Chí Minh',
            introduce: "Khó tính.. hay lười.. mê gái :D",
        };
        $scope.uploadFile = function () {
            $scope.myFile = $scope.files[0];
            var file = $scope.myFile;
            var url = "URL THIS";
            Service.uploadFiletoServer(file, url);
        };
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
        /*        // GET THE FILE INFORMATION.
                $scope.getFileDetails = function (e) {
                    $scope.files = [];
                    $scope.$apply(function () {
                        // STORE THE FILE OBJECT IN AN ARRAY.
                        for (var i = 0; i < e.files.length; i++) {
                            $scope.files.push(e.files[i])
                        }
                    });
                };
                // NOW UPLOAD THE FILES.
                $scope.uploadFiles = function () {
                    //FILL FormData WITH FILE DETAILS.
                    var data = new FormData();
                    for (var i in $scope.files) {
                        data.append("uploadedFile", $scope.files[i]);
                    }
                    // ADD LISTENERS.
                    var objXhr = new XMLHttpRequest();
                    objXhr.addEventListener("progress", updateProgress, false);
                    objXhr.addEventListener("load", transferComplete, false);
                    // SEND FILE DETAILS TO THE API.
                    objXhr.open("POST", "/upload/");
                    objXhr.send(data);
                }

                // UPDATE PROGRESS BAR.
                function updateProgress(e) {
                    if (e.lengthComputable) {
                        document.getElementById('pro').setAttribute('value', e.loaded);
                        document.getElementById('pro').setAttribute('max', e.total);
                    }
                }

                // CONFIRMATION.
                function transferComplete(e) {
                    alert("Files uploaded successfully.");
                }*/


// upload later on form submit or something similar
//         $scope.submit = function() {
//             if ($scope.form.file.$valid && $scope.file) {
//                 $scope.upload($scope.file);
//             }
//         };
//
//         // upload on file select or drop
//         $scope.upload = function (file) {
//             Upload.upload({
//                 url: '/upload',
//                 data: {file: file, 'username': $scope.username}
//             }).then(function (resp) {
//                 console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
//             }, function (resp) {
//                 console.log('Error status: ' + resp.status);
//             }, function (evt) {
//                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//                 console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
//             });
//         };
//         // for multiple files:
//         $scope.uploadFiles = function (files) {
//             if (files && files.length) {
//                 // for (var i = 0; i < files.length; i++) {
//                 //     Upload.upload({..., data: {file: files[i]}, ...})...;
//                 // }
//                 // // or send them all together for HTML5 browsers:
//                 // Upload.upload({..., data: {file: files}, ...})...;
//             }
//         }
    }]);