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
var mailer = require("./Helper/mailer");

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
const PORT = process.env.PORT || 3000;
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
var MissionPieceController = require("./Controllers/MissionPieceController");
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
app.use("/", MissionPieceController);

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
app.get("/test", (request, response) => {
  response.status(200).send("test works !!!!!!!!!!!!!!!!");
});

app.get("/email", (request, response) => {
  let mailOptions = {
    from: "acm@netwaciila.ma",
    to: "boulloul.123@gmail.com", //amine.laghlabi@e-polytechnique.ma //boulloul.123@gmail.com //cecile@acm-maroc.com
    subject: "Email Tache Terminé",
    html: "<b>Tache du client terminé",
  };
  console.log("sending email ......");
  mailer.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      response.status(200).send("error email");
    } else {
      console.log("Email sent: " + info.response);
      response.status(200).send("email sent !!!!!");
    }
  });
});

app.get("/email2", (request, response) => {
  const to = request.query.to;
  const subject = request.query.subject;
  const html = request.query.html;
  if (!to || !subject || !html) {
    return response.status(400).send("Missing required parameters: to, subject, or html");
  }
  let mailOptions = {
    from: "acm@netwaciila.ma",
    to: to, //amine.laghlabi@e-polytechnique.ma //boulloul.123@gmail.com //cecile@acm-maroc.com
    subject: subject,
    html: html,
  };
  console.log("sending email to : ", to);
  mailer.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      response.status(200).send("error email");
    } else {
      console.log("Email sent: " + info.response);
      response.status(200).send("email sent !!!!!");
    }
  });
});

//#region GeneratePDF
const readFile = utils.promisify(fs.readFile);
// Register a custom helper to check equality
hb.registerHelper("eq", function (a, b) {
  return a === b;
});
hb.registerHelper("and", function (a, b, options) {
  return a && b ? options.fn(this) : options.inverse(this);
});
hb.registerHelper("or", function () {
  return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
});
async function getTemplateHtml(template) {
  try {
    const invoicePath = path.resolve(template);
    return await readFile(invoicePath, "utf8");
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
async function generatePdf(template, data, options) {
  console.log("genPdf: template: ", template);
  try {
    const res = await getTemplateHtml(template);
    console.log("Good: getTemplateHtml ");
    const templateCompiled = hb.compile(res, { strict: true });
    console.log("Good: compile ");
    const htmlTemplate = templateCompiled(data);
    console.log("Good: templateCompiled ");
    const browser = await puppeteer.launch();
    console.log("Good: getTemplateHtml ");
    const page = await browser.newPage();
    console.log("Good: browser.newPage ");
    await page.setContent(htmlTemplate);
    console.log("Good: page.setContent ");
    await page.pdf(options);
    console.log("Good: page.pdf ");
    await browser.close();
    console.log("Good: browser.close ");
    console.log("PDF Generated !! file: " + options.path);
    return options.path;
  } catch (err) {
    console.error("\n --------------------- \n\n error generatePdf");
    console.error(err);
    throw err;
  }
}
app.get("/print", async (request, response) => {
  // const recuPaiementTemplate = "./templates/Lettre_Mission.html";
  const recuPaiementTemplate = "./templates/testt.html";

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
