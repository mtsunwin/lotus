// Load the SDK for JavaScript
// var AWS = require('aws-sdk');
// Set the region
// AWS.config.update({region: 'ap-southeast-1'});
// AWS.config.accessKeyId = "AKIAIPWOWY7BRDRICJ3Q";
// AWS.config.secretAccessKey = "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";
// Create S3 service object
// s3 = new AWS.S3({apiVersion: '2006-03-01'});
// // Call S3 to list current buckets
// s3.listBuckets(function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Bucket List", data.Buckets);
//     }
// });

exports.putItem = function (AWS, fs, image, callback) {
    var _bucketName = 'nghiabc';
    var s3Bucket = new AWS.S3({params: {Bucket: _bucketName}});
    var option = {
        Key: image.name,
        Body: fs.createReadStream(image.path),
        ACL: 'public-read'
    };
    s3Bucket.putObject(option, function (err, data) {
        if (err) {
            console.log('--> Put a item error:', err);
            callback(null);
        } else {
            var urlParams = {Bucket: _bucketName, Key: image.name};
            var url = s3Bucket.getSignedUrl('getObject', urlParams);
            try {
                var indexOfQuestion = url.indexOf('?');
                var urlFinal = url.substr(0, indexOfQuestion);
                var _image = {
                    "bucket": _bucketName,
                    "size": image.size,
                    "type": image.type,
                    "url": urlFinal,
                    "name": image.name
                };
                console.log('--> Put a item success.');
                callback(_image);
            }
            catch (exception) {
                console.log("--> Exception in put a item:" + exception);
                return -1;
            }
        }
    });
};

// // call S3 to retrieve upload file to specified bucket
// var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
// var file = process.argv[3];
// var fs = require('fs');
// var fileStream = fs.createReadStream(file);
// fileStream.on('error', function(err) {
//     console.log('File Error', err);
// });
// uploadParams.Body = fileStream;
//
// var path = require('path');
// uploadParams.Key = path.basename(file);
//
// // call S3 to retrieve upload file to specified bucket
// s3.upload (uploadParams, function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } if (data) {
//         console.log("Upload Success", data.Location);
//     }
// });