const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Real-time Chat Server\n');
});

const io = socketIo(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('message', (msg) => {
//     console.log("message in server: ", msg)
//     io.emit('message', msg); // Broadcast the message to all connected clients
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
  });
});


server.listen(80, () => {
  console.log('Server is running on http://localhost:3000');
});