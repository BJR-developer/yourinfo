require('dotenv').config();
const express = require("express");
const mongoose= require('mongoose');
const app = express();
const fs=require('fs');
var   http = require('http');
const UserModel = require("../src/models/schema");
const loginModel = require ('../src/models/loginschema')
const path = require('path');
const hbs = require("hbs"); 
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "./templates/views");
const partialPath = path.join(__dirname, "./templates/partials");
const router = new express.Router();
const excelToJson = require('convert-excel-to-json');
var multer      = require('multer');  
var bodyParser  = require('body-parser');  
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const auth = require('./middleware/auth')
require("./db/connection");
require("../src/models/schema");
app.set("views", staticPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialPath);
app.use(express.json());
app.use(router);
app.use(bodyParser.urlencoded({extended:false}));  
app.use(express.urlencoded({ extended: false }));
router.use(express.urlencoded({ extended: false }));

//file upload method
//define storage for excel
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+'.xlsx');
  }
});
var upload = multer({ storage : storage}).single('databaseFile');

router.get("/admin" ,  (req, res) => {
  const userData = req.cookies.userCookies;
  if (userData) {
    res.render("admin")
  } else {
    res.redirect("/login")
  }
});
router.get("/", (req, res) => {
  res.render("index")
});
router.get("/login", (req, res) => {
  const cookie = req.cookies.userCookies;
  if (!cookie){
    res.render("login")
  }else{
    res.setHeader('Content-Type', 'text/plain');    
    res.redirect("/admin")
  }
  res.render("login")
});
// const test = async()=>{
//   loginModel.insertMany({"username":"admin","password":"admin"} , (err,data)=>{
//     if(err){
//       console.log(err);
//     }else{
//       console.log(data);
//     }
//   })
// }
// test();
router.post('/login' , async(req, res) =>{
  const username = req.body.username,
        password = req.body.password
        const datacheck =  loginModel.find({username:username} , async(err ,data)=>{
          try {
            
          if(err){
            res.redirect('/login')
          }else{
            if(password===data[0].password){
              res.cookie("userCookies" , data , {
                expires:new Date(Date.now()+ 30000000),
                httpOnly:true
              })
              res.redirect("/admin")
            }else{
              res.redirect("/login")             
            }
          }
          } catch (error) {
            res.redirect("/login")
          }
    }); 
   });
   console.log();
   // username and password change
   router.post("/username" , async(req,res)=>{
     const cookieData=req.cookies.userCookies;
    var query = {"username" : cookieData[0].username}
    var newData = {"username":req.body.username}
    loginModel.updateOne(query , newData ,{upsert:true}, (err, data)=>{
     if(err){
       console.log(err)
      //  return res.send("error");
     }else{
      //  return res.send("Succesfully Username Changes")
      console.log(data);
      res.redirect("/logout")
     }
    })
   });

   router.post("/passwordchange" , async(req,res)=>{
     const cookieData=req.cookies.userCookies;
    var query = {"password" : cookieData[0].password}
    var newData = {"password":req.body.newpassword}
    loginModel.updateOne(query , newData ,{upsert:true}, (err, data)=>{
     if(err){
       console.log(err)
      //  return res.send("error");
     }else{
      //  return res.send("Succesfully Username Changes")
      console.log(data);
      res.redirect("/logout")
     }
    })
   });

   router.get("/logout" , (req,res)=>{
     const userData=req.cookies.userCookies;
     res.clearCookie("userCookies");
     res.redirect('/')
   })
router.post("/find" , async (req,res)=>{
  try {
    await UserModel.find({license:req.body.license} , (err, data)=>{
      if(err){
        res.render("error");
      }else{
        res.render("index" , data);
      }
  }).clone();
  } catch (error) {
    res.send("error got")
  }
})

//upload file and convert excel to MongoDB

router.post('/uploadfile' , async(req, res) =>{
      try {
        upload(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          res.redirect("/admin");
          const finalPath = './uploads/databaseFile.xlsx';
        importExcelData2MongoDB(finalPath);
      }); 
      } catch (error) {
      } 
  });  

function importExcelData2MongoDB(filePath){
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
  sourceFile: filePath,
  sheets:[{
  name: 'Sheet1',
  header:{
  rows: 1
  },
  // Mapping columns to keys
  columnToKey: {
        A: 'name',
        B: 'phonenumber',
        C: 'license',
        D: 'terminalallowed',
        E: 'smslicense',
        F: 'smsstatus',
        G: 'smsdeadline',
        H: 'smscost',
        I: 'licensecost',
        J: 'uid',
        K: 'activationdate',
  }
  }]
  });
  UserModel.insertMany( excelData.Sheet1 ,(err,data)=>{  
    if(err){  
      alert('Database not inserted')
    }else{  
    }  
    fs.unlinkSync(filePath);
    });
  };

//server port
app.listen(port, async () => {
  try {
    console.log("Server Listening to 3000 Port")
  } catch (e) {
    console.log(e);
  }
});