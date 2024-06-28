var express = require('express');
var router = express.Router();
const { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient } = require('../Infrastructure/ClientRepository');
const { GetProches, CreateProche, } = require('../Infrastructure/ProcheRepository');
const { GetClientPieces, } = require('../Infrastructure/ClientPieceRepository');

//#region Client
router.get("/GetClients", async (request, response) => {
    await GetClients(request.query.CabinetId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.get("/GetClient", async (request, response) => {
    await GetClient(request.query.ClientId)
        .then((res) => {
            if (res != null && res.length > 0) {
                let client = res[0];
                const promise1 = GetProches(client.ClientId);
                const promise2 = GetClientPieces(client.ClientId);
                Promise.all([promise1, promise2])
                    .then((values) => {
                        client.Proches = values[0];
                        client.ClientPieces = values[1];
                        response.status(200).send(client);
                    }, (error) => {
                        console.log("Error promise.All: ", error);
                        client.Proches = null;
                        client.ClientPieces = null;
                        response.status(200).send(client);
                    });
            }
            else
                response.status(200).send(null);
        })
        .catch((error) => response.status(400).send(error))
});
router.post("/CreateClient", async (request, response) => {
    await CreateClient(request.body)
        .then(async (res) => {
            if (res != null && res == true) {
                // create proches
                if (request.body.Proches != null && request.body.Proches.length > 0) {
                    for (let i = 0; i < request.body.Proches.length; i++) {
                        await CreateProche(request.body.Proches[i])
                            .then((resProche) => { console.log("resProche: ", resProche); })
                            .catch((errorProche) => { console.log("ErrorProche: ", errorProche); })
                    }
                }
                // create conjoint
                if (request.body.Conjoint != null) {
                    await CreateConjoint(request.body.Conjoint)
                        .then((resConjoint) => { console.log("resConjoint: ", resConjoint); })
                        .catch((errorConjoint) => { console.log("ErrorConjoint: ", errorConjoint); })
                }
            }
            response.status(200).send(res);
        })
        .catch((error) => response.status(400).send(error))
});
router.put("/UpdateClient", async (request, response) => {
    await UpdateClient(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.delete("/DeleteClient/:ClientId", async (request, response) => {
    await DeleteClient(request.params.ClientId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
//#endregion Client

module.exports = router;