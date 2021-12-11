const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    _id:{
        type:ObjectId
    },
    name:{
        type:String,
    }
    ,phonenumber:{
       type:Number
    },license:{
        type:String,
    },
    terminalallowed:{
        type:Number,
    },
    smslicense:{
        type:String,
    },smsstatus:{
       type:Number,
    },smsdeadline:{
        type:String,
    },smscost:{
        type:Number
    },licensecost:{
        type:Number,
    },uid:{
        type:String,
    },activationdate:{
        type:String,
    }
});

const UserModel=new mongoose.model("UserCollections" , userSchema);
module.exports=UserModel;