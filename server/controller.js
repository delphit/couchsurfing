const CouchsurfingAPI = require('./CSApi');
const io = require('socket.io');

let CouchsurfingApiInstance;
module.exports = {
  login: async function login(req, res) {
    const { username, password } = req.body;

    CouchsurfingApiInstance = new CouchsurfingAPI(username, password);
    const response = await CouchsurfingApiInstance._login();
    res.status(response.status).send({ message: response.message });
    return CouchsurfingApiInstance;
  },

  getSelfProfile: async function getSelfProfile(req, res) {
    const data = await CouchsurfingApiInstance.getSelfProfile();

    res.send({ data });
  },

  sendMessage: async function sendMessage(req, res) {
    const { title, message } = req.body;

    io.on('connection', client => {
      client.on('subscribeToTimer', interval => {
        client.broadcast.emit('timer', 'AAAAAAAAAAAAAAAAAAAAAAAA');
      });
    });
  },
};
