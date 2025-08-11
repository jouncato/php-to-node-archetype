const express = require('express');
const authController = require('../controllers/authController');
const validationMiddleware = require('../middleware/validation');

const router = express.Router();

router.post('/login', validationMiddleware.validateLogin, authController.login);

module.exports = router;