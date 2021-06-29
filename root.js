//Team-Nuvs
const path = require('path')
const express = require('express');
var session = require('express-session');
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'f<7M$@B`',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(express.urlencoded({ extends: true }))

var router = require("express").Router();
const request = require('request');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const uri = "mongodb+srv://root:soumi07@quest.ni5bi.mongodb.net/edlance?retryWrites=true&w=majority"; //enter your own uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var thenpromise;
var thenpromise2;
var userID;
var userType;

client.connect(err => {
    router.get("/expert-dash", function(req, res) {
        if ((req.session.userID != '' || req.session.userID != null) && req.session.userType == 'expert') {
            console.log("Expert Logged in");
        }
        const collection = client.db("edlance").collection("Questions");
        const collection2 = client.db("edlance").collection("Answers");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
                res.render("expertDashboard", { result: result, result2: answer });
            });

        });
    });
    router.get("/stud-dash", function(req, res) {
        if ((req.session.userID != '' || req.session.userID != null) && req.session.userType == 'student') {
            console.log("Student Logged in");
        }
        const collection = client.db("edlance").collection("Questions");
        const collection2 = client.db("edlance").collection("Answers");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
                res.render("studDashboard", { result: result, result2: answer });
            });

        });
    });
    router.get("/stud-ask", function(req, res) {
        try {
            thenpromise.then(() => {
                req.session.userID = userID;
                req.session.userType = userType;
                console.log('Session in stud-ask' + req.session.userID);
                if ((req.session.userID != '' || req.session.userID != null) && req.session.userType == 'student') {
                    console.log("Student Logged in");
                }
                const collection = client.db("edlance").collection("Questions");
                const collection2 = client.db("edlance").collection("Answers");
                collection.find({ stud_id: "1" }).toArray(function(err, result) {
                    collection2.find().toArray(function(err2, answer) {
                        if (err2) throw err2;
                        res.render("postQuestion", { result: result, result2: answer });
                    });
                });
            });
        } catch {
            res.redirect('/');
        }
    });
    router.post("/stud-ask", function(req, res) {
        const collection = client.db("edlance").collection("Questions");
        d = new Date();
        s = d.getTime();
        collection.insertOne({ _id: req.body._id, stud_id: req.body.stud_id, question: req.body.questions, time_created: s, time_constraint: 3 });
        res.redirect("stud-dash");
    });

    router.get("/expAns", function(req, res) {
        if ((req.session.userID != '' || req.session.userID != null) && req.session.userType == 'expert') {
            console.log("Expert Logged in");
        }
        const collection = client.db("edlance").collection("Questions");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render("expAnswer", { result });
        });
    });

    router.post("/expAns", function(req, res) {
        const collection = client.db("edlance").collection("Answers");
        collection.insertOne({ _id: req.body._id, answer: req.body.answers });
        res.status(200);
        res.redirect("expert-dash");
    })

    router.get("/studAns", function(req, res) {
        try {
            thenpromise.then(() => {
                req.session.userID = userID;
                req.session.userType = userType;
                console.log('Session in studAns' + req.session.userID);
                if ((req.session.userID != '' || req.session.userID != null) && req.session.userType == 'student') {
                    console.log("Student Logged in");
                    const collection = client.db("edlance").collection("Questions");
                    collection.find().toArray(function(err, result) {
                        if (err) throw err;
                        res.render("studAnswer", { result });
                    });
                } else {
                    res.redirect('/');
                }

            });
        } catch {
            res.redirect('/');
        }

    });

    router.post("/studAns", function(req, res) {
        console.log(req.body);
        const collection = client.db("edlance").collection("Stud_Answers");
        collection.insertOne({ qid: req.body._id, stud_acc: req.body.acc, answer: req.body.answers });
        res.status(200);
        res.redirect("stud-dash");
    })

    router.get("/", function(req, res) {
        thenpromise = null;
        thenpromise2 = null;
        res.render("login");
    });
    /************************************************************************************************************/
    router.post("/", function(req, res) {
        console.log(req.body);
        var collection = client.db("edlance").collection('Users');
        var collection2 = client.db("edlance").collection('Experts'); // get reference to the collection
        var doc;
        var promise = collection.findOne({ emailId: req.body.emailId });
        var promise2 = collection2.findOne({ emailId: req.body.emailId });
        thenpromise = promise.then(function(result) {
            console.log(result);
            if (result == null) {
                console.log("Not in Users");
            } else {
                doc = result;
                if (bcrypt.compareSync(req.body.passId, result.passId)) {
                    console.log("In Student checking Password ");
                    userID = doc.sName;
                    userType = 'student';
                    res.redirect('/stud-ask');
                } else {
                    res.render('login');
                }
            }
        });
        thenpromise2 = promise2.then(function(result) {
            if (result == null) {
                console.log("Not in Experts");
            } else {
                doc = result;
                if (bcrypt.compareSync(req.body.passId, result.passId)) {
                    console.log("In Expert checking Password ");
                    req.session.userID = doc.sName;
                    req.session.userType = 'expert';
                } else {
                    res.render('login');
                }
            }
        });

    });

    /***********************************************************************************/
    router.get("/quessearch", function(req, res) {
        //console.log(req.query.term);
        const s = req.query.term;
        console.log(s);
        const collection = client.db("edlance").collection("Questions");
        const collection2 = client.db("edlance").collection("Answers");
        collection.find({ $text: { $search: s } }).toArray(function(err, result) {
            if (err) throw err;
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
                res.render("searched", { result: result, result2: answer });
            });
        });
    });

    router.get("/register", (req, res) => {
        return res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'))

    })

    router.post("/register", (req, res) => {
        // store to mongodb
        console.log(req.body);
        //req.body.username (email.pass.usermode)
        return res.redirect("/")
    })

});


module.exports = router;