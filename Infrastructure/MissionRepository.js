const sql = require("mssql");

function GetMissions(ServiceId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ServiceId", sql.UniqueIdentifier, ServiceId)
      .execute("ps_get_missions")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetMissionsWithPrestationsCount() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_missions_with_prestation_count")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetMissions, GetMissionsWithPrestationsCount };
