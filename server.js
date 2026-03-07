const express = require("express");
const app = express();
const { pool, inicializarTablas } = require("./database");

app.use(express.json());
app.use(express.static("."));

const equiposList = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"];

// Función para arrancar la base de datos antes que las rutas
async function startServer() {
  try {
    await inicializarTablas();
    console.log("Estructura de base de datos verificada ✅");
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor UHS corriendo en el puerto ${PORT} 🚀`);
    });
  } catch (err) {
    console.error("Error fatal al iniciar el servidor:", err);
    process.exit(1);
  }
}

// 1. Obtener lista de equipos
app.get("/equipos", (req, res) => {
  res.json(equiposList);
});

// 2. Obtener fixture completo
app.get("/partidos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM partidos ORDER BY fecha ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener partidos:", err);
    res.status(500).json({ error: "No se pudieron cargar los partidos" });
  }
});

// 3. ACTUALIZAR RESULTADO (Con validación mejorada)
app.post("/resultado", async (req, res) => {
  const { fecha, equipo_home, equipo_away, goles_home, goles_away, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Clave incorrecta." });
  }

  try {
    // Usamos parseInt para asegurar que los goles y fecha sean números
    const result = await pool.query(
      `UPDATE partidos 
       SET goles_home = $1, goles_away = $2 
       WHERE fecha = $3 
       AND LOWER(TRIM(equipo_home)) = LOWER(TRIM($4)) 
       AND LOWER(TRIM(equipo_away)) = LOWER(TRIM($5))`,
      [parseInt(goles_home), parseInt(goles_away), parseInt(fecha), equipo_home, equipo_away]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No se encontró el partido exacto." });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Error en UPDATE:", err);
    res.status(500).json({ error: "Error al guardar en base de datos" });
  }
});

// 4. RUTA DE LA TABLA (Esta es la que te faltaba)
app.get("/tabla", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM partidos WHERE goles_home IS NOT NULL");
    const partidos = result.rows;

    let tabla = {};
    equiposList.forEach(e => {
      tabla[e] = { equipo: e, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, df: 0, pts: 0 };
    });

    partidos.forEach(p => {
      const gH = parseInt(p.goles_home);
      const gA = parseInt(p.goles_away);
      const home = p.equipo_home;
      const away = p.equipo_away;

      if (tabla[home] && tabla[away]) {
        tabla[home].pj++;
        tabla[away].pj++;
        tabla[home].gf += gH;
        tabla[home].gc += gA;
        tabla[away].gf += gA;
        tabla[away].gc += gH;

        if (gH > gA) {
          tabla[home].pg++; tabla[home].pts += 3;
          tabla[away].pp++;
        } else if (gH < gA) {
          tabla[away].pg++; tabla[away].pts += 3;
          tabla[home].pp++;
        } else {
          tabla[home].pe++; tabla[home].pts += 1;
          tabla[away].pe++; tabla[away].pts += 1;
        }
        tabla[home].df = tabla[home].gf - tabla[home].gc;
        tabla[away].df = tabla[away].gf - tabla[away].gc;
      }
    });

    const tablaOrdenada = Object.values(tabla).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return b.df - a.df;
    });

    res.json(tablaOrdenada);
  } catch (err) {
    console.error("Error en tabla:", err);
    res.status(500).json({ error: "Error al calcular tabla" });
  }
});

startServer();