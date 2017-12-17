const table_name = "listFriends";
const col_username = "usernamefriend";
const col_nickname = "usernickname";
/**
 * Tạo table list Friends mỗi khi User đăng ký tài khoản
 * @param AWS
 * @param _id
 * @param callback
 */
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
/**
 * Thêm bạn
 * @param AWS
 * @param _ownId
 * @param _id
 * @param _username
 * @param _nickname
 * @param _time
 * @param callback
 */
exports.insertFriend = function (AWS, _ownId, _id, _username, _nickname, _time, callback) {
    var docClient = new AWS.DynamoDB();
    var params = {
        TableName: table_name + "_" + _ownId,
        Item: {
            "_id": {S: _id},
            "usernamefriend": {S: _username},
            "usernickname": {S: _nickname},
            "time": {S: _time}
        }
    };
    docClient.putItem(params, function (err, data) {
        if (!err) callback(null, data);
        else
            callback(err, null);
    });
};
/**
 * Lấy danh sách bạn bè
 * @param AWS
 * @param _id
 * @param callback
 */
exports.getListFriends = function (AWS, _id, callback) {
    var db = new AWS.DynamoDB();
    db.scan({
        TableName: table_name + "_" + _id,
        Limit: 50
    }, callback);
};

/**
 * Kiểm tra đăng nhập
 * */
exports.checkFriend = function (AWS, _username, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name,
        KeyConditionExpression:
            "#username = :username",
        ExpressionAttributeNames: {
            "#username": "usernamefriend",
        },
        ExpressionAttributeValues: {
            ":username": _username,
        }
    };
    docClient.query(params, function (err, data) {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
};