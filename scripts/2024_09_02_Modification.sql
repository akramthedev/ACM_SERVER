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
    ,@ClientId UNIQUEIDENTIFIER
    ,@PieceId UNIQUEIDENTIFIER
    ,@Extension nvarchar(255)
AS
    UPDATE ClientPiece
    SET
        Extension = @Extension,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE ClientPieceId = @ClientPieceId;
GO