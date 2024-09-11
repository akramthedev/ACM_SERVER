CREATE PROCEDURE ps_update_client_piece
    @ClientPieceId uniqueidentifier
    ,@Extension nvarchar(255)
AS
    UPDATE ClientPiece
    SET
        Extension = @Extension,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE ClientPieceId = @ClientPieceId;
GO

ALTER PROCEDURE ps_update_client_piece
    @ClientPieceId uniqueidentifier
    -- ,@ClientId UNIQUEIDENTIFIER
    -- ,@PieceId UNIQUEIDENTIFIER
    ,@Extension nvarchar(255)
AS
    UPDATE ClientPiece
    SET
        Extension = @Extension,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE ClientPieceId = @ClientPieceId;
GO

ALTER TABLE Piece ADD Numero_Ordre NVARCHAR(255)

UPDATE Piece
SET Numero_Ordre = 'P1'
WHERE PieceId='fff9f49e-0b8f-4382-80b2-a6f1bef73f62'

UPDATE Piece
SET Numero_Ordre = 'P2'
WHERE PieceId='5dbd16bc-ada7-4ac6-83b3-9feaa558394a'

INSERT INTO Piece VALUES (NEWID(),'Carte de Séjour',null,'P3')
INSERT INTO Piece VALUES (NEWID(),'Carte d''indentité',null,'P4')

UPDATE Piece
SET Numero_Ordre = 'P5', Libelle='Carte consulaire'
WHERE PieceId='9e437dfd-298e-4ee9-860b-f90dd8273cd8'

INSERT INTO Piece VALUES (NEWID(),'Carte vitale',null,'P6')

UPDATE Piece
SET Numero_Ordre = 'P7'
WHERE PieceId='8f6cba68-aef7-4875-9b89-c741ab0efee9'

UPDATE Piece
SET Numero_Ordre = 'P8', Libelle='Copie livret de famille'
WHERE PieceId='3d241fda-4c4e-445f-8250-46c9439392af'

UPDATE Piece
SET Numero_Ordre = 'P9'
WHERE PieceId='ef916956-22eb-4f66-9be3-abdf835e4e27'

UPDATE Piece
SET Numero_Ordre = 'P10'
WHERE PieceId='26a18d0c-536d-4457-b9f1-894aebf61485'

UPDATE Piece
SET Numero_Ordre = 'P37'
WHERE PieceId='e41bde58-ecb5-48f1-8622-9b2e4bbae56a'

--supprimer UFE , CNI, SS dans ClientPiece et MissionPiece et Piece

-- Select * from ClientPiece where PieceId='1a2b6811-76d4-47ac-a4f9-2a3bf73440cb'
delete from ClientPiece where PieceId='1a2b6811-76d4-47ac-a4f9-2a3bf73440cb'
-- Select * from MissionPiece where PieceId='1a2b6811-76d4-47ac-a4f9-2a3bf73440cb'
delete from MissionPiece where PieceId='1a2b6811-76d4-47ac-a4f9-2a3bf73440cb'
-- Select * from Piece where PieceId='1a2b6811-76d4-47ac-a4f9-2a3bf73440cb'
delete from Piece where PieceId='1a2b6811-76d4-47ac-a4f9-2a3bf73440cb'
-----------------------------------------------

-- Select * from ClientPiece where PieceId='7ae80834-b1fd-4291-a4ae-db64a368287f'
delete from ClientPiece where PieceId='7ae80834-b1fd-4291-a4ae-db64a368287f'
-- Select * from MissionPiece where PieceId='7ae80834-b1fd-4291-a4ae-db64a368287f'
delete from MissionPiece where PieceId='7ae80834-b1fd-4291-a4ae-db64a368287f'
-- Select * from Piece where PieceId='7ae80834-b1fd-4291-a4ae-db64a368287f'
delete from Piece where PieceId='7ae80834-b1fd-4291-a4ae-db64a368287f'
-----------------------------------------------
-- Select * from ClientPiece where PieceId='0fab2ef7-caa9-4d07-8b28-a305ead65d1e'
delete from ClientPiece where PieceId='0fab2ef7-caa9-4d07-8b28-a305ead65d1e'
-- Select * from MissionPiece where PieceId='0fab2ef7-caa9-4d07-8b28-a305ead65d1e'
delete from MissionPiece where PieceId='0fab2ef7-caa9-4d07-8b28-a305ead65d1e'
-- Select * from Piece where PieceId='0fab2ef7-caa9-4d07-8b28-a305ead65d1e'
delete from Piece where PieceId='0fab2ef7-caa9-4d07-8b28-a305ead65d1e'
-----------------------------------------------
INSERT INTO Piece VALUES (NEWID(),'Dernier bulletin de pension retraite',null,'P11')


