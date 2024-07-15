const sql = require("mssql");

function GetClientMissions(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_missions")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetClientMission(ClientMissionId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientMissionId", sql.UniqueIdentifier, ClientMissionId)
      .execute("ps_get_client_mission")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateClientMission(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientMissionId", sql.UniqueIdentifier, data.ClientMissionId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("MissionId", sql.UniqueIdentifier, data.MissionId)
      .input("DateAffectation", sql.NVarChar(50), data.DateAffectation)
      .execute("ps_create_client_mission")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteClientMission(ClientMissionId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientMissionId", sql.UniqueIdentifier, ClientMissionId)
      .execute("ps_delete_client_mission")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClientMissions, CreateClientMission, DeleteClientMission, GetClientMission };
