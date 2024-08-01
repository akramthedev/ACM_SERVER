ALTER TABLE Client ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_client
    @ClientId uniqueidentifier
    ,@CabinetId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
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
    insert into Client(ClientId,CabinetId,Nom,Prenom,DateNaissance,Profession,DateRetraite,NumeroSS,Adresse,Email1,Email2,Telephone1,Telephone2,HasConjoint,SituationFamiliale,ParticulariteFiscale,CFE,Cotisation,Reversion,CNSS,CNAREFE,CAPITONE,AssuranceRapatriement,MutuelleFrancaise,PASSEPORT,CarteSejour,PermisConduire,AssuranceAuto,AssuranceHabitation,InscriptionConsulat,CPAM,CSG_CRDS,CreatedAt)
    values(@ClientId,@CabinetId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@NumeroSS,@Adresse,@Email1,@Email2,@Telephone1,@Telephone2,@HasConjoint,@SituationFamiliale,@ParticulariteFiscale,@CFE,@Cotisation,@Reversion,@CNSS,@CNAREFE,@CAPITONE,@AssuranceRapatriement,@MutuelleFrancaise,@PASSEPORT,@CarteSejour,@PermisConduire,@AssuranceAuto,@AssuranceHabitation,@InscriptionConsulat,@CPAM,@CSG_CRDS,CURRENT_TIMESTAMP);
Go



ALTER PROCEDURE ps_update_client
    @ClientId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
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

ALTER TABLE Proche ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_proche
    @ProcheId uniqueidentifier,
    @ClientId uniqueidentifier,
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @DateNaissance DATE,
    @Telephone1 NVARCHAR(20),
    @Telephone2 NVARCHAR(20),
    @Email1 NVARCHAR(40),
    @Email2 NVARCHAR(40),
    @Adresse NVARCHAR(100),
    @Charge BIT,
    @LienParente NVARCHAR(100),
    @Particularite NVARCHAR(100),
    @NombreEnfant NVARCHAR(255),
    @Commentaire NVARCHAR(255)
AS
BEGIN
    insert into Proche(ProcheId,ClientId,Nom,Prenom,DateNaissance,Telephone1,Telephone2,Email1,Email2,Adresse,Charge,LienParente,Particularite,NombreEnfant,Commentaire,CreatedAt)
    values(@ProcheId,@ClientId,@Nom,@Prenom,@DateNaissance,@Telephone1,@Telephone2,@Email1,@Email2,@Adresse,@Charge,@LienParente,@Particularite,@NombreEnfant,@Commentaire,CURRENT_TIMESTAMP)
END
GO

ALTER PROCEDURE ps_update_proche
    @ProcheId uniqueidentifier,
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @DateNaissance DATE,
    @Telephone1 NVARCHAR(20),
    @Telephone2 NVARCHAR(20),
    @Email1 NVARCHAR(40),
    @Email2 NVARCHAR(40),
    @Adresse NVARCHAR(100),
    @Charge BIT,
    @LienParente NVARCHAR(100),
    @Particularite NVARCHAR(100),
    @NombreEnfant NVARCHAR(255),
    @Commentaire NVARCHAR(255)
AS
BEGIN
    update Proche
    set
        Nom=@Nom,
        Prenom=@Prenom,
        DateNaissance=@DateNaissance,
        Telephone1=@Telephone1,
        Telephone2=@Telephone2,
        Email1=@Email1,
        Email2=@Email2,
        Adresse=@Adresse,
        Charge=@Charge,
        LienParente=@LienParente,
        Particularite=@Particularite,
        NombreEnfant=@NombreEnfant,
        Commentaire=@Commentaire,
        UpdatedAt=CURRENT_TIMESTAMP
    where ProcheId=@ProcheId
END
GO

ALTER TABLE Conjoint ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_conjoint
    @ConjointId uniqueidentifier,
    @ClientId uniqueidentifier,
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @DateNaissance DATE,
    @Profession NVARCHAR(100),
    @DateRetraite DATE,
    @NumeroSS NVARCHAR(20),
    @DateMariage DATE,
    @Adresse NVARCHAR(255),
    @RegimeMatrimonial NVARCHAR(100),
    @DonationEpoux NVARCHAR(100),
    @ModifRegimeDate NVARCHAR(100),
    @QuestComp NVARCHAR(MAX)
AS
BEGIN
    insert into Conjoint(ConjointId,ClientId,Nom,Prenom,DateNaissance,Profession,DateRetraite,NumeroSS,DateMariage,Adresse,RegimeMatrimonial,DonationEpoux,ModifRegimeDate,QuestComp,CreatedAt)
    values(@ConjointId,@ClientId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@NumeroSS,@DateMariage,@Adresse,@RegimeMatrimonial,@DonationEpoux,@ModifRegimeDate,@QuestComp,CURRENT_TIMESTAMP)
END
GO

