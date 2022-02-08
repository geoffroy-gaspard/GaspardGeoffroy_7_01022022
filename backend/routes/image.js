const express = require('express');
const imageCtrl = require('../controllers/image');
const imageUploader = require('../helpers/image-uploader');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/uploads', authMiddleware.auth, imageUploader.upload.single('image'), imageCtrl.upload);

module.exports = router;