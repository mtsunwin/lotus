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
/**
 * Lấy danh sách tin tức của mình
 * @param AWS
 * @param _id
 * @param callback
 */
exports.getListNewFeed = function (AWS, _id, _date, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name + "_" + _id,
        KeyConditionExpression:
            "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": _date
        }
    };
    docClient.query(params, callback);
}
exports.deleteNewFeed=function(AWS,_id,_date,_idnewFeed,callback){
    var docClient= new AWS.DynamoDB.DocumentClient();
    var params={
        TableName:table_name+_id,
        Key:{
            "id":_date,
            "username":_idnewFeed
        },
    }
    docClient.delete(params,function(err,data){
        if (err) {
            console.log(err, err.stack);
            callback(err,null)
        }
        else {
            console.log(data);
            callback(null,data);
        }
    })
}
/**
 * Lấy danh sách news feed theo ID
 * @param AWS
 * @param _id
 * @param callback
 */
exports.getListNewFeedFriend = function (AWS, _id, callback) {
    tableFriend.getListFriends(AWS, _id, function (err, data) {
        if (!err) callback(null, data);
        else
            callback(err, null)
    });
}
exports.insertComment=function (AWS,_id,_comment,callback) {
    var docClient = new AWS.DynamoDB();
    var name = table_name + "_" + _id;
    var params = {
        TableName: name,
        Item: {
           "comment":{M:{
               "username"
           }}
        }
    }
    docClient.putItem(params, callback);

}