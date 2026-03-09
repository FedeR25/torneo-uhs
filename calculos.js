function calcularTabla(partidos) {
  const equipos = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"]
  const tabla = {}

  equipos.forEach(e => {
    tabla[e] = { equipo: e, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, df: 0, pts: 0 }
  })

  partidos.forEach(p => {
    const gH = parseInt(p.goles_home)
    const gA = parseInt(p.goles_away)
    const home = p.equipo_home
    const away = p.equipo_away

    if (tabla[home] && tabla[away]) {
      tabla[home].pj++; tabla[away].pj++
      tabla[home].gf += gH; tabla[home].gc += gA
      tabla[away].gf += gA; tabla[away].gc += gH

      if (gH > gA) {
        tabla[home].pg++; tabla[home].pts += 3; tabla[away].pp++
      } else if (gH < gA) {
        tabla[away].pg++; tabla[away].pts += 3; tabla[home].pp++
      } else {
        tabla[home].pe++; tabla[home].pts++
        tabla[away].pe++; tabla[away].pts++
      }
      tabla[home].df = tabla[home].gf - tabla[home].gc
      tabla[away].df = tabla[away].gf - tabla[away].gc
    }
  })

  return Object.values(tabla).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    return b.df - a.df
  })
}

module.exports = { calcularTabla }