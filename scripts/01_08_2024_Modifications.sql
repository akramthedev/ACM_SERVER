ALTER TABLE ClientPiece ALTER COLUMN Extension NVARCHAR(50) NULL

CREATE TABLE MissionPiece(
    MissionPieceId uniqueidentifier PRIMARY KEY,
    PieceId uniqueidentifier NOT NULL, -- Référence au Piece
    MissionId uniqueidentifier NOT NULL, -- Référence au Mission
    DateAffectation DateTime,
    FOREIGN KEY (PieceId) REFERENCES Piece(PieceId),
    FOREIGN KEY (MissionId) REFERENCES Mission(MissionId)

);


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

        -- Insertion de toutes les pièces dans la table ClientPiece
        INSERT INTO ClientPiece (ClientPieceID, ClientId, PieceId)
        SELECT NEWID(), @ClientId, mp.PieceId
        FROM MissionPiece mp
        WHERE mp.MissionId=@MissionId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE ps_get_MissionPiece
    @MissionId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        mp.MissionPieceId,
        mp.PieceId,
        mp.MissionId,
        mp.DateAffectation,
        p.Libelle,
        p.Description
    FROM 
        MissionPiece mp
    INNER JOIN 
        Piece p ON mp.PieceId = p.PieceId
    WHERE 
        mp.MissionId = @MissionId;
END;
GO