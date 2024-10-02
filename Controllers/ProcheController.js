var express = require("express");
var router = express.Router();
const { GetProches, CreateProche, UpdateProche, DeleteProche } = require("../Infrastructure/ProcheRepository");
const log = require("node-file-logger");

//#region Proche
router.get("/GetProches", async (request, response) => {
  await GetProches(request.query.ClientId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateProche", async (request, response) => {
  await CreateProche(request.body)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.put("/UpdateProche", async (request, response) => {
  await UpdateProche(request.body)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.delete("/DeleteProche/:ProcheId", async (request, response) => {
  await DeleteProche(request.params.ProcheId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Proche

module.exports = router;
