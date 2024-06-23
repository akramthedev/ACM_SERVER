console.clear();

const express = require('express');
const sql = require("mssql");
const log = require('node-file-logger');
// const http = require('http');
// const WebSocket = require('ws');
// const sql = require("mssql");
// const { log } = require('console');
const { connect } = require('./db');
const { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient } = require('./Infrastructure/ClientRepository');
const { GetProches, CreateProche, UpdateProche, DeleteProche } = require('./Infrastructure/ProcheRepository');
const { GetConjoint, CreateConjoint, UpdateConjoint, DeleteConjoint } = require('./Infrastructure/ConjointRepository');

// setup logger
let options = {
  timeZone: 'Africa/Casablanca',
  folderPath: './logs/',
  dateBasedFileNaming: true,
  // Required only if dateBasedFileNaming is set to false
  fileName: 'All_Logs',
  // Required only if dateBasedFileNaming is set to true
  fileNamePrefix: 'Logs_',
  fileNameSuffix: '',
  fileNameExtension: '.log',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss.SSS',
  logLevel: 'debug',
  onlyFileLogging: true
};
log.SetUserOptions(options); // Options are optional


require('./ClientController');
const app = express();
const cors = require('cors');
app.use(cors());

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

console.log('log to text');
log.Info('Server.js ready');

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

app.use(function (req, res, next) {
  req.testing = 'testing';
  return next();
});

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running, and App is listening on port " + PORT)
  else
    console.log("Error occurred, server can't start", error);
});
app.get("/", (request, response) => {
  response.status(200).send("Server works !!!!");
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
app.get("/GetClients", async (request, response) => {
  await GetClients(request.query.CabinetId)
    .then((res) => {
      // res = res.map(async (client) => {
      //   console.log("client before: ", client)
      //   await GetProches(client.ClientId)
      //     .then((resProche) => {
      //       client.Proches = resProche;
      //       console.log("proches: ", resProche.length)
      //       // return client;
      //     }, (errorProche) => {
      //       console.log("ErrorProche: ", errorProche)
      //       // return client;
      //     });
      //   console.log("client after: ",client)
      //   return client;
      // })
      response.status(200).send(res);
    })
    .catch((error) => response.status(400).send(error))
});
app.get("/GetClient", async (request, response) => {
  await GetClient(request.query.ClientId)
    .then((res) => {
      if (res != null && res.length > 0) {
        let client = res[0];
        GetProches(client.ClientId)
          .then((resProche) => {
            client.Proches = resProche;
            response.status(200).send(client);
          }, (errorProche) => {
            console.log("ErrorProche: ", errorProche)
            response.status(200).send(client);
          });
      }
      else
        response.status(200).send(null);
    })
    .catch((error) => response.status(400).send(error))
});
app.post("/CreateClient", async (request, response) => {
  await CreateClient(request.body)
    .then(async (res) => {
      if (res != null && res == true) {
        // create proches
        if (request.body.Proches != null && request.body.Proches.length > 0) {
          for (let i = 0; i < request.body.Proches.length; i++) {
            await CreateProche(request.body.Proches[i])
              .then((resProche) => { console.log("resProche: ", resProche); })
              .catch((errorProche) => { console.log("ErrorProche: ", errorProche); })
          }
        }
        // create conjoint
        if (request.body.Conjoint != null) {
          await CreateConjoint(request.body.Conjoint)
            .then((resConjoint) => { console.log("resConjoint: ", resConjoint); })
            .catch((errorConjoint) => { console.log("ErrorConjoint: ", errorConjoint); })
        }
      }
      response.status(200).send(res);
    })
    .catch((error) => response.status(400).send(error))
});
app.put("/UpdateClient", async (request, response) => {
  await UpdateClient(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.delete("/DeleteClient/:ClientId", async (request, response) => {
  await DeleteClient(request.params.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
//#endregion Client

//#region Proche
app.get("/GetProches", async (request, response) => {
  await GetProches(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.post("/CreateProche", async (request, response) => {
  await CreateProche(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.put("/UpdateProche", async (request, response) => {
  await UpdateProche(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.delete("/DeleteProche/:ProcheId", async (request, response) => {
  await DeleteProche(request.params.ProcheId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
//#endregion Proche

//#region Conjoint
app.get("/GetConjoint", async (request, response) => {
  await GetConjoint(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.post("/CreateConjoint", async (request, response) => {
  await CreateConjoint(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.put("/UpdateConjoint", async (request, response) => {
  await UpdateConjoint(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.delete("/DeleteConjoint/:ConjointId", async (request, response) => {
  await DeleteConjoint(request.params.ConjointId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
//#endregion Conjoint
