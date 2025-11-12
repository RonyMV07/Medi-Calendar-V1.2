const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hasheada
  preferencias_ux: { type: Object, default: {} }, // Ej: { tema: 'dark' },
  fecha_registro: { type: Date, default: Date.now }
});

// Hash de contraseña pre-guardado
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
