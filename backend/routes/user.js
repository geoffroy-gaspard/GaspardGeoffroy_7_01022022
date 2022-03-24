const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

router.post('/sign-up', userCtrl.signUp);
router.post('/login', userCtrl.login);
router.get('/me/:id', authMiddleware.auth, userCtrl.userInfos);
router.get('/me', userCtrl.allAccounts);
router.delete('/me', authMiddleware.auth, userCtrl.deleteAccount);

module.exports = router;