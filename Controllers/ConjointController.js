var express = require('express');
var router = express.Router();
const { GetConjoint, CreateConjoint, UpdateConjoint, DeleteConjoint } = require('../Infrastructure/ConjointRepository');

//#region Conjoint
router.get("/GetConjoint", async (request, response) => {
    await GetConjoint(request.query.ClientId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.post("/CreateConjoint", async (request, response) => {
    await CreateConjoint(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.put("/UpdateConjoint", async (request, response) => {
    await UpdateConjoint(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.delete("/DeleteConjoint/:ConjointId", async (request, response) => {
    await DeleteConjoint(request.params.ConjointId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
//#endregion Conjoint

module.exports = router;