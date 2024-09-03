const sql = require("mssql");

function GetClientPieces(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_pieces")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetClientPiece(ClientPieceId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPieceId", sql.UniqueIdentifier, ClientPieceId)
      .execute("ps_get_client_piece")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function CreateClientPiece(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPieceId", sql.UniqueIdentifier, data.ClientPieceId)
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("PieceId", sql.UniqueIdentifier, data.PieceId)
      .input("Extension", sql.NVarChar(50), data.Extension)
      .execute("ps_create_client_piece")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function UpdateClientPiece(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPieceId", sql.UniqueIdentifier, data.ClientPieceId)
      .input("Extension", sql.NVarChar(50), data.Extension)
      .execute("ps_update_client_piece")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteClientPiece(ClientPieceId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientPieceId", sql.UniqueIdentifier, ClientPieceId)
      .execute("ps_delete_client_piece")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClientPieces, CreateClientPiece, DeleteClientPiece, GetClientPiece, UpdateClientPiece };
