var express = require("express");
var router = express.Router();
const { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient } = require("../Infrastructure/ClientRepository");
const { GetProches, CreateProche } = require("../Infrastructure/ProcheRepository");
const { GetClientPieces } = require("../Infrastructure/ClientPieceRepository");
const { GetPatrimoines } = require("../Infrastructure/PatrimoineRepository");
const { GetPassifs } = require("../Infrastructure/PassifRepository");
const { GetBudgets } = require("../Infrastructure/BudgetRepository");
const { GetConjoint } = require("../Infrastructure/ConjointRepository");
//#region Client
router.get("/GetClients", async (request, response) => {
  await GetClients(request.query.CabinetId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.get("/GetClient", async (request, response) => {
  await GetClient(request.query.ClientId)
    .then((res) => {
      if (res != null && res.length > 0) {
        let client = res[0];
        const promise1 = GetProches(client.ClientId);
        const promise2 = GetClientPieces(client.ClientId);
        const promise3 = GetPatrimoines(client.ClientId);
        const promise4 = GetPassifs(client.ClientId);
        const promise5 = GetBudgets(client.ClientId);
        const promise6 = GetConjoint(client.ClientId);

        Promise.all([promise1, promise2, promise3, promise4, promise5, promise6]).then(
          (values) => {
            client.Proches = values[0];
            client.ClientPieces = values[1];
            client.Patrimoines = values[2];
            client.Passifs = values[3];
            client.Budgets = values[4];
            client.Conjoint = values[5];
            response.status(200).send(client);
          },
          (error) => {
            console.log("Error promise.All: ", error);
            client.Proches = null;
            client.ClientPieces = null;
            client.Patrimoines = null;
            client.Passifs = null;
            client.Budgets = null;
            client.Conjoint = null;
            response.status(200).send(client);
          }
        );
      } else response.status(200).send(null);
    })
    .catch((error) => response.status(400).send(error));
});
router.post("/CreateClient", async (request, response) => {
  await CreateClient(request.body)
    .then(async (res) => {
      if (res != null && res == true) {
        // create proches
        if (request.body.Proches != null && request.body.Proches.length > 0) {
          for (let i = 0; i < request.body.Proches.length; i++) {
            await CreateProche(request.body.Proches[i])
              .then((resProche) => {
                console.log("resProche: ", resProche);
              })
              .catch((errorProche) => {
                console.log("ErrorProche: ", errorProche);
              });
          }
        }
        // create conjoint
        if (request.body.Conjoint != null) {
          await CreateConjoint(request.body.Conjoint)
            .then((resConjoint) => {
              console.log("resConjoint: ", resConjoint);
            })
            .catch((errorConjoint) => {
              console.log("ErrorConjoint: ", errorConjoint);
            });
        }

        // create service
        if (request.body.Service != null) {
          await CreateService(request.body.Service)
            .then((resService) => {
              console.log("resService: ", resService);
            })
            .catch((errorService) => {
              console.log("ErrorService: ", errorService);
            });
        }
      }
      response.status(200).send(res);
    })
    .catch((error) => response.status(400).send(error));
});
router.put("/UpdateClient", async (request, response) => {
  await UpdateClient(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
router.delete("/DeleteClient/:ClientId", async (request, response) => {
  await DeleteClient(request.params.ClientId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion Client

module.exports = router;
