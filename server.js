console.clear();

const express = require('express');
const sql = require("mssql");
// const http = require('http');
// const WebSocket = require('ws');
// const sql = require("mssql");
const { log } = require('console');
const { connect } = require('./db');
require('./ClientController');
const app = express();

const PORT = 3000;
// const server = http.createServer(express);
// const wss = new WebSocket.Server({ server });

(async () => { // Immediately-invoked async function expression (IIFE)
  try {
    await connect(); // Call the connect function to establish the database connection
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1); // Exit the application if connection fails
  }
})();


// wss.on('connection', function connection(ws) {
//   console.log("on connection")
//   ws.on('message', function incoming(data) {
//     console.log("on message, data: ", data)
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(data);
//       }
//     })
//   })
// })

// server.listen(port, function () {
//   console.log(`WebSocket Server is listening on ${port}!`)
// })


app.use(express.json());
app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running, and App is listening on port " + PORT)
  else
    console.log("Error occurred, server can't start", error);
});

app.get("/cabinets", (request, response) => {
  console.log("/cabinets")
  // Execute a SELECT query
  new sql.Request().query("SELECT * FROM Cabinet", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
    } else {
      response.send(result.recordset); // Send query result as response
      console.log(result.recordset[0]);
    }
  });
});

//#region Client
app.get("/GetClients", (request, response) => {
  console.log("/GetClients");
  new sql.Request()
    .input("CabinetId", sql.UniqueIdentifier, request.body.CabinetId)
    .execute('ps_get_clients')
    .then((result) => {
      response.status(200).send(result.recordsets);
    })
    .catch((error) => {
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.post("/CreateClient", (request, response) => {
  console.log("/CreateClient");
  new sql.Request()
    .input("ClientId", sql.UniqueIdentifier, request.body.ClientId)
    .input("CabinetId", sql.UniqueIdentifier, request.body.CabinetId)
    .input("Nom", sql.NVarChar(255), request.body.Nom)
    .input("Prenom", sql.NVarChar(255), request.body.Prenom)
    .execute('ps_create_client')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      response.status(400).send(error?.originalError?.info?.message);
    })
});
//#endregion Client


