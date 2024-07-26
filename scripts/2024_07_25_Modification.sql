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