-- select * from Piece ORDER BY CAST(SUBSTRING(Numero_Ordre, 2, LEN(Numero_Ordre) - 1) AS INT);

-- select cp.ClientId,cp.PieceId,p.Libelle,p.PieceId from ClientPiece cp,Piece p where ClientId='12612211-69E8-4DAA-A21C-6B9EC50163F8' and cp.PieceId=p.PieceId

--------- Ordre ClientPiece et Piece--------------------------------------

ALTER PROCEDURE ps_get_client_pieces
    @ClientId uniqueidentifier
AS
BEGIN
    select cp.ClientPieceId,cp.ClientId,cp.PieceId,cp.Extension,p.Libelle,p.Description
    from ClientPiece cp
    left join Piece p on p.PieceId=cp.PieceId
    where cp.ClientId=@ClientId
    ORDER BY 
        CAST(SUBSTRING(p.Numero_Ordre, 2, LEN(p.Numero_Ordre) - 1) AS INT);
END
GO

ALTER PROCEDURE ps_get_pieces
AS
    select * from Piece ORDER BY CAST(SUBSTRING(Numero_Ordre, 2, LEN(Numero_Ordre) - 1) AS INT)
GO

-----------Add oder Pieces ---------------------------------------------
INSERT INTO Piece VALUES (NEWID(),'Dernière attestation Info Retraite',null,'P12');
INSERT INTO Piece VALUES (NEWID(),'Les 3 derniers bilans ou 3 derniers bulletins de salaire et celui de décembre',null,'P13');
INSERT INTO Piece VALUES (NEWID(),'Les 3 derniers avis d''imposition complet français et marocain',null,'P14');
INSERT INTO Piece VALUES (NEWID(),'Revenu locatif : déclaration 2044',null,'P15');
INSERT INTO Piece VALUES (NEWID(),'Location meublée : déclaration fiscale BIC 2031/2033/2042C',null,'P16');
INSERT INTO Piece VALUES (NEWID(),'Revenu capitaux mobiliers : relevé de situation de placements',null,'P17');
INSERT INTO Piece VALUES (NEWID(),'Assurance propriétaire non occupant (PNO)',null,'P18');
INSERT INTO Piece VALUES (NEWID(),'Copie des statuts',null,'P19');
INSERT INTO Piece VALUES (NEWID(),'Dernière déclaration 2072',null,'P20');
INSERT INTO Piece VALUES (NEWID(),'Revenu locatifs Maroc : contrat de bail, THSC, charges de copropriété',null,'P21');
INSERT INTO Piece VALUES (NEWID(),'Dernier avis THSC',null,'P22');
INSERT INTO Piece VALUES (NEWID(),'Contrat de bail',null,'P23');
INSERT INTO Piece VALUES (NEWID(),'Titre foncier',null,'P24');
INSERT INTO Piece VALUES (NEWID(),'Assurance propriétaire non occupant (PNO)',null,'P25');
INSERT INTO Piece VALUES (NEWID(),'Épargne bancaire : dernier relevé de situation',null,'P26');
INSERT INTO Piece VALUES (NEWID(),'Placement financier : dernier relevé annuel de situation, (ass vie, ctt de capitalisat°,,)(date d''ouverture, bénéf,)',null,'P27');
INSERT INTO Piece VALUES (NEWID(),'Tableaux d''amortissement des prêts (conso, revolving, personnel...)',null,'P28');
INSERT INTO Piece VALUES (NEWID(),'Dernier décomptes des autres prêts en cours',null,'P29');
INSERT INTO Piece VALUES (NEWID(),'Dernière taxe foncière du ou des biens en France',null,'P30');
INSERT INTO Piece VALUES (NEWID(),'Valeur du ou des biens en France et au Maroc',null,'P31');
INSERT INTO Piece VALUES (NEWID(),'Attestation assurance logement / locatif',null,'P32');
INSERT INTO Piece VALUES (NEWID(),'Quittance de loyer',null,'P33');
INSERT INTO Piece VALUES (NEWID(),'Attestation assurance logement',null,'P34');
INSERT INTO Piece VALUES (NEWID(),'Attestation de logement à titre gratuit',null,'P35');
INSERT INTO Piece VALUES (NEWID(),'Identifiant France Connect',null,'P36');
--37 existe deja
INSERT INTO Piece VALUES (NEWID(),'RIB français',null,'P38');
INSERT INTO Piece VALUES (NEWID(),'RIB marocain',null,'P39');
INSERT INTO Piece VALUES (NEWID(),'Carte grise',null,'P40');
INSERT INTO Piece VALUES (NEWID(),'Permis d''habiter',null,'P41');
INSERT INTO Piece VALUES (NEWID(),'Acte de décès',null,'P42');
INSERT INTO Piece VALUES (NEWID(),'Acte de naissance',null,'P43');
INSERT INTO Piece VALUES (NEWID(),'Livret de famille avec mention marginale',null,'P44');
INSERT INTO Piece VALUES (NEWID(),'Copie acte de donation',null,'P45');
INSERT INTO Piece VALUES (NEWID(),'Copie DDV',null,'P46');
INSERT INTO Piece VALUES (NEWID(),'Copie donation',null,'P47');
INSERT INTO Piece VALUES (NEWID(),'Coordonnées caisse de retraite',null,'P48');
INSERT INTO Piece VALUES (NEWID(),'Fiche de renseignements ACM',null,'P49');
INSERT INTO Piece VALUES (NEWID(),'Acte de notoriété',null,'P50');
INSERT INTO Piece VALUES (NEWID(),'Certificat de coutume',null,'P51');
INSERT INTO Piece VALUES (NEWID(),'Consultation du FDDDV',null,'P52');
INSERT INTO Piece VALUES (NEWID(),'Acte de partage',null,'P53');
INSERT INTO Piece VALUES (NEWID(),'Déclaration d''option du conjoint survivant',null,'P54');
INSERT INTO Piece VALUES (NEWID(),'Attestation d''ex du notaire',null,'P55');
INSERT INTO Piece VALUES (NEWID(),'Procuration authentique',null,'P56');
INSERT INTO Piece VALUES (NEWID(),'Procuration SSP',null,'P57');
INSERT INTO Piece VALUES (NEWID(),'Titre de pension',null,'P58');
INSERT INTO Piece VALUES (NEWID(),'Notification de retraite',null,'P59');
INSERT INTO Piece VALUES (NEWID(),'Dernier avis IR',null,'P60');
INSERT INTO Piece VALUES (NEWID(),'Formule 2',null,'P61');
INSERT INTO Piece VALUES (NEWID(),'Quitus syndic',null,'P62');
INSERT INTO Piece VALUES (NEWID(),'Relevés bancaires N à N-4',null,'P63');
INSERT INTO Piece VALUES (NEWID(),'Attestation de solde au jour du DC',null,'P64');
INSERT INTO Piece VALUES (NEWID(),'Attestation de changement de domicile de la DGSN',null,'P65');
INSERT INTO Piece VALUES (NEWID(),'Attestation fiscale N',null,'P66');
INSERT INTO Piece VALUES (NEWID(),'Attestation de régularité fiscale',null,'P67');
INSERT INTO Piece VALUES (NEWID(),'Avis de paiement de THSC',null,'P68');
INSERT INTO Piece VALUES (NEWID(),'Cahier bleu',null,'P69');
INSERT INTO Piece VALUES (NEWID(),'Acte d''hérédité',null,'P70');
INSERT INTO Piece VALUES (NEWID(),'Certificat négatif OMPIC',null,'P71');
INSERT INTO Piece VALUES (NEWID(),'Contrat de location enregistré/Société',null,'P72');
INSERT INTO Piece VALUES (NEWID(),'Déclaration Modèle 2 légalisée',null,'P73');
INSERT INTO Piece VALUES (NEWID(),'Attestation de la TP',null,'P74');
INSERT INTO Piece VALUES (NEWID(),'Certificat de dépôt',null,'P75');
INSERT INTO Piece VALUES (NEWID(),'Statuts',null,'P76');
INSERT INTO Piece VALUES (NEWID(),'PV de constitution',null,'P77');
INSERT INTO Piece VALUES (NEWID(),'Attestation de changement de résidence consulaire',null,'P78');
INSERT INTO Piece VALUES (NEWID(),'Attestation de radiation consulaire',null,'P79');
INSERT INTO Piece VALUES (NEWID(),'Attestation d''inscription sur liste électorale',null,'P80');
INSERT INTO Piece VALUES (NEWID(),'Attestation de radiation liste électorale consulaire',null,'P81');
INSERT INTO Piece VALUES (NEWID(),'Justificatif de domicile',null,'P82');




CREATE PROCEDURE ps_get_client_mission_prestation_simple
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
    ORDER BY 
        CAST(SUBSTRING(p.Numero_Ordre, 2, LEN(p.Numero_Ordre) - 1) AS INT);
END;
GO

CREATE PROCEDURE ps_delete_client_mission_prestation
    @ClientMissionPrestationId UNIQUEIDENTIFIER
AS
BEGIN
    -- Supprimer d'abord les tâches associées à cette prestation
    DELETE FROM ClientTache WHERE ClientMissionPrestationId = @ClientMissionPrestationId;

    -- Ensuite, supprimer la prestation du client
    DELETE FROM ClientMissionPrestation WHERE ClientMissionPrestationId = @ClientMissionPrestationId;
    
END;
GO

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
    ORDER BY 
        CAST(SUBSTRING(p.Numero_Ordre, 2, LEN(p.Numero_Ordre) - 1) AS INT);
END;
GO

CREATE PROCEDURE ps_get_unassigned_prestations_for_client
    @ClientId UNIQUEIDENTIFIER,
    @MissionId UNIQUEIDENTIFIER
AS
BEGIN
    -- Sélectionner toutes les prestations de la mission qui ne sont pas dans ClientMissionPrestation
    SELECT 
        p.PrestationId,
        p.Designation AS PrestationDesignation,
        p.Description AS PrestationDescription
    FROM 
        Prestation p
    LEFT JOIN 
        ClientMissionPrestation cmp ON p.PrestationId = cmp.PrestationId
        AND cmp.ClientMissionId IN (SELECT cm.ClientMissionId 
                                    FROM ClientMission cm 
                                    WHERE cm.ClientId = @ClientId 
                                    AND cm.MissionId = @MissionId)
    WHERE 
        p.MissionId = @MissionId 
        AND cmp.ClientMissionPrestationId IS NULL  -- Exclure les prestations déjà affectées
    ORDER BY 
        p.Designation;
