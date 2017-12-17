const table_name = "user";
const table_id = "_id";
const table_username = "username";
const table_password = "password";
var mt_listFriends = require('./tableListFriends');
/**
 * Tạo Table User
 * @param AWS
 */
exports.createTableUser = function (AWS) {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: table_name,
        KeySchema: [
            {AttributeName: table_username, KeyType: "HASH"},  //Partition key
            {AttributeName: table_password, KeyType: "RANGE"}  //Sort key
        ],
        AttributeDefinitions: [
            {AttributeName: table_username, AttributeType: "S"},
            {AttributeName: table_password, AttributeType: "S"}
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
            return true;
        }
    });
};
/**
 * Thêm user vào Table "table_user"
 * _obj {
 *  id: not null,
 *  name: not null,
 *  nickname: not null,
 *  username: not null,
 *  password: not null,
 *  datecreate: '',
 *  localcreate: '',
 *  ip:'',
 *  phone: '',
 *  email: '',
 *  birthday: '',
 *  accountFacebook: '',
 *  accountGoogle: ''
 * }
 * */
exports.insertUser = function (AWS, _obj, callback) {
    this.findItemhadExisted(AWS, _obj.username, function (err, data) {
        if (!err && data.Count == 0) {
            console.log("run this", data);
            var docClient = new AWS.DynamoDB();
            var params = {
                TableName: table_name,
                Item: {
                    "_id": {S: _obj.id},
                    "fullname": {S: _obj.name},
                    "nickname": {S: _obj.nickname},
                    "datacreate": {S: typeof (_obj.datecreate) != 'undefined' ? _obj.datecreate : 'null'},
                    "localcreate": {S: typeof (_obj.localcreate) != 'undefined' ? _obj.localcreate : 'null'},
                    "ipdevice": {S: typeof (_obj.ip) != 'undefined' ? _obj.ip : 'null'},
                    "phone": {S: typeof (_obj.phone) != 'undefined' ? _obj.phone : 'null'},
                    "email": {S: typeof (_obj.email) != 'undefined' ? _obj.email : 'null'},
                    "birthday": {S: typeof (_obj.birthday) != 'undefined' ? _obj.birthday : 'null'},
                    "username": {S: _obj.username},
                    "password": {S: _obj.password},
                    "accountFacebook": {S: typeof (_obj.accountFacebook) != 'undefined' ? _obj.accountFacebook : 'null'},
                    "accountGoogle": {S: typeof (_obj.accountGoogle) != 'undefined' ? _obj.accountGoogle : 'null'},
                    "avatar": {S: 'null'}
                }
            };
            docClient.putItem(params, function (err, data) {
                if (!err)
                    mt_listFriends.createTableListFriends(AWS, _obj.id, function (err2, data2) {
                        if (!err2)
                            callback(true);
                    });
            });
        } else {
            callback(false);
        }
    });
};
/**
 * Lây dánh sách USER
 * @param _nameTabe: tên bảng
 * @param callback: trả kết quả về hàm
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

/**
 *   Kiểm tra địa chỉ email của người dùng
 **/
exports.findItemhadExisted = function (AWS, _username, callback) {
    var bool = false;
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name,
        KeyConditionExpression:
            "#username = :username",
        ExpressionAttributeNames: {
            "#username": "username"
        },
        ExpressionAttributeValues: {
            ":username": _username
        }
    };
    docClient.query(params, callback);
};

/**
 * Kiểm tra đăng nhập
 * */
exports.checkLogin = function (AWS, _username, _password, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name,
        KeyConditionExpression:
            "#username = :username and #password = :pass",
        ExpressionAttributeNames: {
            "#username": "username",
            "#password": "password"
        },
        ExpressionAttributeValues: {
            ":username": _username,
            ":pass": _password
        }
    };
    docClient.query(params, function (err, data) {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
};

exports.findFrieds = function (AWS, _username, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name,
        KeyConditionExpression:
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
            callback(null, data.Items[0]);
    });
};

exports.scanUser = function (AWS, params, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var paramsUser = {
        // ProjectionExpression:"username,nickname",
        ScanIndexForward: false,
        FilterExpression: "contains(username, :key) or contains(:key,username)  or contains(nickname, :key) or contains(:key,nickname) or contains(KeyWordsContains, :keyLowerCase) or contains(:keyLowerCase,KeyWordsContains)",
        ExpressionAttributeValues: {
            ":key": params,
            ":keyLowerCase": params.toLowerCase()
        },
        limit: 10,
        TableName: table_name
    };
    docClient.scan(paramsUser, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(null);
        } else {
            console.log("Query succeeded.");
            callback(null, data);
        }
    });
}

exports.updateUser= function(AWS,_username,_password,_phone,_birthday,_image,_fb,_google, _address,callback){
    var docClient= new AWS.DynamoDB.DocumentClient();
    var params={
        TableName:table_name,
        Key:{
            "username":_username,
            "password":_password,
        },
        UpdateExpression:"set phone= :phone, birthday = :birthday, avatar = :image,accountFacebook =:fb,accountGoogle = :google, address = :address ",
        ExpressionAttributeValues:{
            ":phone":_phone,
            ":birthday":_birthday,
            ":image":_image,
            ":fb":_fb,
            ":google":_google,
            ":address": _address
        },
        ReturnValues:"UPDATED_NEW"
    };
    console.log("Updating the item...");
    docClient.update(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            callback(null,JSON.stringify(data, null, 2))
        }
    });
}