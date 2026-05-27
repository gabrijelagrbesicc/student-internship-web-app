-- ============================================================
-- Web aplikacija za prijavu i evidenciju studentske prakse
-- SQL Server — baza: studentskaPraksa
-- ============================================================

IF DB_ID(N'studentskaPraksa') IS NULL
BEGIN
    CREATE DATABASE studentskaPraksa;
END
GO

USE studentskaPraksa;
GO

-- ------------------------------------------------------------
-- Korisnici (student, mentor, admin)
-- ------------------------------------------------------------
IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id          INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ime         NVARCHAR(100) NULL,
        prezime     NVARCHAR(100) NULL,
        email       NVARCHAR(100) NULL,
        password    NVARCHAR(255) NULL,
        role        NVARCHAR(20) NULL,
        created_at  DATETIME NULL CONSTRAINT DF_users_created_at DEFAULT (GETDATE()),
        CONSTRAINT CK_users_role CHECK (
            role IN (N'student', N'mentor', N'admin')
        )
    );
END
GO

-- ------------------------------------------------------------
-- Institucije / tvrtke za praksu
-- ------------------------------------------------------------
IF OBJECT_ID(N'dbo.institucije', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.institucije (
        id              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        naziv           NVARCHAR(255) NULL,
        adresa          NVARCHAR(255) NULL,
        grad            NVARCHAR(100) NULL,
        kontakt_email   NVARCHAR(100) NULL,
        kontakt_osoba   NVARCHAR(100) NULL
    );
END
GO

-- ------------------------------------------------------------
-- Prijave studentske prakse
-- ------------------------------------------------------------
IF OBJECT_ID(N'dbo.prijave_prakse', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.prijave_prakse (
        id                      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        student_id              INT NULL,
        institucija_id          INT NULL,
        mentor_id               INT NULL,
        naziv_pozicije          NVARCHAR(255) NULL,
        opis_prakse             NVARCHAR(MAX) NULL,
        datum_pocetka           DATE NULL,
        datum_zavrsetka         DATE NULL,
        status                  NVARCHAR(50) NULL,
        ocjena                  INT NULL,
        zavrsno_izvjesce_tekst  NVARCHAR(MAX) NULL,
        created_at              DATETIME NULL CONSTRAINT DF_prijave_created_at DEFAULT (GETDATE()),
        CONSTRAINT CK_prijave_status CHECK (
            status IN (N'predano', N'u_obradi', N'odobreno', N'u_tijeku', N'zavrseno', N'odbijeno')
        ),
        CONSTRAINT CK_prijave_ocjena CHECK (
            ocjena IS NULL OR (ocjena >= 1 AND ocjena <= 5)
        ),
        CONSTRAINT fk_prijave_student FOREIGN KEY (student_id) REFERENCES dbo.users(id),
        CONSTRAINT fk_prijave_institucija FOREIGN KEY (institucija_id) REFERENCES dbo.institucije(id),
        CONSTRAINT fk_prijave_mentor FOREIGN KEY (mentor_id) REFERENCES dbo.users(id)
    );
END
GO

-- ------------------------------------------------------------
-- Povijest promjena statusa
-- ------------------------------------------------------------
IF OBJECT_ID(N'dbo.status_history', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.status_history (
        id                      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        prijava_id              INT NULL,
        stari_status            NVARCHAR(50) NULL,
        novi_status             NVARCHAR(50) NULL,
        promijenio_korisnik_id  INT NULL,
        datum_promjene          DATETIME NULL CONSTRAINT DF_status_history_datum DEFAULT (GETDATE()),
        CONSTRAINT CK_status_history_stari CHECK (
            stari_status IS NULL OR stari_status IN (
                N'predano', N'u_obradi', N'odobreno', N'u_tijeku', N'zavrseno', N'odbijeno'
            )
        ),
        CONSTRAINT CK_status_history_novi CHECK (
            novi_status IN (
                N'predano', N'u_obradi', N'odobreno', N'u_tijeku', N'zavrseno', N'odbijeno'
            )
        ),
        CONSTRAINT fk_statushistory_prijava FOREIGN KEY (prijava_id) REFERENCES dbo.prijave_prakse(id),
        CONSTRAINT fk_statushistory_korisnik FOREIGN KEY (promijenio_korisnik_id) REFERENCES dbo.users(id)
    );
END
GO

-- ------------------------------------------------------------
-- Dokumenti uz prijavu (PDF, DOC, DOCX)
-- ------------------------------------------------------------
IF OBJECT_ID(N'dbo.dokumenti', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.dokumenti (
        id              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        prijava_id      INT NULL,
        naziv_dokumenta NVARCHAR(255) NULL,
        tip_dokumenta   NVARCHAR(100) NULL,
        putanja         NVARCHAR(255) NULL,
        upload_date     DATETIME NULL CONSTRAINT DF_dokumenti_upload DEFAULT (GETDATE()),
        CONSTRAINT CK_dokumenti_tip CHECK (
            tip_dokumenta IN (N'sporazum', N'projektni_zadatak', N'zavrsno_izvjesce', N'ostalo')
        ),
        CONSTRAINT fk_dokumenti_prijava FOREIGN KEY (prijava_id) REFERENCES dbo.prijave_prakse(id)
    );
END
GO

-- ------------------------------------------------------------
-- In-app obavijesti
-- tip: 'sustav' | 'email'
-- ------------------------------------------------------------
IF OBJECT_ID(N'dbo.notifikacije', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.notifikacije (
        id           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        korisnik_id  INT NULL,
        poruka       NVARCHAR(MAX) NULL,
        tip          NVARCHAR(50) NULL,
        procitano    BIT NULL CONSTRAINT DF_notifikacije_procitano DEFAULT (0),
        created_at   DATETIME NULL CONSTRAINT DF_notifikacije_created_at DEFAULT (GETDATE()),
        CONSTRAINT CK_notifikacije_tip CHECK (
            tip IN (N'sustav', N'email')
        ),
        CONSTRAINT fk_notifikacije_korisnik FOREIGN KEY (korisnik_id) REFERENCES dbo.users(id)
    );
END
GO
