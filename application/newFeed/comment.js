const table_name = "listComment";
const col_username = "username";
const col_id = "id";
exports.createTableCommentNewFeed=function(AWS,_idNewFeed,callback){
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: table_name + "_" + _idNewFeed,
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
/*
* table_name+"_"+id:ten bang comment cua newfeed (id)
*Contain:noi dung comment
*username:username nguoi comment
*time:thoi gian comment, lay thoi gian hien tai
* idComment:id cua comment
*/
exports.insertComment = function (AWS, _id, _idComment, _username, _contain, _time, callback) {
    var docClient = new AWS.DynamoDB();
    var name = table_name + "_" + _id;
    var params = {
        TableName: name,
        Item: {
            "id": {S: _idComment},
            "username": {S: _username},
            "time": {S: _time},
            "contain":{S:_contain},
        }
    }
    docClient.putItem(params, callback);
}
exports.deleteComment=function (AWS,_id,_idComment,_username,callback) {
    var docClient= new AWS.DynamoDB.DocumentClient();
    var params={
        TableName:table_name+"_"+_id,
        Key:{
            "id":_idComment,
            "username":_username
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
