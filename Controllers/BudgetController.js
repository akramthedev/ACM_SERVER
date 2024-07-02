var express = require('express');
var router = express.Router();
const { CreateBudget, UpdateBudget, DeleteBudget, GetBudgets } = require('../Infrastructure/BudgetRepository');

//#region Budget
router.get("/GetBudgets", async (request, response) => {
    await GetBudgets(request.query.ClientId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.post("/CreateBudget", async (request, response) => {
    await CreateBudget(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(500).send(error))
});
router.put("/UpdateBudget", async (request, response) => {
    await UpdateBudget(request.body)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.delete("/DeleteBudget/:BudgetId", async (request, response) => {
    await DeleteBudget(request.params.BudgetId)
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
//#endregion Budget

module.exports = router;