const puppeteer = require("puppeteer");
const hb = require("handlebars");
const utils = require("util");
const path = require("path");
const fs = require("fs");
var express = require("express");
var router = express.Router();
const log = require("node-file-logger");
const keycloak = require("../keycloak-config");
const { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient } = require("../Infrastructure/ClientRepository");
const { GetProches, CreateProche } = require("../Infrastructure/ProcheRepository");
const { CreateConjoint } = require("../Infrastructure/ConjointRepository");
const { GetClientPieces } = require("../Infrastructure/ClientPieceRepository");
const { GetPatrimoines } = require("../Infrastructure/PatrimoineRepository");
const { GetPassifs } = require("../Infrastructure/PassifRepository");
const { GetBudgets } = require("../Infrastructure/BudgetRepository");
const { GetConjoint } = require("../Infrastructure/ConjointRepository");
const { CreateClientMission, GetClientMissions, GetLettreMissions } = require("../Infrastructure/ClientMissionRepository");
const { GetClientMissionPrestations, CreateClientMissionPrestation } = require("../Infrastructure/ClientMissionPrestationRepository");
const { GetClientTaches, CreateClientTache } = require("../Infrastructure/ClientTacheRepository");
const { generatePdf, getImageBase64 } = require("../Helper/pdf-gen");
const sql = require("mssql");




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




//#region Client
router.get(
  "/GetClients",
  async (request, response) => {
    // Récupérer le token JWT de l'utilisateur authentifié
    const tokenContent = request.kauth.grant.access_token.content;

    const username = tokenContent.preferred_username; // Nom d'utilisateur
    const email = tokenContent.email; // Email de l'utilisateur
    const roles = tokenContent.realm_access.roles; // Rôles de l'utilisateur
    const fullName = tokenContent.name; // Nom complet
    const userId=tokenContent.sid

    // Log des informations utilisateur
    await GetClients(request.query.CabinetId)
      .then(async (res) => {
        // log.Info(`Get Clients : ${JSON.stringify(res)} , efféctuer par :${username} , userId: ${userId}`);
        res = res.map((item) => {
          let clientFirectory = `./Pieces/${item.ClientId}/`;
          if (!fs.existsSync(clientFirectory)) {
            item.Photo = null;
          } else {
            let photoProfile = fs.readdirSync(clientFirectory).find((x) => x.toLowerCase().startsWith("profile"));
            if (photoProfile != null) item.Photo = `Pieces/${item.ClientId}/${photoProfile}`;
            else item.Photo = null;
          }
          return item;
        });
        response.status(200).send(res);
      })
      .catch((error) => {
        log.Error(error);
        response.status(400).send(error);
      });
  }
);







router.get("/GetClient", async (request, response) => {
  try {

      let res = await GetClient(request.query.ClientId);
      
      // Ensure res is an array and not undefined
      if (!res || res.length === 0) {
        console.warn("No client found for the given ClientId.");
        return response.status(200).send(null);
      }
      
      let client = res;
      

    if (!client) {
      return response.status(200).send(null);
    }


    let clientDirectory = `./Pieces/${client.ClientId}/`;

    if (!fs.existsSync(clientDirectory)) {
      client.Photo = null;
    } else {
      let photoProfile = fs.readdirSync(clientDirectory).find((x) => x.toLowerCase().startsWith("profile"));
      client.Photo = photoProfile ? `Pieces/${client.ClientId}/${photoProfile}` : null;
    }


    let CLI = `${client.ClientId}`;
    
    
    const promises = [
      GetProches(CLI),
      GetClientPieces(CLI),
      GetPatrimoines(CLI),
      GetPassifs(CLI),
      GetBudgets(CLI),
      GetConjoint(CLI),
      GetClientMissions(CLI),
      GetClientMissionPrestations(CLI),
      GetClientTaches(CLI),
    ];

    const values = await Promise.all(promises);

    client.Proches = values[0];
    client.ClientPieces = values[1];

    client.Patrimoines = values[2].map((patrimoine) => {
      const statusDocumentDirectory = `./Pieces/${CLI}/Status/`;
      let statusDocumentPath = null;
      if (fs.existsSync(statusDocumentDirectory)) {
        let statusDocument = fs.readdirSync(statusDocumentDirectory).find((file) =>
          file.toLowerCase().startsWith(patrimoine.PatrimoineId.toLowerCase())
        );
        if (statusDocument) {
          statusDocumentPath = `Pieces/${CLI}/Status/${statusDocument}`;
        }
      }
      patrimoine.StatusDocumentPath = statusDocumentPath;
      return patrimoine;
    });

    client.Passifs = values[3];
    client.Budgets = values[4];
    client.Conjoint = values[5];
    client.ClientMissions = values[6];
    client.ClientMissionPrestations = values[7];
    client.ClientTaches = values[8];

    response.status(200).send(client);
  } catch (error) {
    console.error( error);
    log.Error("Get Client", error);
    response.status(400).send(error);
  }
});






































