ALTER PROCEDURE ps_get_client_taches
    @ClientId uniqueidentifier
AS
BEGIN
    SELECT 
        ct.ClientTacheId,
        cmp.ClientMissionPrestationId,
        cm.ClientMissionId,
        cm.ClientId,
        t.TacheId,
        t.Intitule AS TacheIntitule,
        p.PrestationId,
        p.Designation AS PrestationDesignation,
        p.Description AS PrestationDescription,
        t.Description AS TacheDescription,
        ct.Intitule AS ClientTacheIntitule,
        t.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable
    FROM 
        ClientTache ct
    LEFT JOIN 
        ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
    LEFT JOIN 
        ClientMission cm ON cmp.ClientMissionId = cm.ClientMissionId
    LEFT JOIN 
        Tache t ON ct.TacheId = t.TacheId
    LEFT JOIN 
        Prestation p ON t.PrestationId = p.PrestationId
    WHERE 
        cm.ClientId = @ClientId
END
GO


----------------------------------------------------------------------------------------------
CREATE PROCEDURE ps_get_client_lettre_mission
    @ClientMissionId uniqueidentifier
AS
BEGIN
SELECT 
        cm.ClientMissionId,
        c.ClientId,
        c.Nom,
        c.Prenom,
        c.DateNaissance,
        c.Telephone1,
        c.Adresse,
        c.NumeroSS,
        cm.DateAffectation,
        m.MissionId,
        m.Designation AS MissionDesignation,
        m.Description AS MissionDescription,
        m.CreatedAt AS MissionCreatedAt,
        m.UpdatedAt AS MissionUpdatedAt,
        p.PrestationId,
        p.Designation AS PrestationDesignation,
        p.Description AS PrestationDescription,
        p.CreatedAt AS PrestationCreatedAt,
        p.UpdatedAt AS PrestationUpdatedAt,
        ct.ClientTacheId,
        t.TacheId,
        t.Intitule AS TacheIntitule,
        t.Description AS TacheDescription,
        t.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable
    FROM ClientMission cm
    LEFT JOIN Client c ON cm.ClientId = c.ClientId
    LEFT JOIN Mission m ON cm.MissionId = m.MissionId
    LEFT JOIN ClientMissionPrestation cmp ON cm.ClientMissionId = cmp.ClientMissionId
    LEFT JOIN Prestation p ON cmp.PrestationId = p.PrestationId
    LEFT JOIN ClientTache ct ON cmp.ClientMissionPrestationId = ct.ClientMissionPrestationId
    LEFT JOIN Tache t ON ct.TacheId = t.TacheId
    WHERE cm.ClientMissionId = @ClientMissionId 
END
GO

create proc ps_create_client_tache_custom
    @ClientTacheId UNIQUEIDENTIFIER,
    @Intitule NVARCHAR(255),
    @Numero_Ordre NVARCHAR(255),
    @Commentaire NVARCHAR(255),
    @Status NVARCHAR(255)
AS
    insert into ClientTache(ClientTacheId,Intitule,Numero_Ordre,Commentaire,Status)
    values(@ClientTacheId,@Intitule,@Numero_Ordre,@Commentaire,@Status)
GO























CREATE PROCEDURE ps_update_ClientTache
    @ClientTacheId UNIQUEIDENTIFIER,
    @ClientMissionPrestationId UNIQUEIDENTIFIER,
    @ClientMissionId UNIQUEIDENTIFIER,
    @TacheId UNIQUEIDENTIFIER,
    @Intitule NVARCHAR(255),
    @Numero_Ordre NVARCHAR(255),
    @Commentaire NVARCHAR(255),
    @Deadline FLOAT,
    @DateButoir DATE,
    @Date_Execution DATE,
    @Status NVARCHAR(255),
    @AgentResposable NVARCHAR(255)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Mise à jour de la table ClientTache avec les nouvelles valeurs
        UPDATE ClientTache
        SET 
            ClientMissionPrestationId = @ClientMissionPrestationId,
            ClientMissionId = @ClientMissionId,
            TacheId = @TacheId,
            Intitule = @Intitule,
            Numero_Ordre = @Numero_Ordre,
            Commentaire = @Commentaire,
            Deadline = @Deadline,
            DateButoir = @DateButoir,
            Date_Execution = @Date_Execution,
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






CREATE PROCEDURE ps_get_client_taches_simple
    @ClientId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        ct.ClientTacheId,
        ct.ClientMissionPrestationId,
        ct.ClientMissionId,
        ct.TacheId,
        ct.Intitule,
        ct.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable
    FROM 
        ClientTache ct
    LEFT JOIN 
        ClientMission cm ON ct.ClientMissionId = cm.ClientMissionId
    WHERE 
        cm.ClientId = @ClientId;
END;
GO

ALTER TABLE Prestation
ADD Numero_Ordre NVARCHAR(255)

