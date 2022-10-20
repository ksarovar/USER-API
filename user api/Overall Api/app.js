var nodemailer = require("nodemailer");
const otp = require("otp-generator")
require("./connectionDB");
const otpdb = require("./model/userSchema");
const signupdb = require("./model/signupSchema")
const validator = require("email-validator")
const bcrypt = require("bcrypt")
const express = require("express");
const app = express();
const { User } = require("./model/user");
app.use(express.json());


app.post('/genotp', async (req, res) => {

    const getotp = otp.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true })
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'krushna.sarovar@indicchain.com',
            pass: 'duitbkcmgbiadosi'
        }
    })

    const { email } = req.body
    if (email) {
        const validemail = await signupdb.findOne({ email: email })
        console.log(validemail);
        if (validemail) {
            return res.status(400).send({ status: "Error", message: " email already exist" })
        }
        else {
            var mailOptions = {
                from: 'krushna.sarovar@indicchain.com',
                to: req.body.email,
                subject: 'otp verification',
                text: 'your otp is ' + getotp
            }

            transport.sendMail(mailOptions, function (error, info) {
                if (error) {

                    console.log(error);

                } else {
                 
                    console.log("emailsent");
                    
                }
            })
        }
    }
    const doc = new otpdb({

        otp: getotp,

    })
    doc.save()
})
app.post('/signup', async (req, res) => {

    const { emailOTP, email, mobile } = req.body

    if (mobile) {
        const validmobile = await signupdb.findOne({ mobile: mobile })
        console.log(validmobile);
        if (validmobile) {
            return res.status(400).send({ status: "Error", message: " mobile already exist" })
        }
        else {
            if (emailOTP) {
                const validUser = await otpdb.findOne({ otp: emailOTP })
                if (validUser) {
                    // const deleteOTP = await otpdb.findOneAndDelete({otp : emailOTP})
                    const doc = new signupdb({
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        password: req.body.password,
                        Address: req.body.Address,
                        DateOfBirth: req.body.DateOfBirth,
                    })
                    doc.save();
                    return res.status(200).send({ status: "Success", message: " User registered Successfully! " },
                    )

                } else {
                    return res.status(400).send({ status: "Error", message: " Invalid OTP! send otp again " })
                }
            } else {
                return res.status(400).send({ status: "Error", message: " Please Enter OTP! " })
            }

        }
    }



});

app.get('/getdata', async (req, res) => {


    const data = await signupdb.find()
    console.log(data);
    res.send(data)
})
app.get('/getdata/:id', async (req, res) => {


    const data = await signupdb.findOne(req.body._id)
    console.log(data);
    res.send(data)
})
app.put('/:id', async (req, res, next) => {
    console.log(req.params.id);
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(pass, salt)
    const { email, mobile } = req.body

    if (email) {
        const validemail = await signupdb.findOne({ email: email })
        console.log(validemail);
        if (validemail) {

            return res.status(400).send({ status: "Error", message: " email already exist" })

        }
        if (mobile) {
            const validmobile = await signupdb.findOne({ mobile: mobile })
            console.log(validmobile);
            if (validmobile) {
                return res.status(400).send({ status: "Error", message: " mobile already exist" })
            }
            else {
                signupdb.findOneAndUpdate({ _id: req.params.id }, {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        password: hashPass,
                        Address: req.body.Address,
                        DateOfBirth: req.body.DateOfBirth,
                    }
                })
                    .then(result => {
                        res.status(200).json({
                            updated_signupdb: result
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
            }
        }
    }


});

app.put('/reset/:id', async (req, res, next) => {
    const { emailOTP } = req.body
    if (emailOTP) {
        const validUser = await otpdb.findOne({ otp: emailOTP })
        if (validUser) {
            const pass = req.body.password;
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(pass, salt)
            signupdb.findOneAndUpdate({ _id: req.params.id }, {
                $set: {

                    password: hashPass,

                }

            })
                .then(result => {
                    res.status(200).json({
                        updated_signupdp: result
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            return res.status(200).send({ status: "Success", message: " password reset successfully " },
            )

        } else {
            return res.status(400).send({ status: "Error", message: " Invalid OTP! send otp again " })
        }
    } else {
        return res.status(400).send({ status: "Error", message: " Please Enter OTP! " })
    }


});

app.put('/forgot/:id', async (req, res, next) => {


    const { emailOTP, email } = req.body

    if (email) {
        const validemail = await signupdb.findOne({ email: email })
        console.log(validemail);
        if (validemail) {
            if (emailOTP) {
                const validUser = await otpdb.findOne({ otp: emailOTP })
                if (validUser) {
                    const pass = req.body.password;
                    const salt = await bcrypt.genSalt(10)
                    const hashPass = await bcrypt.hash(pass, salt)
                    signupdb.findOneAndUpdate({ _id: req.params.id }, {
                        $set: {

                            password: hashPass,

                        }

                    })
                        .then(result => {
                            res.status(200).json({
                                updated_signupdb: result
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        })
                    return res.status(200).send({ status: "Success", message: " password set successfully " },
                    )

                } else {
                    return res.status(400).send({ status: "Error", message: " Invalid OTP! send otp again " })
                }
            } else {
                return res.status(400).send({ status: "Error", message: " Please Enter OTP! " })
            }
            // 

        }
        else {
            return res.status(400).send({ status: "Error", message: " not registered email" })
        }
    }



});

app.post('/login', async (req, res) => {
    const { emailOTP, email, password } = req.body
    if (email) {
        const validemail = await signupdb.findOne({ email: email })
        console.log(validemail);
        if (validemail) {

            if (password) {
                const validpassword = await signupdb.findOne({ password: password })
                console.log(validpassword);
                if (validpassword) {


                    if (emailOTP) {
                        const validUser = await otpdb.findOne({ otp: emailOTP })
                        if (validUser) {

                            return res.status(200).send({ status: "Success", message: " loged in " },
                            )

                        } else {
                            return res.status(400).send({ status: "Error", message: " Invalid credentials " })
                        }
                    } else {
                        return res.status(400).send({ status: "Error", message: " Please Enter OTP! " })
                    }


                } else {
                    return res.status(400).send({ status: "Error", message: " password doesnot match" })
                }
            }

        } else {
            return res.status(400).send({ status: "Error", message: " not registered email" })
        }
    }
});

app.post('/resendotp', async (req, res) => {

    const getotp = otp.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true })
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'krushna.sarovar@indicchain.com',
            pass: 'duitbkcmgbiadosi'
        }
    })

    const { email } = req.body
    if (email) {
        const validemail = await signupdb.findOne({ email: email })
        console.log(validemail);
        if (validemail) {
            return res.status(400).send({ status: "Error", message: " email already exist" })
        }
        else {
            var mailOptions = {
                from: 'krushna.sarovar@indicchain.com',
                to: req.body.email,
                subject: 'otp verification',
                text: 'your otp is ' + getotp
            }

            transport.sendMail(mailOptions, function (error, info) {
                if (error) {

                    console.log(error);

                } else {
                    console.log('====================================');
                    console.log("emailsent");
                    console.log('====================================');
                }
            })
        }
    }
    const doc = new otpdb({

        otp: getotp,

    })
    doc.save()
})

//.......................................................

app.listen(3000, () => {
    console.log(" app is running");
})




