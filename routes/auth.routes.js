const express = require('express');
const authController = require('../controllers/auth.controller'); // Importa el controlador de autenticación
const router = express.Router();

// Ruta para mostrar el formulario de registro
router.get('/register', authController.showRegisterForm);

// Ruta para manejar el registro de usuario
router.post('/register', authController.registerUser);

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', authController.showLoginForm);

// Ruta para manejar el inicio de sesión
router.post('/login', authController.login);

// Ruta para manejar el cierre de sesión
router.get('/logout', authController.logout);

//Ruta para crear usuario administrador
router.post('/create-admin', authController.createAdminUser);

module.exports = router;