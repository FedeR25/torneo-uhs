const express = require("express")
const app = express()
const db = require("./database")

app.use(express.json())
app.use(express.static("."))

app.get("/equipos", (req, res) => {
  const equipos = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"]
  res.json(equipos)
})

app.get("/partidos", (req, res) => {
  const partidos = db.prepare("SELECT * FROM partidos ORDER BY fecha").all()
  res.json(partidos)
})

app.post("/resultado", (req, res) => {
  const { fecha, equipo_home, equipo_away, goles_home, goles_away } = req.body
  db.prepare(`
    UPDATE partidos SET goles_home = ?, goles_away = ?
    WHERE fecha = ? AND equipo_home = ? AND equipo_away = ?
  `).run(goles_home, goles_away, fecha, equipo_home, equipo_away)
  res.json({ ok: true })
})

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000")
})