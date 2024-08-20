ALTER TABLE Client
ADD DateResidence Date

ALTER PROCEDURE ps_create_client
    @ClientId uniqueidentifier
    ,@CabinetId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
    ,@DateResidence Date
    ,@NumeroSS NVarChar(20)
    ,@Adresse NVarChar(255)
    ,@Email1 NVarChar(100)
    ,@Email2 NVarChar(100)
    ,@Telephone1 NVarChar(20)
    ,@Telephone2 NVarChar(20)
    ,@HasConjoint Bit
    ,@SituationFamiliale NVarChar(255)
    ,@ParticulariteFiscale NVarChar(255)
    ,@CFE NVarChar(100)
    ,@Cotisation NVarChar(100)
    ,@Reversion NVarChar(100)
    ,@CNSS NVarChar(100)
    ,@CNAREFE NVarChar(100)
    ,@CAPITONE NVarChar(100)
    ,@AssuranceRapatriement NVarChar(100)
    ,@MutuelleFrancaise NVarChar(100)
    ,@PASSEPORT NVarChar(100)
    ,@CarteSejour NVarChar(100)
    ,@PermisConduire NVarChar(100)
    ,@AssuranceAuto NVarChar(100)
    ,@AssuranceHabitation NVarChar(100)
    ,@InscriptionConsulat NVarChar(100)
    ,@CPAM NVarChar(100)
    ,@CSG_CRDS NVarChar(100)
AS
    insert into Client(ClientId,CabinetId,Nom,Prenom,DateNaissance,Profession,DateRetraite,DateResidence,NumeroSS,Adresse,Email1,Email2,Telephone1,Telephone2,HasConjoint,SituationFamiliale,ParticulariteFiscale,CFE,Cotisation,Reversion,CNSS,CNAREFE,CAPITONE,AssuranceRapatriement,MutuelleFrancaise,PASSEPORT,CarteSejour,PermisConduire,AssuranceAuto,AssuranceHabitation,InscriptionConsulat,CPAM,CSG_CRDS,CreatedAt)
    values(@ClientId,@CabinetId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@DateResidence,@NumeroSS,@Adresse,@Email1,@Email2,@Telephone1,@Telephone2,@HasConjoint,@SituationFamiliale,@ParticulariteFiscale,@CFE,@Cotisation,@Reversion,@CNSS,@CNAREFE,@CAPITONE,@AssuranceRapatriement,@MutuelleFrancaise,@PASSEPORT,@CarteSejour,@PermisConduire,@AssuranceAuto,@AssuranceHabitation,@InscriptionConsulat,@CPAM,@CSG_CRDS,CURRENT_TIMESTAMP);
Go



ALTER PROCEDURE ps_update_client
    @ClientId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
    ,@DateResidence Date
    ,@NumeroSS NVarChar(20)
    ,@Adresse NVarChar(255)
    ,@Email1 NVarChar(100)
    ,@Email2 NVarChar(100)
    ,@Telephone1 NVarChar(20)
    ,@Telephone2 NVarChar(20)
    ,@HasConjoint Bit
    ,@SituationFamiliale NVarChar(255)
    ,@ParticulariteFiscale NVarChar(255)
    ,@CFE NVarChar(100)
    ,@Cotisation NVarChar(100)
    ,@Reversion NVarChar(100)
    ,@CNSS NVarChar(100)
    ,@CNAREFE NVarChar(100)
    ,@CAPITONE NVarChar(100)
    ,@AssuranceRapatriement NVarChar(100)
    ,@MutuelleFrancaise NVarChar(100)
    ,@PASSEPORT NVarChar(100)
    ,@CarteSejour NVarChar(100)
    ,@PermisConduire NVarChar(100)
    ,@AssuranceAuto NVarChar(100)
    ,@AssuranceHabitation NVarChar(100)
    ,@InscriptionConsulat NVarChar(100)
    ,@CPAM NVarChar(100)
    ,@CSG_CRDS NVarChar(100)
AS
    UPDATE Client
    SET
        Nom = @Nom,
        Prenom = @Prenom,
        DateNaissance = @DateNaissance,
        Profession = @Profession,
        DateRetraite = @DateRetraite,
        DateResidence = @DateResidence,
        NumeroSS = @NumeroSS,
        Adresse = @Adresse,
        Email1 = @Email1,
        Email2 = @Email2,
        Telephone1 = @Telephone1,
        Telephone2 = @Telephone2,
        HasConjoint = @HasConjoint,
        SituationFamiliale = @SituationFamiliale,
        ParticulariteFiscale = @ParticulariteFiscale,
        CFE = @CFE,
        Cotisation = @Cotisation,
        Reversion = @Reversion,
        CNSS = @CNSS,
        CNAREFE = @CNAREFE,
        CAPITONE = @CAPITONE,
        AssuranceRapatriement = @AssuranceRapatriement,
        MutuelleFrancaise = @MutuelleFrancaise,
        PASSEPORT = @PASSEPORT,
        CarteSejour = @CarteSejour,
        PermisConduire = @PermisConduire,
        AssuranceAuto = @AssuranceAuto,
        AssuranceHabitation = @AssuranceHabitation,
        InscriptionConsulat = @InscriptionConsulat,
        CPAM = @CPAM,
        CSG_CRDS = @CSG_CRDS,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE ClientId = @ClientId;
GO