var fs = require('fs');
var diacritics = require('diacritic');


//getlist
exports.getListBucket = function (aws) {
    var params = {};
    var s3 = new aws.S3();
    s3.listBuckets(params, function (err, data) {
        if (err) {
            console.log("Error get list bucket", JSON.stringify(err, null, 2));
        } else {
            console.log("Bucket List", JSON.stringify(data, null, 2));
        }
    });
};
//tao bucket de luu tru hinh anh
exports.createBucket = function (aws, bucketName, callback) {
    var myBucket = removeVNMark(bucketName);
    var s3 = new aws.S3();
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
exports.putItem = function (aws, bucketName, image, callback) {
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
//xoa bucket
exports.removeBucket = function (aws, bucketName) {
    var _bucketName = removeVNMark(bucketName);
    console.log("bucketName sau khi xoa dau va khoang trang  " + _bucketName)
    var paramsBucket = {Bucket: _bucketName};
    var s3 = new aws.S3();
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
                        console.log("--> Delete bucket error: " + err);
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
