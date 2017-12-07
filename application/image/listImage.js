var bucket = require('./bucket');
var diacritics = require('diacritic');
var AWS = require("aws-sdk");

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
/**
 * NGHIA
 * Tạo bảng hình ảnh bằng user id
 * */

/**
 * Thêm Image vào Table "Image"_+"id"
 * _obj{
 *      "id": Not null,
 *      "Date":Not null,
 *      "URL":Not null,
 *      "Name":'',
 *      "description":'',
 *      "Location":"",
 *      "comment":(map),
 *      "StatusLike":(Map)
 *}
 * }
 * */
//Add hinh vao bucket mang id cua user
exports.insertImage = function (_username, images, callback) {
    bucket.putItem(_username, _obj, function () {
        var docClient = new AWS.DynamoDB()
        var params = {
            TableName: "Image_" + _username,
            Item: {
                "id": {S: _obj.id},
                "date": {S: _obj.date},
                "url": {S: _obj.URL},
                "name": {S: typeof (_obj.name) != 'undefined' ? _obj.name : 'null'},
                "description": {S: typeof (_obj.description) != 'undefined' ? _obj.description : 'null'},
                "location": {S: typeof (_obj.location) != 'undefined' ? _obj.comment : 'null'},


            }
        }
        docClient.putItem(params, function (err, data) {
            if (err) {
                console.error("Unable to add ", _name, ". Error JSON:", JSON.stringify(err, null, 2));
                callback(-2)
            } else {
                console.log("Added image")
                callback(0);
            }
        })
    })
}

/**
 exports.insertImage= function (AWS,_id,_obj) {
    var docClient= new AWS.DynamoDB();
    var params = {
        TableName : "Image_"+_id,
        Item: {
            "id" :{S: _obj.id},
            "date":{S: _obj.date},
            "url":{S:_obj.URL},
            "name":{S:typeof (_obj.name)!='undefined' ?_obj.name:'null'},
            "description":{S: typeof (_obj.description)!='undefined' ?_obj.description:'null'},
            "location":{S: typeof (_obj.location)!='undefined' ?_obj.comment:'null'},
            "comment":{M: typeof (_obj.comment)!='undefined' ?_obj.comment:'null'},
            "status":{M: typeof (_obj.status)!='undefined' ?_obj.status:'null'},

        }
    }
    docClient.putItem(params,function (err, data) {
        if (err) {
            console.error("Unable to add ", _name, ". Error JSON:", JSON.stringify(err, null, 2));
            return false;
        } else {
            return true;
        }
    })
}
 **/

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