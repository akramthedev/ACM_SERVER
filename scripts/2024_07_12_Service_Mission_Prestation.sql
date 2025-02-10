CREATE TABLE Service (
    ServiceId uniqueidentifier PRIMARY KEY, 
    CabinetId uniqueidentifier NOT NULL, -- Référence au cabinet 
    Designation NVARCHAR(255),
    Description NVARCHAR(255),
    CreatedAt DateTime,
    UpdatedAt DateTime,
    FOREIGN KEY (CabinetId) REFERENCES Cabinet(CabinetId)

);

CREATE TABLE Mission (
    MissionId uniqueidentifier PRIMARY KEY, 
    ServiceId uniqueidentifier NOT NULL, -- Référence au service 
    Designation NVARCHAR(255),
    Description NVARCHAR(255),
    CreatedAt DateTime,
    UpdatedAt DateTime,
    FOREIGN KEY (ServiceId) REFERENCES Service(ServiceId)

);

CREATE TABLE Prestation (
    PrestationId uniqueidentifier PRIMARY KEY, 
    MissionId uniqueidentifier NOT NULL, -- Référence au mission 
    Designation NVARCHAR(255),
    Description NVARCHAR(255),
    CreatedAt DateTime,
    UpdatedAt DateTime,
    FOREIGN KEY (MissionId) REFERENCES Mission(MissionId)

);
----------------------------------------------------------------------------17/07/2024-------------------------------------------------------------
CREATE TABLE TacheDateReference(
    TacheDateReferenceId uniqueidentifier PRIMARY KEY,
    Libelle NVARCHAR(255),
    Description NVARCHAR(255)
);
CREATE TABLE TypePersonneANotifier(
    TypePersonneANotifierId uniqueidentifier PRIMARY KEY,
    Libelle NVARCHAR(255),
    Description NVARCHAR(255)
);

CREATE TABLE Tache(
    TacheId uniqueidentifier PRIMARY KEY,
    PrestationId uniqueidentifier NOT NULL, --Référence au prestation
    TacheDateReferenceId uniqueidentifier , --Référence au TacheDateReference
    TypePersonneANotifierId uniqueidentifier , --Référence au TypePersonneANotifier
    Depend_de uniqueidentifier --Référence Tache
    AgentId uniqueidentifier, --Référence au Agent
    Intitule NVARCHAR(255),
    Description NVARCHAR(255),
    Numero_Ordre NVARCHAR(255),
    Deadline Float,
    NombreRapelle Float,
    Priorite NVARCHAR(255),
    Honoraire Float,
    FOREIGN KEY (PrestationId) REFERENCES Prestation(PrestationId),
    FOREIGN KEY (TacheDateReferenceId) REFERENCES TacheDateReference(TacheDateReferenceId),
    FOREIGN KEY (TypePersonneANotifierId) REFERENCES TypePersonneANotifier(TypePersonneANotifierId),
    FOREIGN KEY (Depend_de) REFERENCES Tache(TacheId)


);


CREATE TABLE ClientMission(
    ClientMissionId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au Client
    MissionId uniqueidentifier NOT NULL, -- Référence au Mission
    DateAffectation DateTime,
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId),
    FOREIGN KEY (MissionId) REFERENCES Mission(MissionId)

);

create proc ps_get_client_missions
    @ClientId uniqueidentifier
AS
BEGIN
    select cm.ClientMissionId,cm.ClientId,cm.MissionId,cm.DateAffectation,m.Designation,m.Description
    from ClientMission cm
    left join Mission m on m.MissionId=cm.MissionId
    where cm.ClientId=@ClientId
END
GO

create proc ps_create_client_mission
    @ClientMissionId uniqueidentifier,
    @ClientId uniqueidentifier,
    @MissionId uniqueidentifier
AS
    insert into ClientMission(ClientMissionId,ClientId,MissionId,DateAffectation)
    values(@ClientMissionId,@ClientId,@MissionId,CURRENT_TIMESTAMP)
GO

create proc ps_delete_client_mission
    @ClientMissionId uniqueidentifier
AS
    delete from ClientMission where ClientMissionId=@ClientMissionId
GO

CREATE TABLE ClientMissionPrestation(
    ClientMissionPrestationId uniqueidentifier PRIMARY KEY,
    ClientMissionId uniqueidentifier NOT NULL, -- Référence au ClientMission
    PrestationId uniqueidentifier NOT NULL, -- Référence au Prestation
    DateAffectation Date,
    FOREIGN KEY (ClientMissionId) REFERENCES ClientMission(ClientMissionId),
    FOREIGN KEY (PrestationId) REFERENCES Prestation(PrestationId)
);

create proc ps_get_client_mission_prestations
    @ClientId uniqueidentifier
AS
BEGIN
    select cmp.ClientMissionPrestationId,cmp.ClientMissionId,cmp.PrestationId,cmp.DateAffectation,cm.ClientMissionId,cm.ClientId,m.MissionId,m.Designation AS Mission,p.PrestationId,p.Designation AS Prestation
    from ClientMissionPrestation cmp
    left join ClientMission cm on cm.ClientMissionId=cmp.ClientMissionId
    left join Mission m on cm.MissionId=m.MissionId
    left join Prestation p on p.PrestationId=cmp.PrestationId
    where cm.ClientId=@ClientId
END
GO

create proc ps_create_client_mission_prestation
    @ClientMissionPrestationId uniqueidentifier,
    @ClientMissionId uniqueidentifier,
    @PrestationId uniqueidentifier
AS
    insert into ClientMissionPrestation(ClientMissionPrestationId,ClientMissionId,PrestationId,DateAffectation)
    values(@ClientMissionPrestationId,@ClientMissionId,@PrestationId,CURRENT_TIMESTAMP)
GO






CREATE TABLE ClientTache(
    ClientTacheId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier,
    ClientMissionPrestationId uniqueidentifier NULL, --Référence au ClientMissionPrestation
    ClientMissionId uniqueidentifier NOT NULL, --Référence au ClientMission
    TacheId uniqueidentifier NOT NULL, --Référence au Tache
    DateAffectation Date,
    Intitule NVARCHAR(255),
    Numero_Ordre NVARCHAR(255),
    Commentaire NVARCHAR(255),
    Deadline Float,
    DateButoir Date,
    Date_Execution Date,
    Status NVARCHAR(255),
    AgentResposable uniqueidentifier NULL, 
    color VARCHAR(7) DEFAULT '#7366fe' NULL,  
    isDone BIT DEFAULT 0 , 
    isReminder BIT DEFAULT 0, 
    start_date DATETIME NULL, 
    end_date DATETIME NULL, 
	FOREIGN KEY (AgentResposable) REFERENCES Agent(AgentId),
	FOREIGN KEY (ClientId) REFERENCES Client(ClientId),
    FOREIGN KEY (ClientMissionId) REFERENCES ClientMission(ClientMissionId),
    FOREIGN KEY (TacheId) REFERENCES Tache(TacheId)
);







CREATE TABLE Evenements (
    EventId INT IDENTITY(1,1) PRIMARY KEY,
    TacheId UNIQUEIDENTIFIER NOT NULL,
    EventName VARCHAR(50) NULL, 
    EventTimeStart DATETIME NULL, 
	EventTimeEnd DATETIME NULL, 
    EventDescription VARCHAR(250) NULL, 
    color VARCHAR(10) DEFAULT '#7366fe',  
    isDone BIT DEFAULT 0, 
    isReminder BIT DEFAULT 0,
    NumberEvent INT NULL, 
    CONSTRAINT FK_Evenements_ClientTache FOREIGN KEY (TacheId) REFERENCES ClientTache(ClientTacheId) ON DELETE CASCADE
);





CREATE TABLE GoogleCalendar (
    ClientIdOfCloack UNIQUEIDENTIFIER PRIMARY KEY,
    EmailKeyCloack VARCHAR(255) NULL,
	AccessTokenGoogle VARCHAR(255) NULL, 
    ClientIdOfGoogle VARCHAR(255) NULL, 
);






CREATE PROCEDURE ps_get_client_taches
    @ClientId uniqueidentifier
