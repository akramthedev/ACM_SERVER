
CREATE TABLE Budget (
    BudgetsId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    Designation NVARCHAR(255),
    Montant FLOAT,
    Sexe NVARCHAR(100),
    CommentBudgets NVARCHAR(255),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

create proc ps_get_Budgets
    @ClientId uniqueidentifier
AS
BEGIN
    select * from Budget where ClientId=@ClientId 
END
GO

create proc ps_create_Budget
    @BudgetsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @Designation NVARCHAR(255),
    @Montant FLOAT,
    @Sexe NVARCHAR(100),
    @CommentBudgets NVARCHAR(255)
AS
BEGIN
    insert into Budget(BudgetsId,ClientId,Designation,Montant,Sexe,CommentBudgets)
    values(@BudgetsId,@ClientId,@Designation,@Montant,@Sexe,@CommentBudgets)
END
GO

create proc ps_update_Budget
    @BudgetsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @Designation NVARCHAR(255),
    @Montant FLOAT,
    @Sexe NVARCHAR(100),
    @CommentBudgets NVARCHAR(255)
AS
BEGIN
    update Budget
    set
        BudgetsId=@BudgetsId,
        ClientId=@ClientId,
        Designation=@Designation,
        Montant=@Montant,
        Sexe=@Sexe,
        CommentBudgets=@CommentBudgets
    where BudgetsId=@BudgetsId
END
GO

create proc ps_delete_Budget
    @BudgetsId uniqueidentifier
AS
BEGIN
    delete from Budget where BudgetsId=@BudgetsId
END
GO