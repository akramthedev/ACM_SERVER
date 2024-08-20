const sql = require("mssql");

function GetClients(CabinetId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("CabinetId", sql.UniqueIdentifier, CabinetId)
      .execute("ps_get_clients")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetClient(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateClient(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("CabinetId", sql.UniqueIdentifier, data.CabinetId)
      .input("Nom", sql.NVarChar(255), data.Nom)
      .input("Prenom", sql.NVarChar(255), data.Prenom)
      .input("DateNaissance", sql.Date, data.DateNaissance)
      .input("Profession", sql.NVarChar(255), data.Profession)
      .input("DateRetraite", sql.Date, data.DateRetraite)
      .input("DateResidence", sql.Date, data.DateResidence)
      .input("NumeroSS", sql.NVarChar(20), data.NumeroSS)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("Email1", sql.NVarChar(100), data.Email1)
      .input("Email2", sql.NVarChar(100), data.Email2)
      .input("Telephone1", sql.NVarChar(20), data.Telephone1)
      .input("Telephone2", sql.NVarChar(20), data.Telephone2)
      .input("HasConjoint", sql.Bit, data.HasConjoint)
      .input("SituationFamiliale", sql.NVarChar(255), data.SituationFamiliale)
      .input("ParticulariteFiscale", sql.NVarChar(255), data.ParticulariteFiscale)
      .input("CFE", sql.NVarChar(100), data.CFE)
      .input("Cotisation", sql.NVarChar(100), data.Cotisation)
      .input("Reversion", sql.NVarChar(100), data.Reversion)
      .input("CNSS", sql.NVarChar(100), data.CNSS)
      .input("CNAREFE", sql.NVarChar(100), data.CNAREFE)
      .input("CAPITONE", sql.NVarChar(100), data.CAPITONE)
      .input("AssuranceRapatriement", sql.NVarChar(100), data.AssuranceRapatriement)
      .input("MutuelleFrancaise", sql.NVarChar(100), data.MutuelleFrancaise)
      .input("PASSEPORT", sql.NVarChar(100), data.PASSEPORT)
      .input("CarteSejour", sql.NVarChar(100), data.CarteSejour)
      .input("PermisConduire", sql.NVarChar(100), data.PermisConduire)
      .input("AssuranceAuto", sql.NVarChar(100), data.AssuranceAuto)
      .input("AssuranceHabitation", sql.NVarChar(100), data.AssuranceHabitation)
      .input("InscriptionConsulat", sql.NVarChar(100), data.InscriptionConsulat)
      .input("CPAM", sql.NVarChar(100), data.CPAM)
      .input("CSG_CRDS", sql.NVarChar(100), data.CSG_CRDS)
      .execute("ps_create_client")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function UpdateClient(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("Nom", sql.NVarChar(255), data.Nom)
      .input("Prenom", sql.NVarChar(255), data.Prenom)
      .input("DateNaissance", sql.Date, data.DateNaissance)
      .input("Profession", sql.NVarChar(255), data.Profession)
      .input("DateRetraite", sql.Date, data.DateRetraite)
      .input("DateResidence", sql.Date, data.DateResidence)
      .input("NumeroSS", sql.NVarChar(20), data.NumeroSS)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("Email1", sql.NVarChar(100), data.Email1)
      .input("Email2", sql.NVarChar(100), data.Email2)
      .input("Telephone1", sql.NVarChar(20), data.Telephone1)
      .input("Telephone2", sql.NVarChar(20), data.Telephone2)
      .input("HasConjoint", sql.Bit, data.HasConjoint)
      .input("SituationFamiliale", sql.NVarChar(255), data.SituationFamiliale)
      .input("ParticulariteFiscale", sql.NVarChar(255), data.ParticulariteFiscale)
      .input("CFE", sql.NVarChar(100), data.CFE)
      .input("Cotisation", sql.NVarChar(100), data.Cotisation)
      .input("Reversion", sql.NVarChar(100), data.Reversion)
      .input("CNSS", sql.NVarChar(100), data.CNSS)
      .input("CNAREFE", sql.NVarChar(100), data.CNAREFE)
      .input("CAPITONE", sql.NVarChar(100), data.CAPITONE)
      .input("AssuranceRapatriement", sql.NVarChar(100), data.AssuranceRapatriement)
      .input("MutuelleFrancaise", sql.NVarChar(100), data.MutuelleFrancaise)
      .input("PASSEPORT", sql.NVarChar(100), data.PASSEPORT)
      .input("CarteSejour", sql.NVarChar(100), data.CarteSejour)
      .input("PermisConduire", sql.NVarChar(100), data.PermisConduire)
      .input("AssuranceAuto", sql.NVarChar(100), data.AssuranceAuto)
      .input("AssuranceHabitation", sql.NVarChar(100), data.AssuranceHabitation)
      .input("InscriptionConsulat", sql.NVarChar(100), data.InscriptionConsulat)
      .input("CPAM", sql.NVarChar(100), data.CPAM)
      .input("CSG_CRDS", sql.NVarChar(100), data.CSG_CRDS)
      .execute("ps_update_client")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function DeleteClient(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_delete_client")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient };
