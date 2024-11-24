const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/user.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación
const syncLocal = require ('../middlewares/syncLocals');


// Ruta para obtener el perfil del usuario (puedes agregar más rutas según sea necesario)
router.get('/profile', getProfile);

// Ruta para listar usuarios
router.get('/all',authMiddleware, syncLocal, userController.listAllUsers);

//Ruta de comabio de rol
router.post('/:userId/change-role',authMiddleware, syncLocal, userController.changeRole)

// Tuta que deletea
router.post('/:userId/delete', authMiddleware, syncLocal, userController.deleteUser )

module.exports = router;
//obtener ruta  de perfil de usuario
