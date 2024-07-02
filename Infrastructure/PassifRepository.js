const sql = require("mssql");

function GetPassifs(ClientId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ClientId", sql.UniqueIdentifier, ClientId)
            .execute('ps_get_Passifs')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function CreatePassif(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("PassifsId", sql.UniqueIdentifier, data.PassifsId)
            .input("ClientId", sql.UniqueIdentifier, data.ClientId)
            .input("TypePassifs", sql.NVarChar(100), data.TypePassifs)
            .input("Designation", sql.NVarChar(255), data.Designation)
            .input("CapitalEmprunte", sql.NVarChar(255), data.CapitalEmprunte)
            .input("Valeur", sql.Float, data.Valeur)
            .input("Detenteur", sql.NVarChar(255), data.Detenteur)            
            .input("DureeMois", sql.Decimal(5,2), data.DureeMois)
            .input("Taux", sql.NVarChar(255), data.Taux)
            .input("Deces", sql.NVarChar(255), data.Deces)
            .input("Particularite", sql.NVarChar(255), data.Particularite)
            .input("ValeurRachat", sql.Float, data.ValeurRachat)
            .input("DateSouscription", sql.Date, data.DateSouscription)
            .input("Assure", sql.Bit, data.Assure)
            .input("Beneficiaire", sql.NVarChar(255), data.Beneficiaire)
            .input("DateOuverture", sql.Date, data.DateOuverture)
            .input("EpargneAssocie", sql.NVarChar(255), data.EpargneAssocie)
            .input("RevenusDistribue", sql.NVarChar(255), data.RevenusDistribue)
            .input("FiscaliteOuRevenue", sql.NVarChar(255), data.FiscaliteOuRevenue)
            .input("TauxRevalorisation", sql.NVarChar(255), data.TauxRevalorisation)
            .input("CommentPassifs", sql.NVarChar(255), data.CommentPassifs)
            .execute('ps_create_Passif')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function UpdatePassif(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("PassifsId", sql.UniqueIdentifier, data.PassifsId)
            .input("ClientId", sql.UniqueIdentifier, data.ClientId)
            .input("TypePassifs", sql.NVarChar(100), data.TypePassifs)
            .input("Designation", sql.NVarChar(255), data.Designation)
            .input("CapitalEmprunte", sql.NVarChar(255), data.CapitalEmprunte)
            .input("Valeur", sql.Float, data.Valeur)
            .input("Detenteur", sql.NVarChar(255), data.Detenteur)            
            .input("DureeMois", sql.Decimal(5,2), data.DureeMois)
            .input("Taux", sql.NVarChar(255), data.Taux)
            .input("Deces", sql.NVarChar(255), data.Deces)
            .input("Particularite", sql.NVarChar(255), data.Particularite)
            .input("ValeurRachat", sql.Float, data.ValeurRachat)
            .input("DateSouscription", sql.Date, data.DateSouscription)
            .input("Assure", sql.Bit, data.Assure)
            .input("Beneficiaire", sql.NVarChar(255), data.Beneficiaire)
            .input("DateOuverture", sql.Date, data.DateOuverture)
            .input("EpargneAssocie", sql.NVarChar(255), data.EpargneAssocie)
            .input("RevenusDistribue", sql.NVarChar(255), data.RevenusDistribue)
            .input("FiscaliteOuRevenue", sql.NVarChar(255), data.FiscaliteOuRevenue)
            .input("TauxRevalorisation", sql.NVarChar(255), data.TauxRevalorisation)
            .input("CommentPassifs", sql.NVarChar(255), data.CommentPassifs)
            .execute('ps_update_Passif')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function DeletePassif(PassifsId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("PassifsId", sql.UniqueIdentifier, PassifsId)
            .execute('ps_delete_Passif')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
module.exports = { GetPassifs, CreatePassif, UpdatePassif, DeletePassif };
