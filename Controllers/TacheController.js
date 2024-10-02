var express = require("express");
var router = express.Router();
const { GetTaches } = require("../Infrastructure/TacheRepository");
const log = require("node-file-logger");

//#region Tache
router.get("/GetTaches", async (request, response) => {
  await GetTaches()
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Tache

module.exports = router;
