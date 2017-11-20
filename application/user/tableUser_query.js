const tableUser = "user";
exports.iLogIn = function (AWS, _username, _password, response, fs) {
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
        if (err) {
            console.log("ERR");
        }
        else {
            fs.readFile("../views/newfeed.html", function (err, da) {
                response.writeHead(200, {"content-type": "text/html"});
                response.end(da);
            });
        }
    });
}