END;
GO

CREATE PROCEDURE ps_get_unassigned_tasks_for_prestation
    @ClientId UNIQUEIDENTIFIER,
    @PrestationId UNIQUEIDENTIFIER
AS
BEGIN
    -- Sélectionner toutes les tâches de la prestation qui ne sont pas dans ClientTache
    SELECT 
        t.TacheId,
        t.Intitule AS TaskTitle,
        t.Description AS TaskDescription,
        t.Numero_Ordre AS TaskOrder
    FROM 
        Tache t
    LEFT JOIN 
        ClientTache ct ON t.TacheId = ct.TacheId
        AND ct.ClientMissionPrestationId IN (SELECT cmp.ClientMissionPrestationId 
                                             FROM ClientMissionPrestation cmp
                                             JOIN ClientMission cm ON cmp.ClientMissionId = cm.ClientMissionId
                                             WHERE cm.ClientId = @ClientId 
                                             AND cmp.PrestationId = @PrestationId)
    WHERE 
        t.PrestationId = @PrestationId
        AND ct.ClientTacheId IS NULL  -- Exclure les tâches déjà affectées
    ORDER BY 
        t.Numero_Ordre;
END;
GO

-- ALTER proc ps_get_client_mission_prestations --Original
--     @ClientId uniqueidentifier
-- AS
-- BEGIN
--     select cmp.ClientMissionPrestationId,cmp.ClientMissionId,cmp.PrestationId,cmp.DateAffectation,cm.ClientMissionId,cm.ClientId,m.MissionId,m.Designation AS Mission,p.PrestationId,p.Designation AS Prestation
--     from ClientMissionPrestation cmp
--     left join ClientMission cm on cm.ClientMissionId=cmp.ClientMissionId
--     left join Mission m on cm.MissionId=m.MissionId
--     left join Prestation p on p.PrestationId=cmp.PrestationId
--     where cm.ClientId=@ClientId
-- END
-- GO

