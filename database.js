const { Pool } = require('pg');

const pool = new Pool({
  // Esta línea es la que está fallando, asegurate de que esté así:
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function inicializarTablas() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS partidos (
        id SERIAL PRIMARY KEY,
        fecha INTEGER NOT NULL,
        equipo_home TEXT NOT NULL,
        equipo_away TEXT NOT NULL,
        goles_home INTEGER,
        goles_away INTEGER
      );
    `);
    console.log("Tablas de Postgres listas ✅");
  } finally {
    client.release();
  }
}
module.exports = { pool, inicializarTablas };