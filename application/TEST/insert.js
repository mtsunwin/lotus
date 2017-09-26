const table_name = "user";
var _obj = {
    id: 'abcxyz126',
    name: 'Tran Minh Thang',
    nickname: 'Thang',
    // datecreate: '',
    // localcreate: '',
    // ip:'',
    // phone: '',
    // email: '',
    // birthday: '',
    username: 'minh@gmail.com',
    password: 'minhthang'
    // accountFacebook: '',
    // accountGoogle: ''
}
var AWS = require("aws-sdk");
AWS.config.accessKeyId = "AWSAccessKeyId=AKIAJXJSIQBQMRMTKIOQ";
AWS.config.secretAccessKey = "AWSSecretKey=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";
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

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
        "birthday": {S: typeof (_obj.birthday) != 'undefined' > 0 ? _obj.birthday : 'null'},
        "username": {S: _obj.username},
        "password": {S: _obj.password},
        "accountFacebook": {S: typeof (_obj.accountFacebook) != 'undefined' > 0 ? _obj.accountFacebook : 'null'},
        "accountGoogle": {S: typeof (_obj.accountGoogle) != 'undefined' > 0 ? _obj.accountGoogle : 'null'}
    }
};
docClient.putItem(params, function (err, data) {
    if (err) {
        console.error("Unable to add USER" + " Error JSON:", JSON.stringify(err, null, 2));
        return false;
    } else {
        return true;
    }
});