ALTER PROCEDURE ps_update_conjoint
    @ConjointId uniqueidentifier,
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @DateNaissance DATE,
    @Profession NVARCHAR(100),
    @DateRetraite DATE,
    @NumeroSS NVARCHAR(20),
    @DateMariage DATE,
    @Adresse NVARCHAR(255),
    @RegimeMatrimonial NVARCHAR(100),
    @DonationEpoux NVARCHAR(100),
    @ModifRegimeDate NVARCHAR(100),
    @QuestComp NVARCHAR(MAX)
AS
BEGIN
    update Conjoint
    set
        ConjointId=@ConjointId,
        Nom=@Nom,
        Prenom=@Prenom,
        DateNaissance=@DateNaissance,
        Profession=@Profession,
        DateRetraite=@DateRetraite,
        NumeroSS=@NumeroSS,
        DateMariage=@DateMariage,
        Adresse=@Adresse,
        RegimeMatrimonial=@RegimeMatrimonial,
        DonationEpoux=@DonationEpoux,
        ModifRegimeDate=@ModifRegimeDate,
        QuestComp=@QuestComp,
        UpdatedAt=CURRENT_TIMESTAMP
    where ConjointId=@ConjointId
END
GO
---------------------------------
ALTER TABLE ClientPiece ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_client_piece
    @ClientPieceId uniqueidentifier,
    @ClientId uniqueidentifier,
    @PieceId uniqueidentifier,
    @Extension NVARCHAR(50)
AS
    insert into ClientPiece(ClientPieceId,ClientId,PieceId,Extension,CreatedAt)
    values(@ClientPieceId,@ClientId,@PieceId,@Extension,CURRENT_TIMESTAMP)
GO
----------------------------------
ALTER TABLE Patrimoine ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_patrimoine
    @PatrimoineId uniqueidentifier,
    @ClientId uniqueidentifier,
    @TypePatrimoine NVARCHAR(100),
    @Designation NVARCHAR(255),
    @Adresse NVARCHAR(255),
    @Valeur FLOAT,
    @Detenteur NVARCHAR(255),
    @ChargesAssocies NVARCHAR(255),
    @Charges NVARCHAR(255),
    @DateAchat Date,
    @RevenueFiscalite NVARCHAR(255),
    @CapitalEmprunte FLOAT,
    @Duree FLOAT,
    @Taux FLOAT,
    @AGarantieDeces BIT,
    @Particularite NVARCHAR(255),
    @Commentaire NVARCHAR(MAX),
    @QuestionsComplementaires NVARCHAR(MAX)
AS
BEGIN
    insert into Patrimoine(PatrimoineId,ClientId,TypePatrimoine,Designation,Adresse,Valeur,Detenteur,ChargesAssocies,Charges,DateAchat,RevenueFiscalite,CapitalEmprunte,Duree,Taux,AGarantieDeces,Particularite,Commentaire,QuestionsComplementaires,CreatedAt)
    values(@PatrimoineId,@ClientId,@TypePatrimoine,@Designation,@Adresse,@Valeur,@Detenteur,@ChargesAssocies,@Charges,@DateAchat,@RevenueFiscalite,@CapitalEmprunte,@Duree,@Taux,@AGarantieDeces,@Particularite,@Commentaire,@QuestionsComplementaires,CURRENT_TIMESTAMP)
END
GO

ALTER PROCEDURE ps_update_patrimoine
    @PatrimoineId uniqueidentifier,
    @TypePatrimoine NVARCHAR(100),
    @Designation NVARCHAR(255),
    @Adresse NVARCHAR(255),
    @Valeur FLOAT,
    @Detenteur NVARCHAR(255),
    @ChargesAssocies NVARCHAR(255),
    @Charges NVARCHAR(255),
    @DateAchat Date,
    @RevenueFiscalite NVARCHAR(255),
    @CapitalEmprunte FLOAT,
    @Duree FLOAT,
    @Taux FLOAT,
    @AGarantieDeces BIT,
    @Particularite NVARCHAR(255),
    @Commentaire NVARCHAR(MAX),
    @QuestionsComplementaires NVARCHAR(MAX)
AS
BEGIN
    update Patrimoine
    set
        PatrimoineId=@PatrimoineId,
        TypePatrimoine=@TypePatrimoine,
        Designation=@Designation,
        Adresse=@Adresse,
        Valeur=@Valeur,
        Detenteur=@Detenteur,
        ChargesAssocies=@ChargesAssocies,
        Charges=@Charges,
        DateAchat=@DateAchat,
        RevenueFiscalite=@RevenueFiscalite,
        CapitalEmprunte=@CapitalEmprunte,
        Duree=@Duree,
        Taux=@Taux,
        AGarantieDeces=@AGarantieDeces,
        Particularite=@Particularite,
        Commentaire=@Commentaire,
        QuestionsComplementaires=@QuestionsComplementaires,
        UpdatedAt=CURRENT_TIMESTAMP
    where PatrimoineId=@PatrimoineId
