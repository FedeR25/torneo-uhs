const { Pool } = require('pg');

// Render llena process.env.DATABASE_URL automáticamente con la Internal URL que pegaste
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Esto es necesario para que Render acepte la conexión segura
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
    console.log("Estructura de base de datos verificada ✅");
  } catch (err) {
    console.error("Error al inicializar tablas:", err);
  } finally {
    client.release();
  }
}

module.exports = { pool, inicializarTablas };