var express = require('express');
var router = express.Router();
const { CreatePatrimoine, UpdatePatrimoine, DeletePatrimoine, GetPatrimoines } = require('../Infrastructure/PatrimoineRepository');

//#region Patrimoine
router.get("/GetPatrimoines", async (request, response) => {
    await GetPatrimoines(request.query.ClientId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.post("/CreatePatrimoine", async (request, response) => {
    console.log("request: ", request.body)
    await CreatePatrimoine(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(500).send(error))
});
router.put("/UpdatePatrimoine", async (request, response) => {
    await UpdatePatrimoine(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.delete("/DeletePatrimoine/:PatrimoineId", async (request, response) => {
    await DeletePatrimoine(request.params.PatrimoineId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
//#endregion Patrimoine

module.exports = router;