const mongoose = require("mongoose")
// create a schema

const signUp=mongoose.Schema({
   name:{type:String},
   email:{type:String},
   mobile:{type:String},
   password:{type:String},
   Address:{type:String},
   DateOfBirth:{type:String},
   status:{type:String,default:"active"}
   
    })
   module.exports = mongoose.model('signUp',signUp);