const { Pool } = require('pg');

// Usamos la variable de entorno que configuramos
const pool = new Pool({
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
  } catch (err) {
    console.error("Error inicializando tablas:", err);
  } finally {
    client.release();
  }
}

module.exports = { pool, inicializarTablas };