AS
BEGIN
    SELECT 
        ct.ClientTacheId,
        ct.ClientMissionPrestationId,
        ct.ClientMissionId,
        ct.TacheId,
        cm.ClientMissionId,
        cm.ClientId,
        t.TacheId,
        t.Intitule,
        cmp.PrestationId,
        p.Designation AS PrestationDesignation,
        p.Description AS PrestationDescription,
        t.Intitule AS TacheIntitule,
        t.Description AS TacheDescription,
        ct.Intitule AS ClientTacheIntitule,
        ct.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable, 
        ct.start_date AS Start_Date,
        ct.end_date AS End_Date, 
        ct.isDone AS IsDone , 
        ct.isReminder  AS IsReminder, 
        ct.color AS Color
    FROM 
        ClientTache ct
    LEFT JOIN 
        ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
    LEFT JOIN 
        ClientMission cm ON ct.ClientMissionId = cm.ClientMissionId
    LEFT JOIN 
        Tache t ON ct.TacheId = t.TacheId
    LEFT JOIN 
        Prestation p ON t.PrestationId = p.PrestationId
    WHERE 
        cm.ClientId = @ClientId
END
GO







CREATE PROCEDURE ps_create_client_tache
    @ClientId uniqueidentifier,
    @AgentResposable uniqueidentifier,
    @ClientMissionPrestationId uniqueidentifier,
    @ClientMissionId uniqueidentifier,
    @TacheId uniqueidentifier, 
    @Intitule VARCHAR(200), 
    @Commentaire VARCHAR(200), 
    @start_date DATETIME,       
    @end_date DATETIME,          
    @color VARCHAR(7),         
    @isDone BIT,                
    @isReminder BIT                
AS
BEGIN
    -- Check if ClientId exists before inserting
    IF NOT EXISTS (SELECT 1 FROM Client WHERE ClientId = @ClientId)
    BEGIN
        RAISERROR('Client does not exist', 16, 1);
        RETURN;
    END

    -- Check if ClientMissionPrestationId exists
    IF NOT EXISTS (SELECT 1 FROM ClientMissionPrestation WHERE ClientMissionPrestationId = @ClientMissionPrestationId)
    BEGIN
        RAISERROR('ClientMissionPrestationId does not exist', 16, 1);
        RETURN;
    END

    -- Check if ClientMissionId exists
    IF NOT EXISTS (SELECT 1 FROM ClientMission WHERE ClientMissionId = @ClientMissionId)
    BEGIN
        RAISERROR('ClientMissionId does not exist', 16, 1);
        RETURN;
    END

    -- Insert task for the existing ClientId, ClientMissionPrestationId, and ClientMissionId
    INSERT INTO ClientTache (
        ClientTacheId, ClientId, AgentResposable, 
        ClientMissionPrestationId, ClientMissionId, TacheId, 
        Intitule, Commentaire, start_date, end_date, color, isDone, isReminder
    ) VALUES (
        NEWID(), @ClientId, @AgentResposable, 
        @ClientMissionPrestationId, @ClientMissionId, @TacheId, 
        @Intitule, @Commentaire, @start_date, @end_date, @color, @isDone, @isReminder
    );
END
GO












-------------------------------------------------17/07/2024-------------------------------------------------------------

--region service
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('a04cbdcc-7a95-4548-acbc-7e43b4f7ff9c','0e06e5a4-6246-415d-b119-c47077180755','Immobilier','Description Immobilier',CURRENT_TIMESTAMP)
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('35073c25-0a5c-46e7-abb1-7ec29ab50bef','0e06e5a4-6246-415d-b119-c47077180755','Actes notaires','Description Actes notaires',CURRENT_TIMESTAMP)
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('57039ef7-1bde-40bf-8477-6e74e37164c7','0e06e5a4-6246-415d-b119-c47077180755','Retraite','Description Retraite',CURRENT_TIMESTAMP)
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('66eb9acf-02e0-44e8-bfe3-5686873e8761','0e06e5a4-6246-415d-b119-c47077180755','Accompagnement','Description Accompagnement',CURRENT_TIMESTAMP)



create proc ps_get_services
    @CabinetId uniqueidentifier
AS
BEGIN
    select * from service where CabinetId=@CabinetId 
END
GO



-- endregion

