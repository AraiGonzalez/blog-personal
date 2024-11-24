const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authController = require('../controllers/auth.controller'); // Importa el controlador de autenticación
const authMiddleware = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación


// Ruta para listar todas las publicaciones
router.get('/all-post', authMiddleware, postController.listAllPosts);

// Ruta para mostrar el formulario de creación de publicaciones
router.get('/create-post', authMiddleware, postController.showCreatePostForm);

// Ruta para crear una nueva publicación
router.post('/create-post', authMiddleware, postController.createPost);

// Ruta para mostrar el formulario de edición de publicaciones
router.get('/:id/edit', authMiddleware, postController.showEditPostForm);

// Ruta para actualizar una publicación
router.post('/:id/edit', authMiddleware, postController.updatePost);

// Ruta para eliminar una publicación
router.post('/:id/delete', authMiddleware, postController.deletePost);
// Ruta para agregar un comentario a una publicación (protegida)
router.post('/:id/comment', authMiddleware, postController.addComment);

// Ruta para los comentarios del filtrado por category
router.post('/:id/comment/category',authMiddleware, postController.addCommentCategory);

// Ruta para buscar publicaciones
router.get('/search', authMiddleware, postController.searchPosts);

router.get('/:id', authMiddleware, postController.getPostById);

module.exports = router;