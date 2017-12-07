const table_name = "listFriends";
const col_username = "usernamefriend";
const col_nickname = "usernickname";
exports.createTableListFriends = function (AWS, _id) {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: table_name + "_" + _id,
        KeySchema: [
            {AttributeName: col_username, KeyType: "HASH"},  //Partition key
            {AttributeName: col_nickname, KeyType: "RANGE"}  //Sort key
        ],
        AttributeDefinitions: [
            {AttributeName: col_username, AttributeType: "S"},
            {AttributeName: col_nickname, AttributeType: "S"}
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
};


exports.insertFriend = function (AWS, _id, _username, _nickname, _time) {
    var docClient = new AWS.DynamoDB();
    var params = {
        TableName: table_name + "_" + _id,
        Item: {
            "usernamefriend": {S: _username},
            "usernickname": {S: _nickname},
            "time": {S: _time}
        }
    };
    docClient.putItem(params, function (err, data) {
        if (!err) return true;
        else
            return false;
    });
};

exports.getListFriends = function (AWS, _id) {
    var db = new AWS.DynamoDB();
    db.scan({
        TableName: table_name + "_" + _id,
        Limit: 50
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data.Items);
        }
    });
};

