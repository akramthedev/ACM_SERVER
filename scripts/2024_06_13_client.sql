create table Cabinet
(	
	CabinetId uniqueidentifier PRIMARY KEY
	,Nom nvarchar(255)
	,Adresse nvarchar(255)
	,Telephone1 nvarchar(20)
	,Telephone2 nvarchar(20)
);

CREATE TABLE Client (
    ClientId uniqueidentifier PRIMARY KEY
    ,CabinetId uniqueidentifier not null
    ,Nom NVARCHAR(255) NOT NULL
    ,Prenom NVARCHAR(255) NOT NULL
    ,DateNaissance Date
    ,Photo NVARCHAR(255)
    
    ,Profession NVARCHAR(255)
    ,DateRetraite DATE
    ,DateArriveMaroc DATE
    ,NumeroSS NVARCHAR(20)  --Numero Sécurité Sociale
    ,Adresse NVARCHAR(255)
    ,Email1 NVARCHAR(100)
    ,Email2 NVARCHAR(100)
    ,Telephone1 NVARCHAR(20)
    ,Telephone2 NVARCHAR(20)
    ,HasConjoint BIT

    ,SituationFamiliale NVARCHAR(50)

    ,FOREIGN KEY (CabinetId) REFERENCES Cabinet(CabinetId)    
);

create proc ps_get_clients
    @CabinetId uniqueidentifier
AS
    select * from Client
    where CabinetId=@CabinetId
GO



create proc ps_get_client
    @ClientId uniqueidentifier
AS
    select top 1 * from Client
    where ClientId=@ClientId
GO







create proc ps_create_client
    @ClientId uniqueidentifier
    ,@CabinetId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
    ,@DateArriveMaroc Date
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
    insert into Client(ClientId,CabinetId,Nom,Prenom,DateNaissance,Profession,DateRetraite,DateArriveMaroc, DateResidence,NumeroSS,Adresse,Email1,Email2,Telephone1,Telephone2,HasConjoint,SituationFamiliale,ParticulariteFiscale,CFE,Cotisation,Reversion,CNSS,CNAREFE,CAPITONE,AssuranceRapatriement,MutuelleFrancaise,PASSEPORT,CarteSejour,PermisConduire,AssuranceAuto,AssuranceHabitation,InscriptionConsulat,CPAM,CSG_CRDS)
    values(@ClientId,@CabinetId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@DateArriveMaroc, @DateResidence,@NumeroSS,@Adresse,@Email1,@Email2,@Telephone1,@Telephone2,@HasConjoint,@SituationFamiliale,@ParticulariteFiscale,@CFE,@Cotisation,@Reversion,@CNSS,@CNAREFE,@CAPITONE,@AssuranceRapatriement,@MutuelleFrancaise,@PASSEPORT,@CarteSejour,@PermisConduire,@AssuranceAuto,@AssuranceHabitation,@InscriptionConsulat,@CPAM,@CSG_CRDS);
Go










CREATE PROCEDURE ps_update_client
    @ClientId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
    ,@DateArriveMaroc Date
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
        DateArriveMaroc = @DateArriveMaroc,
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
        CSG_CRDS = @CSG_CRDS
    WHERE ClientId = @ClientId;
GO


create proc ps_delete_client
    @ClientId uniqueidentifier
AS
    delete from Client where ClientId=@ClientId;
GO


alter proc ps_delete_client
    @ClientId uniqueidentifier
AS
    delete from Proche where ClientId=@ClientId;
    delete from Conjoint where ClientId=@ClientId;
    delete from ClientPiece where ClientId=@ClientId;
    delete ct from ClientTache ct JOIN ClientMissionPrestation cmp ON ct.ClientMissionId=cmp.ClientMissionId JOIN ClientMission cm ON ct.ClientMissionId=cm.ClientMissionId WHERE cm.ClientId=@ClientId
    delete cmp from ClientMissionPrestation cmp JOIN ClientMission cm ON cmp.ClientMissionId = cm.ClientMissionId WHERE cm.ClientId=@ClientId
    delete from ClientMission where ClientId=@ClientId;
    delete from Client where ClientId=@ClientId;
GO
