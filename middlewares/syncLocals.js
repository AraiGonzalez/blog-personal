// Middleware para sincronizar res.locals con req.session
module.exports = (req, res, next) => {
    res.locals.userId = req.session.userId || null; // Asegura un valor por defecto
    res.locals.role = req.session.role || null;     // Asegura un valor por defecto
    next();
};