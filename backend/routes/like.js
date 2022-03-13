const express = require('express');
const likeCtrl = require('../controllers/like');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:post_id/like', authMiddleware.auth, likeCtrl.like);
router.get('/:post_id/dislike', authMiddleware.auth, likeCtrl.dislike);
router.get('/', authMiddleware.auth, likeCtrl.index);

module.exports = router;