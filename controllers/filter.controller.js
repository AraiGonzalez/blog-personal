// Importa el models
const Post = require('../models/post'); 

const User = require('../models/user');

// endpoints
exports.getPostsByUsername = async (req, res) => {
    const { username } = req.query; // Obtiene el username
    
    try {
      // buscamos al usuario por el username
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).render(
            'filter/error', { error_msg: 'No se encontró un usuario con ese nombre.' 
            }); // Redirecciona error.pug
      }
  
      // Si encontramos el usuario, usamos su _id para buscar las publicaciones
      const posts = await Post.find({ author: user._id }).populate('author', 'username');
      
      if (posts.length === 0) {
        return res.render('filter/error', { error_msg: 'No se encontraron publicaciones para este autor.' });
      }
      
      // Devolvemos las publicaciones en formato JSON
      res.render('filter/author', { posts });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las publicaciones.');
    }
  };



exports.getPostsByCategory = async (req, res) => {
  const { category } = req.query; // Obtiene la categoría de la consulta en la URL
  
  if (!category) {
    req.session.error_msg = 'Por favor, proporcione una categoría.';
    return res.redirect('/posts/all-post'); // Redirige si no se proporciona una categoría
  }

  try {
    // Busca las publicaciones que coincidan con la categoría
    const posts = await Post.find({ category })
      .populate('author', 'username') // Población del autor de la publicación
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' } // Población del autor de cada comentario
      });
    
    if (posts.length === 0) {
      req.session.error_msg = `No se encontraron publicaciones en la categoría "${category}".`;
      return res.redirect('/posts/all-post'); // Redirige si no hay resultados
    }
    
    res.render('filter/category', { posts, category }); // Renderiza una vista con las publicaciones filtradas
  } catch (error) {
    console.error('Error al filtrar publicaciones por categoría:', error);
    req.session.error_msg = 'Error al filtrar publicaciones por categoría.';
    res.redirect('/posts/all-post');
  }
};  