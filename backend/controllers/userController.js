const { sql, poolPromise } = require("../config/db");

const getMe = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", sql.Int, req.user.id)
            .query(`
                SELECT id, ime, prezime, email, role, created_at
                FROM users
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: "Korisnik nije pronađen."
            });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju korisnika.",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT id, ime, prezime, email, role, created_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju svih korisnika.",
            error: error.message
        });
    }
};

const getMentors = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT id, ime, prezime, email, role
            FROM users
            WHERE role = 'mentor'
            ORDER BY ime, prezime
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju mentora.",
            error: error.message
        });
    }
};

module.exports = {
    getMe,
    getAllUsers,
    getMentors
};