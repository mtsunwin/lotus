const table_name = "listNewFeed";
const col_username = "username";
const col_id = "id";

exports.createTableNewsFeeds = function (AWS, _id, callback) {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: table_name + "_" + _id,
        KeySchema: [
            {AttributeName: col_id, KeyType: "HASH"},
            {AttributeName: col_username, KeyType: "RANGE"}
        ],
        AttributeDefinitions: [
            {AttributeName: col_id, AttributeType: "S"},
            {AttributeName: col_username, AttributeType: "S"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };
    dynamodb.createTable(params, callback);
}

//them tin vào id cua user
/*
* newfeed gồm có
* id:S
* username người tạo:S
* imageName:S
* time thời gian tạo:S
* status dòng cảm nghĩ: S
* total like tổng like:N
* */
exports.insertNew = function (AWS, _id, _idNewFeed, _username, _ImageName, _status, _time, callback) {
    var docClient = new AWS.DynamoDB();
    var name = table_name + "_" + _id;
    console.log("name table", name);
    console.log("_id", _id);
    console.log("_idNew", _idNewFeed);
    var params = {
        TableName: name,
        Item: {
            "username": {S: _username},
            "id": {S: _idNewFeed},
            "imageName": {S: _ImageName},
            "time": {S: _time},
            "status": {S: _status}
        }
    }
    docClient.putItem(params, callback);
}

exports.getListNewFeed = function (AWS, _id) {
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
    })
}