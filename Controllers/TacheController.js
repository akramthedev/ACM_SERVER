var express = require("express");
var router = express.Router();
const { GetTaches } = require("../Infrastructure/TacheRepository");

//#region Tache
router.get("/GetTaches", async (request, response) => {
  await GetTaches()
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion Tache

module.exports = router;
