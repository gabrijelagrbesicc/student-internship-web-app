const { sql, poolPromise } = require("../config/db");

const getMyNotifications = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("korisnik_id", sql.Int, req.user.id)
            .query(`
                SELECT id, korisnik_id, poruka, tip, procitano, created_at
                FROM notifikacije
                WHERE korisnik_id = @korisnik_id
                ORDER BY created_at DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju notifikacija.",
            error: error.message
        });
    }
};

module.exports = {
    getMyNotifications
};