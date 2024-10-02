var express = require("express");
var router = express.Router();
const { GetPrestations } = require("../Infrastructure/PrestationRepository");
const log = require("node-file-logger");

//#region Prestation
router.get("/GetPrestations", async (request, response) => {
  await GetPrestations(request.query.MissionId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Prestation

module.exports = router;
