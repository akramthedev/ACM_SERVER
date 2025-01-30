const sql = require("mssql");

function GetClients(CabinetId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("CabinetId", sql.UniqueIdentifier, CabinetId)
      .execute("ps_get_clients")
      .then((result) => resolve(result.recordset))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}







function GetClient(ClientId) {

  console.warn("Request Executed : in Client Repository");
  console.log("ClientId : "+ClientId);

  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    
    request.input("ClientId", sql.UniqueIdentifier, ClientId)
      .query("SELECT TOP 1 * FROM Client WHERE ClientId = @ClientId")
      .then((result) => {
        if (result.recordset && result.recordset.length > 0) {
          console.log(result.recordset[0]);
          resolve(result.recordset[0]); 
        } else {
          resolve(null); 
        }
      })
      .catch((error) => {
        reject(error?.message || "An error occurred while fetching the client.");
      });
  });
}








function CreateClient(data) {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    request.input("ClientId", sql.UniqueIdentifier, data.ClientId);
    request.input("CabinetId", sql.UniqueIdentifier, data.CabinetId);
    request.input("Nom", sql.NVarChar(255), data.Nom);
    request.input("Prenom", sql.NVarChar(255), data.Prenom);
    request.input("DateNaissance", sql.Date, data.DateNaissance);
    request.input("Profession", sql.NVarChar(255), data.Profession);
    request.input("DateRetraite", sql.Date, data.DateRetraite);
    request.input("DateResidence", sql.Date, data.DateResidence);
    request.input("NumeroSS", sql.NVarChar(20), data.NumeroSS);
    request.input("Adresse", sql.NVarChar(255), data.Adresse);
    request.input("Email1", sql.NVarChar(100), data.Email1);
    request.input("Email2", sql.NVarChar(100), data.Email2);
    request.input("Telephone1", sql.NVarChar(20), data.Telephone1);
    request.input("Telephone2", sql.NVarChar(20), data.Telephone2);
    request.input("HasConjoint", sql.Bit, data.HasConjoint);
    request.input("SituationFamiliale", sql.NVarChar(255), data.SituationFamiliale);
    request.input("ParticulariteFiscale", sql.NVarChar(255), data.ParticulariteFiscale);
    request.input("CFE", sql.NVarChar(100), data.CFE);
    request.input("Cotisation", sql.NVarChar(100), data.Cotisation);
    request.input("Reversion", sql.NVarChar(100), data.Reversion);
    request.input("CNSS", sql.NVarChar(100), data.CNSS);
    request.input("CNAREFE", sql.NVarChar(100), data.CNAREFE);
    request.input("CAPITONE", sql.NVarChar(100), data.CAPITONE);
    request.input("AssuranceRapatriement", sql.NVarChar(100), data.AssuranceRapatriement);
    request.input("MutuelleFrancaise", sql.NVarChar(100), data.MutuelleFrancaise);
    request.input("PASSEPORT", sql.NVarChar(100), data.PASSEPORT);
    request.input("CarteSejour", sql.NVarChar(100), data.CarteSejour);
    request.input("PermisConduire", sql.NVarChar(100), data.PermisConduire);
    request.input("AssuranceAuto", sql.NVarChar(100), data.AssuranceAuto);
    request.input("AssuranceHabitation", sql.NVarChar(100), data.AssuranceHabitation);
    request.input("InscriptionConsulat", sql.NVarChar(100), data.InscriptionConsulat);
    request.input("CPAM", sql.NVarChar(100), data.CPAM);
    request.input("CSG_CRDS", sql.NVarChar(100), data.CSG_CRDS);

    // ✅ Use OUTPUT clause to return inserted row
    const sqlQuery = `
      INSERT INTO Client (ClientId, CabinetId, Nom, Prenom, DateNaissance, Profession, DateRetraite, DateResidence, NumeroSS, Adresse, Email1, Email2, Telephone1, Telephone2, HasConjoint, SituationFamiliale, ParticulariteFiscale, CFE, Cotisation, Reversion, CNSS, CNAREFE, CAPITONE, AssuranceRapatriement, MutuelleFrancaise, PASSEPORT, CarteSejour, PermisConduire, AssuranceAuto, AssuranceHabitation, InscriptionConsulat, CPAM, CSG_CRDS)
      OUTPUT INSERTED.*
      VALUES (@ClientId, @CabinetId, @Nom, @Prenom, @DateNaissance, @Profession, @DateRetraite, @DateResidence, @NumeroSS, @Adresse, @Email1, @Email2, @Telephone1, @Telephone2, @HasConjoint, @SituationFamiliale, @ParticulariteFiscale, @CFE, @Cotisation, @Reversion, @CNSS, @CNAREFE, @CAPITONE, @AssuranceRapatriement, @MutuelleFrancaise, @PASSEPORT, @CarteSejour, @PermisConduire, @AssuranceAuto, @AssuranceHabitation, @InscriptionConsulat, @CPAM, @CSG_CRDS);
    `;

    request.query(sqlQuery)
      .then((result) => {
        console.warn("Inserted Client:", result.recordset[0]); // ✅ Log the inserted row
        resolve(result.recordset[0]); // ✅ Return the inserted row
      })
      .catch((error) => {
        console.error("Error inserting client:", error);
        reject(error);
      });
  });
}










