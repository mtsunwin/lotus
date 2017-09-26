// libs
const http = require("http");
const express = require("express");
const fs = require("fs");
const url = require("url");
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
// service
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

// Folder public
var app = express();
app.use("/public/", express.static("../public/"));
app.use("/public/js/", express.static("../node_modules/angular/"));
app.use("/public/js/", express.static("../node_modules/jquery/dist/"));
app.use("/public/css/", express.static("../node_modules/bootstrap/dist/css/"));
app.use("/public/js/", express.static("../node_modules/bootstrap/dist/js/"));
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// create server
http.createServer(app).listen(9091);
// controllers HOME
app.get("/", function (request, response) {
    fs.readFile("../views/index.html", function (err, data) {
        if (err) {
            response.writeHead(404, {"content-type": "text/html"});
            response.end("not found");
        } else {
            response.writeHead(200, {"content-type": "text/html"});
            response.write(data);
            response.end();
        }
    });
});

app.get("/home", function (request, response) {
    fs.readFile("../views/newfeed.html", function (err, data) {
        if (err) {
            response.writeHead(404, {"content-type": "text/html"});
            response.end("not found");
        } else {
            response.writeHead(200, {"content-type": "text/html"});
            response.write(data);
            response.end();
        }
    });
});

app.post("/home", function (request, response) {
    response.writeHead(200, {"content-type": "text/html"});
    var username = request.body.email;
    var password = request.body.password;
    console.log(username + " - " + password);
    response.end("oke");
});

// SYSTEM
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
    let dt = require("../application/user/listTable");
    dt.getListTable(AWS, function (err, data) {
        resp.writeHead(200, {"content-type": "text/html"});
        for (var i in data)
            resp.write(data[i] + "<br/>");
        resp.end();
    });
});
app.get("/sys/createtableuser", function (req, resp) {
    resp.writeHead(200, {"content-type": "text/html"});
    let dt = require("../application/user/tableUser");
    if (dt.createTableUser(AWS)) {
        resp.write("Tạo thành công");
    }
    resp.end();
});
app.get("/sys/insertuser", function (req, resp) {
    fs.readFile("../application/views/insertuser.html", function (err, data) {
        if (err) {
            resp.writeHead(404, {"content-type": "text/html"});
            resp.end();
        } else {
            resp.writeHead(200, {"content-type": "text/html"});
            resp.write(data);
            resp.end();
        }
    })
});
app.post("/sys/insertuser", function (req, resp) {
    var obj = {
        id: uuidv4(),
        name: req.body.name,
        nickname: req.body.nickname,
        username: req.body.username,
        password: req.body.password
    };
    if (obj.name.length == 0 || obj.nickname.length == 0 || obj.username.length == 0 || obj.password.length == 0) {
        console.log("this");
        resp.writeHead(200, {"content-type": "text/html"});
        resp.end("0");
        return;
    }
    console.log(obj);
    let dt = require("../application/user/tableUser");
    dt.insertUser(AWS, obj, function (err, data) {
        if (err) {
            console.log("/sys/insertuser", err);
            resp.writeHead(200, {"content-type": "text/html"});
            resp.end("0");
            return;
        } else {
            console.log("/sys/insertuser", "completed");
            resp.writeHead(200, {"content-type": "text/html"});
            resp.end("1");
            return;
        }
    });
});

app.get("/sys/listuser", function (req, resp) {
    let dt = require("../application/user/tableUser");
    var data = dt.getListUser(AWS, "table_user", function (err, data) {
        if (err) {
            resp.writeHead(404, {"content-type": "text/html"});
            resp.end("404 not found");
        } else {
            resp.writeHead(200, {"content-type": "text/html"});
            for (var i in data) {
                i = data[i];
                console.log(i.id);
                resp.end("oke");
            }
        }
    });
});

app.post("/sys/login", function (req, resp) {
    let dt = require("../application/user/tableUser_query");
    dt.iLogIn(AWS, req.body.username, req.body.password, function (err, data) {
        if (err) {
            resp.writeHead(200, {"content-type": "text/html"});
            resp.end("0");
            return;
        } else {
            resp.writeHead(200, {"content-type": "text/html"});
            resp.end("1");
            return;
        }
    });
});

app.get("/sys/concac", function (req, resp) {
    let dt = require("../application/user/tableUser");
    var data = dt.findItemhadExisted(AWS, "Trần Minh Thắng", "thang@gmail.com", function (err, data) {
        if (err) {
            resp.writeHead(404, {"content-type": "text/html"});
            resp.end("Sai con mẹ nó rồi" + err);
        } else {
            resp.writeHead(200, {"content-type": "text/html"});
            resp.end("Đúng");
        }
    });
});