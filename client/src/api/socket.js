import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3010');
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => {
    console.log('rrrrrrrrrr');
    return cb(timestamp);
  });
  socket.on('ooo', timestamp => {
    console.log('client', timestamp);
  });
  socket.emit('subscribeToTimer', 1000);
}
export { subscribeToTimer };