function UpdateClient(data) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, data.ClientId)
      .input("Nom", sql.NVarChar(255), data.Nom)
      .input("Prenom", sql.NVarChar(255), data.Prenom)
      .input("DateNaissance", sql.Date, data.DateNaissance)
      .input("Profession", sql.NVarChar(255), data.Profession)
      .input("DateRetraite", sql.Date, data.DateRetraite)
      .input("DateResidence", sql.Date, data.DateResidence)
      .input("NumeroSS", sql.NVarChar(20), data.NumeroSS)
      .input("Adresse", sql.NVarChar(255), data.Adresse)
      .input("Email1", sql.NVarChar(100), data.Email1)
      .input("Email2", sql.NVarChar(100), data.Email2)
      .input("Telephone1", sql.NVarChar(20), data.Telephone1)
      .input("Telephone2", sql.NVarChar(20), data.Telephone2)
      .input("HasConjoint", sql.Bit, data.HasConjoint)
      .input("SituationFamiliale", sql.NVarChar(255), data.SituationFamiliale)
      .input("ParticulariteFiscale", sql.NVarChar(255), data.ParticulariteFiscale)
      .input("CFE", sql.NVarChar(100), data.CFE)
      .input("Cotisation", sql.NVarChar(100), data.Cotisation)
      .input("Reversion", sql.NVarChar(100), data.Reversion)
      .input("CNSS", sql.NVarChar(100), data.CNSS)
      .input("CNAREFE", sql.NVarChar(100), data.CNAREFE)
      .input("CAPITONE", sql.NVarChar(100), data.CAPITONE)
      .input("AssuranceRapatriement", sql.NVarChar(100), data.AssuranceRapatriement)
      .input("MutuelleFrancaise", sql.NVarChar(100), data.MutuelleFrancaise)
      .input("PASSEPORT", sql.NVarChar(100), data.PASSEPORT)
      .input("CarteSejour", sql.NVarChar(100), data.CarteSejour)
      .input("PermisConduire", sql.NVarChar(100), data.PermisConduire)
      .input("AssuranceAuto", sql.NVarChar(100), data.AssuranceAuto)
      .input("AssuranceHabitation", sql.NVarChar(100), data.AssuranceHabitation)
      .input("InscriptionConsulat", sql.NVarChar(100), data.InscriptionConsulat)
      .input("CPAM", sql.NVarChar(100), data.CPAM)
      .input("CSG_CRDS", sql.NVarChar(100), data.CSG_CRDS)
      .execute("ps_update_client")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}

function DeleteClient(ClientId) {
  return new Promise((resolve, reject) => {
    new sql.Request()
      .input("ClientId", sql.UniqueIdentifier, ClientId)
      .execute("ps_delete_client")
      .then((result) => resolve(result.rowsAffected[0] > 0))
      .catch((error) => reject(error?.originalError?.info?.message));
  });
}
module.exports = { GetClients, GetClient, CreateClient, UpdateClient, DeleteClient };
