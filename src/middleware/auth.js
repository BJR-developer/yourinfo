require('dotenv').config();
const jwt=require("jsonwebtoken"),
    cookieParser=require("cookie-parser"),
    UserModel=require("../models/schema")
    const express=require("express");
const app=express();
    app.use(cookieParser())

//cookies meaning user Collections Data save on browser
 const auth=async( req,res,next)=>{
     try {
        const userData = req.cookies.userCookies;
       if(userData){
        res.redirect('/admin')
        res.setHeader('Content-Type', 'text/plain');

       }else{
           res.redirect('/login')
           res.setHeader('Content-Type', 'text/plain');
           res.end()
       }
        // console.log(verify + jwt);
        next()
     } catch (error) {
         console.log("this is the auth problem " + error)
     }
     
 }
 
 module.exports=auth;