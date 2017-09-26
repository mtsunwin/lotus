const tableUser = "user";
exports.iLogIn = function (AWS, _username, _password, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: tableUser,
        ProjectionExpression: "username,password",
        FilterExpression: "#username = :username and #password =:password",
        ExpressionAttributeNames: {
            "#username": "username",
            "#password": "password"
        },
        ExpressionAttributeValues: {
            ":username": _username,
            ":password": _password
        }
    }
    docClient.scan(params, function (err, data) {
        if (err) callback(err);
        else callback(null, data);
    });
}

