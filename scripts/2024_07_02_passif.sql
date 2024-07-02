
CREATE TABLE Passif (
    PassifsId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    TypePassifs NVARCHAR(100),
    Designation NVARCHAR(100),
    CapitalEmprunte FLOAT,
    Valeur FLOAT,
    Detenteur NVARCHAR(100),
    DureeMois DECIMAL(5,2),
    Taux NVARCHAR(100),
    Deces NVARCHAR(100),
    Particularite NVARCHAR(100),
    ValeurRachat FLOAT,
    DateSouscription DATE,
    Assure BIT,
    Beneficiaire NVARCHAR(100),
    DateOuverture DATE,
    EpargneAssocie NVARCHAR(100),
    RevenusDistribue NVARCHAR(100),
    FiscaliteOuRevenue NVARCHAR(100),
    TauxRevalorisation NVARCHAR(100),
    CommentPassifs NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

create proc ps_get_Passifs
    @ClientId uniqueidentifier
AS
BEGIN
    select * from Passif where ClientId=@ClientId 
END
GO

create proc ps_create_Passif
    @PassifsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @TypePassifs NVARCHAR(100),
    @Designation NVARCHAR(100),
    @CapitalEmprunte FLOAT,
    @Valeur FLOAT,
    @Detenteur NVARCHAR(100),
    @DureeMois DECIMAL(5,2),
    @Taux NVARCHAR(100),
    @Deces NVARCHAR(100),
    @Particularite NVARCHAR(100),
    @ValeurRachat FLOAT,
    @DateSouscription DATE,
    @Assure BIT,
    @Beneficiaire NVARCHAR(100),
    @DateOuverture DATE,
    @EpargneAssocie NVARCHAR(100),
    @RevenusDistribue NVARCHAR(100),
    @FiscaliteOuRevenue NVARCHAR(100),
    @TauxRevalorisation NVARCHAR(100),
    @CommentPassifs NVARCHAR(MAX),
AS
BEGIN
    insert into Passif(PassifsId,ClientId,TypePassifs,Designation,Valeur,Detenteur,DureeMois,Taux,Deces,Particularite,ValeurRachat,DateSouscription,Assure,Beneficiaire,DateOuverture,EpargneAssocie,RevenusDistribue,FiscaliteOuRevenue,TauxRevalorisation,CommentPassifs)
    values(@PassifsId,@ClientId,@TypePassifs,@Designation,@Valeur,@Detenteur,@DureeMois,@Taux,@Deces,@Particularite,@ValeurRachat,@DateSouscription,@Assure,@Beneficiaire,@DateOuverture,@EpargneAssocie,@RevenusDistribue,@FiscaliteOuRevenue,@TauxRevalorisation,@CommentPassifs)
END
GO

create proc ps_update_Passif
    @PassifsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @TypePassifs NVARCHAR(100),
    @Designation NVARCHAR(100),
    @CapitalEmprunte FLOAT,
    @Valeur FLOAT,
    @Detenteur NVARCHAR(100),
    @DureeMois DECIMAL(5,2),
    @Taux NVARCHAR(100),
    @Deces NVARCHAR(100),
    @Particularite NVARCHAR(100),
    @ValeurRachat FLOAT,
    @DateSouscription DATE,
    @Assure BIT,
    @Beneficiaire NVARCHAR(100),
    @DateOuverture DATE,
    @EpargneAssocie NVARCHAR(100),
    @RevenusDistribue NVARCHAR(100),
    @FiscaliteOuRevenue NVARCHAR(100),
    @TauxRevalorisation NVARCHAR(100),
    @CommentPassifs NVARCHAR(MAX),
AS
BEGIN
    update Passif
    set
        PassifsId=@PassifsId,
        ClientId=@ClientId,
        TypePassifs=@TypePassifs,
        Designation=@Designation,
        Valeur=@Valeur,
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
        CommentPassifs=@CommentPassifs
    where PassifsId=@PassifsId
END
GO

create proc ps_delete_Passif
    @PassifId uniqueidentifier
AS
BEGIN
    delete from Passif where PassifId=@PassifId
END
GO
