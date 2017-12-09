var aws = require('aws-sdk');
var fs = require('fs');
var diacritics = require('diacritic');
aws.config.update({
    region: "ap-southeast-1",

});
aws.config.accessKeyId = "AWSAccessKeyId=AKIAJJXIY3275CEHFILQ";
aws.config.secretAccessKey = "AWSSecretKey=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";
var s3 = new aws.S3();
//getlist
exports.getListBucket = function(){
    var params = {};
    s3.listBuckets(params,function(err, data) {
        if (err) {
            console.log("Error get list bucket", JSON.stringify(err, null, 2));
        } else {
            console.log("Bucket List", JSON.stringify(data, null, 2));
        }
    });
};
//tao bucket de luu tru hinh anh
exports.createBucket = function (bucketName, callback) {
    var myBucket = removeVNMark(bucketName);
    s3.createBucket({Bucket: myBucket}, function (err, data) {
        if (err) {
            console.log("--> CreateBucket error: " + err);
            callback(false);
        } else {
            console.log("--> CreateBucket create success.");
            callback(true);
        }
    });
};

//add 1 hinh vao bucket
exports.putItem = function (bucketName, image, callback) {
    var _bucketName = removeVNMark(bucketName);
    var s3Bucket = new aws.S3({params: {Bucket: _bucketName}});
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
//add nhieu image vao bucket
exports.putItems = function (bucketName, images, callback) {
    var _images = [];
    var _bucketName = removeVNMark(bucketName);
    var s3Bucket = new aws.S3({params: {Bucket: _bucketName}});
    var option;
    var count = 0;
    try{
        images.forEach(function (item) {
            count++;
            option = {
                Key: item.name,
                Body: fs.createReadStream(item.path),
                ACL: 'public-read'
            };
            var messageErr;
            s3Bucket.putObject(option, function (err, data) {
                if (err) {
                    console.log('--> Put items error, item  ' + count + ": " + err);
                    messageErr += "Put items error, item " + count + ": " + err;
                    if (count == images.length) {
                        callback(null);
                    }
                } else {
                    var urlParams = {Bucket: _bucketName, Key: item.name};
                    var url = s3Bucket.getSignedUrl('getObject', urlParams);
                    try {
                        var indexOfQuestion = url.indexOf('?');
                        var urlFinal = url.substr(0, indexOfQuestion);
                        _images.push({
                            "bucket": _bucketName,
                            "size": item.size,
                            "type": item.type,
                            "url": urlFinal,
                            "name": item.name
                        });
                        if (count == images.length) {
                            console.log('--> Put items success.');
                            callback(_images);
                        }
                    }
                    catch (exception) {
                        console.log("--> Exception in putItems: " + exception);
                        callback(null);
                    }
                }
            });
        });
    }
    catch(exception){
        console.log("--> Exception in putItems: " + exception);
        callback(null);
    }
};
//xoa bucket
exports.removeBucket = function (bucketName) {
    var _bucketName = removeVNMark(bucketName);
    console.log("bucketName sau khi xoa dau va khoang trang  " + _bucketName)
    var paramsBucket = {Bucket: _bucketName};
    s3.listObjects(paramsBucket, function (err, data) {
        var objects = [];
        data.Contents.forEach(function (item) {
            objects.push({"Key": item.Key});
        });
        var params = {
            "Bucket": _bucketName,
            "Delete": {
                "Objects": objects
            }
        };
        s3.deleteObjects(params, function (err, data) {
            if (err) {
                console.log("--> Delete objects  error: " + err);
            }
            else {
                s3.deleteBucket({Bucket: _bucketName}, function (err, data) {
                    if (err) {
                        console.log("--> Delete bucket error: "+ err);
                    } else {
                        console.log("--> Delete bucket success");
                    }
                });
            }
        });
    });
};

//xoa ki tu rong
function removeVNMark(str) {
    if (str.trim() != null || str.trim() != "") {
        var noneSign = diacritics.clean(str).trim();
        return noneSign;
    }
    return str;
}
