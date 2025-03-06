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
    ExpiresIn VARCHAR(255) NULL
);


CREATE TABLE Facturation (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ClientId UNIQUEIDENTIFIER NOT NULL,
    NumeroFacture VARCHAR(25) NULL,
    total_price DECIMAL(10,2) DEFAULT 0.00,
    date_facturation DATETIME DEFAULT GETDATE(),
    status VARCHAR(10) DEFAULT 'Pending',
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId) ON DELETE CASCADE
);


CREATE TABLE FacturationItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    facturation_id INT NOT NULL,
    ClientTacheId UNIQUEIDENTIFIER NOT NULL,
    NomTache VARCHAR(222) NULL,
    PrestationId UNIQUEIDENTIFIER NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (facturation_id) REFERENCES Facturation(id) ON DELETE CASCADE,
    FOREIGN KEY (ClientTacheId) REFERENCES ClientTache(ClientTacheId) ON DELETE CASCADE,
);


ALTER TABLE Conjoint
ADD DateArriveMaroc DATE;


ALTER TABLE Client
ADD DateArriveMaroc DATE NULL;


ALTER PROCEDURE ps_create_client
    @ClientId uniqueidentifier
    ,@CabinetId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
    ,@DateArriveMaroc Date
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
    insert into Client(ClientId,CabinetId,Nom,Prenom,DateNaissance,Profession,DateRetraite, DateArriveMaroc,NumeroSS,Adresse,Email1,Email2,Telephone1,Telephone2,HasConjoint,SituationFamiliale,ParticulariteFiscale,CFE,Cotisation,Reversion,CNSS,CNAREFE,CAPITONE,AssuranceRapatriement,MutuelleFrancaise,PASSEPORT,CarteSejour,PermisConduire,AssuranceAuto,AssuranceHabitation,InscriptionConsulat,CPAM,CSG_CRDS,CreatedAt)
    values(@ClientId,@CabinetId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite, @DateArriveMaroc,@NumeroSS,@Adresse,@Email1,@Email2,@Telephone1,@Telephone2,@HasConjoint,@SituationFamiliale,@ParticulariteFiscale,@CFE,@Cotisation,@Reversion,@CNSS,@CNAREFE,@CAPITONE,@AssuranceRapatriement,@MutuelleFrancaise,@PASSEPORT,@CarteSejour,@PermisConduire,@AssuranceAuto,@AssuranceHabitation,@InscriptionConsulat,@CPAM,@CSG_CRDS,CURRENT_TIMESTAMP);
Go


ALTER PROCEDURE ps_update_client
    @ClientId uniqueidentifier
    ,@Nom nvarchar(255)
    ,@Prenom nvarchar(255)
    ,@DateNaissance Date
    ,@Profession NVarChar(255)
    ,@DateRetraite Date
    ,@DateArriveMaroc Date, 
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
        CSG_CRDS = @CSG_CRDS,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE ClientId = @ClientId;
GO


ALTER PROCEDURE ps_create_conjoint
    @ConjointId uniqueidentifier,
    @ClientId uniqueidentifier,
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @DateNaissance DATE,
    @Profession NVARCHAR(100),
    @DateRetraite DATE,
    @DateArriveMaroc DATE,
    @NumeroSS NVARCHAR(20),
    @DateMariage DATE,
    @Adresse NVARCHAR(255),
    @RegimeMatrimonial NVARCHAR(100),
    @DonationEpoux NVARCHAR(100),
    @ModifRegimeDate NVARCHAR(100),
    @QuestComp NVARCHAR(MAX)
AS
BEGIN
    insert into Conjoint(ConjointId,ClientId,Nom,Prenom,DateNaissance,Profession,DateRetraite,DateArriveMaroc,NumeroSS,DateMariage,Adresse,RegimeMatrimonial,DonationEpoux,ModifRegimeDate,QuestComp,CreatedAt)
    values(@ConjointId,@ClientId,@Nom,@Prenom,@DateNaissance,@Profession,@DateRetraite,@DateArriveMaroc,@NumeroSS,@DateMariage,@Adresse,@RegimeMatrimonial,@DonationEpoux,@ModifRegimeDate,@QuestComp,CURRENT_TIMESTAMP)
END
GO


