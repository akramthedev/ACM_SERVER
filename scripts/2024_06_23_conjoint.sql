
CREATE TABLE Conjoint (
    ConjointId uniqueidentifier primary key,
    ClientId uniqueidentifier NOT NULL,
    Nom NVARCHAR(100) NOT NULL,
    Prenom NVARCHAR(100) NOT NULL,
    DateNaissance DATE,
    Profession NVARCHAR(100),
    DateRetraite DATE,
    NumeroSS NVARCHAR(20),
    DateMariage DATE,
    Adresse NVARCHAR(255),
    RegimeMatrimonial NVARCHAR(100),
    DonationEpoux BIT,
    ModifRegimeDate NVARCHAR(100),
    QuestComp NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

create proc ps_get_conjoint
    @ClientId uniqueidentifier
AS
BEGIN
    select top 1 * from Conjoint where ClientId=@ClientId 
END
GO

create proc ps_create_conjoint
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
    @DonationEpoux BIT,
    @ModifRegimeDate NVARCHAR(100),
    @QuestComp NVARCHAR(MAX)
AS
BEGIN
    insert into Conjoint(ConjointId,ClientId,Nom,Prenom,DateNaissance,Profession,DateRetraite,NumeroSS,DateMariage,Adresse,RegimeMatrimonial,DonationEpoux,ModifRegimeDate,QuestComp)
    values(@ConjointId,@ClientId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@NumeroSS,@DateMariage,@Adresse,@RegimeMatrimonial,@DonationEpoux,@ModifRegimeDate,@QuestComp)
END
GO

create proc ps_update_conjoint
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
    @DonationEpoux BIT,
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
        QuestComp=@QuestComp
    where ConjointId=@ConjointId
END
GO

create proc ps_delete_conjoint
    @ConjointId uniqueidentifier
AS
BEGIN
    delete from Conjoint where ConjointId=@ConjointId
END
GO
