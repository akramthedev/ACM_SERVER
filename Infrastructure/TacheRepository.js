const sql = require("mssql");

function GetTaches() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .query(`
        SELECT 
          t.TacheId,
          t.PrestationId,
          t.Intitule,
          t.Description,
          t.Numero_Ordre,
          t.Deadline,
          t.NombreRapelle,
          t.Priorite,
          t.Honoraire
        FROM 
          Tache t
      `) // Replace with your SQL query
      .then((result) => {
        resolve(result.recordset); // Resolve the fetched data
        console.log("Fetched Taches:", result.recordset); // Log the data
      })
      .catch((error) => {
        console.error("Error fetching Taches:", error); // Log errors
        reject(error?.originalError?.info?.message || error.message);
      });
  });
}

module.exports = { GetTaches };
