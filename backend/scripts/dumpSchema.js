require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 1433,
    options: { trustServerCertificate: true },
};

(async () => {
    const pool = await sql.connect(config);
    const cols = await pool.request().query(`
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH,
               IS_NULLABLE, COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'dbo'
        ORDER BY TABLE_NAME, ORDINAL_POSITION
    `);
    const checks = await pool.request().query(`
        SELECT tc.TABLE_NAME, cc.CHECK_CLAUSE
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        JOIN INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
          ON tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
        WHERE tc.CONSTRAINT_TYPE = 'CHECK' AND tc.TABLE_SCHEMA = 'dbo'
    `);
    const fks = await pool.request().query(`
        SELECT
            fk.name AS fk_name,
            tp.name AS parent_table,
            cp.name AS parent_column,
            tr.name AS ref_table,
            cr.name AS ref_column
        FROM sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
        INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
        INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
        INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
        ORDER BY parent_table, fk_name
    `);
    console.log(JSON.stringify({ columns: cols.recordset, checks: checks.recordset, fks: fks.recordset }, null, 2));
    await pool.close();
})().catch((e) => {
    console.error("ERR", e.message);
    process.exit(1);
});
