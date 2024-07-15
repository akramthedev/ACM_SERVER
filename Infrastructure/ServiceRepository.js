const sql = require("mssql");

function GetServices() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_services")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetServices };
