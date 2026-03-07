const path = require("path")
const fs = require("fs")
const initSqlJs = require("sql.js")

const DB_PATH = path.join(__dirname, "torneo.db")

let db

async function getDb() {
  if (db) return db
  const SQL = await initSqlJs()
  
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
    db.run(`
      CREATE TABLE IF NOT EXISTS equipos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
      )
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS partidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha INTEGER NOT NULL,
        equipo_home TEXT NOT NULL,
        equipo_away TEXT NOT NULL,
        goles_home INTEGER,
        goles_away INTEGER
      )
    `)
    guardarDb()
  }
  return db
}

function guardarDb() {
  const data = db.export()
  fs.writeFileSync(DB_PATH, Buffer.from(data))
}

module.exports = { getDb, guardarDb }