ALTER PROCEDURE ps_get_client_taches_simple
    @ClientId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        ct.ClientTacheId,
        ct.ClientMissionPrestationId,
        ct.ClientMissionId,
        ct.TacheId,
        ct.Intitule,
        ct.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable
    FROM 
        ClientTache ct
    LEFT JOIN 
        ClientMission cm ON ct.ClientMissionId = cm.ClientMissionId
    WHERE 
        cm.ClientId = @ClientId
    ORDER BY 
        CAST(SUBSTRING(ct.Numero_Ordre, 2, LEN(ct.Numero_Ordre) - 1) AS INT);
END;
GO

CREATE TABLE Agent (
    AgentId uniqueidentifier PRIMARY KEY, 
    CabinetId uniqueidentifier NOT NULL, -- Référence au cabinet 
    Nom NVARCHAR(255),
    Email NVARCHAR(255),
    Telephone NVARCHAR(255),
    CreatedAt DateTime,
    UpdatedAt DateTime,
    FOREIGN KEY (CabinetId) REFERENCES Cabinet(CabinetId)

);

 ALTER TABLE Tache
ADD FOREIGN KEY (AgentId) REFERENCES Agent(AgentId);

ALTER TABLE ClientTache
ALTER COLUMN AgentResposable uniqueidentifier;

 ALTER TABLE ClientTache
ADD FOREIGN KEY (AgentResposable) REFERENCES Agent(AgentId);


ALTER TABLE ClientTache
ADD AgentAnotifierId uniqueidentifier;


UPDATE Tache
SET AgentId = '3d9d1ac0-ac20-469e-be24-97cb3c8c5187' //Redouane





CREATE PROCEDURE ps_get_all_client_taches
AS
BEGIN

SELECT 
        ct.ClientTacheId,
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
        m.Designation AS MissionDesignation,  -- Mission designation
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
        ag.Nom AS AgentNom
    FROM 
        ClientTache ct
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
        Client cl ON cm.ClientId = cl.ClientId   -- Join with Client to get client details
    LEFT JOIN 
        Agent ag ON ct.AgentResposable = ag.AgentId    

END
GO







ALTER PROCEDURE ps_get_client_taches_simple --add Prestation designation
    @ClientId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        ct.ClientTacheId,
        ct.ClientMissionPrestationId,
        ct.ClientMissionId,
        ct.TacheId,
        ct.Intitule,
        ct.Numero_Ordre,
        ct.Commentaire,
        ct.Deadline,
        ct.DateButoir,
        ct.Date_Execution,
        ct.Status,
        ct.AgentResposable,
        m.Designation, 
        p.Designation, 
        t.Intitule, 
        p.Designation AS PrestationDesignation  -- Include PrestationDesignation
    FROM 
        ClientTache ct
    LEFT JOIN 
        ClientMission cm ON ct.ClientMissionId = cm.ClientMissionId
    LEFT JOIN
        ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
    LEFT JOIN
        Prestation p ON cmp.PrestationId = p.PrestationId  -- Join Prestation table
    WHERE 
        cm.ClientId = @ClientId
    ORDER BY 
        CAST(SUBSTRING(ct.Numero_Ordre, 2, LEN(ct.Numero_Ordre) - 1) AS INT);
END;
GO











CREATE PROC ps_create_client_tache  
    @ClientTacheId UNIQUEIDENTIFIER,  
    @ClientId UNIQUEIDENTIFIER,  
    @AgentResponsable UNIQUEIDENTIFIER, 
    @ClientMissionPrestationId UNIQUEIDENTIFIER,  
    @ClientMissionId UNIQUEIDENTIFIER,  
    @TacheId UNIQUEIDENTIFIER,   
    @Intitule VARCHAR(200),   
    @Commentaire VARCHAR(200) = NULL,  -- Allow NULL for optional fields
    @start_date DATETIME,         
    @end_date DATETIME,           
    @color VARCHAR(7) = '#000000',  -- Default color if not provided
    @isDone BIT = 0,               -- Default as 'not done'
    @isReminder BIT = 0  
AS  
BEGIN  
    SET NOCOUNT ON;  

    BEGIN TRY  
        INSERT INTO ClientTache (
            ClientTacheId, ClientId, ClientMissionPrestationId, ClientMissionId,  
            TacheId, Intitule, Commentaire, start_date, end_date, color, isDone, isReminder, AgentResponsable
        )  
        VALUES (
            @ClientTacheId, @ClientId, @ClientMissionPrestationId, @ClientMissionId,  
            @TacheId, @Intitule, @Commentaire, @start_date, @end_date, @color, @isDone, @isReminder, @AgentResponsable
        );  
    END TRY  
    BEGIN CATCH  
        -- Error handling
        PRINT 'Error occurred: ' + ERROR_MESSAGE();  
        THROW;  -- Rethrow the error for debugging
    END CATCH  
END;













CREATE PROCEDURE ps_delete_ClientTache
    @ClientTacheId UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Suppression de la tâche de la table ClientTache
        DELETE FROM ClientTache
        WHERE ClientTacheId = @ClientTacheId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
