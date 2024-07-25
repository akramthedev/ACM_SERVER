CREATE TABLE Cabinet (
    CabinetID INT PRIMARY KEY AUTO_INCREMENT,
    Nom NVARCHAR(100) NOT NULL,
    Adresse NVARCHAR(255),
    Telephone NVARCHAR(20)
);
CREATE TABLE Client (
    ClientId INT PRIMARY KEY AUTO_INCREMENT,
    Nom NVARCHAR(100) NOT NULL,
    Prenom NVARCHAR(100) NOT NULL,
    DateNaissance DATE,
    SituationFamiliale NVARCHAR(50),
    Profession NVARCHAR(100),
    DateRetraite DATE,
    NumeroSS NVARCHAR(20),  --Numero Sécurité Sociale
    Adresse NVARCHAR(255),
    Email1 NVARCHAR(100),
    Email1 NVARCHAR(100),
    Tel1 NVARCHAR(20),
    Tel1 NVARCHAR(20),
    ImgSrc NVARCHAR(255),
    HasConjoint BIT,
    CabinetID INT NOT NULL,
    FOREIGN KEY (CabinetID) REFERENCES Cabinet(CabinetID)
);
CREATE TABLE Conjoint (
    ConjointId INT PRIMARY KEY AUTO_INCREMENT,
    ClientId INT NOT NULL, -- Référence au client 
    Nom NVARCHAR(100) NOT NULL,
    Prenom NVARCHAR(100) NOT NULL,
    DateNaissance DATE,
    Profession NVARCHAR(100),
    DateRetraite DATE,
    NumeroSS NVARCHAR(20),
    DateMariage DATE,
    Adresse NVARCHAR(255),
    RegimeMatrimonial NVARCHAR(100),
    DonationEpoux NVARCHAR(100),
    ModifRegimeDate NVARCHAR(100),
    QuestComp NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);
CREATE TABLE Proche (
    ProcheId INT PRIMARY KEY AUTO_INCREMENT,
    ClientId INT NOT NULL, -- Référence au client 
    Nom NVARCHAR(100) NOT NULL,
    Prenom NVARCHAR(100) NOT NULL,
    DateNaissance DATE,
    LienParenteID INT,  
    Charge NVARCHAR(100),
    Particularite NVARCHAR(MAX),
    NombreEnfant Int,
    Comment NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

CREATE TABLE Patrimoine (
    PatrimoineId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    TypePatrimoine NVARCHAR(100),
    Designation NVARCHAR(255),
    Valeur FLOAT,
    Detenteur NVARCHAR(255),
    ChargesAssocies NVARCHAR(255),
    Charges NVARCHAR(255),
    RevenueFiscalite NVARCHAR(255),
    CapitalEmprunte NVARCHAR(255),
    Duree NVARCHAR(255),
    Taux NVARCHAR(255),
    Deces NVARCHAR(255),
    Particularite NVARCHAR(255)
    CommentUsage NVARCHAR(MAX),
    CommentRapport NVARCHAR(MAX),
    CommentImmobilier NVARCHAR(MAX),
    QuestionsComplementaires NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

CREATE TABLE Passifs (
    PassifsId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au client 
    TypePassifs NVARCHAR(100),
    Designation NVARCHAR(100),
    CapitalEmprunte FLOAT,
    Valeur FLOAT,
    Detenteur NVARCHAR(100),
    Duree NVARCHAR(100),
    Taux NVARCHAR(100),
    Deces NVARCHAR(100),
    Particularite NVARCHAR(100),
    ValeurRachat FLOAT,
    DateSouscription DATE,
    Assure BIT,
    Beneficiaire NVARCHAR(100),
    DateOuverture DATE,
    EpargneAssocie NVARCHAR(100),
    RevenusDistribue NVARCHAR(100),
    FiscaliteOuRevenue NVARCHAR(100),
    TauxRevalorisation NVARCHAR(100),
    CommentPassifs NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

CREATE TABLE Budget (
    BudgetId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULLL, -- Référence au client
    Designation NVARCHAR(100),
    MontantAnnuel FLOAT,
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);


CREATE TABLE ParticulariteFiscale (
    ParticulariteFiscaleId uniqueidentifier PRIMARY KEY,
    ClientId uniqueidentifier NOT NULL, -- Référence au client
    Reponse NVARCHAR(MAX),
    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);

CREATE TABLE SituationAdministrative (
    SituationAdministrativeId uniqueidentifier PRIMARY KEY ,
    ClientId uniqueidentifier NOT NULL, -- Référence au client
    CFE BIT,
    Cotisation BIT,
    Reversion BIT,
    CNSS BIT,
    CNAREFE BIT,
    CAPITONE BIT,
    AssuranceRapatriement BIT,
    MutuelleFrancaise BIT,
    PASSEPORT BIT,
    CarteSejour BIT,
    PermisConduire BIT,
    AssuranceAuto BIT,
    AssuranceHabitation BIT,
    InscriptionConsulat BIT,
    CPAM BIT,
    CSG_CRDS BIT,

    FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);