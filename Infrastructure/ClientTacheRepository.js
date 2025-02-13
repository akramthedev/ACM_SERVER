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





formatDateForDB = (dateString) => {
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0'); // Include hours
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};







function UpdateSingleEvent(data) {
  console.warn(data.NewDateNonFormated);
  
  // Parse the input date
  let dateX = new Date(data.NewDateNonFormated);
  console.warn(dateX);
  
  // Adjust the date by adding 7 hours
  let Starting = new Date(dateX.getTime() + (15 * 60 * 60 * 1000));
  console.warn(Starting);
  
  // Format the date for SQL
  let StartingFormated = formatDateForDB(Starting);
  console.warn(StartingFormated);

  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("NewDate", sql.DateTime, new Date(data.NewDate))  
      .input("EventId", sql.Int, data.EventId)
      .input("StartingFormated", sql.DateTime, StartingFormated)
      .query(`
        UPDATE Evenements
        SET EventTimeEnd = @StartingFormated, EventTimeStart = @NewDate
        WHERE EventId = @EventId
      `)
      .then((result) => {
        resolve({  
          EventTimeEnd: Starting,
          EventTimeStart: new Date(data.NewDate) 
        });
      })
      .catch((error) => {
        reject(error?.originalError?.info?.message || error.message);
      });
  });
}











function GetClientTachesAllOfThem() {
  console.log("GetClientTachesAllOfThem Function Executed...");
  return new Promise((resolve, reject) => {
    new sql.Request()
      .query(`
        SELECT 
          ct.ClientTacheId,
          cmp.ClientMissionPrestationId,
          cm.ClientMissionId,
          cm.ClientId,
          cl.Nom AS ClientNom,    
          cl.Prenom AS ClientPrenom,
          cl.DateNaissance AS ClientDateNaissance,
          cl.Photo AS ClientPhoto,
          cl.Profession AS ClientProfession,
          cl.DateRetraite AS ClientDateRetraite,
          cl.NumeroSS AS ClientNumeroSS,
          cl.Adresse AS ClientAdresse,
          cl.Email1 AS ClientEmail1,
          cl.Email2 AS ClientEmail2,
          cl.Telephone1 AS ClientTelephone1,
          cl.Telephone2 AS ClientTelephone2,
          cl.HasConjoint AS ClientHasConjoint,
          cl.SituationFamiliale AS ClientSituationFamiliale,
          m.Designation AS MissionDesignation,
          t.TacheId,
          t.Intitule AS TacheIntitule,
          p.PrestationId,
          p.Designation AS PrestationDesignation,
          p.Description AS PrestationDescription,
          t.Description AS TacheDescription,
          ct.Intitule AS ClientTacheIntitule,
          t.Numero_Ordre,
          ct.Commentaire AS Commentaire,
          ct.Deadline,
          ct.DateButoir,
          ct.Date_Execution,
          ct.Intitule AS TacheClientIntitule, 
          ct.start_date, 
          ct.end_date, 
          ct.isReminder, 
          ct.isDone,
          ct.color, 
          ct.Status,
          ag.Nom AS AgentNom, 
          ev.EventTimeStart AS EventStart, 
          ev.EventTimeEnd AS EventEnd, 
          ev.EventName AS EventName, 
          ev.color AS EventColor, 
          ev.isDone AS EventIsDone, 
          ev.isReminder AS EventIsReminder, 
          ev.EventId, 
          ev.EventDescription, 
          ev.NumberEvent
      FROM ClientTache ct
      LEFT JOIN Evenements ev ON ct.ClientTacheId = ev.TacheId 
      LEFT JOIN ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
      LEFT JOIN ClientMission cm ON cmp.ClientMissionId = cm.ClientMissionId
      LEFT JOIN Mission m ON cm.MissionId = m.MissionId
      LEFT JOIN Tache t ON ct.TacheId = t.TacheId
      LEFT JOIN Prestation p ON t.PrestationId = p.PrestationId
      LEFT JOIN Client cl ON cm.ClientId = cl.ClientId
      LEFT JOIN Agent ag ON t.AgentId = ag.AgentId;

      `)  
      .then((result) => {
        resolve(result.recordset);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tâches :", error);
        reject(error?.originalError?.info?.message || error.message);
      });
  });
}










function GetClientTachesSimple(ClientId) {
  console.warn("Get Single Client Taches Simple : "+ClientId);
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





async function GetAccessTokenGoogleCalendar(ClientIdOfCloack) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientIdOfCloack", sql.UniqueIdentifier, ClientIdOfCloack)  // Adding input to bind the parameter
      .query(`
       SELECT * 
        FROM GoogleCalendar 
        WHERE ClientIdOfCloack = @ClientIdOfCloack 
          AND ClientIdOfCloack = (SELECT MAX(ClientIdOfCloack) FROM GoogleCalendar WHERE ClientIdOfCloack = @ClientIdOfCloack);

      `)  // Added ordering to get the "latest" record based on a column, assuming you want the most recent entry.
      .then((result) => {
        console.warn("Access Token retrieved:", result.recordset);
        resolve(result.recordset);
      })
      .catch((error) => {
        console.error("Error retrieving access token:", error);
        reject(error?.originalError?.info?.message || error.message);
      });
  });
}




