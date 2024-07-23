var express = require("express");
var router = express.Router();
const { GetClientMissions, CreateClientMission, DeleteClientMission } = require("../Infrastructure/ClientMissionRepository");

//#region ClientMission
router.get("/GetClientMissions", async (request, response) => {
  await GetClientMissions(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.post("/CreateClientMission", async (request, response) => {
  await CreateClientMission(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.delete("/DeleteClientMission/:ClientMissionId", async (request, response) => {
  await DeleteClientMission(request.params.ClientMissionId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion CLientMission

module.exports = router;
