import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3010');
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => {
    return cb(timestamp);
  });
  socket.on("getConversions", data => {
    console.log('data', data);
  });
}

export { subscribeToTimer };