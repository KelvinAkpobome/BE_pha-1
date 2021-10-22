const log = console.log;
const Agent = require('../models/Agent.js');
const Client = require('../models/Client.js');
const bcrypt = require('bcryptjs');
const {createToken} = require('../services/jwtService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const logger = require('../utils/logger.js');
const nodemailer = require("nodemailer");


exports.registerAgent = catchAsync(async (req, res, next) => {})
//to be refactored
exports.registerAgent = function(req, res) {
	//check if user with this email address exists
    Agent.findOne({email: req.body.email}, (err, userExists)=> {
        if (err) return res.status(500).json({err});
        if (userExists) return res.status(400).json({"msg": "User with this email address already exists"});
        //create a new user
        Agent.create({...req.body}, (err, newAgent)=> {
            if (err) return res.status(500).json({err});
            //hash user password
            bcrypt.genSalt(10, (err, salt)=> {
                if (err) return res.status(500).json({err});
                bcrypt.hash(req.body.password, salt, (err, hashedPassword)=> {
                    if (err) return res.status(500).json({err});
                    //save password to user data in the db
                    newAgent.password = hashedPassword;
                    newAgent.save((err, savedUser)=> {
                        if (err) return res.status(500).json({err});
                        else {
                            req.flash("success_msg", "You are now registered and can login");
                            res.redirect('/login');
                        }
                    });
                });
            });

        });
    });
}

exports.loginAgent = async(req, res)=> {
	//Check if user exists
    const user = await Agent.findOne({email: req.body.email}, (err, agent)=> { if (err) return res.status(500).json({err})}) || await Client.findOne({email: req.body.email}, (err, client)=> { if (err) return res.status(500).json({err})});
    if (!user) req.flash("success_msg", "Incorrect email address");
    else {
        //check if password is correct
        let match = bcrypt.compareSync(req.body.password, user.password);
        log(match);
        if (!match) { 
            req.flash("success_msg", "Incorrect password");
            //return res.status(401).json({"msg": "Incorrect password"});
        }
        //create token
        let token = createToken(user);
        //if (!token) return res.status(500).redirect("/users/login");
        if (!token) return res.status(500).json({"msg": "Unable to authenticate"});
        else {
            res.cookie('jwt', token, {maxAge: 604800, httpOnly: true});
            //log(res.locals.user);
            return res.status(200).redirect('/');
        }             
    }
}

exports.logout = function(req, res) {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}


// exports.passwordReset = async(req, res)=> {
//     //find email in the db
//     const user = await Agent.findOne({email: req.body.email}, (err, agent)=> { if (err) return res.status(500).json({err})}) || await Client.findOne({email: req.body.email}, (err, client)=> { if (err) return res.status(500).json({err})});
//     if (!user) return res.status(401).json({"msg": "This email is not registered to a user"});
//     else {
//         var tempPassword = "";
//         for (var i = 0; tempPassword < 11; i++) {
//             tempPassword += user.password[i]
//         }
//         //configure nodemailer
//         let transporter = nodemailer.createTransport({
//             service: 'zoho',
//             auth: {
//                 user: 'oasisproperties88@zohomail.com',
//                 pass: 'weAreOasis88'
//             }
//         });
//         //set mail options
//         let userNames = user.name.split(' ');
//         let userFirstName = userNames[0];
//         let mailOptions = {
//             from: 'oasisproperties88@zohomail.com',
//             to: user.email,
//             subject: 'Oasis Properties Password Recover',
//             html: `<p>Dear ${userFirstName},</p><p>You requested a password reset.</p><p>Check out your new temporary password below.</p><p style="font-weight: 600;">New password: <span>${tempPassword}</span></p><p>You can now login with your new temporary password.</p>`
//         }
//         user.findByIdAndUpdate(user._id, {password: tempPassword}, (err, updatedUser)=> {
//             if (err) res.status(500).json({err});
//             else if (!updatedUser) return res.status(404).json({"msg": "Password not updated"});
//             else {
//                 bcrypt.genSalt(10, (err, salt)=> {
//                     if (err) return res.status(500).json({err});
//                     //hash new password
//                     bcrypt.hash(tempPassword, salt, (err, hashedPassword)=> {
//                         if (err) return res.status(500).json({err});
//                         else {
//                             updatedUser.password = hashedPassword;
//                             log(updatedUser.password);
//                             //save new password
//                             updatedUser.save((err, savedPassword)=> {
//                                 if (err) return res.status(500).json({err});
//                                 else {
//                                     transporter.sendMail(mailOptions, (err, sentMsg)=> {
//                                         if (err) return res.status(500).json({err});
//                                         log(`Email sent: ${sentMsg.response}`);
//                                         //return res.status(200).json({"msg": "Password Reset Link sent!"});
//                                         req.flash("success_msg", "Your new password has been sent to your email address.");
//                                         return res.status(200).redirect('/login');
//                                     });
//                                 }
//                             });
//                         }
//                     });
//                 });
//             }
//         }
//     }   
// }
