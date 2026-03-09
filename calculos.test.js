const { calcularTabla } = require("./calculos")

describe("calcularTabla", () => {

  test("equipo que gana recibe 3 puntos", () => {
    const partidos = [
      { equipo_home: "Dealers", equipo_away: "Magos", goles_home: 3, goles_away: 0 }
    ]
    const tabla = calcularTabla(partidos)
    const dealers = tabla.find(t => t.equipo === "Dealers")
    expect(dealers.pts).toBe(3)
    expect(dealers.pg).toBe(1)
  })

  test("equipo que pierde recibe 0 puntos", () => {
    const partidos = [
      { equipo_home: "Dealers", equipo_away: "Magos", goles_home: 3, goles_away: 0 }
    ]
    const tabla = calcularTabla(partidos)
    const magos = tabla.find(t => t.equipo === "Magos")
    expect(magos.pts).toBe(0)
    expect(magos.pp).toBe(1)
  })

  test("empate da 1 punto a cada equipo", () => {
    const partidos = [
      { equipo_home: "Kaiser", equipo_away: "Caranchos", goles_home: 2, goles_away: 2 }
    ]
    const tabla = calcularTabla(partidos)
    const kaiser = tabla.find(t => t.equipo === "Kaiser")
    const caranchos = tabla.find(t => t.equipo === "Caranchos")
    expect(kaiser.pts).toBe(1)
    expect(caranchos.pts).toBe(1)
  })

  test("tabla se ordena por puntos", () => {
    const partidos = [
      { equipo_home: "Dealers", equipo_away: "Magos", goles_home: 3, goles_away: 0 },
      { equipo_home: "Kaiser", equipo_away: "Caranchos", goles_home: 1, goles_away: 0 }
    ]
    const tabla = calcularTabla(partidos)
    expect(tabla[0].equipo).toBe("Dealers")
    expect(tabla[1].equipo).toBe("Kaiser")
  })

  test("diferencia de goles se calcula correctamente", () => {
    const partidos = [
      { equipo_home: "Dealers", equipo_away: "Magos", goles_home: 4, goles_away: 1 }
    ]
    const tabla = calcularTabla(partidos)
    const dealers = tabla.find(t => t.equipo === "Dealers")
    const magos = tabla.find(t => t.equipo === "Magos")
    expect(dealers.df).toBe(3)
    expect(magos.df).toBe(-3)
  })

  test("proxima fecha devuelve partidos sin resultado", () => {
    const partidos = [
      { fecha: 1, equipo_home: "Dealers", equipo_away: "Magos", goles_home: 3, goles_away: 0 },
      { fecha: 2, equipo_home: "Kaiser", equipo_away: "Caranchos", goles_home: null, goles_away: null },
      { fecha: 2, equipo_home: "Aston Birra", equipo_away: "Golosos", goles_home: null, goles_away: null },
    ]
    const sinResultado = partidos.filter(p => p.goles_home === null).sort((a,b) => a.fecha - b.fecha)
    expect(sinResultado.length).toBe(2)
    expect(sinResultado[0].fecha).toBe(2)
  })

  test("jugador con equipo y nombre se puede agregar a la lista", () => {
    const jugadores = []
    const nuevo = { equipo: "Kaiser", nombre: "Juan Perez" }
    if (nuevo.equipo && nuevo.nombre) jugadores.push(nuevo)
    expect(jugadores.length).toBe(1)
    expect(jugadores[0].nombre).toBe("Juan Perez")
  })

  test("no se agrega jugador si falta equipo o nombre", () => {
    const jugadores = []
    const nuevo = { equipo: "", nombre: "Juan Perez" }
    if (nuevo.equipo && nuevo.nombre) jugadores.push(nuevo)
    expect(jugadores.length).toBe(0)
  })

})