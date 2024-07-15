var express = require("express");
var router = express.Router();
const { GetMissions } = require("../Infrastructure/MissionRepository");

//#region Mission
router.get("/GetMissions", async (request, response) => {
  await GetMissions(request.query.ServiceId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion Mission

module.exports = router;