async function CreateGoogleCalendarAccount(data){
  
  console.warn("B executed...");


  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    console.log(data);

    request
      .input("ClientIdOfCloack", sql.UniqueIdentifier, data.ClientIdOfCloack)
      .input("EmailKeyCloack", sql.VarChar(255), data.EmailKeyCloack)
      .input("AccessTokenGoogle", sql.VarChar(255), data.AccessTokenGoogle)
      .input("ClientIdOfGoogle", sql.VarChar(255), data.ClientIdOfGoogle)
      .input("ExpiresIn", sql.VarChar(255), data.ExpiresIn)
      .execute("ps_create_google_calendar_account")
      .then(() => {
         resolve(true)})
      .catch((error) => reject(error?.originalError?.info?.message || error.message));
  });


}



async function  MarkAsDone(ClientTacheId) {
  try {
    const request1 = new sql.Request();
    request1.input("ClientTacheId", sql.UniqueIdentifier, ClientTacheId);
    request1.input("isDone", sql.Bit, 1);
    request1.input("color", sql.VarChar(7), "#28a745");
    request1.input("statusS", sql.NVarChar(255), "Finalisée");

    const result1 = await request1.query(
      "UPDATE ClientTache SET isDone = @isDone,  Status = @statusS   , color = @color WHERE ClientTacheId = @ClientTacheId"
    );

    if (result1.rowsAffected[0] === 0) {
      throw new Error("Aucune tâche mise à jour, l'ID est peut-être incorrect.");
    }

    const request2 = new sql.Request();
    request2.input("ClientTacheId", sql.UniqueIdentifier, ClientTacheId);
    request2.input("isDone", sql.Bit, 1);
    request2.input("color", sql.VarChar(7), "#28a745");

    await request2.query(
      "UPDATE Evenements SET isDone = @isDone, color = @color WHERE TacheId = @ClientTacheId"
    );

    return true;
  } catch (error) {
    throw new Error(error?.originalError?.info?.message || error.message);
  }
}







function CreateClientTache(data) {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();


    // Step 1: Insert the task into the database
    request
      .input("ClientId", sql.NVarChar(255), data.ClientId)
      .input("AgentId", sql.NVarChar(255), '3D9D1AC0-AC20-469E-BE24-97CB3C8C5187')
      .input("ClientMissionPrestationId", sql.NVarChar(255), data.ClientMissionPrestationId)
      .input("ClientMissionId", sql.NVarChar(255), data.ClientMissionId)
      .input("TacheId", sql.NVarChar(255), data.TacheId)
      .input("start_date", sql.DateTime, data.start_date) // New field: start_date
      .input("end_date", sql.DateTime, data.end_date)     // New field: end_date
      .input("color", sql.VarChar(7), data.color || '#7366fe') // New field: color (default if not provided)
      .input("isDone", sql.Bit, 0)                        // New field: isDone (default to 0)
      .input("Intitule", sql.NVarChar(250), data.Intitule)                        // New field: isDone (default to 0)
      .execute("ps_create_client_tache")
      .then((result) => {
        if (result.rowsAffected[0] > 0) {
          console.warn("Done Done Done");
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
      .input("Intitule", sql.NVarChar(255), data.Intitule)
      .input("Numero_Ordre", sql.NVarChar(255), data.Numero_Ordre)
      .input("Status", sql.NVarChar(255), data.Status) 
      .input("AgentResposable", sql.NVarChar(255)  , data.AgentResposable) 
      .execute("ps_update_clienttache_from_SinglePageCLient")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

 


function convertUTCToLocal(utcDateString) {
  const date = new Date(utcDateString); // Convert string to Date object
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // Format as 'YYYY-MM-DD HH:mm:ss'
}


function UpdateClientTacheDates(data) {
  return new Promise((resolve, reject) => {

    const startDate = convertUTCToLocal(data.start_date);
    const endDate = convertUTCToLocal(data.end_date);


    new sql.Request()
      .input("ClientTacheId", sql.UniqueIdentifier, data.ClientTacheId)
      .input("start_date", sql.DateTime, startDate)
      .input("end_date", sql.DateTime, endDate)
      .execute("ps_update_ClientTache_Dates")
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


function DeleteGoogleToken(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientIdOfCloack", sql.UniqueIdentifier , data.ClientIdOfCloack) 
      .query(`
        DELETE FROM GoogleCalendar WHERE ClientIdOfCloack = @ClientIdOfCloack
      `)  
      .then((result) => {
        console.warn("Access Token deleted:", result.recordset);
        resolve(result.recordset);
      })
      .catch((error) => {
        console.error("Error deleting access token:", error);
        reject(error?.originalError?.info?.message || error.message);
      });
  });
}


module.exports = { UpdateSingleEvent,GetClientTaches,GetClientTachesAllOfThem,  CreateGoogleCalendarAccount,GetAccessTokenGoogleCalendar,DeleteGoogleToken,   MarkAsDone, CreateClientTache, UpdateClientTache,UpdateClientTacheDates, CreateClientTacheCustom, GetClientTachesSimple, GetAllClientTaches, DeleteClientTache, GetUnassignedClientTache };