ALTER proc ps_get_client_mission_prestations  --Modified because it get 2
    @ClientId uniqueidentifier
AS
BEGIN
    select cmp.ClientMissionPrestationId,cmp.ClientMissionId,cmp.PrestationId,cmp.DateAffectation,cm.ClientId,m.MissionId,m.Designation AS Mission,p.Designation AS Prestation
    from ClientMissionPrestation cmp
    left join ClientMission cm on cm.ClientMissionId=cmp.ClientMissionId
    left join Mission m on cm.MissionId=m.MissionId
    left join Prestation p on p.PrestationId=cmp.PrestationId
    where cm.ClientId=@ClientId
END
GO

ALTER PROCEDURE ps_get_unassigned_prestations_for_client
    @ClientMissionId UNIQUEIDENTIFIER
AS
BEGIN
    -- Sélectionner toutes les prestations de la mission spécifique qui ne sont pas dans ClientMissionPrestation
    SELECT 
        p.PrestationId,
        p.Designation AS PrestationDesignation,
        p.Description AS PrestationDescription
    FROM 
        Prestation p
    LEFT JOIN 
        ClientMissionPrestation cmp 
        ON p.PrestationId = cmp.PrestationId
        AND cmp.ClientMissionId = @ClientMissionId  -- Vérifier la ClientMissionId au lieu de MissionId
    WHERE 
        p.MissionId = (SELECT cm.MissionId 
                       FROM ClientMission cm 
                       WHERE cm.ClientMissionId = @ClientMissionId)  -- Trouver la MissionId associée à la ClientMissionId
        AND cmp.ClientMissionPrestationId IS NULL  -- Exclure les prestations déjà affectées à cette ClientMission
    ORDER BY 
        p.Designation;
END;
GO

