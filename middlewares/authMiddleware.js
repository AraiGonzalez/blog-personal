// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.session.token; // Obtén el token de la sesión
  

  if (!token) {
    console.log("Token no encontrado. Redirigiendo al login.");
    return res.redirect('/auth/login');
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token en sesión:', req.session.token);
    console.log("Token decodificado:", decoded);
    // Guarda el `userId` y otros datos en `req.user` para usar en el controlador
    req.user = { userId: decoded.userId, role: decoded.role };
    // Pasa el userId y role a las vistas
    req.session.userId = decoded.userId; // Guarda el userId en la sesión
    req.session.role = decoded.role; // Guarda el role en la sesión
    next(); // Continúa al siguiente middleware o controlador
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.redirect('/auth/login'); // Si el token no es válido, redirige al login
  }
};

