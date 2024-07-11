const sql = require("mssql");

function GetConjoint(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_conjoint")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateConjoint(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ConjointId", sql.UniqueIdentifier, data.ConjointId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("Nom", sql.NVarChar(100), data.Nom)
      .input("Prenom", sql.NVarChar(100), data.Prenom)
      .input("DateNaissance", sql.Date, data.DateNaissance)
      .input("Profession", sql.NVarChar(100), data.Profession)
      .input("DateRetraite", sql.Date, data.DateRetraite)
      .input("NumeroSS", sql.NVarChar(20), data.NumeroSS)
      .input("DateMariage", sql.Date, data.DateMariage)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("RegimeMatrimonial", sql.NVarChar(100), data.RegimeMatrimonial)
      .input("DonationEpoux", sql.Bit, data.DonationEpoux)
      .input("ModifRegimeDate", sql.NVarChar(100), data.ModifRegimeDate)
      .input("QuestComp", sql.NVarChar(255), data.QuestComp)
      .execute("ps_create_conjoint")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function UpdateConjoint(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ConjointId", sql.UniqueIdentifier, data.ConjointId)
      .input("Nom", sql.NVarChar(100), data.Nom)
      .input("Prenom", sql.NVarChar(100), data.Prenom)
      .input("DateNaissance", sql.Date, data.DateNaissance)
      .input("Profession", sql.NVarChar(100), data.Profession)
      .input("DateRetraite", sql.Date, data.DateRetraite)
      .input("NumeroSS", sql.NVarChar(20), data.NumeroSS)
      .input("DateMariage", sql.Date, data.DateMariage)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("RegimeMatrimonial", sql.NVarChar(100), data.RegimeMatrimonial)
      .input("DonationEpoux", sql.Bit, data.DonationEpoux)
      .input("ModifRegimeDate", sql.NVarChar(100), data.ModifRegimeDate)
      .input("QuestComp", sql.NVarChar(255), data.QuestComp)
      .execute("ps_update_conjoint")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteConjoint(ConjointId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ConjointId", sql.UniqueIdentifier, ConjointId)
      .execute("ps_delete_conjoint")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetConjoint, CreateConjoint, UpdateConjoint, DeleteConjoint };
