console.clear();
const { v4: uuidv4 } = require("uuid"); 
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
app.post("/CreatePrestation", async (req, res) => {
  try {
    const { Designation, NumeroOrdre } = req.body;

    if (!Designation || !NumeroOrdre) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const request = new sql.Request();

    request.input("PrestationId", sql.UniqueIdentifier, uuidv4());  
    request.input("MissionId", sql.UniqueIdentifier, "A83DCAD0-3A14-4523-A5C5-30E1BAA232D0");
    request.input("Designation", sql.NVarChar, Designation);
    request.input("Numero_ordre", sql.NVarChar, NumeroOrdre);

    const result = await request.query(`
      INSERT INTO Prestation (PrestationId, MissionId, Designation, Numero_ordre)
      OUTPUT INSERTED.PrestationId
      VALUES (@PrestationId, @MissionId, @Designation, @Numero_ordre)
    `);

    res.status(201).json({ message: "Prestation créée avec succès", id: result.recordset[0].PrestationId });

  } catch (error) {
    res.status(500).json({ error: error?.message || "Erreur serveur" });
  }
});




app.post("/CreateTache/:PrestationId", async (req, res) => {
  try {
    const { Intitule, NumeroOrdre, Deadline, NbrRapp, Hono } = req.body;
    const {PrestationId} = req.params

    if (!Intitule || !NumeroOrdre) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const request = new sql.Request();

    request.input("TacheId", sql.UniqueIdentifier, uuidv4());  
    request.input("PrestationId", sql.UniqueIdentifier, PrestationId);
    request.input("Intitule", sql.NVarChar, Intitule);
    request.input("Numero_ordre", sql.NVarChar, NumeroOrdre);
    request.input("Deadline", sql.Float, Deadline);
    request.input("NombreRapelle", sql.Float, NbrRapp);
    request.input("Honoraire", sql.Float, Hono);

    const result = await request.query(`
      INSERT INTO Tache (TacheId, PrestationId, Intitule, Numero_ordre,Deadline, NombreRapelle, Honoraire )
      VALUES (@TacheId, @PrestationId, @Intitule, @Numero_ordre,@Deadline, @NombreRapelle, @Honoraire)
    `);

    res.status(201).json({ message: "Tache créée avec succès"});

  } catch (error) {
    res.status(500).json({ error: error?.message || "Erreur serveur" });
  }
});





app.put("/UpdateTache/:TacheId", async (req, res) => {
  try {
    const { Intitule, Numero_Ordre, Deadline, NombreRapelle, Honoraire } = req.body;
    const { TacheId } = req.params; 

    console.warn({ Intitule, Numero_Ordre, Deadline, NombreRapelle, Honoraire })
    console.log("TacheId : "+TacheId);

    if (!Intitule ) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const request = new sql.Request();

    request.input("TacheId", sql.UniqueIdentifier, TacheId);  
    request.input("Intitule", sql.NVarChar, Intitule);
    request.input("Numero_ordre", sql.NVarChar, Numero_Ordre);

    request.input("Deadline", sql.Float, Deadline);
    request.input("NombreRapelle", sql.Float, NombreRapelle);
    request.input("Honoraire", sql.Float, Honoraire);

    await request.query(`
      UPDATE Tache 
      SET Intitule = @Intitule, 
          Numero_ordre = @Numero_ordre, 
          Deadline = @Deadline, 
          NombreRapelle = @NombreRapelle, 
          Honoraire = @Honoraire
      WHERE TacheId = @TacheId
    `);

    res.status(200).json({ message: "Tache modifiée avec succès"});

  } catch (error) {
    res.status(500).json({ error: error?.message || "Erreur serveur" });
  }
});




app.put("/UpdatePrestation/:PrestationId", async (req, res) => {
  try {
    const { Designation, NumeroOrdre } = req.body;
    const { PrestationId } = req.params;


    if (!Designation) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const request = new sql.Request();

    request.input("PrestationId", sql.UniqueIdentifier, PrestationId);  
    request.input("Designation", sql.NVarChar, Designation);
    request.input("Numero_ordre", sql.NVarChar, NumeroOrdre);

    const result = await request.query(`
      UPDATE Prestation 
      SET Designation = @Designation, 
          Numero_ordre = @Numero_ordre
      WHERE PrestationId = @PrestationId
    `);

    res.status(200).json({ message: "Prestation modifiée avec succès"});

  } catch (error) {
    res.status(500).json({ error: error?.message || "Erreur serveur" });
  }
});



app.delete("/DeletePrestation/:PrestationId", async (req, res) => {
  try {
    const { PrestationId } = req.params;
    
    if (!PrestationId) {
      return res.status(400).json({ error: "PrestationId est requis." });
    }

    const request = new sql.Request();

    request.input("PrestationId", sql.UniqueIdentifier, PrestationId);


    const result = await request.query(`
      DELETE FROM Prestation WHERE PrestationId = @PrestationId
    `);

    

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Prestation non trouvée." });
    }

    res.status(200).json({ message: "Prestation supprimée avec succès." });


  } catch (error) {
    res.status(500).json({ error: error?.message || "Erreur serveur" });
  }
});



