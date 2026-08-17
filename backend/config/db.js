const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 1433,
    options: {
        trustServerCertificate: true
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("✅ Spojeno na SQL Server bazu.");
        return pool;
    })
    .catch(err => {
        console.error("❌ Greška pri spajanju na bazu:", err.message);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};