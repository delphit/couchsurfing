const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const CouchsurfingAPI = require('./CSApi');

const router = require('./router');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/couchsurfing', err => {
  if (err) {
    console.log('Could not connect to database: ', err);
  } else {
    console.log('Connected to database');
  }
});
mongoose.set('debug', true);

const app = express();

app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.set('port', process.env.PORT || 3010);

const server = app.listen(app.get('port'), () => {
  console.log(`The app is listening on port ${app.get('port')}`);
});
const io = require('socket.io')(server);

io.on('connection', client => {
  client.on('getHosts', async (values, address) => {
    const { perPage } = values;
    console.log('Get Hosts - perPage, address', perPage, address);

    let CouchsurfingApiInstance = new CouchsurfingAPI(
      'mykola.mykhailyshyn@gmail.com',
      'm12345678',
    );
    const response = await CouchsurfingApiInstance._login();
    return CouchsurfingApiInstance.getHosts(params)
      .then(hosts => {
        console.log('hosts', hosts);
        client.emit('getConversions', hosts);
      })
      .catch(e => console.log('allalalalallalalala', e));
  });
});
