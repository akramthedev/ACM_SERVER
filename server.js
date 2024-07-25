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
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const utils = require("util");
const path = require("path");

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
var ServiceController = require("./Controllers/ServiceController");
var MissionController = require("./Controllers/MissionController");
var PrestationController = require("./Controllers/PrestationController");
var TacheController = require("./Controllers/TacheController");
var ClientMissionController = require("./Controllers/ClientMissionController");
var ClientMissionPrestationController = require("./Controllers/ClientMissionPrestationController");
var ClientTacheController = require("./Controllers/ClientTacheController");
app.use("/Auth/", AuthController);
app.use("/", ClientController);
app.use("/", ProcheController);
app.use("/", ConjointController);
app.use("/", PatrimoineController);
app.use("/", ClientPieceController);
app.use("/", PassifController);
app.use("/", BudgetController);
app.use("/", ServiceController);
app.use("/", MissionController);
app.use("/", PrestationController);
app.use("/", TacheController);
app.use("/", ClientMissionController);
app.use("/", ClientMissionPrestationController);
app.use("/", ClientTacheController);

app.use(function (req, res, next) {
  /*req.testing = 'testing';*/ return next();
});

app.listen(PORT, (error) => {
  if (!error) console.log("Server is Successfully Running, and App is listening on port " + PORT);
  else console.log("Error occurred, server can't start", error);
});
app.get("/", (request, response) => {
  response.status(200).send("Server works !!!!");
});

//#region GeneratePDF
const readFile = utils.promisify(fs.readFile);
async function getTemplateHtml(template) {
  try {
    const invoicePath = path.resolve(template);
    return await readFile(invoicePath, "utf8");
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
// async function generatePdf(template, data, options) {
//   console.log("genPdf: template: ", template);
//   getTemplateHtml(template)
//     .then(async (res) => {
//       // Now we have the html code of our template in res object
//       // you can check by logging it on console
//       // console.log(res)
//       // console.log("Compiing the template with handlebars")
//       const template = hb.compile(res, { strict: true });
//       // we have compile our code with handlebars
//       const htmlTemplate = template(data);
//       // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       // We set the page content as the generated html by handlebars
//       // console.log("htmlTemplate: ", htmlTemplate);
//       await page.setContent(htmlTemplate);
//       // console.log("setContent");
//       // We use pdf function to generate the pdf in the same folder as this file.
//       // console.log("options ", options);
//       await page.pdf(options);
//       // console.log(".pdf");
//       await browser.close();
//       // console.log("PDF Generated !! file: " + options.path)
//       return Promise.resolve(true);
//     })
//     .catch((err) => {
//       console.error("\n --------------------- \n\n error generatePdf");
//       console.error(err);
//     });
// }
async function generatePdf(template, data, options) {
  console.log("genPdf: template: ", template);
  try {
    const res = await getTemplateHtml(template);
    const templateCompiled = hb.compile(res, { strict: true });
    const htmlTemplate = templateCompiled(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.pdf(options);
    await browser.close();
    console.log("PDF Generated !! file: " + options.path);
    return options.path;
  } catch (err) {
    console.error("\n --------------------- \n\n error generatePdf");
    console.error(err);
    throw err;
  }
}
app.get("/print", async (request, response) => {
  const recuPaiementTemplate = "./templates/Lettre_Mission.html";
  const recuPaiementFileName = `./pdfs/Lettre_Mission_${new Date().getTime()}.pdf`;
  const recuPaiementData = {
    NumeroRecu: "123456",
    Matricule: "1234564789",
    Nom: "EtdNom",
    Prenom: "EtdPrenom",
    Filiere: "Ingénierie Financière, Contrôle et Audit",
    Niveau: "4ème année",
    Annee: "2023-2024",
    data: [
      { nom: "aa", prenom: "aaa" },
      { nom: "bb", prenom: "bbb" },
      { nom: "cc", prenom: "ccc" },
    ],
  };
  // https://handlebarsjs.com/examples/builtin-helper-each-block.html
  // https://handlebarsjs.com/guide/builtin-helpers.html#unless
  // const recuPaiementOptions = { path: recuPaiementFileName, format: "A4", printBackground: true, landscape: false };
  // await generatePdf(recuPaiementTemplate, recuPaiementData, recuPaiementOptions)
  //   .then((responseGen) => {
  //     console.log("Generated: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  //     setTimeout(() => {
  //       var data = fs.readFileSync(recuPaiementFileName);
  //       response.contentType("application/pdf");
  //       response.send(data);
  //     }, 15000);
  //   })
  //   .catch((errorGen) => {
  //     console.log("errorGen: ", errorGen);
  //     response.send(errorGen);
  //   });
  const recuPaiementOptions = { path: recuPaiementFileName, format: "A4", printBackground: true, landscape: false };

  // Ensure the pdfs directory exists
  if (!fs.existsSync("./pdfs")) {
    fs.mkdirSync("./pdfs");
  }

  try {
    const generatedPdfPath = await generatePdf(recuPaiementTemplate, recuPaiementData, recuPaiementOptions);
    const data = fs.readFileSync(generatedPdfPath);
    response.contentType("application/pdf");
    response.send(data);
  } catch (errorGen) {
    console.log("errorGen: ", errorGen);
    response.status(500).send(errorGen);
  }
});

//#endregion GeneratePDF

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
