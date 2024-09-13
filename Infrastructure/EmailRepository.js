const sql = require("mssql");

function GetClientTacheDetailsForEmail(ClientTacheId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, ClientTacheId)
      .execute("ps_get_client_tache_details_for_email")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

module.exports = { GetClientTacheDetailsForEmail };
