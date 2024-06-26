const sql = require("mssql");

function GetPatrimoines(ClientId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ClientId", sql.UniqueIdentifier, ClientId)
            .execute('ps_get_patrimoines')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function CreatePatrimoine(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("PatrimoineId", sql.UniqueIdentifier, data.PatrimoineId)
            .input("ClientId", sql.UniqueIdentifier, data.ClientId)
            .input("TypePatrimoine", sql.NVarChar(100), data.TypePatrimoine)
            .input("Designation", sql.NVarChar(255), data.Designation)
            .input("Valeur", sql.Float, data.Valeur)
            .input("Detenteur", sql.NVarChar(255), data.Detenteur)
            .input("ChargesAssocies", sql.NVarChar(255), data.ChargesAssocies)
            .input("Charges", sql.NVarChar(255), data.Charges)
            .input("RevenueFiscalite", sql.NVarChar(255), data.RevenueFiscalite)
            .input("CapitalEmprunte", sql.NVarChar(255), data.CapitalEmprunte)
            .input("Duree", sql.NVarChar(255), data.Duree)
            .input("Taux", sql.NVarChar(255), data.Taux)
            .input("Deces", sql.NVarChar(255), data.Deces)
            .input("Particularite", sql.NVarChar(255), data.Particularite)
            .input("Commentaire", sql.NVarChar(255), data.Commentaire)
            .input("QuestionsComplementaires", sql.NVarChar(255), data.QuestionsComplementaires)
            .execute('ps_create_patrimoine')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function UpdatePatrimoine(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("PatrimoineId", sql.UniqueIdentifier, data.PatrimoineId)
            .input("TypePatrimoine", sql.NVarChar(100), data.TypePatrimoine)
            .input("Designation", sql.NVarChar(255), data.Designation)
            .input("Valeur", sql.Float, data.Valeur)
            .input("Detenteur", sql.NVarChar(255), data.Detenteur)
            .input("ChargesAssocies", sql.NVarChar(255), data.ChargesAssocies)
            .input("Charges", sql.NVarChar(255), data.Charges)
            .input("RevenueFiscalite", sql.NVarChar(255), data.RevenueFiscalite)
            .input("CapitalEmprunte", sql.NVarChar(255), data.CapitalEmprunte)
            .input("Duree", sql.NVarChar(255), data.Duree)
            .input("Taux", sql.NVarChar(255), data.Taux)
            .input("Deces", sql.NVarChar(255), data.Deces)
            .input("Particularite", sql.NVarChar(255), data.Particularite)
            .input("Commentaire", sql.NVarChar(255), data.Commentaire)
            .input("QuestionsComplementaires", sql.NVarChar(255), data.QuestionsComplementaires)
            .execute('ps_update_patrimoine')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function DeletePatrimoine(PatrimoineId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("PatrimoineId", sql.UniqueIdentifier, PatrimoineId)
            .execute('ps_delete_patrimoine')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
module.exports = { GetPatrimoines, CreatePatrimoine, UpdatePatrimoine, DeletePatrimoine };
