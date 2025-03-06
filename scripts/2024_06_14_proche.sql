
CREATE TABLE Proche(
    ProcheId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL,
    Nom NVARCHAR(100) NOT NULL,
    Prenom NVARCHAR(100) NOT NULL,
    DateNaissance DATE,
    Telephone1 NVARCHAR(20),
    Telephone2 NVARCHAR(20),
    Email1 NVARCHAR(40),
    Email2 NVARCHAR(40),
    Adresse NVARCHAR(100),
    Charge BIT,
    LienParente NVARCHAR(100) NOT NULL,
    Particularite NVARCHAR(100) NOT NULL,
    NombreEnfant NVARCHAR(255),
    Commentaire NVARCHAR(255),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

create proc ps_get_proches
    @ClientId uniqueidentifier
AS
BEGIN
    select * from Proche where ClientId=@ClientId 
END
GO

create proc ps_create_proche
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
    insert into Proche(ProcheId,ClientId,Nom,Prenom,DateNaissance,Telephone1,Telephone2,Email1,Email2,Adresse,Charge,LienParente,Particularite,NombreEnfant,Commentaire)
    values(@ProcheId,@ClientId,@Nom,@Prenom,@DateNaissance,@Telephone1,@Telephone2,@Email1,@Email2,@Adresse,@Charge,@LienParente,@Particularite,@NombreEnfant,@Commentaire)
END
GO

create proc ps_update_proche
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
        Commentaire=@Commentaire
    where ProcheId=@ProcheId
END
GO

create proc ps_delete_proche
    @ProcheId uniqueidentifier
AS
BEGIN
    delete from Proche where ProcheId=@ProcheId
END
GO
