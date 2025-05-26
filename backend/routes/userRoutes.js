const express = require('express');
const router = express.Router();
const { getUserProfile,updateUserProfile, getPublicProfile } = require('../controllers/userController');

router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);
router.get('/:id/profile', getPublicProfile);

module.exports = router;
