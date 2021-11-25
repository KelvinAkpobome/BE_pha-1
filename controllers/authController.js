/* eslint-disable quotes */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const jsonWT = require('../utils/auth-token');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const sendmail = require('../utils/sendEmail');
const { successResMsg, errorResMsg } = require('../utils/response');
const { usersSchema } = require('../schemas');

const URL = process.env.LIVE_URL;

exports.registerAgent = catchAsync(async (req, res, next) => {
  const {
    first_name, last_name, password, email, phone_no, role,
  } = req.body;
    // Search for all registered Agent
  try {
    logger.info('Validating the req.body');
    const validatedAgentFields = await usersSchema.validateAsync(req.body);
    logger.info(`Started search for Agent with Phone number: ${phone_no}`);
    const foundAgent = await db.collection('users').findOne({ email });

    if (foundAgent == null) {
      logger.info(`Creating agents data with Phone number: ${phone_no}`);

      // encrypt password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      // generate verification token
      const fullname = `${first_name} ${last_name}`;
      const basicInfo = {
        email,
        username: fullname,
        role,
      };

      const token = jsonWT.signJWT(basicInfo, '1h');

      // populate validatedAgentFields object
      validatedAgentFields.username = fullname;
      validatedAgentFields.verification_token = token;
      validatedAgentFields.password = hashPassword;
      validatedAgentFields.role = role.toLowerCase();

      // save agent details
      await db.collection('users').insertOne(validatedAgentFields);

      // mail verification code to the agent
      const verificationUrl = `${URL}/v1/auth/email/verify/?verification_code=${token}`;

      const message = `<p>Hi ${fullname}, thanks for registering with Port Harcourt Agents, kindly verify your email <a href ="${verificationUrl}">here</a> </p> `;

      await sendmail({
        from: process.env.FROM_EMAIL,
        to: basicInfo.email,
        subject: 'Email Verification',
        html: message,
      });
      const data = { message: `Verification email sent to ${basicInfo.email}!, please verify account to proceed`, token };
      return successResMsg(res, 201, data);
    }
    return errorResMsg(res, 403, `Someone already registered with ${email}`);
  } catch (err) {
    logger.error(err.message);
    return errorResMsg(res, 401, err.message);
  }
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  try {
    // obtain verification token from url and verify
    const { verification_code } = req.query;
    const decoded = jsonWT.verifyJWT(verification_code);

    // check token expiration
    if (Date.now() <= decoded.exp + Date.now() + 60 * 60) {
      const user = await db.collection('users').updateOne({ email: decoded.email }, { $set: { status: '1', email_verified_at: Date.now() } });

      if (!user) return errorResMsg(res, 404, 'Email is not registered with us');
      if (user.status === 1) return errorResMsg(res, 401, `${decoded.email} has already been verified`);

      const data = { message: 'Email verification successful, You can now log in.' };
      return successResMsg(res, 200, data);
    }
    return errorResMsg(res, 400, 'Invalid or expired token');
  } catch (err) {
    logger.error(err.message);
    errorResMsg(res, 401, err.message);
  }
});

exports.loginAgent = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    logger.error('Please enter details correctly');
    return errorResMsg(res, 404, 'Please enter details correctly');
  }
  const { email, password } = req.body;

  try {
    const currentUser = await db.collection('users').findOne({ email }); // confirm user email
    if (currentUser == null) {
      logger.error(`${email} does not exist`);
      return errorResMsg(
        res,
        404,
        `${email} does not exist`, // if email is not found, return error msg
      );
    }
    if (currentUser.status === 0) {
      logger.error(`${email} is not verified, please verify before trying to login`);
      return errorResMsg(res, 401, `${email} is not verified, please verify before trying to login`);
    }
    if (currentUser.block) return errorResMsg(res, 401, `Agent with email-${email} is blocked!`);

    const valid = await bcrypt.compare(password, currentUser.password);
    if (!valid) return errorResMsg(res, 401, 'Password incorrect');

    const data = {
      email: currentUser.email,
      userId: currentUser._id.toString(),
      role: currentUser.role,
    };

    const time = '1h';
    const token = await jsonWT.signJWT(data, time);
    await db.collection('users').updateOne({ email: currentUser.email }, { $set: { verification_token: token } });
    return res.status(200).send({
      status: 'Success',
      data: {
        message: 'Login Successful',
        token,
      },
    });
  } catch (err) {
    logger.error(err.message);
    errorResMsg(res, 401, err.message);
  }
});

// exports.logout = function(req, res) {
//     res.cookie('jwt', '', {maxAge: 1});
//     res.redirect('/');
// }
