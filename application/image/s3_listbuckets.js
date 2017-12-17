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
exports.deleteImage=function (AWS,fs,image,callback) {
    var _bucketName = 'nghiabc';
    var s3Bucket = new AWS.S3({params: {Bucket: _bucketName}});
    var params2={
        Bucket:_bucketName,
        Key: image,
    }

    s3Bucket.deleteObject(params2,function (err,data) {
        if (err) {
            console.log(err, err.stack);
        } // an error occurred
        else    {
            console.log(data);
            callback(data);
        }
        // successful response
    })

}