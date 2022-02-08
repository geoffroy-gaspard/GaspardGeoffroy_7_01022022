const express = require('express');
const commentController = require('../controllers/comment');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/", commentController.save);
router.get("/", commentController.index);
router.get("/:id", commentController.show);
router.patch("/:id", authMiddleware.auth, commentController.update);
router.delete("/:id", authMiddleware.auth, commentController.destroy);

module.exports = router;