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

exports.updateUser = function (AWS, _username, _password, _phone, _birthday, _fb, _google, _address, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name,
        Key: {
            "username": _username,
            "password": _password,
        },
        UpdateExpression: "set phone= :phone, birthday = :birthday,accountFacebook =:fb,accountGoogle = :google, address = :address ",
        ExpressionAttributeValues: {
            ":phone": _phone,
            ":birthday": _birthday,
            ":fb": _fb,
            ":google": _google,
            ":address": _address
        },
        ReturnValues: "UPDATED_NEW"
    };
    console.log("Updating the item...");
    docClient.update(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            callback(null, JSON.stringify(data, null, 2))
        }
    });
}

exports.insertComment=function(AWS,_idNewFeed,_idUser,_idComment,_username,_nickname,_imageUrl,_date,_content,callback){
    var docClient = new AWS.DynamoDB.DocumentClient();
    var name= table_name+"_"+_idUser;
    var params={
        "id":_idNewFeed,
        "username":_username,
        "nickname":_nickname,
        "image":_imageUrl,
        "date":_date,
        "content":_content
    }
    var params1={
        TableName: name,
        Key:{
            "id":_idNewFeed,
            "username":_username
        },
        UpdateExpression: "set comment.add(:comment)",
        ExpressionAttributeValues: {
            ":comment":params
        },
        ReturnValues: "UPDATED_NEW"
    }
    console.log("Updating the item...");
    docClient.update(params1, function (err, data) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            callback(null, JSON.stringify(data, null, 2))
        }
    });
}
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
    // var docClient = new AWS.DynamoDB();
    // var name = table_name + "_" + _id;
    // var params = {
    //     TableName: name,
    //     Item: {
    //        "comment":{M:{
    //            "username"
    //        }}
    //     }
    // }
    // docClient.putItem(params, callback);
}
