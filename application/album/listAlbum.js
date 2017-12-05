var bucket= require('application/Bucket/bucket')
var diacritics = require('diacritic');
var aws = require("aws-sdk");
/**
 * NGHIA
 * Tạo bảng Album by id user
 * */
exports.createTableAlbum = function (AWS, _id) {
    var dynamodb = new AWS.DynamoDB();
    var params={
        TableName: "Album_" + _id,
        KeySchema: [
            {AttributeName: "id", KeyType:"HASH"},
            {AttributeName: "name", KeyType:"RANGE"}
        ],
        AttributeDefinitions: [
            {AttributeName :"id", AttributeType: "S"},
            {AttributeName :"name", AttributeType: "S"}

        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };
    dynamodb.createTable(params,function (err,data) {
        if(err){
            console.error("Unable to create table. Error JSON:",JSON.stringify(err,null,2));
            return false;
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data,null,2));
            return true;
        }
    })
}
/**
 * Thêm album vào Table "album"_+"id"
 * _obj{
 *      "id": Not null,
 *      "name":Not null,
 *      "comment":'',
 *      "Images":(Url),
 *      "SharedUser":'',
 *      "Status":Private, public
 *}
 * }
 * */

/**
exports.insertAlbum= function (AWS,_id,_obj) {
    var docClient= new AWS.DynamoDB();
    var params = {
        TableName : "Album_"+_id,
        Item: {
            "id" :{S: _obj.id},
            "name":{S: _obj.name},
            "comment":{M: typeof (_obj.comment)!='undefined' ?_obj.comment:'null'},
            "images": {M: _obj.images},
            "sharedUser" :{M : _obj.sharedUser},
            "Status" :{S :_obj.Status},
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
exports.getListUser = function (AWS, _nameTable, callback) {
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
exports.getListAlbum = function (AWS, _nameTable, callback) {
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
}
