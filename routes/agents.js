const express = require('express');

const router = express.Router();
const agent = require('../controllers/agentsController');

router.post('/register/agent', agent.registerAgent);
router.post('/login/agent', agent.loginAgent);
// router.get('/', (req, res) => {
//     return res.status(200).send('Welcome to PHA API')
// });

//   router.post('/only-owner', verifyToken, checkIsValidUser, requireRoles(['owner']), (req, res) => {
//     res.status(200).json({
//       status: 'success',
//       message: 'Logged in user is owner, and hence, is granted access.',
//     });
//   });

//   router.post('/only-user', verifyToken, checkIsValidUser, requireRoles(['user']), (req, res) => {
//     res.status(200).json({
//       status: 'success',
//       message: 'Logged in user is user, and hence, is granted access.',
//     });
//   });

module.exports = router;
