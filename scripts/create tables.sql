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
AS
    insert into Client(ClientId,CabinetId,Nom,Prenom)
    values(@ClientId,@CabinetId,@Nom,@Prenom);
Go
create proc ps_delete_client
    @ClientId uniqueidentifier
AS
    delete from Client where ClientId=@ClientId;
GO