ALTER PROCEDURE ps_update_conjoint
    @ConjointId uniqueidentifier,
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @DateNaissance DATE,
    @Profession NVARCHAR(100),
    @DateRetraite DATE,
    @DateArriveMaroc DATE,
    @NumeroSS NVARCHAR(20),
    @DateMariage DATE,
    @Adresse NVARCHAR(255),
    @RegimeMatrimonial NVARCHAR(100),
    @DonationEpoux NVARCHAR(100),
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
        DateArriveMaroc=@DateArriveMaroc,
        NumeroSS=@NumeroSS,
        DateMariage=@DateMariage,
        Adresse=@Adresse,
        RegimeMatrimonial=@RegimeMatrimonial,
        DonationEpoux=@DonationEpoux,
        ModifRegimeDate=@ModifRegimeDate,
        QuestComp=@QuestComp,
        UpdatedAt=CURRENT_TIMESTAMP
    where ConjointId=@ConjointId
END
GO


ALTER PROCEDURE ps_get_conjoint
    @ClientId uniqueidentifier
AS
BEGIN
    SELECT TOP 1 * 
    FROM Conjoint 
    WHERE ClientId = @ClientId
END
GO


ALTER TABLE ClientTache ADD 
    ClientId uniqueidentifier NULL, 
    color VARCHAR(7) DEFAULT '#7366fe' NULL,  
    isDone BIT DEFAULT 0, 
    isReminder BIT DEFAULT 0, 
    start_date DATETIME NULL, 
    end_date DATETIME NULL, 
    NombreRappel INT NULL;

ALTER TABLE ClientTache ALTER COLUMN AgentResposable uniqueidentifier NULL;

ALTER TABLE ClientTache ADD CONSTRAINT FK_ClientTache_Agent FOREIGN KEY (AgentResposable) REFERENCES Agent(AgentId);

ALTER TABLE ClientTache ADD CONSTRAINT FK_ClientTache_Client FOREIGN KEY (ClientId) REFERENCES Client(ClientId);


ALTER PROCEDURE ps_get_client_taches
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


ALTER PROCEDURE ps_create_client_tache
    @ClientId UNIQUEIDENTIFIER,
    @AgentResposable UNIQUEIDENTIFIER,
    @ClientMissionPrestationId UNIQUEIDENTIFIER,
    @ClientMissionId UNIQUEIDENTIFIER,
    @TacheId UNIQUEIDENTIFIER, 
    @Intitule VARCHAR(200), 
    @Commentaire VARCHAR(200), 
    @start_date DATETIME,       
    @end_date DATETIME,          
    @color VARCHAR(7),         
    @isDone BIT,                
    @isReminder BIT, 
    @NombreRappel INT                
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Client WHERE ClientId = @ClientId)
    BEGIN
        RAISERROR('Client does not exist', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM ClientMissionPrestation WHERE ClientMissionPrestationId = @ClientMissionPrestationId)
    BEGIN
        RAISERROR('ClientMissionPrestationId does not exist', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM ClientMission WHERE ClientMissionId = @ClientMissionId)
    BEGIN
        RAISERROR('ClientMissionId does not exist', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Agent WHERE AgentId = @AgentResposable)
    BEGIN
        RAISERROR('AgentResponsable does not exist', 16, 1);
        RETURN;
    END

    INSERT INTO ClientTache (
        ClientTacheId, ClientId, AgentResposable, 
        ClientMissionPrestationId, ClientMissionId, TacheId, 
        Intitule, Commentaire, start_date, end_date, color, isDone, isReminder, NombreRappel, Status
    ) 
    VALUES (
        NEWID(), @ClientId, @AgentResposable, 
        @ClientMissionPrestationId, @ClientMissionId, @TacheId, 
        @Intitule, @Commentaire, @start_date, @end_date, @color, @isDone, @isReminder, @NombreRappel, 'En cours'
    );

    RETURN 0;
END
GO


CREATE PROCEDURE ps_create_client_tache_But_From_SinglePageClient
    @ClientId UNIQUEIDENTIFIER,
    @AgentResposable UNIQUEIDENTIFIER,
    @TacheId UNIQUEIDENTIFIER, 
    @Intitule VARCHAR(200), 
    @color VARCHAR(7),             
    @ClientMissionId UNIQUEIDENTIFIER , 
    @ClientMissionPrestationId UNIQUEIDENTIFIER, 
    @start_date DATETIME,       
    @end_date DATETIME , 
    @NombreRappel INT
AS
BEGIN
      
    INSERT INTO ClientTache (
        ClientTacheId, ClientId, AgentResposable, TacheId, 
        Intitule, color, NombreRappel, Status , ClientMissionId, ClientMissionPrestationId, start_date, end_date
    ) 
    VALUES (
        NEWID(), @ClientId, @AgentResposable, @TacheId, 
        @Intitule,  @color, @NombreRappel, 'En cours', @ClientMissionId , @ClientMissionPrestationId, @start_date, @end_date
    );
    
    RETURN 0;
END
GO


CREATE TRIGGER trg_CreateEventsForTask
ON ClientTache
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TacheId UNIQUEIDENTIFIER, @StartDate DATETIME2, @EndDate DATETIME2, @IntituleTask NVARCHAR(MAX), @NombreRappel INT;
    DECLARE @RandomColor VARCHAR(7), @EventStart DATETIME2, @EventEnd DATETIME2, @EventDate DATETIME2;
    DECLARE @NumberEvent INT, @EventCounter INT, @IntervalDays INT, @PreviousEventDate DATETIME2;
    DECLARE @TotalDays INT, @MidDate DATETIME2, @AdjustedStartDate DATETIME2;

    DECLARE @Colors TABLE (Color VARCHAR(7));
    INSERT INTO @Colors (Color) VALUES 
        ('#6366f1'), ('#eab308'), ('#3b82f6'), ('#ec4899'), ('#ea2e08'), ('#b007b0'), ('#07128f'), ('#f59e0b'), 
        ('#f97316'), ('#ef4444'), ('#6b21a8'), ('#8b5cf6'), ('#d946ef'), ('#f43f5e'), ('#ea580c'), ('#9333ea'), 
        ('#fb923c'), ('#6366f1'), ('#1d4ed8'), ('#d4d4d8');

    DECLARE task_cursor CURSOR FOR 
    SELECT ClientTacheId, CAST(start_date AS DATETIME2), CAST(end_date AS DATETIME2), Intitule, NombreRappel 
    FROM Inserted;

    OPEN task_cursor; 
    FETCH NEXT FROM task_cursor INTO @TacheId, @StartDate, @EndDate, @IntituleTask, @NombreRappel;

    WHILE @@FETCH_STATUS = 0
    BEGIN


        IF @NombreRappel = 0
        BEGIN
            FETCH NEXT FROM task_cursor INTO @TacheId, @StartDate, @EndDate, @IntituleTask, @NombreRappel;
            CONTINUE;
        END;


        SELECT TOP 1 @RandomColor = Color FROM @Colors ORDER BY NEWID();

        SET @NumberEvent = ISNULL(@NombreRappel, 1);

        SET @TotalDays = DATEDIFF(DAY, @StartDate, @EndDate);
        IF @TotalDays = 0 SET @TotalDays = 1; 

        SET @MidDate = DATEADD(DAY, @TotalDays / 2, @StartDate);

        SET @AdjustedStartDate = DATEADD(DAY, CEILING(@TotalDays * 0.1), @StartDate);

        SET @PreviousEventDate = @AdjustedStartDate;
        SET @EventCounter = 1;

        WHILE @EventCounter <= @NumberEvent
        BEGIN
            IF @NumberEvent = 1
            BEGIN
                SET @EventDate = @MidDate;
            END
            ELSE IF @NumberEvent = 2
            BEGIN
                IF @EventCounter = 1 SET @EventDate = @MidDate;
                ELSE SET @EventDate = DATEADD(DAY, -1, @EndDate);
            END
            ELSE IF @NumberEvent = 3
            BEGIN
                IF @EventCounter = 1 SET @EventDate = DATEADD(DAY, @TotalDays / 6, @AdjustedStartDate);
                ELSE IF @EventCounter = 2 SET @EventDate = @MidDate;
                ELSE SET @EventDate = DATEADD(DAY, -1, @EndDate);
            END
            ELSE
            BEGIN
                SET @IntervalDays = @TotalDays / (@NumberEvent - 1);
                SET @EventDate = DATEADD(DAY, (@EventCounter - 1) * @IntervalDays, @AdjustedStartDate);

                IF @EventCounter = @NumberEvent SET @EventDate = DATEADD(DAY, -1, @EndDate);
            END

            IF @EventDate = @PreviousEventDate
                SET @EventDate = DATEADD(DAY, 1, @PreviousEventDate);

            IF @EventDate > @EndDate
                SET @EventDate = @EndDate;

            SET @EventStart = DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', '08:00:00'), CAST(@EventDate AS DATETIME2));
            SET @EventEnd = DATEADD(HOUR, 1, @EventStart); 

            INSERT INTO Evenements (TacheId, EventName, EventTimeStart, EventTimeEnd, EventDescription, Color, NumberEvent)
            VALUES 
            (@TacheId, @IntituleTask, @EventStart, @EventEnd, CONCAT('Event ', @EventCounter), @RandomColor, @NumberEvent);

            SET @PreviousEventDate = @EventDate;
            SET @EventCounter = @EventCounter + 1;
        END;

        FETCH NEXT FROM task_cursor INTO @TacheId, @StartDate, @EndDate, @IntituleTask, @NombreRappel;
    END;

    CLOSE task_cursor;
    DEALLOCATE task_cursor;
