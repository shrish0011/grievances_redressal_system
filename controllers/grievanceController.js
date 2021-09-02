const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Grievance = mongoose.model('grievanceModel');
var popup = require("alert");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './views/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
 
const upload = multer({
     storage: storage ,
     limits:{
         fieldSize: 1024 *1024 *3,
     },
    });

router.post('/login',(req,res)=>{
    console.log("hi");
    if (req.body.username == "test" && req.body.pass == "test"){
        console.log("heelo");
        //res.render("./views/landingPage.html");
        res.render("landingPage.ejs",{errormsg:""});
    }
    if (req.body.username == "admin" && req.body.pass =="admin"){
       // res.render("adminPage.ejs");
       res.render("adminPage.ejs",{errormessage:"",msg:"",image_name:""});
    }
});

router.get('/searchGrievance',(req,res)=>{
    Grievance.findById(req.query.grievanceId, function(err, docs){
       
        if (err){ 
            throw new Error("Record not found");
            console.log(err +"hi error"); 
           // res.render("searchPage.ejs",{grievanceId:req.query.grievanceId});
        } 
        else{ 
            console.log(docs);
            if (docs == null){
                res.render("landingPage.ejs",{errormsg:"Grievance record doesn't exist. Please check your Grievance ID!"});
            }else{
                res.render("searchPage.ejs",{grievanceId:req.query.grievanceId,fullName:docs.fullName, email:docs.email, phone: docs.phone, description: docs.description,location: docs.location,
                    image_name:docs.image.name, status:docs.status, comments:docs.comments});
            }
           
        } 
    });
  
});

router.post('/insertGrievance',(req,res)=>{
    console.log("search");
    res.render("grievance.ejs",{successmessage:"",docid:0});
});

router.get('/searchGriev',(req,res)=>{
    Grievance.findById(req.query.grievId, function(err, docs){
        if (err){ 
            console.log(err); 
        } 
        else{ 
           // console.log(docs.status);
            if (docs == null){
                res.render("adminPage.ejs",{msg:"",image_name:"",errormessage:"Grievance record doesn't exist. Please check your Grievance ID!"});
            }
            else{
                console.log(docs.image.contentType);
                res.render("adminPage.ejs",{msg:"",errormessage:"",grievanceId:req.query.grievId,fullName:docs.fullName, email:docs.email, phone: docs.phone, description: docs.description,location: docs.location,
                    image:docs.image,image_name:docs.image.name, status:docs.status, msg:"",comments:docs.comments});
            }
            
        } 
    });
  
});
router.post('/status/',(req,res)=>{
    console.log(req.body);
    console.log("my status"+req.body.status+"my location:"+req.body.image);
    Grievance.findByIdAndUpdate(req.body.grievanceId,{status:req.body.status,comments:req.body.comments} ,function(err, docs){
        console.log("check");
        if (err){ 
            console.log(err); 
        } 
        else{ 

          if(docs != null){
            res.render("adminPage.ejs",{errormessage:"",image_name:"",msg:"Grievance updated successfully"});
          }else{
            res.render("adminPage.ejs",{errormessage:"",image_name:"",msg:""});
          }
            
           
           
        } 
    });
    
  
});

router.post('/addGrievance',upload.single('image'),(req,res)=>{
    insertRecord(req,res);
});

function insertRecord(req,res){
    
    var grievance = new Grievance();
    grievance.fullName = req.body.fullName;
    grievance.email = req.body.email;
    grievance.phone = req.body.phone;
    grievance.description = req.body.description;
    grievance.location = req.body.location;
    grievance.image={
        name : req.file.filename,
        data : fs.readFileSync(path.join('./views/uploads/' + req.file.filename))
    };
    grievance.status = "New";
    grievance.comments = req.body.comments;
    grievance.save((err,doc)=>{
        if (!err){
            res.render("grievance.ejs",{successmessage:"Grievance reported successfully.",docid:doc._id});
        }else{
            console.log("error reported"+err);
        }
    });

}
module.exports = router;