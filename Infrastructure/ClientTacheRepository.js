const sql = require("mssql");

function GetClientTaches(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_taches")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function GetClientTachesSimple(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_taches_simple")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetAllClientTaches() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_all_client_taches")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function CreateClientTache(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("ClientMissionPrestationId", sql.UniqueIdentifier, data.ClientMissionPrestationId)
      .input("ClientMissionId", sql.UniqueIdentifier, data.ClientMissionId)
      .input("TacheId", sql.UniqueIdentifier, data.TacheId)
      .execute("ps_create_client_tache")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function CreateClientTacheCustom(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("Intitule", sql.NVarChar(255), data.Intitule)
      .input("Numero_Ordre", sql.NVarChar(255), data.Numero_Ordre)
      .input("Commentaire", sql.NVarChar(255), data.Commentaire)
      .input("Status", sql.NVarChar(255), data.Status)
      .execute("ps_create_client_tache_custom")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function UpdateClientTache(data) {
  console.log("UpdateClientTache :", data);
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("ClientMissionPrestationId", sql.UniqueIdentifier, data.ClientMissionPrestationId)
      .input("ClientMissionId", sql.UniqueIdentifier, data.ClientMissionId)
      .input("TacheId", sql.UniqueIdentifier, data.TacheId)
      .input("Intitule", sql.NVarChar(255), data.Intitule)
      .input("Numero_Ordre", sql.NVarChar(255), data.Numero_Ordre)
      .input("Commentaire", sql.NVarChar(255), data.Commentaire)
      .input("Deadline", sql.Float, data.Deadline)
      .input("DateButoir", sql.Date, data.DateButoir)
      .input("Date_Execution", sql.Date, data.Date_Execution)
      .input("Status", sql.NVarChar(255), data.Status)
      .input("AgentResposable", sql.NVarChar(255), data.AgentResposable)
      .execute("ps_update_ClientTache")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteClientTache(ClientTacheId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, ClientTacheId)
      .execute("ps_delete_ClientTache")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

module.exports = { GetClientTaches, CreateClientTache, UpdateClientTache, CreateClientTacheCustom, GetClientTachesSimple, GetAllClientTaches, DeleteClientTache };