app.delete("/DeleteTache/:TacheId", async (req, res) => {
  try {
    const { TacheId } = req.params;
    
    if (!TacheId) {
      return res.status(400).json({ error: "TacheId est requis." });
    }

    const request = new sql.Request();

    request.input("TacheId", sql.UniqueIdentifier, TacheId);


    const result = await request.query(`
      DELETE FROM Tache WHERE TacheId = @TacheId
    `);

    

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Tache non trouvée." });
    }

    res.status(200).json({ message: "Tache supprimée avec succès." });


  } catch (error) {
    res.status(500).json({ error: error?.message || "Erreur serveur" });
  }
});







app.get("/GetDashData", async (req, res) => {
  let resFallBack = {
    data: {
      total_tasks: 0,
      incomplete_tasks: 0,
      completed_tasks: 0,
      total_dossiers: 0,
      dossier_en_cours: 0,
      dossier_clotures: 0,
      dossierIncomplets: 0,
      total_extensions: 0,
    },
    upcoming_tasks: [],
  };

  try {
    const data = await GetDashboardData();
    res.json({
      data: data || resFallBack.data,
      upcoming_tasks: [],
    });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Server error" });
  }
});




async function GetDashboardData() {
  try {
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
    
    const result = await request.query(query);
    let dashboardData = result.recordset[0] || {};

    const query2 = `SELECT ClientId, Extension FROM ClientPiece`;
    const result2 = await request.query(query2);

    let clientsWithMissingFiles = new Set(); // To store unique ClientId with at least one NULL Extension
    let nonNullExtensions = 0;

    result2.recordset.forEach(row => {
      if (row.Extension === null) {
        clientsWithMissingFiles.add(row.ClientId);
      } else {
        nonNullExtensions++;
      }
    });

    dashboardData.dossierIncomplets = clientsWithMissingFiles.size;  
    dashboardData.total_extensions = nonNullExtensions;

    return dashboardData;
  } catch (error) {
    throw new Error("Error fetching dashboard data: " + error.message);
  }
}





app.get("/GetAllPrestationWithTache",async (request, response) => {
  try {
    const data = await GetAllPrestationsWithTasks();
    response.json({
      data, 
      message : "Salam l3alam..."
    });  
  } catch (error) {
    response.status(500).json({ error: error?.message || "Server error" });
  }
})


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




app.post("/CreateSingleEvent", async (request, response) => {
  try {
    const {
      ClientTacheId,
      ClientTacheIntitule,
      EventTimeStart,
      EventTimeEnd,
      EventDescription,
      color,
      NumberEvent
    } = request.body;   


    const sqlRequest = new sql.Request();

    // Bind the parameters with the correct data types
    sqlRequest.input("TacheId", sql.UniqueIdentifier, ClientTacheId);  
    sqlRequest.input("EventName", sql.NVarChar, ClientTacheIntitule);  
    sqlRequest.input("EventTimeStart", sql.DateTime, EventTimeStart);  
    sqlRequest.input("EventTimeEnd", sql.DateTime, EventTimeEnd);  
    sqlRequest.input("EventDescription", sql.NVarChar, EventDescription);  
    sqlRequest.input("color", sql.NVarChar, color);  
    sqlRequest.input("NumberEvent", sql.Int, NumberEvent);    

    // SQL query to insert event data
    const query = `
      INSERT INTO Evenements (TacheId, EventName, EventTimeStart, EventTimeEnd, EventDescription, color, NumberEvent) 
      VALUES (@TacheId, @EventName, @EventTimeStart, @EventTimeEnd, @EventDescription, @color, @NumberEvent)
    `;

    // Execute the query
    await sqlRequest.query(query);

    const sqlRequest2 = new sql.Request();
    sqlRequest2.input("NombreRappel", sql.Int, 1);
    sqlRequest2.input("ClientTacheId", sql.UniqueIdentifier, ClientTacheId);
    const query2 = `
      UPDATE ClientTache 
      SET NombreRappel = @NombreRappel
      WHERE ClientTacheId = @ClientTacheId
    `;
    await sqlRequest2.query(query2);
    
    response.status(201).json({ 
      message: 'Event created successfully', 
      data: {
        ClientTacheId,
        ClientTacheIntitule,
        EventTimeStart,
        EventTimeEnd,
        EventDescription,
        color,
        NumberEvent
      }
    });

  } catch (error) {
    // Handle error if anything goes wrong
    console.error(error); // Log the error for debugging
    response.status(500).json({ error: error?.message || "Server error" });
  }
});






function convertToISOFormat(dateInput) {
  if (!dateInput) {
    console.error("❌ Date input is missing or undefined.");
    return null;
  }

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    console.error("❌ Invalid date input:", dateInput);
    return null;
  }

  date.setUTCHours(9, 0, 0, 0);
  return date.toISOString();
}



function addDaysToDateStart(dateString, days) {
  if (!dateString) {
    console.error("❌ Invalid input to addDaysToDateStart: dateString is null or undefined");
    return null;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("❌ Cannot process invalid date in addDaysToDateStart:", dateString);
    return null;
  }

  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(9, 0, 0, 0);

  return date.toISOString();
}




app.post("/CreateSingleTaskFromSingleClientPage", async (request, response) => {
  try {
    const { TacheId, ClientId, Intitule,PrestationId, DateArriveMaroc  } = request.body;
    let ClientMissionIdX = "";
    let ClientMissionPrestationIdX = "";
    let start_date;
    let end_date;
    let NombreRapelle;
    let deadline;

    if (!TacheId || !ClientId || !Intitule) {
      return response.status(400).json({ error: "Missing required fields" });
    }
    
    const sqR0 = new sql.Request();
    sqR0.input("TacheId", sql.UniqueIdentifier, TacheId);
    const rXR0 = await sqR0.query(`
      SELECT Deadline, NombreRapelle, Honoraire
      FROM Tache
      WHERE TacheId = @TacheId
    `);

    console.warn(rXR0.recordset[0]);

    if (rXR0.recordset[0] !== null) {
      console.warn(DateArriveMaroc);
      start_date = convertToISOFormat(DateArriveMaroc);
    
      if (!start_date) {
        throw new Error("🚨 Invalid start_date: DateArriveMaroc is not a valid date.");
      }
    
      deadline = parseInt(rXR0.recordset[0].Deadline);
      if (isNaN(deadline)) {
        deadline = 13;  
      }
      NombreRapelle = rXR0.recordset[0].NombreRapelle;
      if(NombreRapelle === null){
        NombreRapelle = 0;
      }
      else{
        NombreRapelle = parseInt(rXR0.recordset[0].NombreRapelle);
      }
      end_date = addDaysToDateStart(start_date, deadline);
    }
    

    console.log("PrestationId   : "+PrestationId);
    console.log("-------------------------------");
    console.log("TacheId        : "+TacheId);
    console.log("-------------------------------");
    console.log("ClientId       : "+ClientId);
    console.log("-------------------------------");
    console.log("Start_Date     : "+start_date)
    console.log("-------------------------------");
    console.log("End_Date       : "+end_date);  
    console.log("-------------------------------");
    console.log("Deadline       : "+deadline);    
    console.log("-------------------------------");
    console.log("NombreRapelle  : "+NombreRapelle);


    const sqlRequest = new sql.Request();
    sqlRequest.input("ClientId", sql.UniqueIdentifier, ClientId);
    const query = `
      SELECT  ClientMission.ClientMissionId AS ClientMissionId, ClientMissionPrestation.ClientMissionPrestationId AS ClientMissionPrestationId From ClientMission, ClientMissionPrestation WHERE ClientMission.ClientMissionId = ClientMissionPrestation.ClientMissionId AND ClientMission.ClientId = @ClientId;
    `;

    const result = await sqlRequest.query(query);

    if (result.recordset?.length > 0) {
      ClientMissionIdX = result.recordset[0].ClientMissionId;
      ClientMissionPrestationIdX = result.recordset[0].ClientMissionPrestationId;
      
      const insertRequest = new sql.Request();
      insertRequest.input("ClientId", sql.UniqueIdentifier, ClientId);
      insertRequest.input("AgentResposable", sql.UniqueIdentifier, "3D9D1AC0-AC20-469E-BE24-97CB3C8C5187");
      insertRequest.input("TacheId", sql.UniqueIdentifier, TacheId);
      insertRequest.input("color", sql.VarChar(7), "#7366fe");
      insertRequest.input("Intitule", sql.NVarChar(250), Intitule);
      insertRequest.input("ClientMissionId", sql.UniqueIdentifier, ClientMissionIdX);
      insertRequest.input("ClientMissionPrestationId", sql.UniqueIdentifier, PrestationId);
      insertRequest.input("start_date", sql.DateTime, start_date)  
      insertRequest.input("end_date", sql.DateTime, end_date)
      insertRequest.input("NombreRappel", sql.Int, NombreRapelle)

      await insertRequest.execute("ps_create_client_tache_But_From_SinglePageClient");

      return response.status(201).json({
        message: "Task created successfully",
        data: { X: "Hallo X" },
      });
    } else {
      return response.status(404).json({ error: "Client mission not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({ error: error.message || "Server error" });
  }
});






function GetAllPrestationsWithTasks(){
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    const query = `
      SELECT 
        Prestation.PrestationId AS PrestationId,
        Prestation.Designation AS PrestationName, 
        Prestation.Numero_Ordre AS PrestationNumOrdre,
        Tache.TacheId AS TacheId, 
        Tache.Intitule AS TacheIntitule, 
        Tache.Numero_Ordre AS TacheNumOrdre, 
        Tache.deadline AS TacheDeadline, 
        Tache.NombreRapelle AS TacheNbrRapp, 
        Tache.Honoraire AS TacheHonoraire        
      FROM Prestation
      LEFT JOIN Tache 
      ON Prestation.PrestationId = Tache.PrestationId;
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

function GetAllFacturations() {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    const query = `
      SELECT  
        Facturation.NumeroFacture AS NumeroFacture, 
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
          AND (ct.start_date < DATEADD(DAY, 17, GETDATE()) OR ct.end_date < DATEADD(DAY, 17, GETDATE()))
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