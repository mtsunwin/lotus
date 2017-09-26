const table_name = "user";

exports.createTableUser = function (AWS) {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: table_name,
        KeySchema: [
            {AttributeName: "_id", KeyType: "HASH"},  //Partition key
            {AttributeName: "username", KeyType: "RANGE"}  //Sort key
        ],
        AttributeDefinitions: [
            {AttributeName: "_id", AttributeType: "S"},
            {AttributeName: "username", AttributeType: "S"}
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
    var docClient = new AWS.DynamoDB();
    console.log("2", _obj);
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
            "accountGoogle": {S: typeof (_obj.accountGoogle) != 'undefined' ? _obj.accountGoogle : 'null'}
        }
    };
    console.log(params);
    docClient.putItem(params, function (err, data) {
        if (err) callback(err);
        else callback(null, data);
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
 *   Kiểm tra địa chỉ email-SDT của người dùng
 *
 **/
exports.findItemhadExisted = function (AWS, _fullname, _username, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table_name,
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

