const User = require('../models/user'); // Importa el modelo de usuario
const jwt = require('jsonwebtoken');// Biblioteca para la gestion de JWT(Json Web Tokens)
const bcrypt = require('bcrypt');

// Función para generar el token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Controlador para mostrar el formulario de registro
exports.showRegisterForm = (req, res) => {
  res.render('auth/register'); // Renderiza la vista register.pug
};
//-----------------------------------------------------------------//
// Controlador para manejar el registro de usuario
exports.registerUser = async (req, res) => {
  let { username, password, role } = req.body;
  
  try {
    role= role || 'user' // Si no se especifica un rol, se asigna 'user' como valor por defecto
    const hashedPassword = await bcrypt.hash(password, 10); // Encripta la contraseña
    const user = new User({ username, password: hashedPassword, role }); // Crea un nuevo usuario con la contraseña encriptada, y establese su rol
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).send('Rol no válido');
    }
    await user.save(); // Guarda el usuario en la base de datos
    res.redirect('/auth/login'); // Redirige al formulario de inicio de sesión después del registro
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).send('Error al registrar usuario');
  }
};
//---------------------------------------------------------------------//

// Controlador para mostrar el formulario de inicio de sesión
exports.showLoginForm = (req, res) => {
  res.render('auth/login'); // Renderiza la vista login.pug
};
//-----------------------------------------------------------------------//
// Controlador para manejar el inicio de sesión
exports.login = async (req, res) => {
  const { username, password } = req.body; // Obtiene el nombre de usuario y la contraseña del cuerpo de la solicitud
  if (!username || !password) { // Verifica si los campos están vacíos
    req.session.error_msg = 'Por favor, complete todos los campos'; // Almacena el mensaje de error en la sesión
    return res.redirect('/auth/login'); // Redirige al formulario de inicio de sesión
  }
  try {
    const user = await User.findOne({ username }); // Busca el usuario por nombre de usuario
    if (!user || !(await user.comparePassword(password))) { // Verifica si el usuario no existe o la contraseña es incorrecta
      req.session.error_msg = 'Nombre de usuario o contraseña incorrectos'; // Almacena el mensaje de error en la sesión
      return res.redirect('/auth/login'); // Redirige al formulario de inicio de sesión
    }
    // Crea el JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },  // Información a guardar en el token (puedes agregar más campos)
      process.env.JWT_SECRET,  // La clave secreta (defínela en tu archivo .env)
      { expiresIn: '1h' }      // El token expira en 1 hora
    );
    console.log(`El token emitido es : ${token}`)

    req.session.token = token; // Almacena el token JWT en la sesión
    console.log('Token del usuario almacenado en la sesión:', req.session.token);
    req.session.success_msg = 'Inicio de sesión exitoso'; // Almacena el mensaje de éxito en la sesión
    console.log('Sesión después de almacenar el token:', req.session);
    res.redirect('/posts/all-post'); // Redirige a la vista de todas las publicaciones
  } catch (error) {
    console.error('Error al iniciar sesión:', error); // Agrega un mensaje de consola para errores
    req.session.error_msg = 'Error al iniciar sesión'; // Almacena el mensaje de error en la sesión
    res.redirect('/auth/login'); // Redirige al formulario de inicio de sesión
  }
};
//----------------------------------------------------------------------------------------------------------------------------------//
// Controlador para manejar el cierre de sesión
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
      return res.status(500).send('Error al cerrar sesión. Intenta nuevamente.');
    }
    res.clearCookie('connect.sid'); // Elimina la cookie de sesión del cliente
    res.redirect('/auth/login'); // Redirige al formulario de inicio de sesión
  });
};
///------------------------------------------------------------------------------------///
// Controlador para crear un usuario administrador
exports.createAdminUser = async (req, res) => {
  let { username, password } = req.body; // Obtiene los datos del cuerpo de la solicitud
  
  if (!username || !password) {
    return res.status(400).send('Por favor, ingrese un nombre de usuario y una contraseña.');
  }

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('El nombre de usuario ya está registrado.');
    }

    // Asigna el rol de 'admin' de manera predeterminada
    const role = 'admin';

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario administrador
    const user = new User({
      username,
      password: hashedPassword,
      role
    });

    // Guarda el usuario en la base de datos
    await user.save();

    // Responde con un mensaje de éxito
    res.status(201).json({
      message: 'Usuario administrador creado exitosamente',
      user: {
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
    res.status(500).send('Error al crear usuario administrador');
  }
};
///------------------------------------------------------------------------------------///