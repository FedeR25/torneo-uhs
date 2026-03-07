const express = require("express")
const app = express()
const { getDb, guardarDb } = require("./database")

app.use(express.json())
app.use(express.static("."))

const equipos = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"]

app.get("/equipos", (req, res) => {
  res.json(equipos)
})

app.get("/partidos", async (req, res) => {
  const db = await getDb()
  const result = db.exec("SELECT * FROM partidos ORDER BY fecha")
  if (!result.length) return res.json([])
  const cols = result[0].columns
  const rows = result[0].values.map(row => {
    const obj = {}
    cols.forEach((col, i) => obj[col] = row[i])
    return obj
  })
  res.json(rows)
})

app.post("/resultado", async (req, res) => {
  const { fecha, equipo_home, equipo_away, goles_home, goles_away } = req.body
  const db = await getDb()
  db.run(
    `UPDATE partidos SET goles_home = ?, goles_away = ? WHERE fecha = ? AND equipo_home = ? AND equipo_away = ?`,
    [goles_home, goles_away, fecha, equipo_home, equipo_away]
  )
  guardarDb()
  res.json({ ok: true })
})

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000")
})