END;
GO


CREATE PROCEDURE ps_create_google_calendar_account
    @ClientIdOfCloack UNIQUEIDENTIFIER,
    @EmailKeyCloack VARCHAR(255),
    @AccessTokenGoogle VARCHAR(255),
    @ClientIdOfGoogle VARCHAR(255), 
    @ExpiresIn VARCHAR(255)
AS
BEGIN
    -- Check if a record with the given ClientIdOfCloack exists
    IF EXISTS (SELECT 1 FROM GoogleCalendar WHERE ClientIdOfCloack = @ClientIdOfCloack)
    BEGIN
        -- If record exists, update it
        UPDATE GoogleCalendar
        SET
            EmailKeyCloack = @EmailKeyCloack,
            AccessTokenGoogle = @AccessTokenGoogle,
            ClientIdOfGoogle = @ClientIdOfGoogle, 
            ExpiresIn = @ExpiresIn
        WHERE ClientIdOfCloack = @ClientIdOfCloack;
    END
    ELSE
    BEGIN
        -- If record does not exist, insert a new one
        INSERT INTO GoogleCalendar (ClientIdOfCloack, EmailKeyCloack, AccessTokenGoogle, ClientIdOfGoogle, ExpiresIn)
        VALUES (@ClientIdOfCloack, @EmailKeyCloack, @AccessTokenGoogle, @ClientIdOfGoogle, @ExpiresIn);
    END
END;
GO


CREATE PROCEDURE ps_update_clienttache_from_SinglePageCLient
    @ClientTacheId UNIQUEIDENTIFIER,
    @Intitule NVARCHAR(255),
    @Numero_Ordre NVARCHAR(255),
    @Status NVARCHAR(255),
    @AgentResposable NVARCHAR(255)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY

        UPDATE ClientTache
        SET 
            Intitule = @Intitule,
            Numero_Ordre = @Numero_Ordre,
            Status = @Status,
            AgentResposable = @AgentResposable
        WHERE ClientTacheId = @ClientTacheId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


CREATE PROCEDURE ps_update_ClientTache_Dates
    @ClientTacheId UNIQUEIDENTIFIER,
    @start_date DATETIME,
    @end_date DATETIME
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Vérifier que la date de début n'est pas après la date de fin
        IF @start_date > @end_date
        BEGIN
            THROW 50001, 'La date de début ne peut pas être après la date de fin.', 1;
        END

        -- Vérifier si le ClientTacheId existe avant la mise à jour
        IF EXISTS (SELECT 1 FROM ClientTache WHERE ClientTacheId = @ClientTacheId)
        BEGIN
            -- Mise à jour de la table ClientTache avec les nouvelles valeurs
            UPDATE ClientTache
            SET 
                end_date = @end_date,
                start_date = @start_date
            WHERE ClientTacheId = @ClientTacheId;
        END
        ELSE
        BEGIN
            THROW 50000, 'ClientTacheId introuvable.', 1;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


ALTER PROCEDURE ps_get_all_client_taches
AS
BEGIN

SELECT 
        ct.ClientTacheId AS ClientTacheId,
        cmp.ClientMissionPrestationId,
        cm.ClientMissionId,
        cm.ClientId,
        cl.Nom AS ClientNom,          
        cl.Prenom AS ClientPrenom,
        cl.DateNaissance AS ClientDateNaissance,
        cl.Photo AS ClientPhoto,
        cl.Profession AS ClientProfession,
        cl.DateRetraite AS ClientDateRetraite,
        cl.NumeroSS AS ClientNumeroSS,
        cl.Adresse AS ClientAdresse,
        cl.Email1 AS ClientEmail1,
        cl.Email2 AS ClientEmail2,
        cl.Telephone1 AS ClientTelephone1,
        cl.Telephone2 AS ClientTelephone2,
        cl.HasConjoint AS ClientHasConjoint,
        cl.SituationFamiliale AS ClientSituationFamiliale,
        m.Designation AS MissionDesignation,   
        t.TacheId,
        t.Intitule AS TacheIntitule,
        p.PrestationId,
        p.Designation AS PrestationDesignation,
        p.Description AS PrestationDescription,
        t.Description AS TacheDescription,
        ct.Intitule AS ClientTacheIntitule,
        ct.isDone AS IsDone ,
        ct.AgentResposable AS AgentResposable,
        t.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ag.Nom AS AgentNom,
        COUNT(CASE WHEN ev.EventTimeStart > CURRENT_TIMESTAMP THEN ev.EventId END) AS NombreEvenementsFutursParTache
    FROM 
        ClientTache ct
    LEFT JOIN
        Evenements ev ON ct.ClientTacheId = ev.TacheId 
    LEFT JOIN 
        ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
    LEFT JOIN 
        ClientMission cm ON cmp.ClientMissionId = cm.ClientMissionId
    LEFT JOIN 
        Mission m ON cm.MissionId = m.MissionId
    LEFT JOIN 
        Tache t ON ct.TacheId = t.TacheId
    LEFT JOIN 
        Prestation p ON t.PrestationId = p.PrestationId
    LEFT JOIN 
        Client cl ON cm.ClientId = cl.ClientId    
    LEFT JOIN 
        Agent ag ON ct.AgentResposable = ag.AgentId
