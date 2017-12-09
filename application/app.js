// libs
const http = require("http");
const express = require("express");
const fs = require("fs");
const url = require("url");
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
var sys_username;
var uploadFile = require('./uploadFile');
var listImage = require('./image/listImage');
var bucket = require('./image/bucket');
// var multer = require('multer');
//

let tbName_User = "user";
// service
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId = "AWSAccessKeyId=AKIAJXJSIQBQMRMTKIOQ";
AWS.config.secretAccessKey = "AWSSecretKey=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";

// Folder public
var app = express();
var session = require('express-session');
app.use("/public/", express.static("../public/"));
app.use("/public/js/", express.static("../node_modules/angular/"));
app.use("/public/js/", express.static("../node_modules/jquery/dist/"));
app.use("/public/css/", express.static("../node_modules/bootstrap/dist/css/"));
app.use("/public/js/", express.static("../node_modules/bootstrap/dist/js/"));
// app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true
}));
var auth = function (req, res, next) {
    if (req.session && req.session.user === sys_username && req.session.admin) {
        return next();
    } else {
        return res.redirect('/');
    }
};
// create server
http.createServer(app).listen(9091);

app.get("/", function (req, res) {
    fs.readFile("../views/index.html", function (err, data) {
        if (err) {
            res.writeHead(404, {"content-type": "text/html"});
            res.end("not found");
        } else {
            res.writeHead(200, {"content-type": "text/html"});
            res.write(data);
            res.end();
        }
    });
});

app.get("/home", auth, function (req, res) {
    fs.readFile("../views/newfeed.html", function (err, data) {
        if (err) {
            res.writeHead(404, {"content-type": "text/html"});
            res.end("not found");
        } else {
            res.writeHead(200, {"content-type": "text/html"});
            res.write(data);
            res.end();
        }
    });
});

app.get("/profile", auth, function (req, res) {
    console.log("->>>", req.session.idUser);
    fs.readFile("../views/profile.html", function (err, data) {
        if (err) {
            res.writeHead(404, {"content-type": "text/html"});
            res.end("not found");
        } else {
            res.writeHead(200, {"content-type": "text/html"});
            res.write(data);
            res.end();
        }
    });
});

/**
 * Logout
 */
app.get('/logout', function (req, res) {
    req.session.destroy();
    fs.readFile("../views/index.html", function (err, data) {
        if (err) {
            res.writeHead(404, {"content-type": "text/html"});
            res.end("not found");
        } else {
            res.writeHead(200, {"content-type": "text/html"});
            res.write(data);
            res.end();
        }
    });
});

app.get("/err", function (req, res) {
    fs.readFile("../views/error.html", function (err, data) {
        if (err) {
            res.writeHead(404, {"content-type": "text/html"});
            res.end("not found");
        } else {
            res.writeHead(200, {"content-type": "text/html"});
            res.write(data);
            res.end();
        }
    });
});

/**
 * Add User in Collection
 * ------- 2 steps -------
 * 1. check user has existed in collection
 * 2. if user don't exited then add to collection
 * -------input-----------
 * name
 * nickname
 * username
 * password
 * -------output----------
 * 1 if success
 * 0 if fail
 */
app.post("/insertuser", function (req, resp) {
    var obj = {
        id: uuidv4(),
        name: req.body.name,
        nickname: req.body.nickname,
        username: req.body.username,
        password: req.body.password
    };
    if (obj.name.length == 0 || obj.nickname.length == 0 || obj.username.length == 0 || obj.password.length == 0) {
        resp.setHeader('Content-Type', 'application/json');
        resp.send(JSON.stringify({status: false}));
    }
    var dt = require("../application/user/tableUser");
    // console.log("tmtt", dt.insertUser(AWS, obj));
    dt.insertUser(AWS, obj, function (err) {
        console.log("ttt", err);
        if (err) {
            resp.setHeader('Content-Type', 'application/json');
            resp.send(JSON.stringify({status: true}));
        } else {
            console.log("oke chưa");
            resp.setHeader('Content-Type', 'application/json');
            resp.send(JSON.stringify({status: false}));
        }
    });
});

// var dt2 = require("../application/image/bucket");
// dt2.createBucket(obj.username, function (_st) {
//     console.log("tmt", _st);
//     if (_st || _st == 'true') {
//         resp.setHeader('Content-Type', 'application/json');
//         resp.send(JSON.stringify({status: true}));
//     }
// });
/**
 * Check is login
 * ------input-----
 * username
 * password
 * ------output----
 * 1 true -> đúng đăng nhập thành công
 * 2 false -> sai đăng nhập thất bại
 *
 */
app.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var dt = require("../application/user/tableUser");
    res.setHeader('Content-Type', 'application/json');
    dt.checkLogin(AWS, username, password, function (err, data) {
        if (err) {
            console.log("lỗi", data);
            res.send(JSON.stringify({status: 0}));
        } else {
            console.log(data.Items[0]);
            req.session.user = data.Items[0].username;
            req.session.infoUser = data.Items[0];
            sys_username = data.Items[0].username;
            req.session.admin = true;
            res.send(JSON.stringify({status: 1}));
        }
    });
});

app.post("/fileupload", function (req, resp) {
    try {
        uploadFile.uploadFiles(req, function (err, fields, files) {
            if (err) {
                resp.writeHead(500, {'content-type': 'text/plain'});
                resp.end('fail');
            }
            else {
                listImage.insertImage('dien cai username vao', files.Image, function (results) {
                    if (results != 0) {
                        resp.writeHead(500, {'content-type': 'text/plain'});
                        resp.end("Add image fail");
                    } else {
                        resp.writeHead(200, {'content-type': 'text/plain'});
                        resp.end("Add image success");
                    }
                });
            }
        })
    } catch (exception) {
        console.log("->Exception");
        resp.writeHead();
        resp.end();
    }
});
/**
 * Tìm kiếm bạn bè
 * ---input-----
 * getkey -> username or nickname
 * --output---
 * list username trùng
 */
app.post("/findfriends", function (req, resp) {
    var key = req.body.getkey;
    var dt = require("../application/user/tableUser");
    dt.scanUser(AWS, key, function (err, data) {
        if (!err) {
            //console.log("thangg ", data);
            var friend = data;
            console.log("nghia", friend);
            // data
            resp.setHeader('Content-Type', 'application/json');
            resp.send(JSON.stringify({a: friend}, null, 3));
        }
    });
});

app.post("/getListFriends", function (req, res) {

});

app.post("/getinfo", auth, function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({user: req.session.infoUser}));
});

// SYSTEM TEST
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
