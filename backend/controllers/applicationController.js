const { sql, poolPromise } = require("../config/db");
const { sendStatusChangeEmail } = require("../services/emailService");

const createApplication = async (req, res) => {
    try {
        const student_id = req.user.id;

        const {
            institucija_id,
            naziv_pozicije,
            opis_prakse,
            datum_pocetka,
            datum_zavrsetka
        } = req.body;

        if (
            !institucija_id ||
            !naziv_pozicije ||
            !opis_prakse ||
            !datum_pocetka ||
            !datum_zavrsetka
        ) {
            return res.status(400).json({
                message: "Sva polja za prijavu prakse su obavezna."
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input("student_id", sql.Int, student_id)
            .input("institucija_id", sql.Int, institucija_id)
            .input("naziv_pozicije", sql.NVarChar, naziv_pozicije)
            .input("opis_prakse", sql.NVarChar(sql.MAX), opis_prakse)
            .input("datum_pocetka", sql.Date, datum_pocetka)
            .input("datum_zavrsetka", sql.Date, datum_zavrsetka)
            .input("status", sql.NVarChar, "predano")
            .query(`
                INSERT INTO prijave_prakse
                (student_id, institucija_id, naziv_pozicije, opis_prakse, datum_pocetka, datum_zavrsetka, status)
                VALUES
                (@student_id, @institucija_id, @naziv_pozicije, @opis_prakse, @datum_pocetka, @datum_zavrsetka, @status)
            `);

        res.status(201).json({
            message: "Prijava prakse uspješno dodana."
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri unosu prijave prakse.",
            error: error.message
        });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const student_id = req.user.id;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("student_id", sql.Int, student_id)
            .query(`
                SELECT 
                    pp.*,
                    i.naziv AS institucija_naziv
                FROM prijave_prakse pp
                LEFT JOIN institucije i ON pp.institucija_id = i.id
                WHERE pp.student_id = @student_id
                ORDER BY pp.created_at DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju mojih prijava.",
            error: error.message
        });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                pp.*,
                s.ime AS student_ime,
                s.prezime AS student_prezime,
                i.naziv AS institucija_naziv,
                m.ime AS mentor_ime,
                m.prezime AS mentor_prezime
            FROM prijave_prakse pp
            LEFT JOIN users s ON pp.student_id = s.id
            LEFT JOIN users m ON pp.mentor_id = m.id
            LEFT JOIN institucije i ON pp.institucija_id = i.id
            ORDER BY pp.created_at DESC
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju svih prijava.",
            error: error.message
        });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT 
                    pp.*,
                    s.ime AS student_ime,
                    s.prezime AS student_prezime,
                    s.email AS student_email,
                    i.naziv AS institucija_naziv,
                    i.adresa AS institucija_adresa,
                    i.grad AS institucija_grad,
                    i.kontakt_email AS institucija_kontakt_email,
                    i.kontakt_osoba AS institucija_kontakt_osoba,
                    m.ime AS mentor_ime,
                    m.prezime AS mentor_prezime
                FROM prijave_prakse pp
                LEFT JOIN users s ON pp.student_id = s.id
                LEFT JOIN users m ON pp.mentor_id = m.id
                LEFT JOIN institucije i ON pp.institucija_id = i.id
                WHERE pp.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: "Prijava nije pronađena."
            });
        }

        const application = result.recordset[0];

        if (
            req.user.role === "student" &&
            application.student_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "Nemate pristup ovoj prijavi."
            });
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju prijave.",
            error: error.message
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const promijenio_korisnik_id = req.user.id;

        const allowedStatuses = [
            "predano",
            "u_obradi",
            "odobreno",
            "u_tijeku",
            "zavrseno",
            "odbijeno"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Neispravan status."
            });
        }

        const pool = await poolPromise;

        const oldStatusResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT 
                    pp.status,
                    pp.naziv_pozicije,
                    pp.student_id,
                    u.email AS student_email,
                    u.ime AS student_ime,
                    u.prezime AS student_prezime
                FROM prijave_prakse pp
                LEFT JOIN users u ON pp.student_id = u.id
                WHERE pp.id = @id
            `);

        if (oldStatusResult.recordset.length === 0) {
            return res.status(404).json({
                message: "Prijava nije pronađena."
            });
        }

        const stari_status = oldStatusResult.recordset[0].status;

        await pool.request()
            .input("id", sql.Int, id)
            .input("status", sql.NVarChar, status)
            .query(`
                UPDATE prijave_prakse
                SET status = @status
                WHERE id = @id
            `);

        await pool.request()
            .input("prijava_id", sql.Int, id)
            .input("stari_status", sql.NVarChar, stari_status)
            .input("novi_status", sql.NVarChar, status)
            .input("promijenio_korisnik_id", sql.Int, promijenio_korisnik_id)
            .query(`
                INSERT INTO status_history
                (prijava_id, stari_status, novi_status, promijenio_korisnik_id)
                VALUES
                (@prijava_id, @stari_status, @novi_status, @promijenio_korisnik_id)
            `);

        const prijava = oldStatusResult.recordset[0];
        const mozeSlatiMail =
            prijava.student_email || process.env.FORCE_EMAIL_TO?.trim();

        if (mozeSlatiMail && stari_status !== status) {
            try {
                await sendStatusChangeEmail({
                    to: prijava.student_email || process.env.FORCE_EMAIL_TO.trim(),
                    studentIme: `${prijava.student_ime} ${prijava.student_prezime}`,
                    prijavaId: id,
                    stariStatus: stari_status,
                    noviStatus: status,
                    nazivPozicije: prijava.naziv_pozicije,
                });
            } catch (mailError) {
                console.error("Greška pri slanju e-maila:", mailError.message);
            }

            const poruka = `Status prijave #${id} promijenjen: ${stari_status} → ${status}`;
            const allowedTips = ["email", "sustav"];

            for (const tip of allowedTips) {
                try {
                    await pool.request()
                        .input("korisnik_id", sql.Int, prijava.student_id)
                        .input("poruka", sql.NVarChar, poruka)
                        .input("tip", sql.NVarChar, tip)
                        .query(`
                            INSERT INTO notifikacije (korisnik_id, poruka, tip, procitano)
                            VALUES (@korisnik_id, @poruka, @tip, 0)
                        `);
                    break;
                } catch (notifError) {
                    if (tip === allowedTips[allowedTips.length - 1]) {
                        console.error(
                            "Greška pri upisu notifikacije:",
                            notifError.message
                        );
                    }
                }
            }
        }

        res.status(200).json({
            message: "Status uspješno promijenjen."
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri promjeni statusa.",
            error: error.message
        });
    }
};

const assignMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const { mentor_id } = req.body;

        if (!mentor_id) {
            return res.status(400).json({
                message: "mentor_id je obavezan."
            });
        }

        const pool = await poolPromise;

        const mentorCheck = await pool.request()
            .input("mentor_id", sql.Int, mentor_id)
            .query(`
                SELECT * FROM users
                WHERE id = @mentor_id AND role = 'mentor'
            `);

        if (mentorCheck.recordset.length === 0) {
            return res.status(400).json({
                message: "Odabrani korisnik nije mentor."
            });
        }

        await pool.request()
            .input("id", sql.Int, id)
            .input("mentor_id", sql.Int, mentor_id)
            .query(`
                UPDATE prijave_prakse
                SET mentor_id = @mentor_id
                WHERE id = @id
            `);

        res.status(200).json({
            message: "Mentor uspješno dodijeljen."
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dodjeli mentora.",
            error: error.message
        });
    }
};

const gradeApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { ocjena, zavrsno_izvjesce_tekst } = req.body;

        if (ocjena === undefined && !zavrsno_izvjesce_tekst) {
            return res.status(400).json({
                message: "Unesite ocjenu ili završno izvješće."
            });
        }

        if (ocjena !== undefined && (ocjena < 1 || ocjena > 5)) {
            return res.status(400).json({
                message: "Ocjena mora biti između 1 i 5."
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input("id", sql.Int, id)
            .input("ocjena", sql.Int, ocjena ?? null)
            .input("zavrsno_izvjesce_tekst", sql.NVarChar(sql.MAX), zavrsno_izvjesce_tekst || null)
            .query(`
                UPDATE prijave_prakse
                SET ocjena = @ocjena,
                    zavrsno_izvjesce_tekst = @zavrsno_izvjesce_tekst
                WHERE id = @id
            `);

        res.status(200).json({
            message: "Ocjena i izvješće uspješno spremljeni."
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri spremanju ocjene/izvješća.",
            error: error.message
        });
    }
};

const getStatusHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const appResult = await pool.request()
            .input("id", sql.Int, id)
            .query(`SELECT student_id FROM prijave_prakse WHERE id = @id`);

        if (appResult.recordset.length === 0) {
            return res.status(404).json({ message: "Prijava nije pronađena." });
        }

        if (
            req.user.role === "student" &&
            appResult.recordset[0].student_id !== req.user.id
        ) {
            return res.status(403).json({ message: "Nemate pristup ovoj prijavi." });
        }

        const result = await pool.request()
            .input("prijava_id", sql.Int, id)
            .query(`
                SELECT
                    sh.id,
                    sh.stari_status,
                    sh.novi_status,
                    sh.datum_promjene,
                    u.ime AS promijenio_ime,
                    u.prezime AS promijenio_prezime
                FROM status_history sh
                LEFT JOIN users u ON sh.promijenio_korisnik_id = u.id
                WHERE sh.prijava_id = @prijava_id
                ORDER BY sh.datum_promjene DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju povijesti statusa.",
            error: error.message
        });
    }
};

const getApplicationReports = async (req, res) => {
    try {
        const pool = await poolPromise;

        const byStatus = await pool.request().query(`
            SELECT status, COUNT(*) AS broj
            FROM prijave_prakse
            GROUP BY status
            ORDER BY status
        `);

        const byInstitution = await pool.request().query(`
            SELECT i.naziv AS institucija_naziv, COUNT(*) AS broj
            FROM prijave_prakse pp
            LEFT JOIN institucije i ON pp.institucija_id = i.id
            GROUP BY i.naziv
            ORDER BY broj DESC
        `);

        const totalResult = await pool.request().query(`
            SELECT COUNT(*) AS ukupno FROM prijave_prakse
        `);

        res.status(200).json({
            ukupno: totalResult.recordset[0].ukupno,
            po_statusu: byStatus.recordset,
            po_instituciji: byInstitution.recordset
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri generiranju izvještaja.",
            error: error.message
        });
    }
};

module.exports = {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateStatus,
    assignMentor,
    gradeApplication,
    getStatusHistory,
    getApplicationReports
};
