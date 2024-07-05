
CREATE TABLE Budget (
    BudgetsId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    Designation NVARCHAR(255),
    MontantMr FLOAT,
    MontantMme FLOAT,
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
    @MontantMr FLOAT,
    @MontantMme FLOAT,
    @CommentBudgets NVARCHAR(255)
AS
BEGIN
    insert into Budget(BudgetsId,ClientId,Designation,MontantMr,MontantMme,CommentBudgets)
    values(@BudgetsId,@ClientId,@Designation,@MontantMr,@MontantMme,@CommentBudgets)
END
GO

create proc ps_update_Budget
    @BudgetsId uniqueidentifier,
    @ClientId uniqueidentifier, -- Référence au client 
    @Designation NVARCHAR(255),
    @MontantMr FLOAT,
    @MontantMme FLOAT,
    @CommentBudgets NVARCHAR(255)
AS
BEGIN
    update Budget
    set
        BudgetsId=@BudgetsId,
        ClientId=@ClientId,
        Designation=@Designation,
        MontantMr=@MontantMr,
        MontantMme=@MontantMme,
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
