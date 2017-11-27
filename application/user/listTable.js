exports.getListTable = function (AWS, callback) {
    ddb = new AWS.DynamoDB();
    ddb.listTables({Limit: 10}, function (err, data) {
        if (err) callback(err);
        else
            callback(null, data.TableNames);
    });
};