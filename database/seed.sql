-- Primjer početnih podataka (institucije)
-- Korisnike registriraj kroz aplikaciju (/register) — lozinke se hashiraju u backendu.

USE studentskaPraksa;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.institucije)
BEGIN
    INSERT INTO dbo.institucije (naziv, adresa, grad, kontakt_email, kontakt_osoba)
    VALUES
        (N'Infobip d.o.o.', N'Petračićeva 4', N'Zagreb', N'hr@infobip.com', N'HR tim'),
        (N'Končar - Elektroindustrija d.d.', N'Fallerovo šetalište 22', N'Zagreb', N'info@koncar.hr', N'Kadrovska služba'),
        (N'Rimac Technology d.o.o.', N'Ljubljanska 7', N'Sveta Nedelja', N'careers@rimac-automobili.com', N'Recruitment'),
        (N'Agencija za znanost i visoko obrazovanje', N'Frankopanska 26', N'Zagreb', N'info@azvo.hr', N'Uprava'),
        (N'Fakultet elektrotehnike i računarstva', N'Unska 3', N'Zagreb', N'fer@fer.hr', N'Studentska služba');
END
GO
