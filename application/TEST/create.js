const table_name = "user";
var AWS = require("aws-sdk");
AWS.config.accessKeyId = "AWSAccessKeyId=AKIAJXJSIQBQMRMTKIOQ";
AWS.config.secretAccessKey = "AWSSecretKey=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";
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000" // bỏ thì nó sẽ tạo trên cloud
});
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: table_name,
    KeySchema: [
        {AttributeName: "_id", KeyType: "HASH"},  //Partition key
        {AttributeName: "username", KeyType: "RANGE"}  //Sort key
    ],
    AttributeDefinitions: [
        {AttributeName: "_id", AttributeType: "S"},
        {AttributeName: "username", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};
dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        return false;
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        return true;
    }
});
