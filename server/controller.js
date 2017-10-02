const CouchsurfingAPI = require('./CSApi');

let CouchsurfingApiInstance;

module.exports = {
  login: async function login(req, res) {
    const { username, password } = req.body;

    CouchsurfingApiInstance = new CouchsurfingAPI(username, password);
    const response = await CouchsurfingApiInstance._login();
    res.status(response.status).send({ message: response.message });
  },

  getSelfProfile: async function getSelfProfile(req, res) {
    const data = await CouchsurfingApiInstance.getSelfProfile();

    res.send({ data });
  }
};
