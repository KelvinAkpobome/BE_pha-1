const Agent = require('../models/Agent.js');
const bcrypt = require('bcryptjs');
const jsonWT = require('../utils/auth-token');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger.js');
const sendmail = require('../utils/sendEmail');
const {
    successResMsg,
    errorResMsg,
    sessionSuccessResMsg,
  } = require('../Utils/response');

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_URL
    : process.env.LIVE_URL;

exports.registerAgent = catchAsync(async (req, res, next) => {
      // Search for all registered Agent
    try {
        logger.info(`Started getting Agent with Phone number: ${req.body.phoneNo}`);
        const foundAgent = await Agent.findOne({phone_no: req.body.phoneNo }, 'phone_no').exec();
        if (!foundAgent){
            // encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(req.body.password, salt);

            //generate verification token
            const fullname = `${req.body.firstName} ${req.body.lastName}`;
            const basicInfo = {
                email: req.body.email,
                username: fullname,
            };
  
            const token = jsonWT.signJWT(basicInfo, '1h');
            const userData = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: basicInfo.email,
                phone_no: req.body.phoneNo,
                password: hashPassword,
                username: fullname,
                verification_token: token,
                address: req.body.address
            };

            await Agent.create(userData);

            // mail verification code to the student
            const verificationUrl = `${URL}/v1/auth/email/verify/?verification_code=${token}`;
  
            const message = ` Hi ${fullname} thanks for registering, kindly verify your email </p><a href ='${verificationUrl}'>Token</a>`;
      
            await sendmail({
                from: process.env.FROM_EMAIL,
                to: basicInfo.email,
                subject: 'Email Verification',
                text: message
            });
            const data = { message: `Verification email sent to ${basicInfo.email}!, please verify account to proceed`, token };
            successResMsg(res, 201, data);
        }else {
            errorResMsg(res, 403, `An Agent has already registered ${basicInfo.email}`);
        }
    }catch (err) {
        logger.info('No agent found');
        console.log(err);
        errorResMsg(res, 401, `No agent found`);
    }
})

exports.verifyEmail = catchAsync(async (req, res, next) => {
    try {
      // obtain verification token from url and verify
      const { verification_code } = req.query;
      const decoded = jsonWT.verifyJWT(verification_code);
  
      // check token expiration
      if (Date.now() <= decoded.exp + Date.now() + 60 * 60) {
        const user = await Agent.findOneAndUpdate({email : decoded.email}, {status: 1, email_verified_at: Date.now() }, {useFindAndModify: false})
  
        if (!user) return errorResMsg(res, 404, `Email is not registered with us`);
        if (user.status === 1 ) return errorResMsg(res, 401, `${decoded.email} has already been verified`);


        const data = { message: 'Email verification successful, You can now log in.' };
        return successResMsg(res, 200, data);
      } else {
        return errorResMsg(res, 400, 'Invalid or expired token');
      }
    } catch (err) {
        logger.info('No token found');
        console.log(err);
        errorResMsg(res, 401, `No token found`);
    }
  });

exports.loginAgent = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;
    try{
        let currentUser = await Agent.findOne( { email } ) // confirm user email
        if(!currentUser){
            return errorResMsg(
                res,
                404,
                `Incorrect login details, ${email} does not exist` // if email is not found, return error msg
        )};
        if(currentUser.status === 0) {
            return errorResMsg(res, 401, `${email} is not verified, please verify before trying to login`);
        }
        if (currentUser.block) return errorResMsg(res, 401, `Agent with email-${email} is blocked!`);
    
        let valid = await bcrypt.compare(password, currentUser.password)
        if (!valid) return errorResMsg(res, 401, 'Password incorrect');

        const data = {
            email: currentUser.email,
            userId: currentUser._id.toString(),
            userRole: currentUser.role,
        };

        const time = '1h';

        const token = await jsonWT.signJWT(data, time);
        await Agent.findOneAndUpdate({email : currentUser.email}, {verification_token: token}, {useFindAndModify: false})
        return res.header('x-auth-token', token).status(200).send({
            status: "Success",
            data: {
                message: "Login Successful",
                token
            }
        })

    }catch(err){
        logger.info('No agent found');
        console.log(err);
        errorResMsg(res, 401, `No agent found`);
    };
})

// exports.logout = function(req, res) {
//     res.cookie('jwt', '', {maxAge: 1});
//     res.redirect('/');
// }


