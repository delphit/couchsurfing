const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: "https://placeimg.com/640/480/nature" },
  name: { type: String },
  userID: { type: String },
  accessToken: { type: String },
  isVerified: { type: Boolean },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
