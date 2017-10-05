const mongoose = require('mongoose');

const HostsSchema = new mongoose.Schema({
  id: String,
  avatarUrl: String,
  publicName: String,
  isVerified: Boolean,
  responseRate: String,
  daysSinceLastActivity: Number,
  positiveReferenceCount: String,
  negativeReferenceCount: String,
});

module.exports =  mongoose.model('Hosts', HostsSchema);
