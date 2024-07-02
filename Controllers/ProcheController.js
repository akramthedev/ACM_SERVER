var express = require('express');
var router = express.Router();
const { GetProches, CreateProche, UpdateProche, DeleteProche } = require('../Infrastructure/ProcheRepository');

//#region Proche
router.get("/GetProches", async (request, response) => {
    await GetProches(request.query.ClientId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.post("/CreateProche", async (request, response) => {
    await CreateProche(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.put("/UpdateProche", async (request, response) => {
    await UpdateProche(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.delete("/DeleteProche/:ProcheId", async (request, response) => {
    await DeleteProche(request.params.ProcheId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
//#endregion Proche

module.exports = router;