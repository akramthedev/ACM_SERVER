var express = require("express");
var router = express.Router();
const { GetClientMissions, CreateClientMission, DeleteClientMission } = require("../Infrastructure/ClientMissionRepository");
const log = require("node-file-logger");

//#region ClientMission
router.get("/GetClientMissions", async (request, response) => {
  await GetClientMissions(request.query.ClientId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateClientMission", async (request, response) => {
  await CreateClientMission(request.body)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.delete("/DeleteClientMission/:ClientMissionId", async (request, response) => {
  await DeleteClientMission(request.params.ClientMissionId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion CLientMission

module.exports = router;
