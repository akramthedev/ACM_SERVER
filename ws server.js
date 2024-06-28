console.clear();

const http = require('http');
const WebSocket = require('ws');
// const sql = require("mssql");

const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log("on connection")
  ws.on('message', function incoming(data) {
    console.log("on message, data: ", data)
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})

server.listen(port, function () {
  console.log(`WebSocket Server is listening on ${port}!`)
})

