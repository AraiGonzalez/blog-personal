const express = require('express');
const path = require('path');
const dotenv =require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');

//Importaciones locales
const authRoutes = require('./routes/auth.routes'); // Importa las rutas de autenticación
const postRoutes = require('./routes/post.routes'); // Importa las rutas de publicaciones
const testRoutes = require('./routes/test.routes'); // Nueva ruta de prueba
const filterRoutes = require('./routes/filter.routes');
const authMiddleware = require('./middlewares/authMiddleware');
const syncLocal = require ('./middlewares/syncLocals');
const userRoutes = require('./routes/user.routes');
dotenv.config({path:'./config.env'});


const app = express();

// Conectar a MongoDB solo si no estamos en un entorno de prueba
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(`${process.env.DB_CONNECTION}/blog-personal`)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB', err));
}

// Configuraciones
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('basedir', path.join(__dirname, 'views')); // Configura el basedir


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: false
}));

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.session.success_msg; // Pasa el mensaje de éxito a las vistas
  res.locals.error_msg = req.session.error_msg; // Pasa el mensaje de error a las vistas
  res.locals.userId = req.session.userId; // Pasa el userId a las vistas
  res.locals.role = req.session.role; // Pasa el role a las vistas
  delete req.session.success_msg; // Elimina el mensaje de éxito de la sesión
  delete req.session.error_msg; // Elimina el mensaje de error de la sesión
  next(); // Pasa al siguiente middleware
});


// Rutas protegidas
app.use('/posts', authMiddleware, syncLocal, postRoutes); // Usa las rutas de publicaciones
app.use('/filter', authMiddleware, syncLocal, filterRoutes)// Usar ruta de filtrado
app.use('/users', userRoutes);//Usa ruta de usuario

// Rutas publicas:
app.use('/auth', authRoutes);
app.use('/test', testRoutes); // Usar la nueva ruta de prueba


// Ruta principal
app.get('/', (req, res) => {
  res.render('index'); // Renderiza la vista index.pug
});
let server;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server }; // Exporta la aplicación y el servidor