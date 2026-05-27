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
        res.status(500).json({ message: "Greška pri dohvaćanju notifikacija.", error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .input("korisnik_id", sql.Int, req.user.id)
            .query(`UPDATE notifikacije SET procitano = 1 WHERE id = @id AND korisnik_id = @korisnik_id`);
        res.status(200).json({ message: "Notifikacija označena kao pročitana." });
    } catch (error) {
        res.status(500).json({ message: "Greška.", error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("korisnik_id", sql.Int, req.user.id)
            .query(`UPDATE notifikacije SET procitano = 1 WHERE korisnik_id = @korisnik_id`);
        res.status(200).json({ message: "Sve notifikacije označene kao pročitane." });
    } catch (error) {
        res.status(500).json({ message: "Greška.", error: error.message });
    }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };