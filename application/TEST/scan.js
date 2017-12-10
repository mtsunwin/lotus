var db = new AWS.DynamoDB();
db.scan({
    TableName: table_name,
    Limit: 50
}, function (err, data) {
    if (err) console.log("loi");
    else {
        console.log(data.Items);
    }
});