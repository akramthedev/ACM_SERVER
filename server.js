console.clear();
// https://medium.com/@erinlim555/simple-keycloak-rbac-with-node-js-express-js-bc9031c9f1ba
const express = require("express");
const sql = require("mssql");
const log = require("node-file-logger");
// const log = require("./Helper/log");

const fs = require("fs");
const fileUpload = require("express-fileupload");
// const upload = require('./Helper/upload');
// const http = require('http');
const { connect } = require("./Helper/db");
const { generatePdf } = require("./Helper/pdf-gen");
var passport = require("passport");
const { jwtStrategy } = require("./Auth/passport");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const utils = require("util");
const path = require("path");
var mailer = require("./Helper/mailer");
// var crypto = require('crypto');
// var guard = require('express-jwt-permissions')()
const config = require("./config.json");
let version = "1.0.5";
const keycloak = require("./keycloak-config");
// const keycloakConfig = require("./keycloak.json");

log.SetUserOptions(config.loggerOptions);
log.Info("ACM Server started ...........", "version: " + version, null, "database: " + config.db.database);
// Ensure the pdfs directory exists
if (!fs.existsSync("./pdfs")) {
  fs.mkdirSync("./pdfs");
}

const app = express();
const cors = require("cors");
//Initialize Keycloak
// const keycloak = new Keycloak(keycloakConfig);

//Protect routes with keycloak
app.use(keycloak.middleware());
app.use(cors());
app.use("/Pieces", express.static("Pieces"));
app.use("/Pieces", express.static(path.join(__dirname, "Pieces")));

const PORT = process.env.PORT || 3000;
let connection = null;
// sql server login
(async () => {
  try {
    connection = await connect(config.db);
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
var EmailController = require("./Controllers/EmailController");
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
app.use("/", EmailController);
app.get("/GetDashData", async (request, response) => {
  let resFallBack = {
    data: {
      total_tasks: 0,
      incomplete_tasks: 0,
      completed_tasks: 0,
      total_dossiers: 0,
      dossier_en_cours: 0,
      dossier_clotures: 0,
    },
    upcoming_tasks: [],
  };

  try {
    const data = await GetDashboardData();
    const upcomingTasks = await GetUpcomingTasks();
    
    // Combine the dashboard stats and upcoming tasks into one response
    response.json({
      data: data || resFallBack.data,
      upcoming_tasks: upcomingTasks,
    });
  } catch (error) {
    response.status(500).json({ error: error?.message || "Server error" });
  }
});
app.get("/GetFacturation", async (request, response) => {
  try {
    const data = await GetAllFacturations();
    console.log(data);
    response.json({
      data : data, 
      message : "Salam l3alam..."
    });  
  } catch (error) {
    response.status(500).json({ error: error?.message || "Server error" });
  }
})
function GetAllFacturations() {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    const query = `
      SELECT  
        Facturation.id as FacturationId,
        FacturationItems.id as FacturationItemId,
        FacturationItems.ClientTacheId as ClientTacheId, 
        FacturationItems.NomTache AS NomTache,
        FacturationItems.price AS PrixTache,
        Prestation.Designation AS NomPrestation,
        Facturation.total_price AS TotalFacturation,
        Facturation.status AS StatusFacturation,
        Client.ClientId AS ClientId,
        Client.Nom as NomClient, 
        Client.Prenom as PrenomClient,
        Client.DateArriveMaroc AS DateArriveMaroc, 
        Client.Email1 AS Email, 
        Client.Telephone1 AS Mobile
      FROM Facturation
      JOIN FacturationItems ON FacturationItems.facturation_id = Facturation.id
      JOIN Prestation ON FacturationItems.PrestationId = Prestation.PrestationId
      JOIN Client ON Facturation.clientId = Client.ClientId;
    `;

    request.query(query)
      .then((result) => {
        if (result.recordset?.length > 0) {
          resolve(result.recordset);
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        reject(error);  
      });
  });
}



function GetDashboardData() {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    const query = `
      SELECT 
        (SELECT COUNT(*) FROM ClientTache) AS total_tasks,
        (SELECT COUNT(*) FROM ClientTache WHERE status = 'En cours') AS incomplete_tasks,
        (SELECT COUNT(*) FROM ClientTache WHERE status = 'Finalisée') AS completed_tasks,
        (SELECT COUNT(DISTINCT ClientId) FROM ClientTache) AS total_dossiers,
        (SELECT COUNT(DISTINCT ClientId) FROM ClientTache WHERE status = 'En cours') AS dossier_en_cours,
        (SELECT COUNT(*) FROM (
            SELECT ClientId FROM ClientTache 
            GROUP BY ClientId 
            HAVING SUM(CASE WHEN status = 'En cours' THEN 1 ELSE 0 END) = 0
        ) AS completed_clients) AS dossier_clotures;
    `;

    request.query(query)
      .then((result) => {
        if (result.recordset?.length > 0) {
          resolve(result.recordset[0]);
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        reject(new Error("Error fetching dashboard data: " + error.message));
      });
  });
}

function GetUpcomingTasks() {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    const query = `
      SELECT 
      t.Intitule AS NameTask,    
      ct.Intitule AS FullName,
      c.Email1 AS Email, 
      c.DateArriveMaroc AS DateArriveMaroc,
      ct.start_date AS StartDate, 
      ct.end_date AS EndDate, 
      t.Numero_Ordre AS NumOrder, 
      c.ClientId AS ClientId
        FROM ClientTache ct, Tache t, Client c
        WHERE ct.ClientId = c.ClientId
          AND ct.TacheId = t.TacheId
          AND (ct.start_date >= GETDATE() OR ct.end_date >= GETDATE()) 
          AND (ct.start_date < DATEADD(DAY, 30, GETDATE()) OR ct.end_date < DATEADD(DAY, 30, GETDATE()))
          AND ct.status = 'En cours'
    `;

    request.query(query)
      .then((result) => {
        resolve(result.recordset || []);
      })
      .catch((error) => {
        reject(new Error("Error fetching upcoming tasks: " + error.message));
      });
  });
}
















