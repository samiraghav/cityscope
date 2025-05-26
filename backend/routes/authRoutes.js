const express = require('express');
const multer = require('multer');
const { signup, login } = require('../controllers/authController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', upload.single('image'), signup);
router.post('/login', login);

module.exports = router;