router.post("/CreateClient", async (request, response) => {
  try {
    const res = await CreateClient(request.body);

    if (!res) {
      return response.status(400).send("Client creation failed.");
    }

    log.Info("CreateClient", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

    // Process Proches, Conjoints, Services, etc. asynchronously
    await Promise.all([
      processProches(request.body.Proches),
      processConjoints(request.body.Conjoint),
      processServices(request.body.Service),
      processClientMissions(request.body.ClientMission),
      processClientMissionPrestations(request.body.ClientMissionPrestation),
    ]);

    let insertedTasks = [];

    if (Array.isArray(request.body.ClientTaches) && request.body.ClientTaches.length > 0) {
      insertedTasks = await processClientTaches(request.body.ClientTaches, res.ClientId);
    }

    // ✅ Return message + inserted tasks
    return response.status(200).json({ 
      message: "Client created successfully.",
      events: insertedTasks 
    });

  } catch (error) {
    console.log("Error: ", error);
    log.Info(error);
    return response.status(400).send(error);
  }
});






async function processProches(Proches) {
  if (Proches && Proches.length > 0) {
    for (const proche of Proches) {
      await CreateProche(proche).then((resProche) => {
        if (resProche) log.Info("CreateProche", resProche);
      }).catch(error => log.Error("CreateProcheError", error));
    }
  }
}

async function processConjoints(Conjoints) {
  if (Conjoints && Conjoints.length > 0) {
    for (const conjoint of Conjoints) {
      await CreateConjoint(conjoint).then((resConjoint) => {
        log.Info("CreateConjoint", resConjoint);
      }).catch(error => log.Info("ErrorCreateConjoint", error));
    }
  }
}

async function processServices(Services) {
  if (Services) {
    await CreateService(Services).then((resService) => {
      log.Info("CreateService", resService);
    }).catch(error => log.Info("ErrorCreateService", error));
  }
}

async function processClientMissions(ClientMissions) {
  if (ClientMissions && ClientMissions.length > 0) {
    for (const mission of ClientMissions) {
      await CreateClientMission(mission).then((resClientMission) => {
        log.Info("CreateClientMission", resClientMission);
      }).catch(error => log.Info("ErrorCreateClientMission", error));
    }
  }
}

async function processClientMissionPrestations(ClientMissionPrestations) {
  console.log("processClientMissionPrestations Output : ");
  console.warn(ClientMissionPrestations);
  console.log("-------------------------------");
  if (ClientMissionPrestations && ClientMissionPrestations.length > 0) {
    for (const prestation of ClientMissionPrestations) {
      console.log(prestation);
      console.warn("-_-_-_-_-_-_-_-_-_-_-_");
      await CreateClientMissionPrestation(prestation).then((resPrestation) => {
        log.Info("CreateClientMissionPrestation", resPrestation);
      }).catch(error => log.Info("ErrorCreateClientMissionPrestation", error));
    }
  }
}





async function processClientTaches(clientTaches, clientId) {
  let insertedTasks = []; 

  try {
    for (const tache of clientTaches) {
      let isR = tache.IsReminder ? 1 : 0;

      console.warn(tache.ClientMissionId)
      console.warn(tache.ClientMissionPrestationId);
      console.warn("---------------------------------");
      
      const insertRequest = new sql.Request();
      await insertRequest
        .input("ClientId", sql.UniqueIdentifier, clientId)
        .input("AgentResposable", sql.UniqueIdentifier, '3D9D1AC0-AC20-469E-BE24-97CB3C8C5187')
        .input("ClientMissionId", sql.UniqueIdentifier, tache.ClientMissionId)
        .input("ClientMissionPrestationId", sql.UniqueIdentifier, tache.ClientMissionPrestationId)
        .input("TacheId", sql.UniqueIdentifier, tache.TacheId)
        .input("Intitule", sql.VarChar(200), tache.Intitule)
        .input("Commentaire", sql.VarChar(200), tache.Commentaire)
        .input("start_date", sql.DateTime, tache.Start_date)
        .input("end_date", sql.DateTime, tache.End_date)
        .input("color", sql.VarChar(7), tache.Color || '#7366fe')
        .input("isDone", sql.Bit, 0)
        .input("isReminder", sql.Bit, isR)
        .execute("ps_create_client_tache");
    }

    const selectRequest = new sql.Request();

    const result = await selectRequest
      .input("ClientId", sql.UniqueIdentifier, clientId)
      .query(`
        SELECT * 
        FROM Evenements
        INNER JOIN ClientTache ON Evenements.TacheId = ClientTache.ClientTacheId
        WHERE ClientTache.ClientId = @ClientId
    `);

    if (result.recordset.length > 0) {
      insertedTasks = result.recordset; 
    }

  } catch (error) {
    console.log("Error inserting task: ", error);
  }

  return insertedTasks;
}
















































router.put("/UpdateClient", async (request, response) => {
  await UpdateClient(request.body)
    .then((res) => {
      // log.Info(res);
      log.Info("UpdateClient", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});




router.delete("/DeleteClient/:ClientId", async (request, response) => {
  await DeleteClient(request.params.ClientId)
    .then((res) => {
      // log.Info(res);
      log.Info("DeleteClient", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, `client deleted : ${request.params.ClientId}`);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});

// const readFile = utils.promisify(fs.readFile);
// async function getTemplateHtml(template) {
//   try {
//     const invoicePath = path.resolve(template);
//     let html = await fs.promises.readFile(invoicePath, "utf8");

//     // Intégrer les images en base64
//     const logoBase64 = getImageBase64(path.resolve(__dirname, "../LOGO-BGG.png"));
//     console.log("__dirname: ", __dirname);
//     html = html.replace(/<img src="\.\.\/LOGO-BGG\.png" alt="" style="height: 90px; width: 160px; opacity: 90%" \/>/g, `<img src="${logoBase64}" alt="" style="height: 90px; width: 160px; opacity: 90%" />`);

//     return html;
//   } catch (err) {
//     return Promise.reject("Could not load html template");
//   }
// }
// async function generatePdf0(template, data, options) {
//   // console.log("genPdf: template: ", template);
//   // console.log("dtata : ", data);
//   try {
//     const res = await getTemplateHtml(template);
//     const templateCompiled = hb.compile(res, { strict: true });
//     const htmlTemplate = templateCompiled(data);
//     const browser = await puppeteer.launch({
//       // headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       headless: true, args: ["--no-sandbox"],
//     });
//     const page = await browser.newPage();
//     await page.setContent(htmlTemplate);
//     await page.pdf(options);
//     await browser.close();
//     // console.log("PDF Generated !! file: " + options.path);
//     return options.path;
//   } catch (err) {
//     console.error("Error generatePdf");
//     console.error(err);
//     throw err;
//   }
// }
// function getImageBase640(imagePath) {
//   const image = fs.readFileSync(imagePath);
//   return `data:image/png;base64,${image.toString("base64")}`;
// }
// router.get("/GetLettreMission0/:ClientMissionId", async (req, res) => {
//   const clientMissionId = req.params.ClientMissionId;
//   console.log(req.params);
//   try {
//     // Récupérer les informations du client par son ID
//     const clientMissionData = await GetLettreMissions(clientMissionId);

//     if (!clientMissionData || clientMissionData.length === 0) {
//       return res.status(404).send("Client mission not found");
//     }
//     const currentDate = new Date();
//     const formattedDate = [String(currentDate.getDate()).padStart(2, "0"), String(currentDate.getMonth() + 1).padStart(2, "0"), currentDate.getFullYear()].join("/");
//     console.log("currentFormated date : ", formattedDate);

//     const clientMission = clientMissionData[0];
//     const clientId = clientMission.ClientId;

//     // Complétez les données du client avec les informations associées
//     const promises = [GetClient(clientId), GetProches(clientId), GetClientPieces(clientId), GetPatrimoines(clientId), GetPassifs(clientId), GetBudgets(clientId), GetConjoint(clientId), GetClientMissions(clientId), GetClientMissionPrestations(clientId), GetClientTaches(clientId)];

//     const [clientt, proches, clientPieces, patrimoines, passifs, budgets, conjoint, clientMissions, clientMissionPrestations, clientTaches] = await Promise.all(promises);
//     function formatDateFromString(dateString) {
//       const date = new Date(dateString);

//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
//       const year = date.getFullYear();

//       return `${day}/${month}/${year}`;
//     }
//     const DateResidence = clientt[0].DateResidence;
//     const formattedResidenceDate = formatDateFromString(DateResidence);
//     console.log("DateResidence : ", formatDateFromString);
//     const client = {
//       CurrentDate: formattedDate,
//       Client: clientt,
//       Proches: proches,
//       ClientPieces: clientPieces,
//       Patrimoines: patrimoines,
//       Passifs: passifs,
//       Budgets: budgets,
//       Conjoint: conjoint,
//       ClientMissions: clientMissions,
//       ClientMissionPrestations: clientMissionPrestations,
//       ClientTaches: clientTaches,
//       ClientMissionId: clientMissionId,
//       DateResidence: formattedResidenceDate,
//     };
//     const ClientSituationFamiliale = client.Client[0].SituationFamiliale;

//     // Définissez le modèle HTML pour le PDF
//     const template = "./templates/Lettre_Mission_Maroc.html";
//     const fileName = `./pdfs/LM_M_${clientId}_${new Date().getTime()}.pdf`;

//     // Options pour la génération du PDF
//     const pdfOptions = { path: fileName, format: "A4", printBackground: true };

//     // Générez le PDF avec les données du client
//     const generatedPdfPath = await generatePdf(template, client, pdfOptions);
//     if (!fs.existsSync("./pdfs")) {
//       fs.mkdirSync("./pdfs");
//     }
//     //console.log("clientMissionData : ", clientMissionData);
//     // console.log("client : ", client);

//     // Lisez le fichier PDF généré et envoyez-le en réponse
//     const data = fs.readFileSync(generatedPdfPath);
//     // delete file
//     setTimeout(() => {
//       fs.rmSync(generatedPdfPath);
//     }, 1000);
//     res.contentType("application/pdf");
//     res.send(data);
//   } catch (error) {
//     console.error("Error generating PDF: ", error);
//     res.status(500).send(error);
//   }
// });

router.get("/GetLettreMission/:ClientMissionId", async (req, res) => {
  const clientMissionId = req.params.ClientMissionId;
  try {
    // Récupérer les informations du client par son ID
    const clientMissionData = await GetLettreMissions(clientMissionId);

    if (!clientMissionData || clientMissionData.length === 0) {
      return res.status(404).send("Client mission not found");
    }
    const currentDate = new Date();
    const formattedDate = [String(currentDate.getDate()).padStart(2, "0"), String(currentDate.getMonth() + 1).padStart(2, "0"), currentDate.getFullYear()].join("/");

    const clientMission = clientMissionData[0];
    const clientId = clientMission.ClientId;

    // Complétez les données du client avec les informations associées
    const promises = [GetClient(clientId), GetProches(clientId), GetClientPieces(clientId), GetPatrimoines(clientId), GetPassifs(clientId), GetBudgets(clientId), GetConjoint(clientId), GetClientMissions(clientId), GetClientMissionPrestations(clientId), GetClientTaches(clientId)];

    const [clientt, proches, clientPieces, patrimoines, passifs, budgets, conjoint, clientMissions, clientMissionPrestations, clientTaches] = await Promise.all(promises);
    function formatDateFromString(dateString) {
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    const DateResidence = clientt[0].DateResidence;
    const formattedResidenceDate = formatDateFromString(DateResidence);
    const client = {
      CurrentDate: formattedDate,
      Client: clientt,
      Proches: proches,
      ClientPieces: clientPieces,
      Patrimoines: patrimoines,
      Passifs: passifs,
      Budgets: budgets,
      Conjoint: conjoint,
      ClientMissions: clientMissions,
      ClientMissionPrestations: clientMissionPrestations,
      ClientTaches: clientTaches,
      ClientMissionId: clientMissionId,
      DateResidence: formattedResidenceDate,
    };
    const ClientSituationFamiliale = client.Client[0].SituationFamiliale;

    // Définissez le modèle HTML pour le PDF
    // const template = "./templates/Lettre_Mission_Maroc.html";
    const template = path.resolve(__dirname, "../templates/Lettre_Mission_Maroc.html");
    // const fileName = `./pdfs/LM_M_${clientId}_${new Date().getTime()}.pdf`;
    const fileName = path.resolve(__dirname, `../pdfs/LM_M_${clientId}_${new Date().getTime()}.pdf`);

    // Options pour la génération du PDF
    const pdfOptions = { path: fileName, format: "A4", printBackground: true };

    const photo1 = getImageBase64(path.resolve(__dirname, "../templates/assets/LOGO-BGG.png"));

    let imagesToReplace = [{ old: `<img src="../LOGO-BGG.png" alt="" style="height: 90px; width: 160px; opacity: 90%" />`, new: `<img src="${photo1}" alt="" style="height: 90px; width: 160px; opacity: 90%" />` }];
    // Générez le PDF avec les données du client
    const generatedPdfPath = await generatePdf(template, client, pdfOptions, imagesToReplace);
    const data = fs.readFileSync(generatedPdfPath);
    // delete file
    setTimeout(() => {
      fs.rmSync(generatedPdfPath);
    }, 1000);
    res.contentType("application/pdf");
    res.send(data);
  } catch (error) {
    console.error("Error generating PDF: ", error);
    log.Info(error);
    res.status(500).send(error);
  }
});

//#endregion Client

module.exports = router;
