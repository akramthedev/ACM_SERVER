var express = require("express");
var router = express.Router();
const { GetClientMissionPrestations, CreateClientMissionPrestation, DeleteClientMissionPrestation, GetClientMissionPrestationSimple, GetUnassignedClientMissionPrestationSimple, CreateClientMissionPrestationCustom } = require("../Infrastructure/ClientMissionPrestationRepository");
const log = require("node-file-logger");

//#region ClientMissionPrestation
router.get("/GetClientMissionPrestations", async (request, response) => {
  await GetClientMissionPrestations(request.query.ClientId)
    .then((res) => {
      // log.Info("GetClientMissionPrestations", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetClientMissionPrestations Error ", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      log.Info(error);
      response.status(400).send(error);
    });
});
router.get("/GetClientMissionPrestationSimple", async (request, response) => {
  await GetClientMissionPrestationSimple(request.query.ClientId)
    .then((res) => {
      // log.Info("GetClientMissionPrestationSimple", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetClientMissionPrestationSimple Error ", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.get("/GetUnassignedClientMissionPrestationSimple", async (request, response) => {
  await GetUnassignedClientMissionPrestationSimple(request.query.ClientMissionId)
    .then((res) => {
      // log.Info("GetUnassignedClientMissionPrestationSimple", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientMissionId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error("GetUnassignedClientMissionPrestationSimple Error ", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.query.ClientId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateClientMissionPrestation", async (request, response) => {
  await CreateClientMissionPrestation(request.body)
    .then((res) => {
      log.Info("CreateClientMissionPrestation", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("CreateClientMissionPrestation Error ", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`,request.body);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateClientMissionPrestationCustom", async (request, response) => {
  await CreateClientMissionPrestationCustom(request.body)
    .then((res) => {
      log.Info("CreateClientMissionPrestationCustom", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("CreateClientMissionPrestationCustom Error ", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`,request.body);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.delete("/DeleteClientMissionPrestation/:ClientMissionPrestationId", async (request, response) => {
  await DeleteClientMissionPrestation(request.params.ClientMissionPrestationId)
    .then((res) => {
      log.Info("DeleteClientMissionPrestation", JSON.stringify(res), `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params.ClientMissionPrestationId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error("DeleteClientMissionPrestation Error ", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`,request.params.ClientMissionPrestationId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion CLientMissionPrestation

module.exports = router;
