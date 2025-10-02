// User.js - Mongoose Model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true, 
  },
  password: {
    type: String, 
    required: true,
  },
  dob: { 
    type: Date,
    required: true,
  },
  docType: { 
    type: String,
    required: true,
  },
  document: { 
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0 // Inicia com 0 pontos por padrão
  },
  profileMissionCompleted: { 
      type: Boolean,
      default: false,
  },
  phone: { 
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  createdAt: { 
    type: Date,
    default: Date.now,
  },
});


UserSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    return false;
  }
};

// Export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
