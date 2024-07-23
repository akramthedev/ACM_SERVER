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

module.exports = { GetClientTaches, CreateClientTache };
