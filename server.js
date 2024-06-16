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
  // console.log('middleware');
  // console.log(req.url);
  // console.log(req.baseUrl);
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
app.get("/GetClients", (request, response) => {
  // console.log("/GetClients");
  new sql.Request()
    .input("CabinetId", sql.UniqueIdentifier, request.query.CabinetId)
    .execute('ps_get_clients')
    .then((result) => {
      setTimeout(() => {
        response.status(200).send(result.recordset);
      }, 1000);
    })
    .catch((error) => {
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.post("/CreateClient", (request, response) => {
  // console.log("/CreateClient");
  new sql.Request()
    .input("ClientId", sql.UniqueIdentifier, request.body.ClientId)
    .input("CabinetId", sql.UniqueIdentifier, request.body.CabinetId)
    .input("Nom", sql.NVarChar(255), request.body.Nom)
    .input("Prenom", sql.NVarChar(255), request.body.Prenom)
    .input("DateNaissance", sql.Date, request.body.DateNaissance)
    .input("Profession", sql.NVarChar(255), request.body.Profession)
    .input("DateRetraite", sql.Date, request.body.DateRetraite)
    .input("NumeroSS", sql.NVarChar(20), request.body.NumeroSS)
    .input("Adresse", sql.NVarChar(255), request.body.Adresse)
    .input("Email1", sql.NVarChar(100), request.body.Email1)
    .input("Email2", sql.NVarChar(100), request.body.Email2)
    .input("Telephone1", sql.NVarChar(20), request.body.Telephone1)
    .input("Telephone2", sql.NVarChar(20), request.body.Telephone2)
    .input("HasConjoint", sql.Bit, request.body.HasConjoint)
    .execute('ps_create_client')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      console.log(error?.originalError)
      console.log(error?.originalError?.info)
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.put("/UpdateClient", (request, response) => {
  // console.log("/CreateClient");
  new sql.Request()
    .input("ClientId", sql.UniqueIdentifier, request.body.ClientId)
    .input("Nom", sql.NVarChar(255), request.body.Nom)
    .input("Prenom", sql.NVarChar(255), request.body.Prenom)
    .input("DateNaissance", sql.Date, request.body.DateNaissance)
    .input("Profession", sql.NVarChar(255), request.body.Profession)
    .input("DateRetraite", sql.Date, request.body.DateRetraite)
    .input("NumeroSS", sql.NVarChar(20), request.body.NumeroSS)
    .input("Adresse", sql.NVarChar(255), request.body.Adresse)
    .input("Email1", sql.NVarChar(100), request.body.Email1)
    .input("Email2", sql.NVarChar(100), request.body.Email2)
    .input("Telephone1", sql.NVarChar(20), request.body.Telephone1)
    .input("Telephone2", sql.NVarChar(20), request.body.Telephone2)
    .input("HasConjoint", sql.Bit, request.body.HasConjoint)
    .execute('ps_update_client')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.delete("/DeleteClient/:ClientId", (request, response) => {
  new sql.Request()
    .input("ClientId", sql.UniqueIdentifier, request.params.ClientId)
    .execute('ps_delete_client')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send(error?.originalError?.info?.message);
    })
});
//#endregion Client

//#region Proche
app.get("/GetProches", (request, response) => {
  new sql.Request()
    .input("ClientId", sql.UniqueIdentifier, request.query.ClientId)
    .execute('ps_get_proches')
    .then((result) => {
      setTimeout(() => {
        response.status(200).send(result.recordset);
      }, 1000);
    })
    .catch((error) => {
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.post("/CreateProche", (request, response) => {
  // console.log("/CreateProche");
  new sql.Request()
    .input("ProcheId", sql.UniqueIdentifier, request.body.ProcheId)
    .input("ClientId", sql.UniqueIdentifier, request.body.ClientId)
    .input("Nom", sql.NVarChar(100), request.body.Nom)
    .input("Prenom", sql.NVarChar(100), request.body.Prenom)
    .input("DateNaissance", sql.Date, request.body.DateNaissance)
    .input("Telephone1", sql.NVarChar(20), request.body.Telephone1)
    .input("Telephone2", sql.NVarChar(20), request.body.Telephone2)
    .input("Email1", sql.NVarChar(100), request.body.Email1)
    .input("Email2", sql.NVarChar(100), request.body.Email2)
    .input("Adresse", sql.NVarChar(255), request.body.Adresse)
    .input("Charge", sql.Bit, request.body.Charge)
    .input("LienParente", sql.NVarChar(100), request.body.LienParente)
    .input("Particularite", sql.NVarChar(100), request.body.Particularite)
    .input("NombreEnfant", sql.NVarChar(255), request.body.NombreEnfant)
    .input("Commentaire", sql.NVarChar(255), request.body.Commentaire)
    .execute('ps_create_Proche')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      console.log(error?.originalError)
      console.log(error?.originalError?.info)
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.put("/UpdateProche", (request, response) => {
  // console.log("/CreateProche");
  new sql.Request()
    .input("ProcheId", sql.UniqueIdentifier, request.body.ProcheId)
    .input("Nom", sql.NVarChar(100), request.body.Nom)
    .input("Prenom", sql.NVarChar(100), request.body.Prenom)
    .input("DateNaissance", sql.Date, request.body.DateNaissance)
    .input("Telephone1", sql.NVarChar(20), request.body.Telephone1)
    .input("Telephone2", sql.NVarChar(20), request.body.Telephone2)
    .input("Email1", sql.NVarChar(100), request.body.Email1)
    .input("Email2", sql.NVarChar(100), request.body.Email2)
    .input("Adresse", sql.NVarChar(255), request.body.Adresse)
    .input("Charge", sql.Bit, request.body.Charge)
    .input("LienParente", sql.NVarChar(100), request.body.LienParente)
    .input("Particularite", sql.NVarChar(100), request.body.Particularite)
    .input("NombreEnfant", sql.NVarChar(255), request.body.NombreEnfant)
    .input("Commentaire", sql.NVarChar(255), request.body.Commentaire)
    .execute('ps_update_proche')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      response.status(400).send(error?.originalError?.info?.message);
    })
});

app.delete("/DeleteProche/:ProcheId", (request, response) => {
  new sql.Request()
    .input("ProcheId", sql.UniqueIdentifier, request.params.ProcheId)
    .execute('ps_delete_proche')
    .then((result) => {
      response.status(200).send(result.rowsAffected[0] > 0);
    })
    .catch((error) => {
      // console.log(error)
      response.status(400).send(error?.originalError?.info?.message);
    })
});
//#endregion Proche


