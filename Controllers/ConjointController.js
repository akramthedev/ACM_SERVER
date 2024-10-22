var express = require("express");
var router = express.Router();
const { GetConjoint, CreateConjoint, UpdateConjoint, DeleteConjoint } = require("../Infrastructure/ConjointRepository");
const log = require("node-file-logger");

//#region Conjoint
router.get("/GetConjoint", async (request, response) => {
  await GetConjoint(request.query.ClientId)
    .then((res) => {
      // log.Info("GetConjoint", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetConjoint Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateConjoint", async (request, response) => {
  await CreateConjoint(request.body)
    .then((res) => {
      log.Info("CreateConjoint", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("CreateConjoint Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.put("/UpdateConjoint", async (request, response) => {
  await UpdateConjoint(request.body)
    .then((res) => {
      log.Info("UpdateConjoint", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Info(error);
      log.Error("UpdateConjoint Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      response.status(400).send(error);
    });
});
router.delete("/DeleteConjoint/:ConjointId", async (request, response) => {
  await DeleteConjoint(request.params.ConjointId)
    .then((res) => {
      log.Info("DeleteConjoint", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params.ConjointId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("DeleteConjoint Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params.ConjointId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Conjoint

module.exports = router;
