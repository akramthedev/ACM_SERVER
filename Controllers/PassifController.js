var express = require("express");
var router = express.Router();
const { CreatePassif, UpdatePassif, DeletePassif, GetPassifs } = require("../Infrastructure/PassifRepository");

//#region Passif
router.get("/GetPassifs", async (request, response) => {
  await GetPassifs(request.query.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.post("/CreatePassif", async (request, response) => {
  await CreatePassif(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(500).send(error));
});
router.put("/UpdatePassif", async (request, response) => {
  await UpdatePassif(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.delete("/DeletePassif/:PassifId", async (request, response) => {
  await DeletePassif(request.params.PassifId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion Passif

module.exports = router;
