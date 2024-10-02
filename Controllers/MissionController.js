var express = require("express");
var router = express.Router();
const { GetMissions, GetMissionsWithPrestationsCount } = require("../Infrastructure/MissionRepository");
const log = require("node-file-logger");

//#region Mission
router.get("/GetMissions", async (request, response) => {
  await GetMissions(request.query.ServiceId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.get("/GetMissionsWithPrestationsCount", async (request, response) => {
  await GetMissionsWithPrestationsCount()
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Mission

module.exports = router;
