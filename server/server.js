const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./router');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

app.set('port', process.env.PORT || 3010);

const server = app.listen(app.get('port'), () => {
  console.log(`The app is listening on port ${app.get('port')}`);
});
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('subscribeToTimer', interval => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
  client.on('hey', interval => {
    console.log('EMMMMMMIIIIITTT', interval);
    client.emit('ooo', 'ddddddddddddddddddddddddddddddddddddddddddd');
  });
});
