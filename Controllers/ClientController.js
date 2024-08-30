const puppeteer = require("puppeteer");
const hb = require("handlebars");
const utils = require("util");
const path = require("path");
const fs = require("fs");
var express = require("express");
var router = express.Router();
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
//#region Client
router.get("/GetClients", async (request, response) => {
  await GetClients(request.query.CabinetId)
    .then(async (res) => {
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
    .catch((error) => response.status(400).send(error));
});
router.get("/GetClient", async (request, response) => {
  await GetClient(request.query.ClientId)
    .then(async (res) => {
      if (res != null && res.length > 0) {
        let client = res[0];

        let clientFirectory = `./Pieces/${client.ClientId}/`;
        if (!fs.existsSync(clientFirectory)) {
          client.Photo = null;
        } else {
          let photoProfile = fs.readdirSync(clientFirectory).find((x) => x.toLowerCase().startsWith("profile"));
          if (photoProfile != null) client.Photo = `Pieces/${client.ClientId}/${photoProfile}`;
          else client.Photo = null;
        }

        const promise1 = GetProches(client.ClientId);
        const promise2 = GetClientPieces(client.ClientId);
        const promise3 = GetPatrimoines(client.ClientId);
        const promise4 = GetPassifs(client.ClientId);
        const promise5 = GetBudgets(client.ClientId);
        const promise6 = GetConjoint(client.ClientId);
        const promise7 = GetClientMissions(client.ClientId);
        const promise8 = GetClientMissionPrestations(client.ClientId);
        const promise9 = GetClientTaches(client.ClientId);

        Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8, promise9]).then(
          async (values) => {
            client.Proches = values[0];
            client.ClientPieces = values[1];
            // Récupérer les patrimoines et ajouter le chemin du document de statut
            client.Patrimoines = values[2].map((patrimoine) => {
              const statusDocumentDirectory = `./Pieces/${client.ClientId}/Status/`;
              if (fs.existsSync(statusDocumentDirectory)) {
                let statusDocument = fs.readdirSync(statusDocumentDirectory).find((file) => file.toLowerCase().startsWith(patrimoine.PatrimoineId.toLowerCase()));
                if (statusDocument) {
                  patrimoine.StatusDocumentPath = `Pieces/${client.ClientId}/Status/${statusDocument}`;
                } else {
                  patrimoine.StatusDocumentPath = null;
                }
              } else {
                patrimoine.StatusDocumentPath = null;
              }
              return patrimoine;
            });
            client.Passifs = values[3];
            client.Budgets = values[4];
            client.Conjoint = values[5];
            client.ClientMissions = values[6];
            client.ClientMissionPrestations = values[7];
            client.ClientTaches = values[8];
            response.status(200).send(client);
          },
          (error) => {
            console.log("Error promise.All: ", error);
            client.Proches = null;
            client.ClientPieces = null;
            client.Patrimoines = null;
            client.Passifs = null;
            client.Budgets = null;
            client.Conjoint = null;
            client.ClientMissions = null;
            client.ClientMissionPrestations = null;
            client.ClientTaches = null;
            response.status(200).send(client);
          }
        );
      } else response.status(200).send(null);
    })
    .catch((error) => response.status(400).send(error));
});
router.post("/CreateClient", async (request, response) => {
  await CreateClient(request.body)
    .then(async (res) => {
      if (res != null && res == true) {
        // create proches
        if (request.body.Proches != null && request.body.Proches.length > 0) {
          for (let i = 0; i < request.body.Proches.length; i++) {
            await CreateProche(request.body.Proches[i])
              .then((resProche) => {
                console.log("resProche: ", resProche);
              })
              .catch((errorProche) => {
                console.log("ErrorProche: ", errorProche);
              });
          }
        }
        // create conjoint
        if (request.body.Conjoint != null && request.body.Conjoint.length > 0) {
          for (let i = 0; i < request.body.Conjoint.length; i++) {
            console.log("request.body.Conjoint : ", request.body.Conjoint);
            await CreateConjoint(request.body.Conjoint[i])
              .then((resConjoint) => {
                console.log("resConjoint: ", resConjoint);
              })
              .catch((errorConjoint) => {
                console.log("ErrorConjoint: ", errorConjoint);
              });
          }
        }

        // create service
        if (request.body.Service != null) {
          await CreateService(request.body.Service)
            .then((resService) => {
              console.log("resService: ", resService);
            })
            .catch((errorService) => {
              console.log("ErrorService: ", errorService);
            });
        }

        // create ClientMission
        if (request.body.ClientMission != null && request.body.ClientMission.length > 0) {
          for (let i = 0; i < request.body.ClientMission.length; i++) {
            await CreateClientMission(request.body.ClientMission[i])
              .then((resClientMission) => {
                console.log("resClientMission: ", resClientMission);
              })
              .catch((errorClientMission) => {
                console.log("ErrorClientMission: ", errorClientMission);
              });
          }
        }
        // create ClientMissionPrestation
        if (request.body.ClientMissionPrestation != null && request.body.ClientMissionPrestation.length > 0) {
          for (let i = 0; i < request.body.ClientMissionPrestation.length; i++) {
            await CreateClientMissionPrestation(request.body.ClientMissionPrestation[i])
              .then((resClientMissionPrestation) => {
                console.log("resClientMissionPrestation: ", resClientMissionPrestation);
              })
              .catch((errorClientMissionPrestation) => {
                console.log("ErrorClientMissionPrestation: ", errorClientMissionPrestation);
              });
          }
        }
        // create ClientTache
        if (request.body.ClientTaches != null && request.body.ClientTaches.length > 0) {
          for (let i = 0; i < request.body.ClientTaches.length; i++) {
            await CreateClientTache(request.body.ClientTaches[i])
              .then((resClientTaches) => {
                console.log("resClientTaches: ", resClientTaches);
              })
              .catch((errorClientTaches) => {
                console.log("errorClientTaches: ", errorClientTaches);
              });
          }
        }
      }

      response.status(200).send(res);
    })
    .catch((error) => response.status(400).send(error));
});
router.put("/UpdateClient", async (request, response) => {
  await UpdateClient(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.delete("/DeleteClient/:ClientId", async (request, response) => {
  await DeleteClient(request.params.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});

const readFile = utils.promisify(fs.readFile);
// async function getTemplateHtml(template) {
//   try {
//     const invoicePath = path.resolve(template);
//     return await readFile(invoicePath, "utf8");
//   } catch (err) {
//     return Promise.reject("Could not load html template");
//   }
// }
async function getTemplateHtml(template) {
  try {
    const invoicePath = path.resolve(template);
    let html = await fs.promises.readFile(invoicePath, "utf8");

    // Intégrer les images en base64
    const logoBase64 = getImageBase64(path.resolve(__dirname, "../LOGO-BGG.png"));
    console.log("__dirname: ", __dirname);
    html = html.replace(/<img src="\.\.\/LOGO-BGG\.png" alt="" style="height: 90px; width: 160px; opacity: 90%" \/>/g, `<img src="${logoBase64}" alt="" style="height: 90px; width: 160px; opacity: 90%" />`);

    return html;
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
async function generatePdf(template, data, options) {
  // console.log("genPdf: template: ", template);
  // console.log("dtata : ", data);
  try {
    const res = await getTemplateHtml(template);
    const templateCompiled = hb.compile(res, { strict: true });
    const htmlTemplate = templateCompiled(data);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.pdf(options);
    await browser.close();
    // console.log("PDF Generated !! file: " + options.path);
    return options.path;
  } catch (err) {
    console.error("\n --------------------- \n\n error generatePdf");
    console.error(err);
    throw err;
  }
}
function getImageBase64(imagePath) {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString("base64")}`;
}
router.get("/GetLettreMission/:ClientMissionId", async (req, res) => {
  const clientMissionId = req.params.ClientMissionId;
  console.log(req.params);
  try {
    // Récupérer les informations du client par son ID
    const clientMissionData = await GetLettreMissions(clientMissionId);

    if (!clientMissionData || clientMissionData.length === 0) {
      return res.status(404).send("Client mission not found");
    }
    const currentDate = new Date();
    const formattedDate = [String(currentDate.getDate()).padStart(2, "0"), String(currentDate.getMonth() + 1).padStart(2, "0"), currentDate.getFullYear()].join("/");
    console.log("currentFormated date : ", formattedDate);

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
    console.log("DateResidence : ", formatDateFromString);
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
    const template = "./templates/Lettre_Mission_Maroc.html";
    const fileName = `./pdfs/LM_M_${clientId}_${new Date().getTime()}.pdf`;

    // Options pour la génération du PDF
    const pdfOptions = { path: fileName, format: "A4", printBackground: true };

    // Générez le PDF avec les données du client
    const generatedPdfPath = await generatePdf(template, client, pdfOptions);
    if (!fs.existsSync("./pdfs")) {
      fs.mkdirSync("./pdfs");
    }
    //console.log("clientMissionData : ", clientMissionData);
    // console.log("client : ", client);

    // Lisez le fichier PDF généré et envoyez-le en réponse
    const data = fs.readFileSync(generatedPdfPath);
    // delete file
    setTimeout(() => {
      fs.rmSync(generatedPdfPath);
    }, 1000);
    res.contentType("application/pdf");
    res.send(data);
  } catch (error) {
    console.error("Error generating PDF: ", error);
    res.status(500).send(error);
  }
});

//#endregion Client

module.exports = router;
