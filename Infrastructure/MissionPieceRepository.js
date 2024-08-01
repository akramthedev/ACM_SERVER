const sql = require("mssql");

function GetMissionPieces(MissionId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("MissionId", sql.UniqueIdentifier, MissionId)
      .execute("ps_get_MissionPiece")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

module.exports = { GetMissionPieces };
