var express = require("express");
var router = express.Router();
const { GetClientTaches, CreateClientTache,MarkAsDone,  UpdateClientTache,UpdateClientTacheDates, CreateClientTacheCustom, GetClientTachesSimple, GetAllClientTaches, DeleteClientTache, GetUnassignedClientTache, GetClientTachesAllOfThem } = require("../Infrastructure/ClientTacheRepository");
const { GetClientTacheDetailsForEmail } = require("../Infrastructure/EmailRepository");
var mailer = require("../Helper/mailer");
const log = require("node-file-logger");

function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, "0"); // Obtenir le jour
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtenir le mois (les mois commencent à 0)
  const year = date.getFullYear(); // Obtenir l'année
  return `${day}/${month}/${year}`;
}

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
        log.Info(error);
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

//#region ClientTache
router.get("/GetClientTaches", async (request, response) => {
  await GetClientTaches(request.query.ClientId)
    .then((res) => {
      // log.Info("GetClientTaches", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetClientTaches Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(error);
      response.status(400).send(error);
    });
});


router.get("/GetClientTachesAllOfThem", async (request, response) => {
  await GetClientTachesAllOfThem()
    .then((res) => {
      console.log(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
});


router.put('/MarkAsDone/:ClientTacheId', async (req, res) => {
  try {
    console.log("A Executed...")
    const { ClientTacheId } = req.params;  
    await MarkAsDone(ClientTacheId);  
    res.status(200).json({ message: "Tâche marquée comme faite avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});


router.get("/GetClientTachesSimple", async (request, response) => {
  await GetClientTachesSimple(request.query.ClientId)
    .then((res) => {
      // log.Info("GetClientTachesSimple", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetClientTachesSimple Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.get("/GetAllClientTaches", async (request, response) => {
  await GetAllClientTaches()
    .then((res) => {
      // log.Info("GetAllClientTaches", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, null);
      console.log('666');
      console.log(res);
      console.log("666");
      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetAllClientTaches Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, null);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.get("/GetUnassignedClientTache", async (request, response) => {
  await GetUnassignedClientTache(request.query.ClientId, request.query.PrestationId)
    .then((res) => {
      // log.Info("GetUnassignedClientTache", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, `${request.query.ClientId} , ${ request.query.PrestationId}`);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetUnassignedClientTache Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, `${request.query.ClientId} , ${ request.query.PrestationId}`);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateClientTache", async (request, response) => {
  await CreateClientTache(request.body)
    .then((res) => {
      log.Info("CreateClientTache", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
console.log("dans la methode ")
      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("CreateClientTache Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateClientTacheCustom", async (request, response) => {
  await CreateClientTacheCustom(request.body)
    .then((res) => {
      log.Info("CreateClientTacheCustom", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("CreateClientTacheCustom Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
      response.status(400).send(error);
    });
});






router.put("/UpdateClientTacheDates", async (request, response) => {
  console.log("request body UpdateClientTacheDates : ", request.body);

  try {
    const originalTask = await GetClientTacheDetailsForEmail(request.body.ClientTacheId);
    const originalStatus = originalTask[0]?.Status; 

    if (originalStatus !== "Terminé" && request.body.Status === "Terminé") {
      request.body.Date_Execution = new Date();
    } else if (originalStatus === "Terminé" || request.body.Date_Execution === null) {
      request.body.Date_Execution = originalTask[0].Date_Execution;  
    }

    await UpdateClientTacheDates(request.body);
    
  } catch (error) {
    log.Error("UpdateClientTache Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body.ClientTacheId);

    return response.status(400).send(error);
  }
});




router.put("/UpdateClientTache", async (request, response) => {
  console.log("request body updateClientTache : ", request.body);

  try {
    // Récupérer la tâche avant la mise à jour pour obtenir l'ancien statut
    const originalTask = await GetClientTacheDetailsForEmail(request.body.ClientTacheId);
    const originalStatus = originalTask[0]?.Status; // Récupérer l'ancien statut

    // Vérifier si le statut a changé de "non terminé" à "Terminé"
    if (originalStatus !== "Terminé" && request.body.Status === "Terminé") {
      // Si le statut change en "Terminé", mettre à jour la date d'exécution à la date actuelle
      request.body.Date_Execution = new Date();
    } else if (originalStatus === "Terminé" || request.body.Date_Execution === null) {
      // Si la tâche est déjà "Terminé", ne pas changer la Date_Execution
      request.body.Date_Execution = originalTask[0].Date_Execution; // Garder la date d'exécution d'origine
    }

    // Mettre à jour la tâche (update même si l'email échoue)
    await UpdateClientTache(request.body);

    // Récupérer les détails de la tâche après la mise à jour
    const clientTacheDetails = await GetClientTacheDetailsForEmail(request.body.ClientTacheId);
    log.Info("Tache updated successfully", JSON.stringify(clientTacheDetails), `Updated by: ${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body.ClientTacheId);

    console.log("response GetClientTacheDetailsForEmail : ", clientTacheDetails);
    console.log("originalstatus : ", originalStatus);

    // Essayer d'envoyer l'email si le statut passe de "non terminé" à "Terminé"
    if (originalStatus !== "Terminé" && request.body.Status === "Terminé") {
      const agentEmail = clientTacheDetails[0]?.AgentEmail;
      const clientNom=clientTacheDetails[0]?.ClientNom
      const clientPrenom=clientTacheDetails[0]?.ClientPrenom


      if (agentEmail) {
        const emailSubject = `Tâche terminée pour ${clientPrenom} ${clientNom} : ${request.body.Intitule}`;
        const emailBody = `
          <p>La tâche suivante a été marquée comme terminée :</p>
          <ul>
            <li><strong>Client :</strong> ${clientPrenom} ${clientNom}</li>
            <li><strong>Intitulé :</strong> ${request.body.Intitule}</li>
            <li><strong>Date d'exécution :</strong> ${formatDateToDDMMYYYY(request.body.Date_Execution) || "Non spécifiée"}</li>
          </ul>
          <p>Merci.</p>
        `;

        // Essayer d'envoyer l'email, mais ne pas affecter la mise à jour en cas d'échec
        try {
          await sendEmail(agentEmail, emailSubject, emailBody);
          console.log("Email envoyé à l'agent :", agentEmail);
          log.Info("Email envoyé à l'agent :", agentEmail);
        } catch (emailError) {
          log.Info("Erreur lors de l'envoi de l'email :", emailError);
          console.error("Erreur lors de l'envoi de l'email :", emailError);
        }
      } else {
        log.Info("Aucun email d'agent trouvé pour la tâche.");
        console.log("Aucun email d'agent trouvé pour la tâche.");
      }
    }

    // Envoyer la réponse avec les détails de la tâche, même si l'email échoue
    return response.status(200).send(clientTacheDetails);
  } catch (error) {
    log.Error("UpdateClientTache Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body.ClientTacheId);

    return response.status(400).send(error);
  }
});
router.delete("/DeleteClientTache/:ClientTacheId", async (request, response) => {
  await DeleteClientTache(request.params.ClientTacheId)
    .then((res) => {
      log.Info("DeleteClientTache", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params.ClientTacheId);
      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("DeleteClientTache Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params.ClientTacheId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion CLientTache

module.exports = router;
