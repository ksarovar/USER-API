const mongoose = require('mongoose');
// const Joi = require("joi");
const bcrypt = require("bcrypt")
// const { boolean, date, string } = require('joi');
const userSchema = new mongoose.Schema({
    name: { type: String,  min: 6 },
    email: { type: String,  min: 6, max: 255 },
    password: { type: String, min: 6 },
    MobileNumber: { type: String },
    CC: { type: String,  min: 3 },
    Address: { type: String,  },
    DateOfBirth: { type: String},
    status: { type: Boolean },
    userType : { type : String , default :"USER"}


})

const User = mongoose.model("user", userSchema);
module.exports = { User }
mongoose.model("user", userSchema).find({ userType: "ADMIN" }, async (err, result) => {
    if (err) {
        console.log("default admin error");

    } else if (result.length != 0) {
        console.log("default admin running");
    }
    else {
        let salt = await bcrypt.genSalt(10);
        let hashPass = await bcrypt.hash("krushna@5619", salt)
        let obj = {

            name: "krushna",
            email: "krushna@gmail.com",
            MobileNumber: "7066239691",
            password:hashPass,
            CC: "+91",
            Address: "baner",
            DateOfBirth: "28/06/2000",
            status: true,
            userType : "ADMIN"
            
        }
        mongoose.model("user",userSchema).create(obj,async(err1,result)=>{
            if (err1) {
                console.log("default admin creation error",err1);
                
            }else{
                console.log("default admin created",result);
            }
        })

        }
    
})