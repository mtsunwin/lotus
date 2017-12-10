exports.createTableImage = function (AWS, _id) {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: "Image_" + _id,
        KeySchema: [
            {AttributeName: "id", KeyType: "HASH"},
            {AttributeName: "URL", KeyType: "RANGE"}
        ],
        AttributeDefinitions: [
            {AttributeName: "id", AttributeType: "S"},
            {AttributeName: "URL", AttributeType: "B"}

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
    })
}

exports.getListImage = function (AWS, _nameTable, callback) {
    var db = new AWS.DynamoDB();
    db.scan({
        TableName: _nameTable,
        Limit: 50
    }, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            console.log(data.Items);
            callback(null, data.Items);
        }
    });
};

exports.findItemhadExisted = function (AWS, _id, _username, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "Image_" + _id,
        FilterExpression:
            "#username = :username",
        ExpressionAttributeNames: {
            "#username": "username"
        },
        ExpressionAttributeValues: {
            ":username": _username
        }
    };
    docClient.query(params, function (err, data) {
        if (err)
            callback(err);
        else
            callback(null, data);

    });
}