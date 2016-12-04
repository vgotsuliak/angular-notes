var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var MongoStore = require('connect-mongo/es5')(session);

app.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/angular_session'
    }),
    secret: 'angular_tutorial',
    resave: true,
    saveUninitialized: true
}));

function setUserQuery(req) {
    req.query.userName = req.session.userName || "demo";
}

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var db = new Db('tutor',
    new Server("localhost", 27017, {safe: true},
        {auto_reconnect: true}, {}));

db.open(function () {
    console.log("mongo db is opened!");
    db.collection('notes', function (error, notes) {
        db.notes = notes;
    });
    db.collection('sections', function (error, sections) {
        db.sections = sections;
    });
    db.collection('users', function (error, users) {
        db.users = users;
    });
});

var ObjectID = require('mongodb').ObjectID;
app.delete("/notes", function (req, res) {
    var id = new ObjectID(req.query.id);
    db.notes.remove({_id: id}, function (err) {
        if (err) {
            console.log(err);
            res.send("Failed");
        } else {
            res.send("Success");
        }
    })
});


app.get("/sections", function (req, res) {
    var userName = req.session.userName || "demo";
    db.users.find({userName: userName}).toArray(function (err, items) {
        var user = items[0];
        res.send(user.sections || []);
    });
});

app.get("/notes", function (req, res) {
    setUserQuery(req);
    console.log(req.query);
    db.notes.find(req.query).toArray(function (err, items) {
        console.log('Get: /notes: ' + items);
        res.send(items);
    });
});

app.post("/notes", function (req, res) {
    req.body.userName = req.session.userName || "demo";
    db.notes.insert(req.body);
    res.end();
});

app.post("/sections/replace", function (req, res) {
    var userName = req.session.userName || "demo";
    db.users.update({userName: userName},
        {$set: {sections: req.body}}, function () {
            res.end();
        });
});

app.get("/checkUser", function (req, res) {
    res.send(req.query.user.length > 2);
});

app.post("/users", function (req, res) {
    db.users.insert(req.body, function (resp) {
        req.session.userName = req.body.userName;
        res.end();
    });
});

app.post("/login", function (req, res) {
    db.users.find({userName: req.body.login, password: req.body.password})
        .toArray(function (err, items) {
            if (items.length > 0) {
                req.session.userName = req.body.login;
            }
            res.send(items.length > 0);
        });
});

app.get("/logout", function(req, res) {
    req.session.userName = null;
    res.end();
});

app.listen(3000);

