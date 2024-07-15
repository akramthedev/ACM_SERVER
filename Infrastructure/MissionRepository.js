const sql = require("mssql");

function GetMissions() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_missions")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetMissions };
