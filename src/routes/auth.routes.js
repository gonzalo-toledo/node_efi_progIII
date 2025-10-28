const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword,
  updateProfile
} = require('../controllers/auth.controller');

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/roles', (req, res) => {res.json(['admin', 'cocinero', 'mesero', 'cajero']); });
router.get('/profile', verifyToken, profile);
router.put('/update-profile', verifyToken, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
