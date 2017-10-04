const Hosts = require('./models/models');

module.exports = function(stream, io) {
  stream.on('data', function(data) {
    if (data['user'] !== undefined) {
      const hosts = {
        twid: data['id_str'],
        active: false,
        author: data['user']['name'],
        avatar: data['user']['profile_image_url'],
        body: data['text'],
        date: data['created_at'],
        screenname: data['user']['screen_name'],
      };
      const hostsEntry = new Hosts(hosts);
      hostsEntry.save(function(err) {
        if (!err) {
          io.emit('tweet', hosts);
        }
      });
    }
  });
};
