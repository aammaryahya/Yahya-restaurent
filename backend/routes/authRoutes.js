const express = require('express');
const router = express.Router();
const { register, login, profile, deleteUser,
    updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);
router.delete("/:id", auth, role(['admin']), deleteUser);
router.post('/change-password', auth, changePassword);
router.put("/update-profile", auth, updateProfile);

module.exports = router;
