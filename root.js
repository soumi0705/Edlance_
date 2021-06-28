//Team-Nuvs
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

var router = require("express").Router();
const request = require('request');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const uri = "mongodb+srv://root:soumi07@quest.ni5bi.mongodb.net/edlance?retryWrites=true&w=majority"; //enter your own uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
        console.log("Session : " + req.session.userID);
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
        if ((req.session.userID != '' || req.session.userID != null) && req.session.userType == 'student') {
            console.log("Student Logged in");
        }
        const collection = client.db("edlance").collection("Questions");
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render("studAnswer", { result });
        });
    });

    router.post("/studAns", function(req, res) {
        console.log(req.body);
        const collection = client.db("edlance").collection("Stud_Answers");
        collection.insertOne({ qid: req.body._id, stud_acc: req.body.acc, answer: req.body.answers });
        res.status(200);
        res.redirect("stud-dash");
    })

    router.get("/", function(req, res) {
        res.render("login");
    });
    /************************************************************************************************************/
    router.post("/", function(req, res) {
        console.log(req.body);
        var collection = client.db("edlance").collection('Users');
        var collection2 = client.db("edlance").collection('Experts'); // get reference to the collection
        var doc;
        collection.findOne({ emailId: req.body.emailId }, function(err, result) {

            if (err || result == null) {
                console.log("Not in Users");
            } else {
                doc = result;
                if (bcrypt.compareSync(req.body.passId, result.passId)) {
                    console.log("In Student checking Password " + result);
                    req.session.userID = doc.sName;
                    req.session.userType = 'student';
                    res.redirect('/stud-ask');
                } else {
                    res.render('login');
                }
                // console.log(result);
            }
            console.log("Session set as: " + req.session.userID);
        });
        collection2.findOne({ emailId: req.body.emailId }, function(err, result) {
            if (err || result == null) {
                console.log("Not in Experts");
            } else {
                doc = result;
                if (bcrypt.compareSync(req.body.passId, result.passId)) {
                    console.log("In Expert checking Password " + result);
                    req.session.userID = doc.sName;
                    req.session.userType = 'expert';
                    res.redirect('/expert-dash');
                } else {
                    res.render('login');
                }
                // console.log(result);
            }


        });
        // bcrypt.hash(req.body.passId, saltRounds, function(err, hash) {
        //     console.log(hash);
        // });

        //res.render("login");
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


});


// router.get("/expert-dash",function(req,res){
//     client.connect(err => {
//       const collection = client.db("edlance").collection("Questions");
//       collection.find().toArray(function(err, result) {
//         if (err) throw err;
//         res.render("expertDashboard",{result});
//       });
//     });

// });
// router.get("/stud-dash",function(req,res){
//   client.connect(err => {
//     const collection = client.db("edlance").collection("Questions");
//     collection.find().toArray(function(err, result) {
//       if (err) throw err;
//       res.render("studDashboard",{result});
//     });
//   });

// });
// router.get("/stud-ask",function(req,res){
//   client.connect(err => {

//       res.render("postQuestion");
//     });
//   });  

//   router.get("/expAns",function(req,res){
//     client.connect(err => {
//       const collection = client.db("edlance").collection("Questions");
//       collection.find().toArray(function(err, result) {
//         if (err) throw err;
//         res.render("expAnswer",{result});
//       });
//     });    
//   });

//   router.post("/expAns",function(req,res){

//       console.log(req.body);
//       res.status(200);
//       res.redirect("expert-dash");
//   })

//   router.get("/studAns",function(req,res){
//     client.connect(err => {
//       const collection = client.db("edlance").collection("Questions");
//       collection.find().toArray(function(err, result) {
//         if (err) throw err;
//         res.render("studAnswer",{result});
//       });
//     });    
//   });

//   router.post("/studAns",function(req,res){
//       console.log(req.body);
//       res.status(200);
//       res.redirect("stud-dash");
//   })

//   router.get("/",function(req,res){

//         res.render("login");  
//   });

module.exports = router;