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
exports.insertComment = function (AWS, _id, _idNewFeed, _username, _ImageName, _status, _time, callback) {
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