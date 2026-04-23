const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../config/db");

const register = async (req, res) => {
    try {
        const { ime, prezime, email, password, role } = req.body;

        if (!ime || !prezime || !email || !password || !role) {
            return res.status(400).json({
                message: "Sva polja su obavezna."
            });
        }

        const allowedRoles = ["student", "mentor", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Neispravna uloga korisnika."
            });
        }

        const pool = await poolPromise;

        const existingUser = await pool.request()
            .input("email", sql.NVarChar, email)
            .query("SELECT * FROM users WHERE email = @email");

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({
                message: "Korisnik s tim emailom već postoji."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input("ime", sql.NVarChar, ime)
            .input("prezime", sql.NVarChar, prezime)
            .input("email", sql.NVarChar, email)
            .input("password", sql.NVarChar, hashedPassword)
            .input("role", sql.NVarChar, role)
            .query(`
                INSERT INTO users (ime, prezime, email, password, role)
                VALUES (@ime, @prezime, @email, @password, @role)
            `);

        res.status(201).json({
            message: "Registracija uspješna."
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška na serveru.",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email i lozinka su obavezni."
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input("email", sql.NVarChar, email)
            .query("SELECT * FROM users WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(400).json({
                message: "Neispravan email ili lozinka."
            });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Neispravan email ili lozinka."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login uspješan.",
            token: token,
            user: {
                id: user.id,
                ime: user.ime,
                prezime: user.prezime,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Greška na serveru.",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};