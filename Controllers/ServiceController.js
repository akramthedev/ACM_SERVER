var express = require("express");
var router = express.Router();
const { GetServices } = require("../Infrastructure/ServiceRepository");
const log = require("node-file-logger");

//#region Service
router.get("/GetServices", async (request, response) => {
  await GetServices(request.query.CabinetId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Service

module.exports = router;