app.use(function (req, res, next) {
  /*req.testing = 'testing';*/ return next();
});

app.listen(PORT, (error) => {
  if (!error) console.log("Server is Successfully Running, and App is listening on port " + PORT);
  else console.log("Error occurred, server can't start", error);
});
app.get("/", (request, response) => {
  response.status(200).send("Server works 28/08/2024 16:02");
});
app.get("/test", (request, response) => {
  log.Info("test route works ...........");
  console.log("test route");
  response.status(200).send("test works 28/08/2024 16:02 !!!!!!!!!!!!!!!!");
});
app.get("/test1", (request, response) => {
  console.log("test1 route");
  response.status(200).send("test1 works 18/09/2024 !!!!!!!!!!!!!!!!");
});

app.get(
  "/test2",
  keycloak.protect((token, request) => token.hasRole(`realm:bp_afficher`)),
  (request, response) => {
    // Récupérer le token JWT de l'utilisateur authentifié
    const tokenContent = request.kauth.grant.access_token.content;

    const username = tokenContent.preferred_username; // Nom d'utilisateur
    const email = tokenContent.email; // Email de l'utilisateur
    const roles = tokenContent.realm_access.roles; // Rôles de l'utilisateur
    const fullName = tokenContent.name; // Nom complet

    // Log des informations utilisateur
    console.log("Nom d'utilisateur :", username);
    console.log("Email :", email);
    console.log("Rôles de l'utilisateur :", roles);
    console.log("Nom complet :", fullName);

    // Répondre avec un message contenant les infos utilisateur
    response.status(200).send(`Utilisateur authentifié : ${username}, Email: ${email}, Rôles: ${roles}`);
  }
);

app.get(
  "/test3",
  keycloak.protect((token, request) => token.hasRole(`realm:piece_afficher`)),
  (request, response) => {
    console.log("test3 route protected with keycloak piece-afficher");
    response.status(200).send("test2 route protected with keycloak piece_afficher works 18/09/2024  !!!!!!!!!!!!!!!!");
  }
);

app.get("/email", (request, response) => {
  let mailOptions = {
    from: "acm@netwaciila.ma",
    to: "amine.laghlabi@e-polytechnique.ma", //"boulloul.123@gmail.com", //amine.laghlabi@e-polytechnique.ma //boulloul.123@gmail.com //cecile@acm-maroc.com
    subject: "TestEmail",
    html: "<b>TestEmail</b>",
  };
  console.log("sending email ......");
  log.Info("sending email");
  mailer.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      log.Error("send email Failed");
      response.status(200).send("error email");
    } else {
      console.log("Email sent: " + info.response);
      log.Info("mail sent :D");
      response.status(200).send("email sent !!!!!");
    }
  });
});

app.get("/email2", (request, response) => {
  console.log("request.query Email2 : ", request.query);
  sendEmail(request.query.to, request.query.subject, request.query.html).then(
    (res) => {
      response.status(200).send("email sent !!!!!");
    },
    (error) => {
      console.log("Error send email: ");
      console.log(error);
      response.status(200).send("error email");
    }
  );
});
function sendEmail(to, subject, htmlBody) {
  let mailOptions = {
    from: "acm@netwaciila.ma",
    to: to,
    subject: subject,
    html: htmlBody,
  };
  return new Promise((resolve, reject) => {
    mailer.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
        // response.status(200).send("error email");
      } else {
        resolve(true);
        // console.log("Email sent: " + info.response);
        // response.status(200).send("email sent !!!!!");
      }
    });
  });
}

