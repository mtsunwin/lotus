const table_name = "listFriends";
const col_username = "usernamefriend";
const col_nickname = "usernickname";
exports.createTableListFriends = function (AWS, _id, callback) {
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
    dynamodb.createTable(params, callback);
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

exports.getListFriends = function (AWS, _id, callback) {
    var db = new AWS.DynamoDB();
    db.scan({
        TableName: table_name + "_" + _id,
        Limit: 50
    }, callback);
};