GROUP BY
        ct.ClientTacheId,
        cmp.ClientMissionPrestationId,
        cm.ClientMissionId,
        cm.ClientId,
        cl.Nom,
        cl.Prenom,
        cl.DateNaissance,
        cl.Photo,
        cl.Profession,
        cl.DateRetraite,
        cl.NumeroSS,
        cl.Adresse,
        cl.Email1,
        cl.Email2,
        cl.Telephone1,
        cl.Telephone2,
        cl.HasConjoint,
        cl.SituationFamiliale,
        m.Designation,
        t.TacheId,
        t.Intitule,
        p.PrestationId,
        p.Designation,
        p.Description,
        t.Description,
        ct.Intitule,
        ct.isDone,
        ct.AgentResposable,
        t.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ag.Nom;
END
GO


ALTER PROCEDURE PROCEDURE ps_get_client_taches_simple  
    @ClientId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        ct.ClientTacheId,
        ct.ClientMissionPrestationId,
        ct.ClientMissionId,
        ct.TacheId,
        ct.Intitule,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable,
        p.Designation, 
        t.Intitule AS IntituleTaskOriginal, 
        t.Numero_Ordre AS Numero_Ordre, 
        p.Designation AS PrestationDesignation   
    FROM 
        ClientTache ct
    LEFT JOIN 
        Tache t ON t.TacheId = ct.TacheId
    LEFT JOIN 
        ClientMission cm ON ct.ClientMissionId = cm.ClientMissionId
    LEFT JOIN
        ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
    LEFT JOIN
        Prestation p ON cmp.PrestationId = p.PrestationId  
    WHERE 
        cm.ClientId = @ClientId
    ORDER BY 
        CAST(SUBSTRING(ct.Numero_Ordre, 2, LEN(ct.Numero_Ordre) - 1) AS INT);
END;
GO


ALTER PROCEDURE ps_create_client_tache
    @ClientId UNIQUEIDENTIFIER,
    @AgentResposable UNIQUEIDENTIFIER,
    @ClientMissionPrestationId UNIQUEIDENTIFIER,
    @ClientMissionId UNIQUEIDENTIFIER,
    @TacheId UNIQUEIDENTIFIER, 
    @Intitule VARCHAR(200), 
    @Commentaire VARCHAR(200), 
    @start_date DATETIME,       
    @end_date DATETIME,          
    @color VARCHAR(7),         
    @isDone BIT,                
    @isReminder BIT, 
    @NombreRappel INT                
AS
BEGIN
    -- Check if ClientId exists
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

    -- Check if AgentResponsable exists (Optional, if applicable)
    IF NOT EXISTS (SELECT 1 FROM Agent WHERE AgentId = @AgentResposable)
    BEGIN
        RAISERROR('AgentResponsable does not exist', 16, 1);
        RETURN;
    END

    -- Insert task
    INSERT INTO ClientTache (
        ClientTacheId, ClientId, AgentResposable, 
        ClientMissionPrestationId, ClientMissionId, TacheId, 
        Intitule, Commentaire, start_date, end_date, color, isDone, isReminder, NombreRappel, Status
    ) 
    VALUES (
        NEWID(), @ClientId, @AgentResposable, 
        @ClientMissionPrestationId, @ClientMissionId, @TacheId, 
        @Intitule, @Commentaire, @start_date, @end_date, @color, @isDone, @isReminder, @NombreRappel, 'En cours'
    );

    -- Return success
    RETURN 0;
END
GO