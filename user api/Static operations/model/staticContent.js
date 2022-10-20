const mongoose = require("mongoose")
// create a schema

const staticContent=mongoose.Schema({
   type:{type:String},
   title:{type:String},
   description:{type:String},
   status:{type:String,default:"Active"},
  
   
    })
  


    module.exports = mongoose.model('staticContent',staticContent);