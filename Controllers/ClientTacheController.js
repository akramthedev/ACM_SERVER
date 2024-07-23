var express = require("express");
var router = express.Router();
const { GetClientTaches } = require("../Infrastructure/ClientTacheRepository");

//#region ClientTache
router.get("/GetClientTaches", async (request, response) => {
  await GetClientTaches(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});

router.post("/CreateClientTache", async (request, response) => {
  await CreateClientTache(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion CLientTache

module.exports = router;
