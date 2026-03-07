const db = require("./database")

const fixture = [
  // Fecha 1 - 04/03
  { fecha: 1, home: "Magos", away: "Caranchos", gh: 1, ga: 1 },
  { fecha: 1, home: "Dealers", away: "Golosos", gh: 3, ga: 0 },
  { fecha: 1, home: "Aston Birra", away: "Kaiser", gh: 3, ga: 3 },
  // Fecha 2 - 11/03
  { fecha: 2, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 2, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 2, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  // Fecha 3 - 18/03
  { fecha: 3, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 3, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 3, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  // Fecha 4 - 25/03
  { fecha: 4, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 4, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 4, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  // Fecha 5 - 01/04
  { fecha: 5, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 5, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 5, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
  // Fecha 6 - 08/04
  { fecha: 6, home: "Magos", away: "Caranchos", gh: null, ga: null },
  { fecha: 6, home: "Dealers", away: "Golosos", gh: null, ga: null },
  { fecha: 6, home: "Aston Birra", away: "Kaiser", gh: null, ga: null },
  // Fecha 7 - 15/04
  { fecha: 7, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 7, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 7, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  // Fecha 8 - 22/04
  { fecha: 8, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 8, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 8, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  // Fecha 9 - 29/04
  { fecha: 9, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 9, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 9, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  // Fecha 10 - 06/05
  { fecha: 10, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 10, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 10, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
  // Fecha 11 - 13/05
  { fecha: 11, home: "Magos", away: "Caranchos", gh: null, ga: null },
  { fecha: 11, home: "Dealers", away: "Golosos", gh: null, ga: null },
  { fecha: 11, home: "Aston Birra", away: "Kaiser", gh: null, ga: null },
  // Fecha 12 - 20/05
  { fecha: 12, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 12, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 12, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  // Fecha 13 - 27/05
  { fecha: 13, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 13, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 13, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  // Fecha 14 - 03/06
  { fecha: 14, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 14, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 14, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  // Fecha 15 - 10/06
  { fecha: 15, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 15, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 15, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
  // Fecha 16 - 17/06
  { fecha: 16, home: "Magos", away: "Caranchos", gh: null, ga: null },
  { fecha: 16, home: "Dealers", away: "Golosos", gh: null, ga: null },
  { fecha: 16, home: "Aston Birra", away: "Kaiser", gh: null, ga: null },
  // Fecha 17 - 24/06
  { fecha: 17, home: "Magos", away: "Golosos", gh: null, ga: null },
  { fecha: 17, home: "Caranchos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 17, home: "Dealers", away: "Kaiser", gh: null, ga: null },
  // Fecha 18 - 01/07
  { fecha: 18, home: "Magos", away: "Dealers", gh: null, ga: null },
  { fecha: 18, home: "Caranchos", away: "Kaiser", gh: null, ga: null },
  { fecha: 18, home: "Golosos", away: "Aston Birra", gh: null, ga: null },
  // Fecha 19 - 08/07
  { fecha: 19, home: "Magos", away: "Aston Birra", gh: null, ga: null },
  { fecha: 19, home: "Caranchos", away: "Dealers", gh: null, ga: null },
  { fecha: 19, home: "Golosos", away: "Kaiser", gh: null, ga: null },
  // Fecha 20 - 15/07
  { fecha: 20, home: "Magos", away: "Kaiser", gh: null, ga: null },
  { fecha: 20, home: "Caranchos", away: "Golosos", gh: null, ga: null },
  { fecha: 20, home: "Dealers", away: "Aston Birra", gh: null, ga: null },
]

// Limpiar partidos anteriores
db.exec("DELETE FROM partidos")

// Insertar todos los partidos
const insert = db.prepare(`
  INSERT INTO partidos (fecha, equipo_home, equipo_away, goles_home, goles_away)
  VALUES (?, ?, ?, ?, ?)
`)

fixture.forEach(p => {
  insert.run(p.fecha, p.home, p.away, p.gh, p.ga)
})

console.log(`✅ ${fixture.length} partidos cargados en la base de datos`)