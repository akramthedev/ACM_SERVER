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

);


CREATE TABLE ClientMission(
    ClientMissionId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au Client
    MissionId uniqueidentifier NOT NULL, -- Référence au Mission
    DateAffectation Date,
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId),
    FOREIGN KEY (MissionId) REFERENCES Mission(MissionId)

);

CREATE TABLE ClientMissionPrestation(
    ClientMissionPrestationId uniqueidentifier PRIMARY KEY,
    ClientMissionId uniqueidentifier NOT NULL, -- Référence au ClientMission
    PrestationId uniqueidentifier NOT NULL, -- Référence au Prestation
    DateAffectation Date,
    FOREIGN KEY (ClientMissionId) REFERENCES ClientMission(ClientMissionId),
    FOREIGN KEY (PrestationId) REFERENCES Prestation(PrestationId)
);

CREATE TABLE ClientTache(
    CLientTacheId uniqueidentifier PRIMARY KEY,
    ClientMissionPrestationId uniqueidentifier NOT NULL, --Référence au ClientMissionPrestation
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
    AgentResposable NVARCHAR(255)
    FOREIGN KEY (ClientMissionPrestationId) REFERENCES ClientMissionPrestation(ClientMissionPrestationId),
    FOREIGN KEY (ClientMissionId) REFERENCES ClientMission(ClientMissionId),
    FOREIGN KEY (TacheId) REFERENCES Tache(TacheId)
);


----------------------------------------------------------17/07/2024-------------------------------------------------------------

--region service
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('a04cbdcc-7a95-4548-acbc-7e43b4f7ff9c','0e06e5a4-6246-415d-b119-c47077180755','Immobilier','Description Immobilier',CURRENT_TIMESTAMP)
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('35073c25-0a5c-46e7-abb1-7ec29ab50bef','0e06e5a4-6246-415d-b119-c47077180755','Actes notaires','Description Actes notaires',CURRENT_TIMESTAMP)
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('57039ef7-1bde-40bf-8477-6e74e37164c7','0e06e5a4-6246-415d-b119-c47077180755','Retraite','Description Retraite',CURRENT_TIMESTAMP)
insert into Service(ServiceId,CabinetId,Designation,Description,CreatedAt)values('66eb9acf-02e0-44e8-bfe3-5686873e8761','0e06e5a4-6246-415d-b119-c47077180755','Accompagnement','Description Accompagnement',CURRENT_TIMESTAMP)







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



--endregion

----------------------------------------------------------------------------------------------------------------------------------------




