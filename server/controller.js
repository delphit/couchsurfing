const CouchsurfingAPI = require('./CSApi');

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
    return CouchsurfingApiInstance;
  },

  getHostsList: async function getHostsList(req, res) {
    const { values, address} = req.body;
    const params = {
      perPage: values.perPage,
      placeDescription: address,
      radius: 10,
      sort: 'best_match',
      couchStatus: 'yes,maybe',
      minGuestsWelcome: values.minGuestsWelcome,
    };
    const response = await CouchsurfingApiInstance.getHostsList(params);
    res.send({  message: response });
  },
};
