// SYSTEM TEST
const tbName_User = "user";
exports.init = function (app, fs, AWS) {
    app.get("/sys", function (req, resp) {
        fs.readFile("../application/views/index.html", function (err, data) {
            if (err) {
                resp.writeHead(404, {"content-type": "text/html"});
                resp.end();
            } else {
                resp.writeHead(200, {"content-type": "text/html"});
                resp.write(data);
                resp.end();
            }
        });
    });

    app.get("/sys/listtable", function (req, resp) {
        var dt = require("../application/user/listTable");
        dt.getListTable(AWS, function (err, data) {
            resp.writeHead(200, {"content-type": "text/html"});
            for (var i in data)
                resp.write(data[i] + "<br/>");
            resp.end();
        });
    });

    app.get("/sys/createtableuser", function (req, resp) {
        resp.writeHead(200, {"content-type": "text/html"});
        var dt = require("../application/user/tableUser");
        if (dt.createTableUser(AWS)) {
            resp.write("Tạo thành công");
        }
        resp.end();
    });

    app.get("/sys/listuser", function (req, resp) {
        var dt = require("../application/user/tableUser");
        var data = dt.getListUser(AWS, tbName_User, function (err, data) {
            if (err) {
                resp.writeHead(404, {"content-type": "text/html"});
                resp.end("404 not found err: " + err);
            } else {
                resp.writeHead(200, {"content-type": "text/html"});
                var str = "";
                data.forEach(function (val) {
                    str += "Nickname:" + val.nickname.S + "<br/>";
                    str += "Fullname:" + val.fullname.S + "<br/>";
                    str += "Username:" + val.username.S + "<br/>";
                    str += "Password:" + val.password.S + "<br/>";
                    str += "--------------------<br/>";
                });
                resp.end(str);
            }
        });
    });
};