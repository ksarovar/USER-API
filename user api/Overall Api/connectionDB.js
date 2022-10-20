const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://krushna:krushna@cluster0.1gsvjxn.mongodb.net/krushnadb?retryWrites=true&w=majority").then( ()=>{
   
}).catch((err)=>{
    console.log(err);
})