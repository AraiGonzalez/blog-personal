const request = require('supertest');
const { app, server } = require('../index'); 
const { connectDB, closeDB } = require('../config/jest.setup'); 
const User = require('../models/user'); // Importa el modelo de usuario
beforeAll(async () => {
  await connectDB(); // Conéctate a la base de datos en memoria antes de ejecutar las pruebas
});

afterAll(async () => {
  await closeDB(); // Cierra la conexión 
  if (server && server.close) {
    server.close(); // Cierra el serv
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
      .expect(302); 

    expect(response.headers.location).toBe('/auth/login'); 

    const user = await User.findOne({ username: userData.username });
    expect(user).not.toBeNull(); 
    expect(user.role).toBe('user'); 
  });

  test('should create an admin user', async () => {
    const adminData = {
      username: 'adminuser',
      password: 'adminpassword'
    };

    const response = await request(app)
      .post('/auth/create-admin')
      .send(adminData)
      .expect(201); 
    
    expect(response.body.message).toBe('Usuario administrador creado exitosamente');
    
    const adminUser = await User.findOne({ username: adminData.username });
    expect(adminUser).not.toBeNull();
    expect(adminUser.role).toBe('admin'); // Verifica que el rol sea 'admin'
  });
});