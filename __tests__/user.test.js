const request = require('supertest');
const { app, server } = require('../app'); // Importa la aplicación y el servidor
const { connectDB, closeDB } = require('../config/jest.setup'); // Importa las funciones de conexión
const User = require('../models/user'); // Importa el modelo de usuario
beforeAll(async () => {
  await connectDB(); // Conéctate a la base de datos en memoria antes de ejecutar las pruebas
});

afterAll(async () => {
  await closeDB(); // Cierra la conexión después de que todas las pruebas se hayan ejecutado
  if (server && server.close) {
    server.close(); // Cierra el servidor después de que todas las pruebas se hayan ejecutado
  }
});

describe('Auth Routes', () => {
  test('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData)
      .expect(302); // Verifica que haya una redirección después del registro

    expect(response.headers.location).toBe('/auth/login'); // Verifica que redirige al login

    const user = await User.findOne({ username: userData.username });
    expect(user).not.toBeNull(); // Verifica que el usuario se haya creado
    expect(user.role).toBe('user'); // Verifica que el rol sea 'user' por defecto
  });

  test('should create an admin user', async () => {
    const adminData = {
      username: 'adminuser',
      password: 'adminpassword'
    };

    const response = await request(app)
      .post('/auth/create-admin')
      .send(adminData)
      .expect(201); // Verifica que se crea correctamente
    // Verifica que la respuesta contenga el mensaje esperado
    expect(response.body.message).toBe('Usuario administrador creado exitosamente');
    // Verifica que el usuario administrador se haya creado en la base de datos
    const adminUser = await User.findOne({ username: adminData.username });
    expect(adminUser).not.toBeNull();
    expect(adminUser.role).toBe('admin'); // Verifica que el rol sea 'admin'
  });
});