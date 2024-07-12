const sql = require("mssql");

function GetPatrimoines(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_patrimoines")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreatePatrimoine(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("PatrimoineId", sql.UniqueIdentifier, data.PatrimoineId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("TypePatrimoine", sql.NVarChar(100), data.TypePatrimoine)
      .input("Designation", sql.NVarChar(255), data.Designation)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("Valeur", sql.Float, data.Valeur)
      .input("Detenteur", sql.NVarChar(255), data.Detenteur)
      .input("ChargesAssocies", sql.NVarChar(255), data.ChargesAssocies)
      .input("Charges", sql.NVarChar(255), data.Charges)
      .input("DateAchat", sql.Date, data.DateAchat)
      .input("DateCreation", sql.Date, data.DateCreation)
      .input("RevenueFiscalite", sql.NVarChar(255), data.RevenueFiscalite)
      .input("CapitalEmprunte", sql.Float, data.CapitalEmprunte)
      .input("Duree", sql.Float, data.Duree)
      .input("Taux", sql.Float, data.Taux)
      .input("AGarantieDeces", sql.Bit, data.AGarantieDeces)
      .input("Particularite", sql.NVarChar(255), data.Particularite)
      .input("Commentaire", sql.NVarChar(255), data.Commentaire)
      .input("Status", sql.NVarChar(255), data.Status)
      .input("Restant", sql.Float, data.Restant)
      .input("QuestionsComplementaires", sql.NVarChar(255), data.QuestionsComplementaires)
      .execute("ps_create_patrimoine")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function UpdatePatrimoine(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("PatrimoineId", sql.UniqueIdentifier, data.PatrimoineId)
      .input("TypePatrimoine", sql.NVarChar(100), data.TypePatrimoine)
      .input("Designation", sql.NVarChar(255), data.Designation)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("Valeur", sql.Float, data.Valeur)
      .input("Detenteur", sql.NVarChar(255), data.Detenteur)
      .input("ChargesAssocies", sql.NVarChar(255), data.ChargesAssocies)
      .input("Charges", sql.NVarChar(255), data.Charges)
      .input("DateAchat", sql.Date, data.DateAchat)
      .input("DateCreation", sql.Date, data.DateCreation)
      .input("RevenueFiscalite", sql.NVarChar(255), data.RevenueFiscalite)
      .input("CapitalEmprunte", sql.Float, data.CapitalEmprunte)
      .input("Duree", sql.Float, data.Duree)
      .input("Taux", sql.Float, data.Taux)
      .input("AGarantieDeces", sql.Bit, data.AGarantieDeces)
      .input("Particularite", sql.NVarChar(255), data.Particularite)
      .input("Commentaire", sql.NVarChar(255), data.Commentaire)
      .input("Status", sql.NVarChar(255), data.Status)
      .input("Restant", sql.Float, data.Restant)
      .input("QuestionsComplementaires", sql.NVarChar(255), data.QuestionsComplementaires)
      .execute("ps_update_patrimoine")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeletePatrimoine(PatrimoineId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("PatrimoineId", sql.UniqueIdentifier, PatrimoineId)
      .execute("ps_delete_patrimoine")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetPatrimoines, CreatePatrimoine, UpdatePatrimoine, DeletePatrimoine };
