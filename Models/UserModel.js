const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    userType: { type: String, enum: ['student', 'employer', 'placement officer'], required: true },
    password: { type: String, required: true }
  }, { timestamps: true });  

module.exports = mongoose.model('User', UserSchema);