END
GO


ALTER TABLE Passif ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_Passif
    @PassifsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @TypePassifs NVARCHAR(100),
    @Designation NVARCHAR(100),
    @CapitalEmprunte FLOAT,
    @Valeur FLOAT,
    @Detenteur NVARCHAR(100),
    @DureeMois DECIMAL(5,2),
    @Taux FLOAT,
    @Deces BIT,
    @Particularite NVARCHAR(100),
    @ValeurRachat FLOAT,
    @DateSouscription DATE,
    @Assure BIT,
    @Beneficiaire NVARCHAR(100),
    @DateOuverture DATE,
    @EpargneAssocie NVARCHAR(100),
    @RevenusDistribue FLOAT,
    @FiscaliteOuRevenue FLOAT,
    @TauxRevalorisation FLOAT,
    @CommentPassifs NVARCHAR(255)
AS
BEGIN
    insert into Passif(PassifsId,ClientId,TypePassifs,Designation,Valeur,CapitalEmprunte,Detenteur,DureeMois,Taux,Deces,Particularite,ValeurRachat,DateSouscription,Assure,Beneficiaire,DateOuverture,EpargneAssocie,RevenusDistribue,FiscaliteOuRevenue,TauxRevalorisation,CommentPassifs,CreatedAt)
    values(@PassifsId,@ClientId,@TypePassifs,@Designation,@Valeur,@CapitalEmprunte,@Detenteur,@DureeMois,@Taux,@Deces,@Particularite,@ValeurRachat,@DateSouscription,@Assure,@Beneficiaire,@DateOuverture,@EpargneAssocie,@RevenusDistribue,@FiscaliteOuRevenue,@TauxRevalorisation,@CommentPassifs,CURRENT_TIMESTAMP)
END
GO

ALTER PROCEDURE ps_update_Passif
    @PassifsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @TypePassifs NVARCHAR(100),
    @Designation NVARCHAR(100),
    @CapitalEmprunte FLOAT,
    @Valeur FLOAT,
    @Detenteur NVARCHAR(100),
    @DureeMois DECIMAL(5,2),
    @Taux FLOAT,
    @Deces BIT,
    @Particularite NVARCHAR(100),
    @ValeurRachat FLOAT,
    @DateSouscription DATE,
    @Assure BIT,
    @Beneficiaire NVARCHAR(100),
    @DateOuverture DATE,
    @EpargneAssocie NVARCHAR(100),
    @RevenusDistribue FLOAT,
    @FiscaliteOuRevenue FLOAT,
    @TauxRevalorisation FLOAT,
    @CommentPassifs NVARCHAR(255)
AS
BEGIN
    update Passif
    set
        PassifsId=@PassifsId,
        ClientId=@ClientId,
        TypePassifs=@TypePassifs,
        Designation=@Designation,
        Valeur=@Valeur,
        CapitalEmprunte=@CapitalEmprunte,
        Detenteur=@Detenteur,
        DureeMois=@DureeMois,
        Taux=@Taux,
        Deces=@Deces,
        Particularite=@Particularite,
        ValeurRachat=@ValeurRachat,
        DateSouscription=@DateSouscription,
        Assure=@Assure,
        Beneficiaire=@Beneficiaire,
        DateOuverture=@DateOuverture,
        EpargneAssocie=@EpargneAssocie,
        RevenusDistribue=@RevenusDistribue,
        FiscaliteOuRevenue=@FiscaliteOuRevenue,
        TauxRevalorisation=@TauxRevalorisation,
        CommentPassifs=@CommentPassifs,
        UpdatedAt=CURRENT_TIMESTAMP
    where PassifsId=@PassifsId
END
GO

ALTER TABLE Budget ADD CreatedAt DateTime,UpdatedAt DateTime;

ALTER PROCEDURE ps_create_Budget
    @BudgetsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @Designation NVARCHAR(255),
    @Montant FLOAT,
    @Sexe NVARCHAR(100),
    @CommentBudgets NVARCHAR(255)
AS
BEGIN
    insert into Budget(BudgetsId,ClientId,Designation,Montant,Sexe,CommentBudgets,CreatedAt)
    values(@BudgetsId,@ClientId,@Designation,@Montant,@Sexe,@CommentBudgets,CURRENT_TIMESTAMP)
END
GO

ALTER PROCEDURE ps_update_Budget
    @BudgetsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @Designation NVARCHAR(255),
    @Montant FLOAT,
    @Sexe NVARCHAR(100),
    @CommentBudgets NVARCHAR(255)
AS
BEGIN
    update Budget
    set
        BudgetsId=@BudgetsId,
        ClientId=@ClientId,
        Designation=@Designation,
        Montant=@Montant,
        Sexe=@Sexe,
        CommentBudgets=@CommentBudgets,
        UpdatedAt=CURRENT_TIMESTAMP
    where BudgetsId=@BudgetsId
END
GO


