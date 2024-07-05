const sql = require("mssql");

function GetBudgets(ClientId) {
  return new Promise((resolve, reject) => {
    console.log("GetBudget ", ClientId);
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_Budgets")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateBudget(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("BudgetsId", sql.UniqueIdentifier, data.BudgetsId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("Designation", sql.NVarChar(100), data.Designation)
      .input("Montant", sql.Float, data.Montant)
      .input("Sexe", sql.NVarChar(100), data.Sexe)
      .input("CommentBudgets", sql.NVarChar(255), data.CommentBudgets)
      .execute("ps_create_Budget")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function UpdateBudget(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("BudgetsId", sql.UniqueIdentifier, data.BudgetsId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("Designation", sql.NVarChar(100), data.Designation)
      .input("Montant", sql.Float, data.Montant)
      .input("Sexe", sql.NVarChar(100), data.Sexe)
      .input("CommentBudgets", sql.NVarChar(255), data.CommentBudgets)
      .execute("ps_update_Budget")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteBudget(BudgetsId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("BudgetsId", sql.UniqueIdentifier, BudgetsId)
      .execute("ps_delete_Budget")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetBudgets, CreateBudget, UpdateBudget, DeleteBudget };
