const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, getPosts, reactToPost, replyToPost } = require('../controllers/postController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create', upload.single('image'), createPost);
router.get('/', getPosts);
router.post('/:id/react', reactToPost);
router.post('/:id/replies', replyToPost);

module.exports = router;
