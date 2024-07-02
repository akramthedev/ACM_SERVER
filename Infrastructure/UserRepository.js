const sql = require("mssql");

function GetUser(Login) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("Login", sql.NVarChar(255), Login)
            .execute('ps_get_user')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}
function GetUserRoles(UserId) {
    return new Promise((resolve, reject) => {
        new sql.Request()
            .input("UserId", sql.UniqueIdentifier, UserId)
            .execute('ps_get_user_roles')
            .then((result) => resolve(result.recordset))
            .catch((error) => reject(error?.originalError?.info?.message))
    });
}

module.exports = { GetUser, GetUserRoles };