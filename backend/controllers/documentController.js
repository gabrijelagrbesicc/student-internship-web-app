const { sql, poolPromise } = require("../config/db");

const getDocumentsByApplicationId = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("prijava_id", sql.Int, applicationId)
            .query(`
                SELECT id, prijava_id, naziv_dokumenta, tip_dokumenta, putanja, upload_date
                FROM dbo.dokumenti
                WHERE prijava_id = @prijava_id
                ORDER BY upload_date DESC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Greška pri dohvaćanju dokumenata.",
            error: error.message
        });
    }
};

const uploadDocument = async (req, res) => {
    try {
        const { prijava_id, tip_dokumenta, naziv_dokumenta } = req.body;

        if (!prijava_id || !tip_dokumenta || !naziv_dokumenta) {
            return res.status(400).json({
                message: "prijava_id, tip_dokumenta i naziv_dokumenta su obavezni."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Datoteka nije poslana."
            });
        }

        const pool = await poolPromise;

        await pool.request()
            .input("prijava_id", sql.Int, prijava_id)
            .input("naziv_dokumenta", sql.NVarChar, naziv_dokumenta)
            .input("tip_dokumenta", sql.NVarChar, tip_dokumenta)
            .input("putanja", sql.NVarChar, req.file.path)
            .query(`
                INSERT INTO dbo.dokumenti (prijava_id, naziv_dokumenta, tip_dokumenta, putanja)
                VALUES (@prijava_id, @naziv_dokumenta, @tip_dokumenta, @putanja)
            `);

        res.status(201).json({
            message: "Dokument uspješno uploadan.",
            file: req.file.filename,
            path: req.file.path
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška pri uploadu dokumenta.",
            error: error.message
        });
    }
};

module.exports = {
    getDocumentsByApplicationId,
    uploadDocument
};