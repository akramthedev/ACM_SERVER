const sql = require("mssql");

function GetPieces() {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .execute('ps_get_pieces')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
module.exports = { GetPieces };
