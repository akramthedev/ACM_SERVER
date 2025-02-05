var express = require("express");
var router = express.Router();
const { GetClientTaches, CreateClientTache,CreateGoogleCalendarAccount,GetAccessTokenGoogleCalendar,DeleteGoogleToken, MarkAsDone,  UpdateClientTache,UpdateClientTacheDates, CreateClientTacheCustom, GetClientTachesSimple, GetAllClientTaches, DeleteClientTache, GetUnassignedClientTache, GetClientTachesAllOfThem } = require("../Infrastructure/ClientTacheRepository");
const { GetClientTacheDetailsForEmail } = require("../Infrastructure/EmailRepository");
var mailer = require("../Helper/mailer");
const log = require("node-file-logger");
const sql = require("mssql");



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




router.post("/DeleteGoogleToken", async(request, response)=>{
  await DeleteGoogleToken(request.body)
    .then((res) => {
      response.status(200).send(res);
    })
    .catch((error) => {
      response.status(400).send(error);
    });
})



router.delete("/DeleteEventById/:eventId", async(request, response)=>{

  const {eventId} = request.params;

  if (!eventId) {
    return response.status(400).send({ error: "Event ID is required" });
  }
  try {
    new sql.Request()
          .input("EventIdX", sql.Int , eventId)
          .query("DELETE FROM Evenements WHERE EventId = @EventIdX")  
          .then((result) => {
            console.log(result);
            response.status(200).send(result);

          })
          .catch((error) => reject(error?.originalError?.info?.message || error.message));
  } catch (error) {
    response.status(400).send(error);
  }
})



router.get("/GetAccessTokenGoogleCalendar", async(request, response)=>{
    await GetAccessTokenGoogleCalendar(request.query.ClientIdOfCloack)
      .then((res) => {
        response.status(200).send(res);
      })
      .catch((error) => {
        response.status(400).send(error);
      });
})


router.post("/CreateGoogleCalendarAccount", async(request, response)=>{

  console.warn("A executed...");

  await CreateGoogleCalendarAccount(request.body)
    .then((res) => {
      console.warn("A succeded");
      response.status(200).send(res);
    })
    .catch((error) => {
      console.warn("A failed");
      console.log(error);
      response.status(499).send(error);
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
  
     
    await UpdateClientTache(request.body);
 
    // Envoyer la réponse avec les détails de la tâche, même si l'email échoue
    return response.status(200).send({
      message : "Hello ! "
    });
  } catch (error) {
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
