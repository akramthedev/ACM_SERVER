
CREATE TABLE Users (
    UserId uniqueidentifier primary key,
    CabinetId uniqueidentifier,
    Username NVARCHAR(100) NOT NULL unique,
    Email NVARCHAR(100) NOT NULL unique,
    PasswordHash NVARCHAR(255),
    PhoneNumber NVARCHAR(20),
    CreatedAt DateTime,
    FOREIGN KEY (CabinetId) REFERENCES Cabinet(CabinetId)
);
Create table Role(
    RoleId uniqueidentifier primary key,
    Libelle NVARCHAR(255),
    Description NVARCHAR(255)
);
Create table UserRole(
    UserRoleId uniqueidentifier,
    UserId uniqueidentifier,
    RoleId uniqueidentifier,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RoleId) REFERENCES Role(RoleId)
);
insert into Role values('C5404B02-C7FB-4ABB-9133-79F8E8E05F24','ManageClient',null);
insert into Users values('675D1807-A5F5-4095-9D83-B78A3E85EBAA','0E06E5A4-6246-415D-B119-C47077180755','amine','amine@netwaciila.ma','$2b$10$3bG4yFr3vxQgCuhBZbrqG.16Qe7GMQ97LWxaqztQnwTB8Ss1DsGOe','+2126123456');
insert into UserRole values('B74B395E-853F-4467-863A-6149E6AC73C2','675D1807-A5F5-4095-9D83-B78A3E85EBAA','C5404B02-C7FB-4ABB-9133-79F8E8E05F24')

create proc ps_get_user
    @Login NVARCHAR(255)
AS
BEGIN
    select top 1 * from Users 
    where Username=@Login OR Email=@Login 
END
GO

create proc ps_get_user_roles
    @UserId uniqueidentifier
AS
BEGIN
    select * 
    from Role r
    left join UserRole ur on ur.RoleId=r.RoleId
    where UserId=@UserId
END
GO

create proc ps_create_user
    UserId uniqueidentifier,
    CabinetId uniqueidentifier,
    Username NVARCHAR(100),
    Email NVARCHAR(100),
    PasswordHash NVARCHAR(255),
    PhoneNumber NVARCHAR(20)
AS
BEGIN
    insert into Users(UserId,CabinetId,Username,Email,PasswordHash,PhoneNumber)
    values(@UserId,@CabinetId,@Username,@Email,@PasswordHash,@PhoneNumber)
END
GO