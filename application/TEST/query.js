const table_name = "user";
var AWS = require("aws-sdk");
AWS.config.accessKeyId = "AWSAccessKeyId=AKIAJXJSIQBQMRMTKIOQ";
AWS.config.secretAccessKey = "AWSSecretKey=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";
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
var _fullname = 'Trần Minh Thắng';
var _username = 'abcxyz123';
var _content = 'minh@gmail.com';
var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName: table_name,
    // ProjectionExpression:"username",
    KeyConditionExpression:
        "#username = :username1 and #user=:us"
    ,
    ExpressionAttributeNames: {
        "#username": "_id",
        "#user" : "username"
    },
    ExpressionAttributeValues: {
        ":username1": _username,
        ":us": _content
    }
};
docClient.query(params, function (err, data) {
    if (err) {
        console.log("Lỗi err", err);
    } else {
        console.log("Query succeeded");
        console.log(data);
    }
});