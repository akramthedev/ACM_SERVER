
CREATE TABLE Piece (
    PieceId uniqueidentifier primary key,
    Libelle NVARCHAR(255) NOT NULL,
    Description NVARCHAR(255)
);

Create table ClientPiece(
    ClientPieceId uniqueidentifier primary key,
    ClientId uniqueidentifier not null,
    PieceId uniqueidentifier not null,
    Extension NVARCHAR(50) not null,
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId),
    FOREIGN KEY (PieceId) REFERENCES Piece(PieceId)
)

insert into Piece values
    (newid(),'Passeport', null),
    (newid(),'CNI', null),
    (newid(),'Livert de famille', null),
    (newid(),'Contrat de mariage', null),
    (newid(),'Jugement de divorce', null),
    (newid(),'Carte consultaire', null),
    (newid(),'Carte UFE', null),
    (newid(),'Carte Mutuelle', null),
    (newid(),'Permis de conduire', null),
    (newid(),'Carte Sécurité Sociale', null),
    (newid(),'Photo d''identité', null);


create proc ps_get_client_pieces
    @ClientId uniqueidentifier
AS
BEGIN
    select cp.ClientPieceId,cp.ClientId,cp.PieceId,cp.Extension,p.Libelle,p.Description
    from ClientPiece cp
    left join Piece p on p.PieceId=cp.PieceId
    where cp.ClientId=@ClientId
END
GO
create proc ps_get_client_piece
    @ClientPieceId uniqueidentifier
AS
BEGIN
    select cp.ClientPieceId,cp.ClientId,cp.PieceId,cp.Extension,p.Libelle,p.Description
    from ClientPiece cp
    left join Piece p on p.PieceId=cp.PieceId
    where cp.ClientPieceId=@ClientPieceId
END
GO

create proc ps_create_client_piece
    @ClientPieceId uniqueidentifier,
    @ClientId uniqueidentifier,
    @PieceId uniqueidentifier,
    @Extension NVARCHAR(50)
AS
    insert into ClientPiece(ClientPieceId,ClientId,PieceId,Extension)
    values(@ClientPieceId,@ClientId,@PieceId,@Extension)
GO

create proc ps_delete_client_piece
    @ClientPieceId uniqueidentifier
AS
    delete from ClientPiece where ClientPieceId=@ClientPieceId
GO
    
create proc ps_get_pieces
AS
    select * from Piece
GO