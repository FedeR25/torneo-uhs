const { getDb, guardarDb } = require("./database")

const fixture = [
  { fecha: 1, home: "Magos", away: "Caranchos", gh: 1, ga: 1 },
  { fecha: 1, home: "Dealers", away: "Golosos", gh: 3, ga: 0 },
  { fecha: 1, home: "Aston Birra", away: "Kaiser", gh: 3, ga: 3 },
  { fecha: 2, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 2, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 2, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  { fecha: 3, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 3, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 3, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 4, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 4, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 4, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  { fecha: 5, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 5, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 5, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
  { fecha: 6, home: "Magos", away: "Caranchos", gh: null, ga: null },
  { fecha: 6, home: "Dealers", away: "Golosos", gh: null, ga: null },
  { fecha: 6, home: "Aston Birra", away: "Kaiser", gh: null, ga: null },
  { fecha: 7, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 7, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 7, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  { fecha: 8, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 8, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 8, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 9, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 9, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 9, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  { fecha: 10, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 10, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 10, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
  { fecha: 11, home: "Magos", away: "Caranchos", gh: null, ga: null },
  { fecha: 11, home: "Dealers", away: "Golosos", gh: null, ga: null },
  { fecha: 11, home: "Aston Birra", away: "Kaiser", gh: null, ga: null },
  { fecha: 12, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 12, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 12, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  { fecha: 13, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 13, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 13, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 14, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 14, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 14, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  { fecha: 15, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 15, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 15, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
  { fecha: 16, home: "Magos", away: "Caranchos", gh: null, ga: null },
  { fecha: 16, home: "Dealers", away: "Golosos", gh: null, ga: null },
  { fecha: 16, home: "Aston Birra", away: "Kaiser", gh: null, ga: null },
  { fecha: 17, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 17, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 17, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  { fecha: 18, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 18, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 18, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 19, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 19, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 19, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  { fecha: 20, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 20, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 20, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
]

async function cargar() {
  const db = await getDb()
  db.run("DELETE FROM partidos")
  fixture.forEach(p => {
    db.run(
      `INSERT INTO partidos (fecha, equipo_home, equipo_away, goles_home, goles_away) VALUES (?, ?, ?, ?, ?)`,
      [p.fecha, p.home, p.away, p.gh, p.ga]
    )
  })
  guardarDb()
  console.log(`✅ ${fixture.length} partidos cargados`)
}

cargar()