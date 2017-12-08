const table_name = "listNewFeed";
const col_username = "username";
const col_id = "id";


exports.createTableNewsFeed = function (AWS, _id) {
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
    dynamodb.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            return false;
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            return true;
        }
    });
}

//them tin vào id cua user
/*
* newfeed gồm có
* id:S
* username người tạo:S
* imageName:S
* time thời gian tạo:S
* comment:M
* status dòng cảm nghĩ: S
* total like tổng like:N
* */
exports.insertNew = function (AWS, _id, _username, _obj, _time) {
    var docClient = new AWS.DynamoDB();
    var params = {
        TableName: table_name + "_" + _id,
        Item: {
            "username": {S: _username},
            "id": {S: _idNewFeed},
            "imageName": {S: _obj.ImageName},
            "time": {S: _time},
            "comment": {M: typeof (_obj.comment) != 'undefined' ? _obj.comment : 'null'},
            "status": {S: _obj.status},
            "totalLike": {N: _obj.totalLike},
        }
    }
    docClient.putItem(params, function (err, data) {
        if (!err) return true;
        else
            return false;
    });
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