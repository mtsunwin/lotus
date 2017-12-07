const table_name = "listNewFeed";
const col_username = "username";
const col_nickname = "usernickname";

exports.createTableNewsFeed=function(AWS,_id){
    var dynamodb = new AWS.DynamoDB();
    var params={
        TableName: table_name+"_"+_id,
        KeySchema:[
            {AttributeName:col_username,KeyType:"HASH"},
            {AttributeName:col_nickname,KeyType:"RANGE"}
        ],
        AttributeDefinitions:[
            {AttributeName: col_username,AttributeType:"S"},
            {AttributeName: col_nickname, AttributeType: "S"}
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


exports.insertNew=function(AWS,_id,_username,_obj,_time){
    var docClient= new AWS.DynamoDB();
    var params={
        TableName:table_name+"_"+_id,
        Item:{
            "username": {S: _username},
            "imageName":{S: _obj.ImageName},
            "time":{S: _time},
            "comment": {M: typeof (_obj.comment) != 'undefined' ? _obj.comment : 'null'},
            "status": {S:_obj.status},
            "TotalLike":{M: typeof (_obj.TotalLike) != 'undefined' ? _obj.TotalLike : 'null'},
        }
    }
    docClient.putItem(params,function(err,data){
        if(!err) return true;
        else
            return false;
    });
}
exports.getListNewFeed=function(AWS,_id){
    var db= new AWS.DynamoDB();
    db.scan({
        TableName:table_name+"_"+_id,
        Limit:50
    },function (err,data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data.Items);
        }
    })
}
/*
exports.getListFriends = function (AWS, _id) {
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
    });
    */