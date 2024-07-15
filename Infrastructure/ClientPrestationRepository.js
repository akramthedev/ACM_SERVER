const sql = require("mssql");

function GetClientPrestations(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_prestations")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetClientPrestation(ClientPrestationId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPrestationId", sql.UniqueIdentifier, ClientPrestationId)
      .execute("ps_get_client_prestation")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateClientPrestation(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPrestationId", sql.UniqueIdentifier, data.ClientPrestationId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("PrestationId", sql.UniqueIdentifier, data.PrestationId)
      .input("DateAffectation", sql.NVarChar(50), data.DateAffectation)
      .execute("ps_create_client_prestation")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteClientPrestation(ClientPrestationId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPrestationId", sql.UniqueIdentifier, ClientPrestationId)
      .execute("ps_delete_client_prestation")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClientPrestations, CreateClientPrestation, DeleteClientPrestation, GetClientPrestation };
