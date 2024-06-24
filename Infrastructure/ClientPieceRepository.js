const sql = require("mssql");

function GetClientPieces(ClientId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ClientId", sql.UniqueIdentifier, ClientId)
            .execute('ps_get_client_pieces')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function CreateClientPiece(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ClientPieceId", sql.UniqueIdentifier, data.ClientPieceId)
            .input("ClientId", sql.UniqueIdentifier, data.ClientId)
            .input("PieceId", sql.UniqueIdentifier, data.PieceId)
            .input("Extension", sql.NVarChar(50), data.Extension)
            .execute('ps_create_client_piece')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
// function DeleteProche(ProcheId) {
//     return new Promise((resolve, reject) => {
//         new sql.Request()
//             .input("ProcheId", sql.UniqueIdentifier, ProcheId)
//             .execute('ps_delete_proche')
//             .then((result) => resolve(result.rowsAffected[0] > 0))
//             .catch((error) => reject(error?.originalError?.info?.message))
//     });
// }
module.exports = { GetClientPieces, CreateClientPiece };
