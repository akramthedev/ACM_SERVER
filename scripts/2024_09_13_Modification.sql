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



select * from prestation 

UPDATE Prestation SET Designation = 'Adhesion Sante/CNSS' where PrestationId='55017a79-a7a2-493b-853b-97c33df4d139'

UPDATE Prestation SET Description = 'Description Prestation Adhesion Sante/CNSS de la mission Installation au Maroc' where PrestationId='55017a79-a7a2-493b-853b-97c33df4d139'

INSERT INTO Prestation (PrestationId,MissionId,Designation,Description,CreatedAt,Numero_Ordre) VALUES (NEWID(),'a83dcad0-3a14-4523-a5c5-30e1baa232d0','Adhesion Sante/CFE','Description Prestation Adhesion Sante/CFE de la mission Installation au Maroc',CURRENT_TIMESTAMP,'P4')

select * from Tache where PrestationId='55017a79-a7a2-493b-853b-97c33df4d139' --CNSS

select * from Tache where PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' --CFE

update Tache set PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' where TacheId='611cf32e-2291-4da3-bde8-69c96c8fc7c9'
update Tache set PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' where TacheId='2988b9e3-6a71-4694-bd61-8823cc247781'
update Tache set PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' where TacheId='67e78008-7709-4a89-9ad8-9afa5fe05af4'
update Tache set PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' where TacheId='8b4c0838-a3c3-4a0e-bf34-b2bb43496747'
update Tache set PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' where TacheId='47f7c19f-3dee-4ff7-90e5-d4da1f60138e'
update Tache set PrestationId='109baee7-234f-4bff-baa1-1817d90a877b' where TacheId='fa810186-7b94-494d-873f-db1c27c9475b'



select Numero_Ordre, [Description] from Prestation ORDER BY CAST(SUBSTRING(replace(Numero_Ordre,'-','.'), 2, LEN(replace(Numero_Ordre,'-','')) - 1) AS float),len(Numero_Ordre),Numero_Ordre;







--ORDER BY CAST(SUBSTRING(replace(Numero_Ordre,'-','.'), 2, LEN(replace(Numero_Ordre,'-','')) - 1) AS float),len(Numero_Ordre),Numero_Ordre;



ALTER PROCEDURE ps_get_client_mission_prestation_simple
    @ClientId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        cmp.ClientMissionPrestationId,
        cmp.ClientMissionId,
        cmp.PrestationId,
        p.Designation AS PrestationDesignation,  -- Prestation information
        p.Description AS PrestationDescription,
        m.MissionId,
        m.Designation AS MissionDesignation,  -- Mission information
        m.Description AS MissionDescription,
        s.ServiceId,
        s.Designation AS ServiceDesignation,  -- Service information
        s.Description AS ServiceDescription,
        cmp.DateAffectation
    FROM 
        ClientMissionPrestation cmp
    LEFT JOIN 
        ClientMission cm ON cmp.ClientMissionId = cm.ClientMissionId
    LEFT JOIN
        Prestation p ON cmp.PrestationId = p.PrestationId
    LEFT JOIN
        Mission m ON p.MissionId = m.MissionId
    LEFT JOIN
        Service s ON m.ServiceId = s.ServiceId
    WHERE
        cm.ClientId = @ClientId
    ORDER BY CAST(SUBSTRING(replace(p.Numero_Ordre,'-','.'), 2, LEN(replace(p.Numero_Ordre,'-','')) - 1) AS float),len(p.Numero_Ordre),Numero_Ordre;
END;
GO
