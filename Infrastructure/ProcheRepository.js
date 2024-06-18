const sql = require("mssql");

function GetProches(ClientId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ClientId", sql.UniqueIdentifier, ClientId)
            .execute('ps_get_proches')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function CreateProche(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ProcheId", sql.UniqueIdentifier, data.ProcheId)
            .input("ClientId", sql.UniqueIdentifier, data.ClientId)
            .input("Nom", sql.NVarChar(100), data.Nom)
            .input("Prenom", sql.NVarChar(100), data.Prenom)
            .input("DateNaissance", sql.Date, data.DateNaissance)
            .input("Telephone1", sql.NVarChar(20), data.Telephone1)
            .input("Telephone2", sql.NVarChar(20), data.Telephone2)
            .input("Email1", sql.NVarChar(100), data.Email1)
            .input("Email2", sql.NVarChar(100), data.Email2)
            .input("Adresse", sql.NVarChar(255), data.Adresse)
            .input("Charge", sql.Bit, data.Charge)
            .input("LienParente", sql.NVarChar(100), data.LienParente)
            .input("Particularite", sql.NVarChar(100), data.Particularite)
            .input("NombreEnfant", sql.NVarChar(255), data.NombreEnfant)
            .input("Commentaire", sql.NVarChar(255), data.Commentaire)
            .execute('ps_create_Proche')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function UpdateProche(data) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ProcheId", sql.UniqueIdentifier, data.ProcheId)
            .input("Nom", sql.NVarChar(100), data.Nom)
            .input("Prenom", sql.NVarChar(100), data.Prenom)
            .input("DateNaissance", sql.Date, data.DateNaissance)
            .input("Telephone1", sql.NVarChar(20), data.Telephone1)
            .input("Telephone2", sql.NVarChar(20), data.Telephone2)
            .input("Email1", sql.NVarChar(100), data.Email1)
            .input("Email2", sql.NVarChar(100), data.Email2)
            .input("Adresse", sql.NVarChar(255), data.Adresse)
            .input("Charge", sql.Bit, data.Charge)
            .input("LienParente", sql.NVarChar(100), data.LienParente)
            .input("Particularite", sql.NVarChar(100), data.Particularite)
            .input("NombreEnfant", sql.NVarChar(255), data.NombreEnfant)
            .input("Commentaire", sql.NVarChar(255), data.Commentaire)
            .execute('ps_update_proche')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function DeleteProche(ProcheId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("ProcheId", sql.UniqueIdentifier, ProcheId)
            .execute('ps_delete_proche')
            .then((result) => resolve(result.rowsAffected[0] > 0))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
module.exports = { GetProches, CreateProche, UpdateProche, DeleteProche };
