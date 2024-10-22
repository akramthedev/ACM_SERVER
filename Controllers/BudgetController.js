var express = require("express");
var router = express.Router();
const log = require("node-file-logger");
const { CreateBudget, UpdateBudget, DeleteBudget, GetBudgets } = require("../Infrastructure/BudgetRepository");

// //#region Budget
// router.get("/GetBudgets", async (request, response) => {
//   await GetBudgets(request.query.ClientId)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(400).send(error));
// });
// router.post("/CreateBudget", async (request, response) => {
//   await CreateBudget(request.body)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(500).send(error));
// });
// router.put("/UpdateBudget", async (request, response) => {
//   await UpdateBudget(request.body)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(400).send(error));
// });
// router.delete("/DeleteBudget/:BudgetId", async (request, response) => {
//   await DeleteBudget(request.params.BudgetId)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(400).send(error));
// });
// //#endregion Budget

//#region Budget
router.get("/GetBudgets", async (request, response) => {
  try {
    const res = await GetBudgets(request.query.ClientId);
    // log.Info("GetBudgets", res, request.query);
    response.status(200).send(res);
  } catch (error) {
    // log.Error("GetBudgets Error", error, request.query);
    response.status(400).send(error);
  }
});

router.post("/CreateBudget", async (request, response) => {
  try {
    const res = await CreateBudget(request.body);
    log.Info("CreateBudget", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
    response.status(200).send(res);
  } catch (error) {
    log.Error("CreateBudget Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
    response.status(500).send(error);
  }
});

router.put("/UpdateBudget", async (request, response) => {
  try {
    const res = await UpdateBudget(request.body);
    log.Info("UpdateBudget", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
    response.status(200).send(res);
  } catch (error) {
    log.Error("UpdateBudget Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.body);
    response.status(400).send(error);
  }
});

router.delete("/DeleteBudget/:BudgetId", async (request, response) => {
  try {
    const res = await DeleteBudget(request.params.BudgetId);
    log.Info("DeleteBudget", res, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params);
    response.status(200).send(res);
  } catch (error) {
    log.Error("DeleteBudget Error", error, `${request.kauth.grant.access_token.content.preferred_username}, userId : ${request.kauth.grant.access_token.content.sid}`, request.params);
    response.status(400).send(error);
  }
});
//#endregion Budget

module.exports = router;
