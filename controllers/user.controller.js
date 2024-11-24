
const User = require('../models/user');

exports.getProfile = async (req, res) => {
    // Para este ejemplo, simplemente renderizaremos una vista de perfil
    // En una aplicación real, deberías obtener el usuario autenticado de una sesión o token
    const username = 'Usuario de Ejemplo'; // Esto debería ser dinámico según el usuario autenticado
    res.render('users/profile', { username });
};

// Controlador para listar todos los usuarios
exports.listAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Asegúrate de que esta consulta devuelve datos reales
        console.log('lista:', users);
        res.render('users/all-users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al listar usuarios');
    }
};
// Cambiar el rol del usuario
exports.changeRole = async (req, res) => {
    try {
        // Obtenemos el ID del usuario y el nuevo rol desde los parámetros de la URL
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
        return res.status(404).send('Usuario no encontrado');
        }

        // Cambiar el rol (de 'user' a 'admin' o viceversa)
        user.role = user.role === 'user' ? 'admin' : 'user';
        await user.save();
        // Redirigir de nuevo a la lista de usuarios
        res.redirect('/users/all');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cambiar el rol');
    }
};

// Controlador para eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        // Obtener el ID del usuario desde los parámetros de la URL
        const { userId } = req.params;
        
        // Buscar y eliminar el usuario
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Redirigir a la lista de usuarios después de eliminar el usuario
        res.redirect('/users/all');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el usuario');
    }
};