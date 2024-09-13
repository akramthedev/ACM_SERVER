CREATE PROCEDURE ps_get_client_tache_details_for_email
    @ClientTacheId UNIQUEIDENTIFIER
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
        p.Designation AS PrestationDesignation,  -- Include PrestationDesignation
        -- Informations sur le client
        c.Nom AS ClientNom,
        c.Prenom AS ClientPrenom,
        c.Email1 AS ClientEmail,
        c.Telephone1 AS ClientTelephone,
        -- Informations sur l'agent
        a.Nom AS AgentNom,
        a.Email AS AgentEmail,
        a.Telephone AS AgentTelephone
    FROM 
        ClientTache ct
    LEFT JOIN 
        ClientMission cm ON ct.ClientMissionId = cm.ClientMissionId
    LEFT JOIN
        ClientMissionPrestation cmp ON ct.ClientMissionPrestationId = cmp.ClientMissionPrestationId
    LEFT JOIN
        Prestation p ON cmp.PrestationId = p.PrestationId  -- Join Prestation table
    LEFT JOIN
        Client c ON cm.ClientId = c.ClientId  -- Join Client table to get client information
    LEFT JOIN
        Agent a ON ct.AgentResposable = a.AgentId  -- Join Agent table to get agent information
    WHERE 
        ct.ClientTacheId = @ClientTacheId  -- Filter by the provided ClientTacheId
END;
GO
