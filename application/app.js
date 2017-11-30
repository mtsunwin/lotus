// libs
const http = require("http");
const express = require("express");
const fs = require("fs");
const url = require("url");
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
var multer = require('multer');
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
app.use("/public/", express.static("../public/"));
app.use("/public/js/", express.static("../node_modules/angular/"));
app.use("/public/js/", express.static("../node_modules/jquery/dist/"));
app.use("/public/css/", express.static("../node_modules/bootstrap/dist/css/"));
app.use("/public/js/", express.static("../node_modules/bootstrap/dist/js/"));
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/**
 * ciphertrick.com
 */
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../public')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');

app.post('/upload/', function (req, res) {
    console.log("oke 1", req);
    // upload(req, res, function (err) {
    //     if (err) {
    //         res.json({error_code: 1, err_desc: err});
    //         return;
    //     }
    //     res.json({error_code: 0, err_desc: null});
    // });
});
//------END ciphertrick.com----------

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

app.get("/profile", function (request, response) {
    fs.readFile("../views/profile.html", function (err, data) {
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
        resp.writeHead(200, {"content-type": "text/html"});
        resp.end("0");
        return;
    }
    let dt = require("../application/user/tableUser");
    var checked = true;
    dt.findItemhadExisted(AWS, req.body.username, function (err, data) {
        if (!err && data.Count == 0) {
            dt.insertUser(AWS, obj, function (err, da) {
                if (!err) {
                    resp.writeHead(200, {"content-type": "text/html"});
                    resp.end("1");
                } else {
                    resp.writeHead(200, {"content-type": "text/html"});
                    resp.end("0");
                }
            });
        }
    });
});
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
app.post("/login", function (req, resp) {
    var username = req.body.username;
    var password = req.body.password;

});

app.post("/fileupload", function (req, resp) {
    console.log("tmt thang", req.file);
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

app.get("/sys/listuser", function (req, resp) {
    let dt = require("../application/user/tableUser");
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
