console.clear();

const express = require("express");
const sql = require("mssql");
const log = require("node-file-logger");
const fs = require("fs");
const fileUpload = require("express-fileupload");
// const upload = require('./Helper/upload');
// const http = require('http');
const { connect } = require("./db");
var passport = require("passport");
const { jwtStrategy } = require("./Auth/passport");
// var guard = require('express-jwt-permissions')()

// setup logger
let options = {
  timeZone: "Africa/Casablanca",
  folderPath: "./logs/",
  dateBasedFileNaming: true,
  // Required only if dateBasedFileNaming is set to false
  fileName: "All_Logs",
  // Required only if dateBasedFileNaming is set to true
  fileNamePrefix: "Logs_",
  fileNameSuffix: "",
  fileNameExtension: ".log",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "HH:mm:ss.SSS",
  logLevel: "debug",
  onlyFileLogging: true,
};
log.SetUserOptions(options);
log.Info("ACM Server started ...........");

// require('./ClientController');
const app = express();
const cors = require("cors");
app.use(cors());
const PORT = 3000;
// sql server login
(async () => {
  try {
    await connect();
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
})();

app.use(express.json());
app.use(fileUpload());
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false, // don't save session if unmodified
//   saveUninitialized: false, // don't create session until something stored
//   store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
// }));
// app.use(passport.authenticate('session'));
// app.use(function (req, res, next) {
//   var msgs = req.session.messages || [];
//   res.locals.messages = msgs;
//   res.locals.hasMessages = !!msgs.length;
//   req.session.messages = [];
//   next();
// });

var AuthController = require("./Controllers/AuthController");
var ClientController = require("./Controllers/ClientController");
var ProcheController = require("./Controllers/ProcheController");
var ConjointController = require("./Controllers/ConjointController");
var PatrimoineController = require("./Controllers/PatrimoineController");
var ClientPieceController = require("./Controllers/ClientPieceController");
var PassifController = require("./Controllers/PassifController");
var BudgetController = require("./Controllers/BudgetController");
var MissionController = require("./Controllers/MissionController");
var PrestationController = require("./Controllers/PrestationController");
var TacheController = require("./Controllers/TacheController");
app.use("/Auth/", AuthController);
app.use("/", ClientController);
app.use("/", ProcheController);
app.use("/", ConjointController);
app.use("/", PatrimoineController);
app.use("/", ClientPieceController);
app.use("/", PassifController);
app.use("/", BudgetController);
app.use("/", MissionController);
app.use("/", PrestationController);
app.use("/", TacheController);

app.use(function (req, res, next) {
  // req.testing = 'testing';
  return next();
});

app.listen(PORT, (error) => {
  if (!error) console.log("Server is Successfully Running, and App is listening on port " + PORT);
  else console.log("Error occurred, server can't start", error);
});
app.get("/", (request, response) => {
  response.status(200).send("Server works !!!!");
});

app.get("/cabinets", (request, response) => {
  console.log("/cabinets");
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
