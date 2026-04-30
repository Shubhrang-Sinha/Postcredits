import mysql from "mysql2/promise";

let pool: any = null;

export function getPool(): any {
  if (!pool) {
    const databaseUrl =
      process.env.DATABASE_URL ||
      "mysql://postcredits:postcredits@localhost:3306/postcredits";

    const match = databaseUrl.match(
      /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );

    if (!match) {
      throw new Error("Invalid DATABASE_URL format");
    }

    const [, user, password, host, port, database] = match;

    pool = mysql.createPool({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

export async function query(sql: string, params?: unknown[]): Promise<any> {
  const [rows]: any = await getPool().execute(sql, params);
  return rows;
}

export async function queryOne(sql: string, params?: unknown[]): Promise<any> {
  const rows = await query(sql, params);
  return rows[0] || null;
}

export async function execute(sql: string, params?: unknown[]): Promise<any> {
  const [result]: any = await getPool().execute(sql, params);
  return result;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
