var AWS = require("aws-sdk");
AWS.config.accessKeyId = "AWSAccessKeyId=AKIAJXJSIQBQMRMTKIOQ";
AWS.config.secretAccessKey = "AWSSecretKey=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";
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "user"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});