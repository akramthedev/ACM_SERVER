const sql = require("mssql");





function GetClientTaches(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .query("SELECT * FROM ClientTache WHERE ClientId = @ClientId")  
      .then((result) => {
        resolve(result.recordset);
        console.log(result.recordset);
      })
      .catch((error) => reject(error?.originalError?.info?.message || error.message));
  });
}



function GetClientTachesAllOfThem() {
  console.log("GetClientTachesAllOfThem Function Executed...");
  return new Promise((resolve, reject) => {
    new sql.Request()
      .query("SELECT * FROM ClientTache")  
      .then((result) => {
        resolve(result.recordset);
        console.log(result.recordset);
      })
      .catch((error) => reject(error?.originalError?.info?.message || error.message));
  });
}





function GetClientTachesSimple(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_get_client_taches_simple")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetAllClientTaches() {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .execute("ps_get_all_client_taches")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function GetUnassignedClientTache(ClientId, PrestationId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .input("PrestationId", sql.UniqueIdentifier, PrestationId)
      .execute("ps_get_unassigned_tasks_for_prestation")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}


function CreateClientTache(data) {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    // Step 1: Insert the task into the database
    request
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("ClientMissionPrestationId", sql.UniqueIdentifier, data.ClientMissionPrestationId)
      .input("ClientMissionId", sql.UniqueIdentifier, data.ClientMissionId)
      .input("TacheId", sql.UniqueIdentifier, data.TacheId)
      .input("start_date", sql.DateTime, data.start_date) // New field: start_date
      .input("end_date", sql.DateTime, data.end_date)     // New field: end_date
      .input("color", sql.VarChar(7), data.color || '#7366fe') // New field: color (default if not provided)
      .input("isDone", sql.Bit, 0)                        // New field: isDone (default to 0)
      .execute("ps_create_client_tache")
      .then((result) => {
        if (result.rowsAffected[0] > 0) {
          // return new sql.Request()
          //   .input("TacheId", sql.UniqueIdentifier, data.TacheId)
          //   .execute("trg_CreateEventsForTask");
        } else {
          // throw new Error("Task creation failed.");
        }
      })
      .then(() => resolve(true))
      .catch((error) => reject(error?.originalError?.info?.message || error.message));
  });
}






function CreateClientTacheCustom(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("Intitule", sql.NVarChar(255), data.Intitule)
      .input("Numero_Ordre", sql.NVarChar(255), data.Numero_Ordre)
      .input("Commentaire", sql.NVarChar(255), data.Commentaire)
      .input("Status", sql.NVarChar(255), data.Status)
      .input("start_date", sql.DateTime, data.start_date) // New field: start_date
      .input("end_date", sql.DateTime, data.end_date)     // New field: end_date
      .input("color", sql.VarChar(7), data.color || '#7366fe') // New field: color (default if not provided)
      .input("isDone", sql.Bit, 0) 
      .execute("ps_create_client_tache_custom")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function UpdateClientTache(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("ClientMissionPrestationId", sql.UniqueIdentifier, data.ClientMissionPrestationId)
      .input("ClientMissionId", sql.UniqueIdentifier, data.ClientMissionId)
      .input("TacheId", sql.UniqueIdentifier, data.TacheId)
      .input("Intitule", sql.NVarChar(255), data.Intitule)
      .input("Numero_Ordre", sql.NVarChar(255), data.Numero_Ordre)
      .input("Commentaire", sql.NVarChar(255), data.Commentaire)
      .input("Deadline", sql.Float, data.Deadline)
      .input("DateButoir", sql.Date, data.DateButoir)
      .input("Date_Execution", sql.Date, data.Date_Execution)
      .input("Status", sql.NVarChar(255), data.Status)
      .input("AgentResposable", sql.NVarChar(255), data.AgentResposable)
      .execute("ps_update_ClientTache")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
function DeleteClientTache(ClientTacheId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, ClientTacheId)
      .execute("ps_delete_ClientTache")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

module.exports = { GetClientTaches,GetClientTachesAllOfThem,  CreateClientTache, UpdateClientTache, CreateClientTacheCustom, GetClientTachesSimple, GetAllClientTaches, DeleteClientTache, GetUnassignedClientTache };
