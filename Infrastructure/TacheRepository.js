const sql = require("mssql");

function GetTaches() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_taches")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetTaches };
