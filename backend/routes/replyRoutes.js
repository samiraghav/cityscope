const express = require('express');
const { createReply, getReplies } = require('../controllers/replyController');
const multer = require('multer');
const router = express.Router();
const upload = multer();

router.post('/create', upload.none(), createReply);

router.get('/:postId', getReplies);

module.exports = router;
