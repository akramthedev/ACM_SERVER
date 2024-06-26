console.clear();

const express = require('express');
const sql = require("mssql");
const log = require('node-file-logger');
const fs = require('fs');
const fileUpload = require('express-fileupload');
// const upload = require('./Helper/upload');
// const http = require('http');
// const WebSocket = require('ws');
// const sql = require("mssql");
const { connect } = require('./db');
const { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient } = require('./Infrastructure/ClientRepository');
const { GetProches, CreateProche, UpdateProche, DeleteProche } = require('./Infrastructure/ProcheRepository');
const { GetConjoint, CreateConjoint, UpdateConjoint, DeleteConjoint } = require('./Infrastructure/ConjointRepository');
const { GetClientPieces, CreateClientPiece, DeleteClientPiece, GetClientPiece } = require('./Infrastructure/ClientPieceRepository');
const { GetPieces, } = require('./Infrastructure/PieceRepository');
const { CreatePatrimoine, UpdatePatrimoine, DeletePatrimoine, GetPatrimoines } = require('./Infrastructure/PatrimoineRepository');

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

log.Info('ACM Server started ...........');

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
app.use(fileUpload());

app.use(function (req, res, next) {
  // req.testing = 'testing';
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

        const promise1 = GetProches(client.ClientId);
        const promise2 = GetClientPieces(client.ClientId);

        Promise.all([promise1, promise2])
          .then((values) => {
            client.Proches = values[0];
            client.ClientPieces = values[1];
            response.status(200).send(client);
          }, (error) => {
            console.log("Error promise.All: ", error);
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



//#region ClientPiece
app.get("/GetClientPieces", async (request, response) => {
  let filename = "./Pieces/0.log";
  try {
    let exists = fs.existsSync(filename);
    console.log("exists: ", exists)
    if (exists) {
      fs.unlinkSync(filename)
      response.status(200).send("done");
    }
    else
      response.status(200).send("file not found");
  } catch (e) {
    response.status(200).send("Error delete file");
  }


  // await GetClientPieces(request.query.ClientId)
  //   .then((res) => {
  //     response.status(200).send(res);
  //   })
  //   .catch((error) => response.status(400).send(error))
});
app.get("/GetPieces", async (request, response) => {
  await GetPieces()
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.post('/CreateClientPiece', async (request, response) => {
  let ClientId = request.body.ClientId;
  // let PieceId = request.body.PieceId;
  let ClientPieceId = request.body.ClientPieceId;
  let ClientPiecesDirectory = `./Pieces/${ClientId}`;

  if (!request.files || Object.keys(request.files).length === 0)
    return response.status(400).send('No files were uploaded.');

  let fileToUpload = request.files.file;
  // let mimetype = fileToUpload.mimetype;
  let fileExtension = fileToUpload.name.split(".")[fileToUpload.name.split(".").length - 1];

  // create ClientPiecesDirectory if it doesn't exist
  let exists = fs.existsSync(ClientPiecesDirectory);
  if (!exists) fs.mkdirSync(ClientPiecesDirectory);

  let uploadPath = `${ClientPiecesDirectory}/${ClientPieceId}.${fileExtension}`;

  // Use the mv() method to place the file somewhere on your server
  fileToUpload.mv(uploadPath, async function (err) {
    if (err) return response.status(500).send(err);
    // create ClientPiece
    // response.status(200).send('File uploaded!');
    let newClientPiece = {
      ClientPieceId: request.body.ClientPieceId,
      ClientId: request.body.ClientId,
      PieceId: request.body.PieceId,
      Extension: fileExtension,
    };
    await CreateClientPiece(newClientPiece)
      .then((res) => {
        response.status(200).send(res);
      }, (err) => {
        response.status(500).send(err);
      })
  });
});
app.delete("/DeleteClientPiece/:ClientPieceId", async (request, response) => {
  // get ClientPiece
  await GetClientPiece(request.params.ClientPieceId)
    .then(async (res) => {
      if (res != null && res.length == 1) {
        let clientPiece = res[0];
        let fileNameToDelete = `./Pieces/${clientPiece.ClientId}/${clientPiece.ClientPieceId}.${clientPiece.Extension}`;
        if (fs.existsSync(fileNameToDelete)) {
          fs.rmSync(fileNameToDelete);

          await DeleteClientPiece(request.params.ClientPieceId)
            .then((res) => response.status(200).send(res))
            .catch((error) => response.status(400).send(error))
        }
        else
          response.status(200).send("not found");
      }
    })
    .catch((error) => response.status(400).send(error));
});
// app.post("/CreateClientPiece", async (request, response) => {

//   response.status(200).send("uploaded");
//   // await CreateClient(request.body)
//   //   .then(async (res) => {
//   //     response.status(200).send(res);
//   //   })
//   //   .catch((error) => response.status(400).send(error))
// });
//#endregion ClientPiece


//#region Patrimoine
app.get("/GetPatrimoines", async (request, response) => {
  await GetPatrimoines(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.post("/CreatePatrimoine", async (request, response) => {
  console.log(request.body)
  await CreatePatrimoine(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.put("/UpdatePatrimoine", async (request, response) => {
  await UpdatePatrimoine(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
app.delete("/DeletePatrimoine/:PatrimoineId", async (request, response) => {
  await DeletePatrimoine(request.params.ConjointId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error))
});
//#endregion Patrimoine