//#region GeneratePDF
// const readFile = utils.promisify(fs.readFile);
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
// async function getTemplateHtml(template) {
//   try {
//     const templatePath = path.resolve(template);
//     console.log("templatePath: ", templatePath)
//     return await readFile(templatePath, "utf8");
//   } catch (err) {
//     return Promise.reject("Could not load html template");
//   }
// }
function getImageBase64(imagePath) {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString("base64")}`;
}
async function getTemplateHtml(template) {
  try {
    const templatePath = path.resolve(template);
    let html = await fs.promises.readFile(templatePath, "utf8");
    try {
      // Intégrer les images en base64
      const logoBase64 = getImageBase64(path.resolve(__dirname, "./templates/assets/LOGO-BGG.png"));
      html = html.replace(`<img src="../LOGO-BGG.png" alt="" style="height: 90px; width: 160px; opacity: 90%" />`, `<img src="${logoBase64}" alt="" style="height: 90px; width: 160px; opacity: 90%" />`);
    } catch (ex) {
      return Promise.reject("Could not load photo");
    }
    return html;
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
async function generatePdf0(template, data, options) {
  try {
    const res = await getTemplateHtml(template);
    const templateCompiled = hb.compile(res, { strict: true });
    const htmlTemplate = templateCompiled(data);
    const browser = await puppeteer.launch({
      headless: true, // or false if you want a visible browser
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.pdf(options);
    await browser.close();
    return options.path;
  } catch (err) {
    log.Error("\n --------------------- \n\n error generatePdf");
    log.Error(err);
    throw err;
  }
}
app.get("/print", async (request, response) => {
  const recuPaiementTemplate = "./templates/testt.html";
  // const recuPaiementFileName = `./pdfs/Lettre_Mission_${new Date().getTime()}.pdf`;
  const recuPaiementFileName = `./pdfs/Lettre_Mission_${new Date().getTime()}.pdf`;

  const recuPaiementData = {
    NumeroRecu: "123456",
    Matricule: "1234564789",
    Nom: "EtdNom",
    Prenom: "EtdPrenom " + new Date().toISOString(),
    Filiere: "Ingénierie Financière, Contrôle et Audit",
    Niveau: "4ème année",
    Annee: "2023-2024",
    // img: path.resolve("LOGO-BG.png"),
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
    const generatedPdfPath = await generatePdf0(recuPaiementTemplate, recuPaiementData, recuPaiementOptions);
    const data = fs.readFileSync(generatedPdfPath);
    setTimeout(() => {
      fs.rmSync(generatedPdfPath);
    }, 1000);
    response.contentType("application/pdf");
    response.send(data);
  } catch (errorGen) {
    console.log("errorGen: ", errorGen);
    response.status(500).send(errorGen);
  }
});

setTimeout(() => {
  console.log("\n\n\n");
}, 1000);
app.get("/print2", async (request, response) => {
  console.log("__dirname ", __dirname);

  // const recuPaiementTemplate = `${__dirname}/templates/testt.html`;
  const recuPaiementTemplate = path.resolve(__dirname, "templates/testt.html");
  const recuPaiementFileName = path.resolve(__dirname, `pdfs/Lettre_Mission_${new Date().getTime()}.pdf`);

  const photo1 = getImageBase64(path.resolve(__dirname, "templates/assets/LOGO-BGG.png"));
  let imagesToReplace = [{ old: `<img src="../LOGO-BGG.png" alt="" style="height: 90px; width: 160px; opacity: 90%" />`, new: `<img src="${photo1}" alt="" style="height: 90px; width: 160px; opacity: 90%" />` }];

  const recuPaiementData = {
    NumeroRecu: "123456",
    Matricule: "1234564789",
    Nom: "EtdNom",
    Prenom: "EtdPrenom " + new Date().toISOString(),
    Filiere: "Ingénierie Financière, Contrôle et Audit",
    Niveau: "4ème année",
    Annee: "2023-2024",
    // img: path.resolve("LOGO-BG.png"),
    data: [
      { nom: "aa", prenom: "aaa" },
      { nom: "bb", prenom: "bbb" },
      { nom: "cc", prenom: "ccc" },
    ],
  };

  const recuPaiementOptions = { path: recuPaiementFileName, format: "A4", printBackground: true, landscape: false };

  try {
    const generatedPdfPath = await generatePdf(recuPaiementTemplate, recuPaiementData, recuPaiementOptions, imagesToReplace);
    const data = fs.readFileSync(generatedPdfPath);
    setTimeout(() => {
      fs.rmSync(generatedPdfPath);
    }, 1000);
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

app.get("/db", (request, response) => {
  response.send(connection.config.database);
});
app.get("/version", (request, response) => {
  response.send(version);
});
app.get("/logs", (request, response) => {
  let files = fs.readdirSync("./logs");
  console.log("files: ", files);
  let content = "";
  for (let i = 0; i < files.length; i++) {
    fs.readFile(`./logs/${files[i]}`, "utf8", async (err, data) => {
      console.log(i + " ", files[i]);
      content += data;
      if (i == files.length - 1) {
        console.log("allDone");
        response.attachment("logs.txt");
        response.type("txt");
        response.send(content);
      }
    });
  }
});

module.exports = keycloak;