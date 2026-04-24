export async function query(sql, params) {
    const mysql = await import('../db/index.js');
    const rows = await mysql.default.query(sql, params);
    return rows;
}
export async function queryRow(sql, params) {
    const rows = await query(sql, params);
    return rows[0];
}
