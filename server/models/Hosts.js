const mongoose = require('mongoose');

const HostsSchema = new mongoose.Schema({
  id: String,
  avatarUrl: String,
  isVerified: Boolean,
  responseRate: String,
  positiveReferenceCount: String,
  negativeReferenceCount: String,
});
/*
schema.statics.getHosts = function(page, skip, callback) {
  let hosts = [];
  const start = page * 10 + skip * 1;

  Hosts.find({}, 'twid active author avatar body date screenname', {
    skip: start,
    limit: 10,
  })
    .sort({ date: 'responseRate' })
    .exec(function(err, docs) {
      if (!err) {
        hosts = docs; // We got tweets
        hosts.forEach(function(tweet) {
          tweet.active = true; // Set them to active
        });
      }
      callback(hosts);
    });
};*/

module.exports =  mongoose.model('Hosts', HostsSchema);
