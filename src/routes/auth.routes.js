const { Router } = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

const router = Router();
router.post('/register', register);
router.post('/login', login);
// auth.routes.js
router.get('/roles', (req, res) => {res.json(['admin', 'cocinero', 'mesero']); });
router.get('/profile', verifyToken, profile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
