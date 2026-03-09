const { Pool } = require('pg');

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

    await client.query(`
      CREATE TABLE IF NOT EXISTS jugadores (
        id SERIAL PRIMARY KEY,
        equipo TEXT NOT NULL,
        nombre TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS goles (
        id SERIAL PRIMARY KEY,
        partido_id INTEGER NOT NULL,
        jugador_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 1
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        accion TEXT NOT NULL,
        detalle TEXT,
        fecha_hora TIMESTAMP DEFAULT NOW()
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