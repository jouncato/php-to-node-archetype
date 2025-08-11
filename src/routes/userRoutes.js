const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');

const router = express.Router();

// Rutas protegidas por autenticación
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, validationMiddleware.validateUserUpdate, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;