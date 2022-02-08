const express = require('express');
const postCtrl = require('../controllers/post');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware.auth, postCtrl.save);
router.get('/:id', postCtrl.show);
router.get('/', postCtrl.index);
router.patch('/:id', authMiddleware.auth, postCtrl.update);
router.delete('/:id', authMiddleware.auth, postCtrl.destroy);

module.exports = router;