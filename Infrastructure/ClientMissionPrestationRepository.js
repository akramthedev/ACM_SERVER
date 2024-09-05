const sql = require("mssql");

function GetClientMissionPrestations(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_mission_prestations")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetClientMissionPrestationSimple(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_mission_prestation_simple")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function CreateClientMissionPrestation(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientMissionPrestationId", sql.UniqueIdentifier, data.ClientMissionPrestationId)
      .input("ClientMissionId", sql.UniqueIdentifier, data.ClientMissionId)
      .input("PrestationId", sql.UniqueIdentifier, data.PrestationId)
      .execute("ps_create_client_mission_prestation")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function DeleteClientMissionPrestation(ClientMissionId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientMissionPrestationId", sql.UniqueIdentifier, ClientMissionId)
      .execute("ps_delete_client_mission_prestation")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClientMissionPrestations, CreateClientMissionPrestation, DeleteClientMissionPrestation, GetClientMissionPrestationSimple };
