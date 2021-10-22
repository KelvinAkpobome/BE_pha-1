const express = require('express');
const router = express.Router();
router.use(express.json());
const agent = require('../controllers/agentsController');



//Registration handle
router.post('/register/agent', agent.registerAgent);
// router.post('/register/client', Auth.registerClient);

//login handle
router.post('/login', agent.loginAgent);
router.get('/email/verify/', agent.verifyEmail);

// //logout handle
// router.get('/logout', Auth.logout);

// //forgot password
// router.post('/password-reset', Auth.passwordReset);

module.exports = router;