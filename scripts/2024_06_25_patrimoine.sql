
CREATE TABLE Patrimoine (
    PatrimoineId uniqueidentifier primary key,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    TypePatrimoine NVARCHAR(100),
    Designation NVARCHAR(255),
    Valeur FLOAT,
    Detenteur NVARCHAR(255),
    ChargesAssocies NVARCHAR(255),
    Charges NVARCHAR(255),
    RevenueFiscalite NVARCHAR(255),
    CapitalEmprunte NVARCHAR(255),
    Duree NVARCHAR(255),
    Taux NVARCHAR(255),
    Deces NVARCHAR(255),
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
    @Valeur FLOAT,
    @Detenteur NVARCHAR(255),
    @ChargesAssocies NVARCHAR(255),
    @Charges NVARCHAR(255),
    @RevenueFiscalite NVARCHAR(255),
    @CapitalEmprunte NVARCHAR(255),
    @Duree NVARCHAR(255),
    @Taux NVARCHAR(255),
    @Deces NVARCHAR(255),
    @Particularite NVARCHAR(255),
    @Commentaire NVARCHAR(MAX),
    @QuestionsComplementaires NVARCHAR(MAX)
AS
BEGIN
    insert into Patrimoine(PatrimoineId,ClientId,TypePatrimoine,Designation,Valeur,Detenteur,ChargesAssocies,Charges,RevenueFiscalite,CapitalEmprunte,Duree,Taux,Deces,Particularite,Commentaire,QuestionsComplementaires)
    values(@PatrimoineId,@ClientId,@TypePatrimoine,@Designation,@Valeur,@Detenteur,@ChargesAssocies,@Charges,@RevenueFiscalite,@CapitalEmprunte,@Duree,@Taux,@Deces,@Particularite,@Commentaire,@QuestionsComplementaires)
END
GO

create proc ps_update_patrimoine
    @PatrimoineId uniqueidentifier,
    @TypePatrimoine NVARCHAR(100),
    @Designation NVARCHAR(255),
    @Valeur FLOAT,
    @Detenteur NVARCHAR(255),
    @ChargesAssocies NVARCHAR(255),
    @Charges NVARCHAR(255),
    @RevenueFiscalite NVARCHAR(255),
    @CapitalEmprunte NVARCHAR(255),
    @Duree NVARCHAR(255),
    @Taux NVARCHAR(255),
    @Deces NVARCHAR(255),
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
        Valeur=@Valeur,
        Detenteur=@Detenteur,
        ChargesAssocies=@ChargesAssocies,
        Charges=@Charges,
        RevenueFiscalite=@RevenueFiscalite,
        CapitalEmprunte=@CapitalEmprunte,
        Duree=@Duree,
        Taux=@Taux,
        Deces=@Deces,
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
