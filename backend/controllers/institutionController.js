const { sql, poolPromise } = require("../config/db");

const getAllInstitutions = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT id, naziv, adresa, grad, kontakt_email, kontakt_osoba
            FROM institucije
            ORDER BY naziv ASC
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju institucija.",
            error: error.message
        });
    }
};

const createInstitution = async (req, res) => {
    try {
        const { naziv, adresa, grad, kontakt_email, kontakt_osoba } = req.body;

        if (!naziv) {
            return res.status(400).json({
                message: "Naziv institucije je obavezan."
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input("naziv", sql.NVarChar, naziv)
            .input("adresa", sql.NVarChar, adresa || null)
            .input("grad", sql.NVarChar, grad || null)
            .input("kontakt_email", sql.NVarChar, kontakt_email || null)
            .input("kontakt_osoba", sql.NVarChar, kontakt_osoba || null)
            .query(`
                INSERT INTO institucije (naziv, adresa, grad, kontakt_email, kontakt_osoba)
                VALUES (@naziv, @adresa, @grad, @kontakt_email, @kontakt_osoba)
            `);

        res.status(201).json({
            message: "Institucija uspješno dodana."
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dodavanju institucije.",
            error: error.message
        });
    }
};

module.exports = {
    getAllInstitutions,
    createInstitution
};