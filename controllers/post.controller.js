const Post = require('../models/post'); // Importa el modelo de publicaciones
const { format } = require('date-fns'); // Importa la función format de date-fns


// Controlador para listar todas las publicaciones
exports.listAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author').populate({
      path: 'comments',
      populate: { path: 'author', select: 'username' } // Asegúrate de poblar el campo 'author' de los comentarios
    });
    
    // Formatea las fechas de las publicaciones y comentarios
    posts.forEach(post => {
      post.formattedCreatedAt = format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm');
      post.comments.forEach(comment => {
        comment.formattedCreatedAt = format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm');
      });
    });

    res.render('posts/all-post', { posts, userId: req.session.userId }); // Renderiza la vista all-post.pug con las publicaciones y el userId
  } catch (error) {
    res.status(500).send('Error al obtener las publicaciones'); // Maneja errores al obtener las publicaciones
  }
};

// Controlador para mostrar el formulario de creación de publicaciones
exports.showCreatePostForm = (req, res) => {
  res.render('posts/create-post'); // Renderiza la vista create-post.pug
};

// Controlador para crear una nueva publicación
exports.createPost = async (req, res) => {
  const { title, content, category } = req.body; // Asegúrate de incluir la categoría
  
  console.log('Categoría recibida:', category);
  console.log('resivi title:', title);
  console.log('resivi content:', content);
  console.log('Usuario en sesión:', req.session.userId);
  try {
    const post = new Post({
      title,
      content,
      author: req.session.userId,
      category // Añadi la categoría
    });

    await post.save();
    req.session.success_msg = 'Publicación creada exitosamente';
    res.redirect('/posts/all-post');
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    req.session.error_msg = 'Error al crear la publicación';
    res.redirect('/posts/create-post');
  }
};

// Controlador para mostrar el formulario de edición de publicaciones
exports.showEditPostForm = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Obtiene la publicación por ID
    if (!post) {
      req.session.error_msg = 'Publicación no encontrada'; // Almacena el mensaje de error en la sesión
      return res.redirect('/posts/all-post'); // Redirige a la vista de todas las publicaciones
    }
    res.render('posts/edit-post', { post }); // Renderiza la vista edit-post.pug con la publicación
  } catch (error) {
    req.session.error_msg = 'Error al obtener la publicación'; // Almacena el mensaje de error en la sesión
    res.redirect('/posts/all-post'); // Redirige a la vista de todas las publicaciones
  }
};

// Controlador para actualizar una publicación
exports.updatePost = async (req, res) => {
  const { title, content } = req.body; // Obtiene el título y el contenido del cuerpo de la solicitud
  if (!title || !content) { // Verifica si los campos están vacíos
    req.session.error_msg = 'Por favor, complete todos los campos'; // Almacena el mensaje de error en la sesión
    return res.redirect(`/posts/${req.params.id}/edit`); // Redirige al formulario de edición de publicaciones
  }
  try {
    await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true }); // Actualiza la publicación por ID
    req.session.success_msg = 'Publicación actualizada exitosamente'; // Almacena el mensaje de éxito en la sesión
    res.redirect('/posts/all-post'); // Redirige a la vista de todas las publicaciones
  } catch (error) {
    req.session.error_msg = 'Error al actualizar la publicación'; // Almacena el mensaje de error en la sesión
    res.redirect(`/posts/${req.params.id}/edit`); // Redirige al formulario de edición de publicaciones
  }
};

// Controlador para eliminar una publicación
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Obtiene la publicación por ID
    if (
      post.author.toString() === req.session.userId.toString() || 
      req.session.role === 'admin' // Verifica el rol del usuario actual
    ) {
      await Post.findByIdAndDelete(req.params.id); // Elimina la publicación por ID
      req.session.success_msg = 'Publicación eliminada exitosamente'; // Mensaje de éxito
    } else {
      req.session.error_msg = 'No tiene permiso para eliminar esta publicación'; // Mensaje de error
    }
    res.redirect('/posts/all-post'); // Redirige a la vista de todas las publicaciones
  } catch (error) {
    req.session.error_msg = 'Error al eliminar la publicación'; // Almacena el mensaje de error en la sesión
    res.redirect('/posts/all-post'); // Redirige a la vista de todas las publicaciones
  }
};
// Controlador para agregar un comentario a una publicación
exports.addComment = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const author = req.session.userId;

  console.log(postId);

  if (!content) {
    req.session.error_msg = 'El comentario no puede estar vacío';
    return res.redirect(`/posts/${postId}`);
  }

  try {
    const post = await Post.findById(postId).populate('comments.author');
    if (!post) {
      req.session.error_msg = 'Publicación no encontrada';
      return res.redirect('/posts/all-post');
    }

    const comment = { content, author };
    post.comments.push(comment);
    await post.save();

    req.session.success_msg = 'Comentario agregado exitosamente';
    res.redirect('/posts/all-post');
  } catch (error) {
    req.session.error_msg = 'Error al agregar el comentario';
    res.redirect('/posts/all-post');
  }
};

// Controlador para agregar un comentario a una publicación
exports.addCommentCategory = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const author = req.session.userId;

  console.log(postId);

  if (!content) {
    req.session.error_msg = 'El comentario no puede estar vacío';
    return res.redirect(`/posts/${postId}`);
  }

  if (!req.session.userId) {
    req.session.error_msg = 'Debes iniciar sesión para comentar.';
    return res.redirect('/auth/login');
  }

  try {
    const post = await Post.findById(postId).populate('comments.author');
    if (!post) {
      req.session.error_msg = 'Publicación no encontrada';
      return res.redirect('/posts/all-post');
    }

    const comment = { content, author };
    post.comments.push(comment);
    await post.save();

    req.session.success_msg = 'Comentario agregado exitosamente';
    res.redirect(`/posts/${postId}`);
  } catch (error) {
    req.session.error_msg = 'Error al agregar el comentario';
    res.redirect('/posts/all-post');
  }
};

// Buscar publicaciones
exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.query;
    const posts = await Post.find({ title: { $regex: query, $options: 'i' } });
    res.render('posts/all-post', { posts });
  } catch (err) {
    res.status(500).send('Error al buscar las publicaciones');
  }
};
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author') // Población del autor del post
      .populate({
        path: 'comments.author', // Población del autor de cada comentario
        model: 'User' // Nombre del modelo de usuario
      });

    if (!post) {
      req.session.error_msg = 'Publicación no encontrada';
      return res.redirect('/posts/all-post');
    }

    res.render('posts/postDetail', { post });
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Error al recuperar la publicación';
    res.redirect('posts/all-post');
  }
};