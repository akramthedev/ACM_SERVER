var express = require("express");
var router = express.Router();
const { GetClientTaches, CreateClientTache, UpdateClientTache, CreateClientTacheCustom, GetClientTachesSimple, GetAllClientTaches, DeleteClientTache } = require("../Infrastructure/ClientTacheRepository");

//#region ClientTache
router.get("/GetClientTaches", async (request, response) => {
  await GetClientTaches(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});

router.get("/GetClientTachesSimple", async (request, response) => {
  await GetClientTachesSimple(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.get("/GetAllClientTaches", async (request, response) => {
  await GetAllClientTaches()
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});

router.post("/CreateClientTache", async (request, response) => {
  await CreateClientTache(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.post("/CreateClientTacheCustom", async (request, response) => {
  await CreateClientTacheCustom(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.put("/UpdateClientTache", async (request, response) => {
  console.log("request body udateClientTache : ", request.body);
  await UpdateClientTache(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.delete("/DeleteClientTache/:ClientTacheId", async (request, response) => {
  await DeleteClientTache(request.params.ClientTacheId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion CLientTache

module.exports = router;
