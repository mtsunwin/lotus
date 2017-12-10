const table_name = "listNewFeed";
const col_username = "username";
const col_id = "id";
var tableFriend = require('../user/tableListFriends');
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

    console.log("nametable:", name);
    console.log("_id:", _id);
    console.log("_idNew:", _idNewFeed);
    console.log("_username:", _username);
    console.log("_ImageName:", _ImageName);
    console.log("_status:", _status);
    console.log("_time:", _time + " ");

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

exports.getListNewFeed = function (AWS, _id, callback) {
    var db = new AWS.DynamoDB();
    db.scan({
        TableName: table_name + "_" + _id,
        Limit: 50
    }, function (err, data) {
        if (err) {
            callback(false);
        }
        else {
            callback(data);
        }
    })
}
exports.getListNewFeedFriend = function (AWS, _id) {
    tableFriend.getListFriends(AWS, _id, function (err, data) {
        if (!err) {
            console.log(data);
            console.log("ListFriend:",data);
            var list = [];
            for(var i =0;i<data.length; i++){
                list.add(data.getItem(i));
            }
            console.log('getList', list);
            var listNewfeed = [];
            list.forEach(function callback(currentValue, index, array) {
                var friend = list.get(index);
                listNewfeed.add(this.getListNewFeed(AWS, friend.id))
            });
            console.log('getListNewFeedFriend', listNewfeed);
            return listNewfeed;
        }
    });

}