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

create proc ps_create_client
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
AS
    insert into Client(ClientId,CabinetId,Nom,Prenom,DateNaissance,Profession,DateRetraite,NumeroSS,Adresse,Email1,Email2,Telephone1,Telephone2,HasConjoint)
    values(@ClientId,@CabinetId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@NumeroSS,@Adresse,@Email1,@Email2,@Telephone1,@Telephone2,@HasConjoint);
Go

create proc ps_update_client
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
AS
    update Client
    set
        Nom=@Nom,
        Prenom=@Prenom,
        DateNaissance=@DateNaissance,
        Profession=@Profession,
        DateRetraite=@DateRetraite,
        NumeroSS=@NumeroSS,
        Adresse=@Adresse,
        Email1=@Email1,
        Email2=@Email2,
        Telephone1=@Telephone1,
        Telephone2=@Telephone2,
        HasConjoint=@HasConjoint
    where ClientId=@ClientId
Go

create proc ps_delete_client
    @ClientId uniqueidentifier
AS
    delete from Client where ClientId=@ClientId;
GO


