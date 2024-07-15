const sql = require("mssql");

function GetClientServices(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_services")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetClientService(ClientServiceId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientServiceId", sql.UniqueIdentifier, ClientServiceId)
      .execute("ps_get_client_service")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateClientService(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientServiceId", sql.UniqueIdentifier, data.ClientServiceId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("ServiceId", sql.UniqueIdentifier, data.ServiceId)
      .input("DateAffectation", sql.NVarChar(50), data.DateAffectation)
      .execute("ps_create_client_service")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteClientService(ClientServiceId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientServiceId", sql.UniqueIdentifier, ClientServiceId)
      .execute("ps_delete_client_service")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClientServices, CreateClientService, DeleteClientService, GetClientService };
