const mongoose = require('mongoose');

const loginschema = new mongoose.Schema({
    username:String,
    password:String
})
 
const loginModel = new mongoose.model("admin" , loginschema)

module.exports=loginModel;