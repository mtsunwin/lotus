const table_name = "user";
var AWS = require("aws-sdk");
AWS.config.accessKeyId = "AWSAccessKeyId=AKIAJXJSIQBQMRMTKIOQ";
AWS.config.secretAccessKey = "AWSSecretKey=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";
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
var db = new AWS.DynamoDB();
db.scan({
    TableName: table_name,
    Limit: 50
}, function (err, data) {
    if (err) console.log("loi");
    else {
        console.log(data.Items);
    }
});