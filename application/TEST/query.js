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
// var params = {
//     TableName: table_name,
//     ProjectionExpression: "fullname",
//     FilterExpression:  "#colfullname = :valfullname",
//     KeyConditionExpression:
//         "#colfullname = :valfullname",
//     ExpressionAttributeNames: {
//         // "#colfullname": "fullname"
//         "#colfullname": "fullname",
//     },
//     ExpressionAttributeValues: {
//         ":valfullname": "thang"
//     }
// };
// var params = {
//     TableName: table_name,
//     ProjectionExpression: "fullname, username", // tên bảng được lấy ra
//     KeyConditionExpression: "#fullname = :value",
//     FilterExpression: "#fullname = :value and #username = :username",
//     ExpressionAttributeNames: {
//         "#fullname": "fullname",
//         "#username": "username"
//     },
//     ExpressionAttributeValues: {
//         ":value": "thang",
//         ":username": 'thang@gmail.com'
//
//     }
// };
docClient.query(params, function (err, data) {
    if (err) {
        console.log("Lỗi err", err);
    } else {
        console.log("Query succeeded");
        console.log(data);
    }
});