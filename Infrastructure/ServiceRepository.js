const sql = require("mssql");

function GetServices(CabinetId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("CabinetId", sql.UniqueIdentifier, CabinetId)
      .execute("ps_get_services")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetServices };
