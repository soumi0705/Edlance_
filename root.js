var router = require("express").Router();
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const uri = ""; //enter your own uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("edlance").collection("Questions");
  router.get("/expert-dash",function(req,res){
      const collection = client.db("edlance").collection("Questions");
      const collection2 = client.db("edlance").collection("Answers");
      collection.find().toArray(function(err, result) {
        if (err) throw err;
        collection2.find().toArray(function(err2, answer){
          if(err2) throw err2;
          res.render("expertDashboard",{result:result,result2:answer});
        }); 
        
      });    
        });
    router.get("/stud-dash",function(req,res){
      const collection = client.db("edlance").collection("Questions");
      const collection2 = client.db("edlance").collection("Answers");
      collection.find().toArray(function(err, result) {
        if (err) throw err;
        collection2.find().toArray(function(err2, answer){
          if(err2) throw err2;
          res.render("studDashboard",{result:result,result2:answer});
        }); 
        
      });       
    });
    router.get("/stud-ask",function(req,res){
          const collection = client.db("edlance").collection("Questions");
          const collection2 = client.db("edlance").collection("Answers");
          collection.find({stud_id:"1"}).toArray(function(err, result) {
            collection2.find().toArray(function(err2, answer){
              if(err2) throw err2;
              res.render("postQuestion",{result:result,result2:answer});
            }); 
          });          
      });  
      router.post("/stud-ask",function(req,res){
        const collection = client.db("edlance").collection("Questions");
        d= new Date();
        s= d.getTime();
        collection.insertOne({_id:req.body._id,stud_id:req.body.stud_id, question: req.body.questions, time_created:s, time_constraint:3});
        res.redirect("stud-dash");
    });

      router.get("/expAns",function(req,res){
          const collection = client.db("edlance").collection("Questions");
          collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render("expAnswer",{result});
          });   
      });

      router.post("/expAns",function(req,res){
        const collection = client.db("edlance").collection("Answers");
          collection.insertOne({_id:req.body._id, answer: req.body.answers});
          res.status(200);
          res.redirect("expert-dash");
      })

      router.get("/studAns",function(req,res){
          const collection = client.db("edlance").collection("Questions");
          collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.render("studAnswer",{result});
          });   
      });

      router.post("/studAns",function(req,res){
          console.log(req.body);
          res.status(200);
          res.redirect("stud-dash");
      })

      router.get("/",function(req,res){
        
            res.render("login");  
      });
      router.get("/quessearch",function(req,res){
        //console.log(req.query.term);
        const s = req.query.term;
        console.log(s);
        const collection = client.db("edlance").collection("Questions");
        const collection2 = client.db("edlance").collection("Answers");
        collection.find({ $text: { $search: s } }).toArray(function(err, result) {
          collection2.find().toArray(function(err2, answer){
            if(err2) throw err2;
            res.render("searched",{result:result,result2:answer});
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