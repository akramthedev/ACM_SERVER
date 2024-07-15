const sql = require("mssql");

function GetPrestations() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_prestations")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetPrestations };
