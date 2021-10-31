//Team-Nuvs
const path = require('path');
const socket = require('socket.io');
const express = require('express');
var session = require('express-session');
const app = express();
require('dotenv').config()
app.use(express.urlencoded({ extends: true }));

var router = require("express").Router();
const request = require('request');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const { json } = require('body-parser');

const uri = process.env.MONGO_DB_URI; //enter your own uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var thenpromise;
var thenpromise2;


client.connect(err => {
    app.set('trust proxy', 1); // trust first proxy
    app.use(session({
        secret: 'f<7M$@B`',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));
    async function checkLoginUser(req, res, next) {

        try {
            [flag, req.session.userID, req.session.userType] = await thenpromise2;
            console.log('Session: ' + req.session.userID);
            if (req.session.userID != null || req.session.userID != '' && req.session.userType == 'expert') {
                console.log('Session Verified:' + req.session.userID);
            } else {
                console.log('Failed');
                try {
                    res.redirect('/');
                } catch (err) {
                    console.log('Double redirect');
                }
            }
        } catch (err) {
            res.redirect('/');
        }
        next();
    }
    async function checkLoginUser2(req, res, next) {

        try {
            [flag, req.session.userID, req.session.userType] = await thenpromise;
            console.log('Session: ' + req.session.userID);
            if (req.session.userID != null || req.session.userID != '' && req.session.userType == 'student') {
                console.log('Session Verified:' + req.session.userID);
            } else {
                console.log('Failed');
                try {
                    res.redirect('/');
                } catch (err) {
                    console.log('Double redirect');
                }
            }
        } catch (err) {
            res.redirect('/');
        }
        next();
    }
    /************************************************************************************************************/
    app.get("/", function(req, res) {
        thenpromise = null;
        thenpromise2 = null;
        res.render("login");
    });
    app.post("/", async function(req, res) {
        console.log(req.body);
        var collection = client.db("edtest").collection('Users');
        var collection2 = client.db("edtest").collection('Experts'); // get reference to the collection
        var doc;
        var promise = collection.findOne({ emailId: req.body.emailId });
        var promise2 = collection2.findOne({ emailId: req.body.emailId });
		if(req.body.emailId == 'admin@admin.com' && req.body.passId=='admin'){
			res.redirect('/admin');
		}
        thenpromise = promise.then(function(result) {

            if (result == null) {
                console.log("Not in Users");
                return null;
            } else {
                console.log(result);
                doc = result;
                if (bcrypt.compareSync(req.body.passId, result.passId)) {
                    console.log("In Student checking Password ");
                    req.session.userID = doc.sName;
                    req.session.userType = 'student';
					req.session.stud_id = doc.stud_id;
                    return [1, req.session.userID, req.session.userType, req.session.stud_id];
                } else {
                    res.render('login');
                }
            }
        });
        thenpromise2 = promise2.then(function(result) {
            if (result == null) {
                console.log("Not in Experts");
                return null;
            } else {
                console.log(result);
                doc = result;
                if (bcrypt.compareSync(req.body.passId, result.passId)) {
                    console.log("In Expert checking Password ");
                    req.session.userID = doc.expName;
                    req.session.userType = 'expert';

                    return [1, req.session.userID, req.session.userType];
                } else {
                    res.render('login');
                }
            }
        });
        var stud = await thenpromise;
        var expe = await thenpromise2;
        if (stud != null) {
            res.redirect('/stud-ask');
        } else if (expe != null) {
            res.redirect('/expert-dash');
        } else {
            res.redirect('/');
        }


    });
    /************************************************************************************************************/
    app.get("/stud-ask", checkLoginUser2, async function(req, res) {
        console.log("Student Logged in");
		var stu_id = await thenpromise ;
		console.log(stu_id[3]);
        const collection = client.db("edtest").collection("Questions");
        const collection2 = client.db("edtest").collection("Answers");
        collection.find().toArray(function(err, result) {
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
                res.render("postQuestion", { result: result, result2: answer, stud_id: stu_id[3] });
            });
        });
    });
    app.post("/stud-ask", function(req, res) {
        const collection = client.db("edtest").collection("Questions");
        d = new Date();
        s = d.getTime();
        collection.insertOne({ _id: req.body._id, stud_id: req.body.stud_id, question: req.body.questions, time_created: s, time_constraint: 3 });
        res.redirect("stud-dash");
    });
    /************************************************************************************************************/
    app.get("/studAns", checkLoginUser2, async function(req, res) {

        console.log("Student Logged in");
        const collection = client.db("edtest").collection("Questions");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render("studAnswer", { result });
        });
    });
    app.post("/studAns", function(req, res) {
        console.log(req.body);
        const collection = client.db("edtest").collection("Stud_Answers");
        collection.insertOne({ qid: req.body._id, stud_acc: req.body.acc, answer: req.body.answers });
        res.status(200);
        res.redirect("stud-dash");
    });
    /************************************************************************************************************/
    app.get("/stud-dash", checkLoginUser2, async function(req, res) {
        const collection = client.db("edtest").collection("Questions");
        const collection2 = client.db("edtest").collection("Answers");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
                res.render("studDashboard", { result: result, result2: answer });
            });
        });
    });
    /************************************************************************************************************/
    app.get("/quessearch", checkLoginUser2, async function(req, res) {
        const s = req.query.term;
        console.log(s);
        const collection = client.db("edtest").collection("Questions");
        const collection2 = client.db("edtest").collection("Answers");
        collection.find({ $text: { $search: s } }).toArray(function(err, result) {

            if (err) res.redirect('stud-dash');
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
				console.log(result);
                res.render("searched", { result: result, result2: answer });
            });
        });
    });
    /************************************************************************************************************/
    app.get("/expert-dash", checkLoginUser, async function(req, res) {

        console.log("Expert Logged in");
        const collection = client.db("edtest").collection("Questions");
        const collection2 = client.db("edtest").collection("Answers");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            collection2.find().toArray(function(err2, answer) {
                if (err2) throw err2;
                res.render("expertDashboard", { result: result, result2: answer });
            });

        });
    });
    /************************************************************************************************************/
    app.get("/expAns", checkLoginUser, async function(req, res) {
        const collection = client.db("edtest").collection("Questions");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render("expAnswer", { result });
        });
    });
    app.post("/expAns", function(req, res) {
        const collection = client.db("edtest").collection("Answers");
        collection.insertOne({ _id: req.body._id, answer: req.body.answers });
        res.status(200);
        res.redirect("expert-dash");
    });
    /************************************************************************************************************/
    app.get("/register", (req, res) => {
        return res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'));

    });
    app.post("/register", (req, res) => {
        // store to mongodb
        console.log(req.body);
        //req.body.username (email.pass.usermode)
		var users = client.db("edtest").collection('Users');
		users.find().toArray(function(err, _Users) {
			var i = (_Users.length+1);
			bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
				if(err) res.redirect('/register');
				users.insertOne({ stud_id:""+i, sName:req.body.username, emailId:req.body.email, passId:hash })
			});
			
		});
        return res.redirect("/");
    });
    /************************************************************************************************************/
    app.get("/chat", checkLoginUser2, async(req, res) => {
        return res.sendFile(path.join(__dirname, 'public', 'pages', 'chat.html'));
    });

    /*******************************************admininstrator***************************************************/
    app.get("/admin", (req, res) => {
        var users = client.db("edtest").collection('Users');
        var experts = client.db("edtest").collection('Experts');
        var questions = client.db("edtest").collection('Questions');
        var answers = client.db("edtest").collection('Answers');

        users.find().toArray(function(err, _Users) {
            experts.find().toArray(function(err2, _Experts) {
                questions.find().toArray(function(err2, _Questions) {
                    answers.find().toArray(function(err2, _Answers) {
                        // console.log({ Questions : _Questions, Answers: _Answers ,noStudent: _Users.length, noExpert : _Experts.length });
                        res.render("admin", { Questions: _Questions, Answers: _Answers, noStudent: _Users.length, noExpert: _Experts.length });

                    });
                });
            });
        });


    });
});
module.exports = app;