CREATE PROCEDURE ps_create_client_mission_prestation_custom
    @ClientMissionPrestationId UNIQUEIDENTIFIER,
    @ClientMissionId UNIQUEIDENTIFIER,
    @PrestationId UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Step 1: Insert the ClientMissionPrestation
        INSERT INTO ClientMissionPrestation(ClientMissionPrestationId, ClientMissionId, PrestationId, DateAffectation)
        VALUES (@ClientMissionPrestationId, @ClientMissionId, @PrestationId, CURRENT_TIMESTAMP);

        -- Step 2: Retrieve tasks associated with the PrestationId
        DECLARE @Intitule NVARCHAR(255), @Numero_Ordre NVARCHAR(255), @AgentResposable UNIQUEIDENTIFIER, @TacheId UNIQUEIDENTIFIER;

        -- Step 3: Insert corresponding tasks into ClientTache
        INSERT INTO ClientTache(ClientTacheId, ClientMissionPrestationId, ClientMissionId, TacheId, Intitule, Numero_Ordre, Status, AgentResposable)
        SELECT 
            NEWID() AS ClientTacheId,               -- Generate new unique identifier for ClientTache
            @ClientMissionPrestationId AS ClientMissionPrestationId, -- Use the ClientMissionPrestationId passed to the procedure
            @ClientMissionId AS ClientMissionId,    -- Use the ClientMissionId passed to the procedure
            t.TacheId,                              -- Task ID from Tache table
            t.Intitule,                             -- Task Intitule from Tache table
            t.Numero_Ordre,                         -- Task Numero_Ordre from Tache table
            'En attente' AS Status,                 -- Default status 'En attente'
            t.AgentId AS AgentResposable            -- Task AgentResponsable from Tache table
        FROM 
            Tache t
        WHERE 
            t.PrestationId = @PrestationId;         -- Filter tasks by PrestationId

        -- Step 4: Commit the transaction if all operations succeed
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Step 5: Rollback transaction if any error occurs
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
CREATE PROCEDURE ps_get_missions_with_prestation_count
AS
BEGIN
    SELECT 
        m.MissionId,
        m.Designation AS MissionDesignation,
        m.Description AS MissionDescription,
        COUNT(p.PrestationId) AS NumberOfPrestations
    FROM 
        Mission m
    LEFT JOIN 
        Prestation p ON m.MissionId = p.MissionId
    GROUP BY 
        m.MissionId, 
        m.Designation, 
        m.Description
    ORDER BY 
        m.Designation;
END;
GO


-- ALTER PROC ps_create_client_mission (original)
--     @ClientMissionId UNIQUEIDENTIFIER,
--     @ClientId UNIQUEIDENTIFIER,
--     @MissionId UNIQUEIDENTIFIER
-- AS
-- BEGIN
--     BEGIN TRANSACTION;
--     BEGIN TRY
--         -- Insertion dans la table ClientMission
--         INSERT INTO ClientMission(ClientMissionId, ClientId, MissionId, DateAffectation)
--         VALUES(@ClientMissionId, @ClientId, @MissionId, CURRENT_TIMESTAMP);

--         -- Insertion de toutes les pièces dans la table ClientPiece
--         INSERT INTO ClientPiece (ClientPieceID, ClientId, PieceId)
--         SELECT NEWID(), @ClientId, mp.PieceId
--         FROM MissionPiece mp
--         WHERE mp.MissionId=@MissionId;

--         COMMIT TRANSACTION;
--     END TRY
--     BEGIN CATCH
--         ROLLBACK TRANSACTION;
--         THROW;
--     END CATCH
-- END;
-- GO


ALTER PROC ps_create_client_mission
    @ClientMissionId UNIQUEIDENTIFIER,
    @ClientId UNIQUEIDENTIFIER,
    @MissionId UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Insertion dans la table ClientMission
        INSERT INTO ClientMission(ClientMissionId, ClientId, MissionId, DateAffectation)
        VALUES(@ClientMissionId, @ClientId, @MissionId, CURRENT_TIMESTAMP);

        -- Insertion de toutes les nouvelles pièces dans la table ClientPiece
        INSERT INTO ClientPiece (ClientPieceID, ClientId, PieceId)
        SELECT NEWID(), @ClientId, mp.PieceId
        FROM MissionPiece mp
        WHERE mp.MissionId = @MissionId 
        AND mp.PieceId NOT IN (
            SELECT cp.PieceId 
            FROM ClientPiece cp 
            WHERE cp.ClientId = @ClientId
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE ps_get_client_pieces_affecter
    @ClientId uniqueidentifier
AS
BEGIN
    select cp.ClientPieceId,cp.ClientId,cp.PieceId,cp.Extension,p.Libelle,p.Description
    from ClientPiece cp
    left join Piece p on p.PieceId=cp.PieceId
    where cp.ClientId=@ClientId
    ORDER BY 
        CAST(SUBSTRING(p.Numero_Ordre, 2, LEN(p.Numero_Ordre) - 1) AS INT);
END
GO