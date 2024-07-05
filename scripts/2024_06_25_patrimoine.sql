
CREATE TABLE Patrimoine (
    PatrimoineId uniqueidentifier primary key,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    TypePatrimoine NVARCHAR(100), -- "Bien d'usage" | "Immobilier de rapport" | "Bien professionnel"
    Designation NVARCHAR(255),
    Adresse NVARCHAR(255),
    Valeur FLOAT,
    Detenteur NVARCHAR(255),
    ChargesAssocies NVARCHAR(255),
    Charges NVARCHAR(255),
    DateAchat Date,
    RevenueFiscalite NVARCHAR(255),
    CapitalEmprunte FLOAT,
    Duree FLOAT,
    Taux FLOAT,
    AGarantieDeces Bit,
    Particularite NVARCHAR(255),
    Commentaire NVARCHAR(MAX),
    QuestionsComplementaires NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

create proc ps_get_patrimoines
    @ClientId uniqueidentifier
AS
BEGIN
    select * from Patrimoine where ClientId=@ClientId 
END
GO

create proc ps_create_patrimoine
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
    insert into Patrimoine(PatrimoineId,ClientId,TypePatrimoine,Designation,Adresse,Valeur,Detenteur,ChargesAssocies,Charges,DateAchat,RevenueFiscalite,CapitalEmprunte,Duree,Taux,AGarantieDeces,Particularite,Commentaire,QuestionsComplementaires)
    values(@PatrimoineId,@ClientId,@TypePatrimoine,@Designation,@Adresse,@Valeur,@Detenteur,@ChargesAssocies,@Charges,@DateAchat,@RevenueFiscalite,@CapitalEmprunte,@Duree,@Taux,@AGarantieDeces,@Particularite,@Commentaire,@QuestionsComplementaires)
END
GO

create proc ps_update_patrimoine
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
        QuestionsComplementaires=@QuestionsComplementaires
    where PatrimoineId=@PatrimoineId
END
GO

create proc ps_delete_patrimoine
    @PatrimoineId uniqueidentifier
AS
BEGIN
    delete from Patrimoine where PatrimoineId=@PatrimoineId
END
GO
