const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter.controller');

// Ruta para obtener las publicaciones de un autor por su username
router.get('/author', filterController.getPostsByUsername);

router.get('/category', filterController.getPostsByCategory);

module.exports = router;