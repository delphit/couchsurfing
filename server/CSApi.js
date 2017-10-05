const crypto = require('crypto');
const utf8 = require('utf8');
const axios = require('axios');

const User = require('./models/User');

const CS_URL = 'https://hapi.couchsurfing.com';
const PRIVATE_KEY = 'v3#!R3v44y3ZsJykkb$E@CG#XreXeGCh';


class CouchsurfingAPI {
  constructor(username, password, userID, accessToken) {
    this.loggedIn = false;

    if (username === undefined || password === undefined) {
      throw new Error('Username and password should be not undefined');
    }

    this.password = password;
    this.username = username;

    if (userID !== undefined && accessToken !== undefined) {
      this.userID = userID;
      this.accessToken = accessToken;
    }
    if (accessToken === undefined) {
      console.log('UNAUTHORIZED!', accessToken)
    }
  }

  static _getUrlSignature(secretKey, msg) {
    return crypto
      .createHmac('sha1', utf8.encode(secretKey))
      .update(utf8.encode(msg))
      .digest('hex');
  }

  async _login() {
    if (this.loggedIn !== true) {
      const loginPayload = {
        actionType: 'manual_login',
        credentials: { authToken: this.password, email: this.username },
      };

      const signature = CouchsurfingAPI._getUrlSignature(
        PRIVATE_KEY,
        '/api/v3/sessions' + JSON.stringify(loginPayload),
      );

      this.headers = {
        Accept: 'application/json',
        'X-CS-Url-Signature': signature,
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en;q=1',
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent':
          'Dalvik/2.1.0 (Linux; U; Android 5.0.1; Android SDK built for x86 Build/LSX66B) Couchsurfing/android/20141121013910661/Couchsurfing/3.0.1/ee6a1da',
      };

      return await axios({
        method: 'post',
        url: `${CS_URL}/api/v3/sessions`,
        data: JSON.stringify(loginPayload),
        headers: this.headers,
      })
        .then(async (e) => {
          const { sessionUser } = e.data;
          this.userID = sessionUser.id;
          this.accessToken = sessionUser.accessToken;
          this.loggedIn = true;
          const getUserProfile = await this.getSelfProfile();
          const createUser = new User({
            username: this.username,
            password: this.password,
            userID: sessionUser.id,
            accessToken: sessionUser.accessToken,
            avatarUrl: getUserProfile.avatarUrl,
            name: getUserProfile.publicName,
            isVerified: getUserProfile.isVerified
          });
          // createUser.save((err) => {
          //   if (err) {
          //     console.log('Error when we save user', err);
          //   }
          // });

          return {
            status: 200,
            message: 'User successfully logged in',
          };
        })
        .catch((e) => {
          return {
            status: 301,
            message: `Wrong password ${e}`,
          };
        });
    } else {
      throw new Error('User already logged in');
    }
  }

  async apiRequest(path) {
    const signature = CouchsurfingAPI._getUrlSignature(
      `${PRIVATE_KEY}.${this.userID}`,
      path,
    );

    this.headers = Object.assign({}, this.headers, {
      'X-CS-Url-Signature': signature,
      'X-Access-Token': this.accessToken,
    });

    const dataResponse = await axios({
      method: 'get',
      url: `${CS_URL}${path}`,
      headers: this.headers,
    });
    return dataResponse.data;
  }

  getSelfProfile() {
    const path = `/api/v3/users/${this.userID}`;
    return this.apiRequest(path);
  }

  getProfileById(userID) {
    const path = `/api/v3/users/${userID}`;

    return this.apiRequest(path);
  }

  getReferences(userID = this.userID, type = 'other_and_friend') {
    const path = `/api/v3/users/${userID}/references?perPage=999999&relationshipType=${type}&includeReferenceMeta=true`;

    return this.apiRequest(path);
  }

  sendMessage(userID = this.userID, title, message) {
    const path = `/api/v2.1/users/${userID}/conversations/`;
    const data = {
      title,
      message
    };

    return this.apiRequest(path, "post", data);
  }

  getHostsList(obj) {
    const params = Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
    const path = `/api/v3/users/search?${params}`;
    return this.apiRequest(path);
  }
}

async function test() {
  const API = new CouchsurfingAPI('nzoakhvi@sharklasers.com', 'qwerty');
  await API._login();
}

module.exports = CouchsurfingAPI;
