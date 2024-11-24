const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect(); // Desconectar cualquier conexión existente
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

const closeDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = { connectDB, closeDB };