var express = require("express");
var router = express.Router();
const { GetClientMissionPrestations, CreateClientMissionPrestation, DeleteClientMissionPrestation, GetClientMissionPrestationSimple, GetUnassignedClientMissionPrestationSimple } = require("../Infrastructure/ClientMissionPrestationRepository");

//#region ClientMissionPrestation
router.get("/GetClientMissionPrestations", async (request, response) => {
  await GetClientMissionPrestations(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.get("/GetClientMissionPrestationSimple", async (request, response) => {
  await GetClientMissionPrestationSimple(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.get("/GetUnassignedClientMissionPrestationSimple", async (request, response) => {
  await GetUnassignedClientMissionPrestationSimple(request.query.ClientId, request.query.MissionId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.post("/CreateClientMissionPrestation", async (request, response) => {
  await CreateClientMissionPrestation(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.delete("/DeleteClientMissionPrestation/:ClientMissionPrestationId", async (request, response) => {
  await DeleteClientMissionPrestation(request.params.ClientMissionPrestationId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion CLientMissionPrestation

module.exports = router;
