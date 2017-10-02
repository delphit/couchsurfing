const CouchsurfingAPI = require('./CSApi');

let CouchsurfingApiInstance;

module.exports = {
  login: async function login(req, res) {
    const { username, password } = req.body;

    CouchsurfingApiInstance = new CouchsurfingAPI(username, password);
    const a = await CouchsurfingApiInstance._login();

    res.send({ message: 'User successfully logged in', a});
  },

  getSelfProfile: async function getSelfProfile(req, res) {
    const data = await CouchsurfingApiInstance.getSelfProfile();

    res.send({ data });
  }
};
