const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

router.post('/sign-up', userCtrl.signUp);
router.post('/login', userCtrl.login);
router.get('/me', authMiddleware.auth, userCtrl.userInfos);

module.exports = router;