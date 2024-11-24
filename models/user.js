const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//----------------------------------------//
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String, 
    required: true,
    enum: ['admin','user'],
    default:'user'
  }
});
//--------------------------------------//

// Método para comparar la contraseña
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;