--region mission
--Immobilier
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('7accb6b2-2d62-45cd-98e2-aa3cfa593cb0','a04cbdcc-7a95-4548-acbc-7e43b4f7ff9c','Vente','Description Mission vente du service Immobilier',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('4b8b0686-a27d-4549-bb2d-24d7cec1d1d1','a04cbdcc-7a95-4548-acbc-7e43b4f7ff9c','Achat','Description Mission Achat du service Immobilier',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('5008a193-28f5-45a5-86e2-9720cac45a26','a04cbdcc-7a95-4548-acbc-7e43b4f7ff9c','Suivi vente','Description Mission Suivi vente du service Immobilier',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('ea61c0c5-a08d-43ce-9288-c3bb66dbc5e1','a04cbdcc-7a95-4548-acbc-7e43b4f7ff9c','Transfert de fond','Description Mission Transfert de fond du service Immobilier',CURRENT_TIMESTAMP)

--Actes notaires
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('6d219069-6bc7-4de0-a495-2b862ec24e64','35073c25-0a5c-46e7-abb1-7ec29ab50bef','Donation','Description Mission Donation du service Actes notaires',CURRENT_TIMESTAMP)

--Accompagnement
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('a83dcad0-3a14-4523-a5c5-30e1baa232d0','66eb9acf-02e0-44e8-bfe3-5686873e8761','Installation au Maroc','Description Mission Installation au Maroc du service Accompagnement',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('5386769a-389f-4c5f-8db3-10dcf4ee65db','66eb9acf-02e0-44e8-bfe3-5686873e8761','Installation en France','Description Mission Installation en France du service Accompagnement',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('a0c83d3f-be74-4e05-9131-67f5b3365159','66eb9acf-02e0-44e8-bfe3-5686873e8761','Demande de casier judiciaire','Description Mission Demande de casier judiciaire du service Accompagnement',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('c7dedd97-2cf5-4f3a-8f7d-f2817e111cda','66eb9acf-02e0-44e8-bfe3-5686873e8761','Demande de carte de sejour','Description Mission Demande de carte de sejour du service Accompagnement',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('f6d9aeac-11df-409f-837b-2583ebfa3604','66eb9acf-02e0-44e8-bfe3-5686873e8761','Renouvellement de carte de sejour','Description Mission Renouvellement de carte de sejour du service Accompagnement',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('6760a1ba-baf0-4ab8-9556-fee94cba7b50','66eb9acf-02e0-44e8-bfe3-5686873e8761','Demande de passport','Description Mission Demande de passport du service Accompagnement',CURRENT_TIMESTAMP)
insert into Mission(MissionId,ServiceId,Designation,Description,CreatedAt)values('2dae88c3-13ed-4f01-ae30-4cc3939b99b7','66eb9acf-02e0-44e8-bfe3-5686873e8761','Inscription consulaire','Description Mission Inscription consulaire du service Accompagnement',CURRENT_TIMESTAMP)


create proc ps_get_missions
    @ServiceId uniqueidentifier
AS
BEGIN
    select * from mission where ServiceId=@ServiceId 
END
GO

-- create proc ps_get_client_missions
--     @ClientId uniqueidentifier
-- AS
-- BEGIN
--     select cm.ClientMissionId,cm.ClientId,cm.MissionId,cm.DateAffectation,m.Designation,m.Description
--     from ClientMission cm
--     left join Mission m on m.MissionId=cm.MissionId
--     where cm.ClientId=@ClientId
-- END
-- GO

-- create proc ps_get_client_mission
--     @ClientMissionId uniqueidentifier
-- AS
-- BEGIN
--     select cm.ClientMissionId,cm.ClientId,cm.MissionId,cm.DateAffectation,m.Designation,m.Description
--     from ClientMission cm
--     left join Mission m on m.MissionId=cm.MissionId
--     where cm.ClientMissionId=@ClientMissionId
-- END
-- GO

-- create proc ps_create_client_mission
--     @ClientMissionId uniqueidentifier,
--     @ClientId uniqueidentifier,
--     @MissionId uniqueidentifier,
--     @DateAffectation Date
-- AS
--     insert into ClientMission(ClientMissionId,ClientId,MissionId,DateAffectation)
--     values(@ClientMissionId,@ClientId,@MissionId,@DateAffectation)
-- GO

-- create proc ps_delete_client_mission
--     @ClientMissionId uniqueidentifier
-- AS
--     delete from ClientMission where ClientMissionId=@ClientMissionId
-- GO
-- endregion


--region Prestation
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Demande de carte de sejour','Description Prestation Demande de carte de sejour de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('264cc4ad-adec-4d05-b587-513c06e4334c','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Installation fiscale','Description Prestation Installation fiscale de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('55017a79-a7a2-493b-853b-97c33df4d139','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Adhesion Sante/Base','Description Prestation Adhesion Sante/Base de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('56cf909b-f069-4da0-8914-e79b92de66ef','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Adhesion Sante/Capitone','Description Prestation Adhesion Sante/Capitone de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('885c557b-f392-4015-9b88-7b1d64fcd0f9','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Courrier CSG/CRDS','Description Prestation Courrier CSG/CRDS de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('87dbe557-1857-4f3b-b03a-4195e4cb4a47','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Inscription consulaire','Description Prestation Inscription consulaire de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('0267659d-2e08-4c44-bc55-737ecbeebffb','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Changement de permis','Description Prestation Changement de permis de la mission Installation au Maroc',CURRENT_TIMESTAMP)
insert into Prestation(PrestationId,MissionId,Designation,Description,CreatedAt)values('18f35c10-f3be-46c1-bb83-f74e2d15a3a3','a83dcad0-3a14-4523-a5c5-30e1baa232d0','Etude fiscale','Description Prestation Etude fiscale de la mission Installation au Maroc',CURRENT_TIMESTAMP)

create proc ps_get_prestations
    @MissionId uniqueidentifier
AS
BEGIN
    select * from prestation where MissionId=@MissionId 
END
GO

ALTER proc ps_get_prestations
    @MissionId uniqueidentifier
AS
BEGIN
    select * from prestation where MissionId=@MissionId ORDER BY Numero_Ordre
END
GO

-- create proc ps_get_client_prestations
--     @ClientId uniqueidentifier
-- AS
-- BEGIN
--     select cp.ClientPrestationId,cp.ClientId,cp.PrestationId,cp.DateAffectation,p.Designation,p.Description
--     from ClientPrestation cp
--     left join Prestation p on p.PrestationId=cp.PrestationId
--     where cp.ClientId=@ClientId
-- END
-- GO

-- create proc ps_get_client_prestation
--     @ClientPrestationId uniqueidentifier
-- AS
-- BEGIN
--     select cp.ClientPrestationId,cp.ClientId,cp.PrestationId,cp.DateAffectation,p.Designation,p.Description
--     from ClientPrestation cp
--     left join Prestation p on p.PrestationId=cp.PrestationId
--     where cp.ClientPrestationId=@ClientPrestationId
-- END
-- GO

-- create proc ps_create_client_prestation
--     @ClientPrestationId uniqueidentifier,
--     @ClientId uniqueidentifier,
--     @PrestationId uniqueidentifier,
--     @DateAffectation Date
-- AS
--     insert into ClientPrestation(ClientPrestationId,ClientId,PrestationId,DateAffectation)
--     values(@ClientPrestationId,@ClientId,@PrestationId,@DateAffectation)
-- GO

-- create proc ps_delete_client_prestation
--     @ClientPrestationId uniqueidentifier
-- AS
--     delete from ClientPrestation where ClientPrestationId=@ClientPrestationId
-- GO
--endregion

----------------------------------------------------------------------------------------------------------------------------------------


INSERT INTO TacheDateReference VALUES('dbfd7f80-84ee-427c-b562-f0389bedf58e','Date saisie du dossier','Description Date saisie du dossier')
INSERT INTO TacheDateReference VALUES('5ab42009-d2fc-4820-a994-acd63e35c65d','Date expiration du passeport','Description Date expiration du passeport')
INSERT INTO TacheDateReference VALUES('4caee22c-01b3-4dbf-869d-325ac584e2d0','Date exécution de la tache ','Description Date exécution de la tache ')
INSERT INTO TacheDateReference VALUES('af992d8a-b9b3-4d39-b029-b25535757ccf','Date Date entrée du client au Maroc','Description Date entrée du client au Maroc')

INSERT INTO TypePersonneANotifier VALUES('e89b372a-81d3-4a6e-a5ec-73094097b905','User','Description User')
INSERT INTO TypePersonneANotifier VALUES('0980e872-2118-4aa9-8bb0-97f482170043','Agent','Description Agent')
INSERT INTO TypePersonneANotifier VALUES('91bb038e-481d-4011-9c28-8197ab27848d','Client','Description Client')



INSERT INTO Tache(TacheId,PrestationId,TypePersonneANotifierId,Intitule,Description,Numero_Ordre,Deadline,NombreRapelle,Priorite,Honoraire) VALUES('9e9f7999-0415-4c94-b534-a66b41a8ee52','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','0980e872-2118-4aa9-8bb0-97f482170043','Preparer la liste des pieces  du dossier de la carte de sejour','Descritption T1','T1',30,3,'Normale',500)
INSERT INTO Tache(TacheId,PrestationId,TypePersonneANotifierId,Intitule,Description,Numero_Ordre,NombreRapelle,Priorite,Honoraire) VALUES('61515c1b-72a0-4b52-a070-61f51bcd77d3','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','0980e872-2118-4aa9-8bb0-97f482170043','Remettre la liste des pieces  du dossier carte sejour','Descritption T2','T2',1,'Normale',1000)
INSERT INTO Tache(TacheId,PrestationId,TypePersonneANotifierId,Intitule,Description,Numero_Ordre,NombreRapelle,Priorite,Honoraire) VALUES('c334aa2f-b5c5-4336-8107-3558b3bbf05b','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','0980e872-2118-4aa9-8bb0-97f482170043','Réceptionner les pieces du dépot de  la carte de sejour','Descritption T3','T3',5,'Normale',500)
INSERT INTO Tache(TacheId,PrestationId,TypePersonneANotifierId,Intitule,Description,Numero_Ordre,Priorite,Honoraire) VALUES('d0f11a57-b6c7-42e5-bfb6-3480db37c4ce','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','0980e872-2118-4aa9-8bb0-97f482170043','Valider le dossier de la carte de sejour','Descritption T4','T4','Normale',450)
INSERT INTO Tache(TacheId,PrestationId,TypePersonneANotifierId,TacheDateReferenceId,Intitule,Description,Numero_Ordre,Deadline,Priorite,Honoraire) VALUES('0bb09679-196f-462a-82ed-443e51f6359e','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','91bb038e-481d-4011-9c28-8197ab27848d','af992d8a-b9b3-4d39-b029-b25535757ccf','Déposer le dossier de la carte séjour/prefecture','Descritption T5','T5',90,'Normale',650)
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('0eedb1a5-e8fb-4fe2-acf9-3c908607f7d2','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','Obtenir le Reçu du dépôt de la carte séjour','Descritption T6','T6','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('b87c3e9f-b068-4a20-b7ce-276a112d61c5','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','Récupérer le recepissé avec photo','Descritption T7','T7','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('157ae08e-3b19-4ca1-8017-d76f75e6e59d','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','Obtenir la carte de sejour','Descritption T8','T8','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('5baef1bb-f789-4040-aab0-e2e5977635ab','bf13a09d-4ebd-4250-9909-3fd4db9bd8f4','Scanner et enregistrer  la carte de sejour dans le CRM ','Descritption T9','T9','Normale')



INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('23e907c9-ffd6-4ec7-9dc3-2cbd0c64ff53','264cc4ad-adec-4d05-b587-513c06e4334c','Obtenir copie de bail / acte de propriétée','Descritption T11','T11','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('65f310d8-2593-427a-87cf-fd27f55f109c','264cc4ad-adec-4d05-b587-513c06e4334c','Remplir le formulaire de la demande IDF','Descritption T12','T12','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('6e4f1cef-278a-49d0-91ed-fbe119888f6c','264cc4ad-adec-4d05-b587-513c06e4334c','Dépôt de demande IDF','Descritption T13','T13','Normale')


INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('67e78008-7709-4a89-9ad8-9afa5fe05af4','55017a79-a7a2-493b-853b-97c33df4d139','Ouverture du dossier N°7 Santé avec formulaire interne/ couverture','Descritption T20','T20','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('2988b9e3-6a71-4694-bd61-8823cc247781','55017a79-a7a2-493b-853b-97c33df4d139','Préparer les piéces pour la demande du formulaire SE 350-07','Descritption T21','T21','Normale')
INSERT INTO Tache(TacheId,PrestationId,Intitule,Description,Numero_Ordre,Priorite) VALUES('c19d48f1-b559-4fa2-b83b-e9660d55dd2f','55017a79-a7a2-493b-853b-97c33df4d139','Fixer un rdv avec le client pour déposer la demande du formulaire SE 350-07 à la CNSS','Descritption T22','T22','Normale')




UPDATE Tache SET Depend_de='61515c1b-72a0-4b52-a070-61f51bcd77d3' where TacheId='c334aa2f-b5c5-4336-8107-3558b3bbf05b' --T3
UPDATE Tache SET Depend_de='c334aa2f-b5c5-4336-8107-3558b3bbf05b' where TacheId='d0f11a57-b6c7-42e5-bfb6-3480db37c4ce' --T4
UPDATE Tache SET Depend_de='d0f11a57-b6c7-42e5-bfb6-3480db37c4ce' where TacheId='0bb09679-196f-462a-82ed-443e51f6359e' --T5
UPDATE Tache SET Depend_de='0bb09679-196f-462a-82ed-443e51f6359e' where TacheId='0eedb1a5-e8fb-4fe2-acf9-3c908607f7d2' --T6
UPDATE Tache SET Depend_de='0eedb1a5-e8fb-4fe2-acf9-3c908607f7d2' where TacheId='b87c3e9f-b068-4a20-b7ce-276a112d61c5' --T7
UPDATE Tache SET Depend_de='b87c3e9f-b068-4a20-b7ce-276a112d61c5' where TacheId='157ae08e-3b19-4ca1-8017-d76f75e6e59d' --T8
UPDATE Tache SET Depend_de='157ae08e-3b19-4ca1-8017-d76f75e6e59d' where TacheId='5baef1bb-f789-4040-aab0-e2e5977635ab' --T9
UPDATE Tache SET Depend_de='23e907c9-ffd6-4ec7-9dc3-2cbd0c64ff53' where TacheId='65f310d8-2593-427a-87cf-fd27f55f109c' --T12
UPDATE Tache SET Depend_de='65f310d8-2593-427a-87cf-fd27f55f109c' where TacheId='6e4f1cef-278a-49d0-91ed-fbe119888f6c' --T13
UPDATE Tache SET Depend_de='67e78008-7709-4a89-9ad8-9afa5fe05af4' where TacheId='2988b9e3-6a71-4694-bd61-8823cc247781' --T21
UPDATE Tache SET Depend_de='2988b9e3-6a71-4694-bd61-8823cc247781' where TacheId='c19d48f1-b559-4fa2-b83b-e9660d55dd2f' --T22



create proc ps_get_taches
AS
BEGIN
    SELECT 
    t.TacheId,
    t.PrestationId,
    p.Designation AS PrestationDesignation,
    p.MissionId,
    m.Designation AS MissionDesignation,
    t.TacheDateReferenceId,
    t.TypePersonneANotifierId,
    t.Depend_de,
    t.AgentId,
    t.Intitule,
    t.Description,
    t.Numero_Ordre,
    t.Deadline,
    t.NombreRapelle,
    t.Priorite,
    t.Honoraire
FROM 
    Tache t
LEFT JOIN 
    Prestation p ON t.PrestationId = p.PrestationId
LEFT JOIN 
    Mission m ON p.MissionId = m.MissionId;
 
END
GO

ALTER proc ps_get_taches
AS
BEGIN
    SELECT 
    t.TacheId,
    t.PrestationId,
    p.Designation AS PrestationDesignation,
    p.MissionId,
    m.Designation AS MissionDesignation,
    t.TacheDateReferenceId,
    t.TypePersonneANotifierId,
    t.Depend_de,
    t.AgentId,
    t.Intitule,
    t.Description,
    t.Numero_Ordre,
    t.Deadline,
    t.NombreRapelle,
    t.Priorite,
    t.Honoraire
FROM 
    Tache t
LEFT JOIN 
    Prestation p ON t.PrestationId = p.PrestationId
LEFT JOIN 
    Mission m ON p.MissionId = m.MissionId
ORDER BY 
        CAST(SUBSTRING(t.Numero_Ordre, 2, LEN(t.Numero_Ordre) - 1) AS INT);
 
END
GO






















CREATE TRIGGER trg_CreateEventsForTask
ON ClientTache
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TacheId UNIQUEIDENTIFIER, @StartDate DATETIME2, @EndDate DATETIME2, @IntituleTask NVARCHAR(MAX), @DiffHours INT;
    DECLARE @RandomColor VARCHAR(7), @EventStart DATETIME2, @EventEnd DATETIME2, @EventDate DATE;
    DECLARE @NumberEvent INT, @EventCounter INT, @EventOffset INT;
    
    -- Table des couleurs aléatoires
    DECLARE @Colors TABLE (Color VARCHAR(7));
     INSERT INTO @Colors (Color) VALUES 
        ('#6366f1'), 
        ('#eab308'), 
        ('#3b82f6'), 
        ('#ec4899'), 
        ('#ea2e08'), 
        ('#b007b0'), 
        ('#07128f'),
        ('#f59e0b'), 
        ('#f97316'), 
        ('#ef4444'), 
        ('#6b21a8'), 
        ('#8b5cf6'), 
        ('#d946ef'), 
        ('#f43f5e'), 
        ('#ea580c'), 
        ('#9333ea'), 
        ('#fb923c'), 
        ('#6366f1'), 
        ('#1d4ed8'), 
        ('#d4d4d8');

    -- Curseur pour parcourir les tâches insérées
    DECLARE task_cursor CURSOR FOR 
    SELECT ClientTacheId, CAST(start_date AS DATETIME2), CAST(end_date AS DATETIME2), Intitule 
    FROM Inserted;

    OPEN task_cursor;
    FETCH NEXT FROM task_cursor INTO @TacheId, @StartDate, @EndDate, @IntituleTask;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Générer une couleur aléatoire
        SELECT TOP 1 @RandomColor = Color FROM @Colors ORDER BY NEWID();

        -- Calculer la durée en heures
        SET @DiffHours = DATEDIFF(HOUR, @StartDate, @EndDate);

        -- Déterminer combien d'événements créer
        IF @DiffHours BETWEEN 0 AND 120
            SET @NumberEvent = 1;
        IF @DiffHours BETWEEN 121 AND 6665
            SET @NumberEvent = 2;
        ELSE IF @DiffHours BETWEEN 6666 AND 200000
            SET @NumberEvent = 3;
        ELSE
            SET @NumberEvent = 1; -- Sécurité pour éviter les erreurs

        -- Initialiser les événements
        SET @EventCounter = 1;

        WHILE @EventCounter <= @NumberEvent
        BEGIN
            -- Déterminer le bon placement de l'événement selon la règle demandée
            IF @EventCounter = 1
                SET @EventOffset = @DiffHours / 2;
            ELSE IF @EventCounter = 2
                SET @EventOffset = @DiffHours - (CAST(@DiffHours AS FLOAT) / 3.2);
            ELSE IF @EventCounter = 3
                SET @EventOffset = @DiffHours - (@DiffHours / 8);
            ELSE
                SET @EventOffset = @DiffHours - (@DiffHours / 10);

            -- Calculer uniquement la **date** de l'événement
            SET @EventDate = CAST(DATEADD(HOUR, @EventOffset, @StartDate) AS DATE);

            -- Fixer toujours l'heure à **08:45**
            SET @EventStart = DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', '08:00:00'), CAST(@EventDate AS DATETIME2));
            SET @EventEnd = DATEADD(HOUR, 9, @EventStart); -- L'événement dure 1 heure

            -- Insérer l'événement
            INSERT INTO Evenements (TacheId, EventName, EventTimeStart, EventTimeEnd, EventDescription, Color, NumberEvent)
            VALUES 
            (@TacheId, @IntituleTask, @EventStart, @EventEnd, CONCAT('Event ', @EventCounter), @RandomColor, @NumberEvent);

            -- Passer à l'événement suivant
            SET @EventCounter = @EventCounter + 1;
        END;

        -- Passer à la tâche suivante
        FETCH NEXT FROM task_cursor INTO @TacheId, @StartDate, @EndDate, @IntituleTask;
    END;

    CLOSE task_cursor;
    DEALLOCATE task_cursor;
END;
