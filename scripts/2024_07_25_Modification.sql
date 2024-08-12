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


ALTER PROCEDURE ps_create_client_tache
    @ClientTacheId UNIQUEIDENTIFIER,
    @ClientMissionPrestationId UNIQUEIDENTIFIER,
    @ClientMissionId UNIQUEIDENTIFIER,
    @TacheId UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Récupération de l'intitulé et du numéro d'ordre de la tâche, et de la désignation de la prestation
        DECLARE @Intitule NVARCHAR(255);
        DECLARE @Numero_Ordre NVARCHAR(255);
        DECLARE @Commentaire NVARCHAR(255);

        SELECT 
            @Intitule = t.Intitule,
            @Numero_Ordre = t.Numero_Ordre,
            @Commentaire = p.Designation
        FROM 
            Tache t
        LEFT JOIN 
            Prestation p ON t.PrestationId = p.PrestationId
        WHERE 
            t.TacheId = @TacheId;

        -- Insertion dans la table ClientTache avec les valeurs récupérées et le statut "En cours"
        INSERT INTO ClientTache(
            ClientTacheId, 
            ClientMissionPrestationId, 
            ClientMissionId, 
            TacheId, 
            Intitule, 
            Numero_Ordre, 
            Commentaire,
            Status)
        VALUES(
            @ClientTacheId, 
            @ClientMissionPrestationId, 
            @ClientMissionId, 
            @TacheId, 
            @Intitule, 
            @Numero_Ordre, 
            @Commentaire,
            'En attente');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
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