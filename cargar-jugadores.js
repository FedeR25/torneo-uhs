const { pool } = require("./database");

const jugadores = [
  { equipo: "Aston Birra", nombre: "Fabian Koch" },
  { equipo: "Aston Birra", nombre: "Paul Saban" },
  { equipo: "Aston Birra", nombre: "Miguel Gonzalez" },
  { equipo: "Aston Birra", nombre: "Nicolas Toscano" },
  { equipo: "Aston Birra", nombre: "Nicolas Rosseti" },
  { equipo: "Aston Birra", nombre: "Martin Celador" },
  { equipo: "Aston Birra", nombre: "Federico Ramundo" },
  { equipo: "Aston Birra", nombre: "Marcelo Koblecosky" },
  { equipo: "Aston Birra", nombre: "Santiago Ricci" },
]

async function cargar() {
  try {
    // Crear tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jugadores (
        id SERIAL PRIMARY KEY,
        equipo TEXT NOT NULL,
        nombre TEXT NOT NULL
      );
    `)

    // Borrar jugadores de Aston Birra para no duplicar
    await pool.query("DELETE FROM jugadores WHERE equipo = 'Aston Birra'")

    // Insertar jugadores
    for (const j of jugadores) {
      await pool.query(
        "INSERT INTO jugadores (equipo, nombre) VALUES ($1, $2)",
        [j.equipo, j.nombre]
      )
    }
    console.log(`✅ ${jugadores.length} jugadores cargados`)
  } catch (err) {
    console.error("Error:", err)
  } finally {
    process.exit()
  }
}

cargar()