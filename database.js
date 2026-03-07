const Database = require("better-sqlite3")
const db = new Database("torneo.db")

// Crear tabla de equipos
db.exec(`
  CREATE TABLE IF NOT EXISTS equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  )
`)

// Crear tabla de partidos
db.exec(`
  CREATE TABLE IF NOT EXISTS partidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha INTEGER NOT NULL,
    equipo_home TEXT NOT NULL,
    equipo_away TEXT NOT NULL,
    goles_home INTEGER,
    goles_away INTEGER
  )
`)

console.log("Base de datos lista ✅")

module.exports = db