const express = require("express");
const app = express();
const { pool, inicializarTablas } = require("./database");

app.use(express.json());
app.use(express.static("."));

const equiposList = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"];

async function log(accion, detalle) {
  try {
    await pool.query(
      "INSERT INTO logs (accion, detalle) VALUES ($1, $2)",
      [accion, detalle]
    )
  } catch (err) {
    console.error("Error guardando log:", err)
  }
}

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

app.get("/equipos", (req, res) => {
  res.json(equiposList);
});

app.get("/partidos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM partidos ORDER BY fecha ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener partidos:", err);
    res.status(500).json({ error: "No se pudieron cargar los partidos" });
  }
});

app.post("/resultado", async (req, res) => {
  const { fecha, equipo_home, equipo_away, goles_home, goles_away, password } = req.body;

  console.log("--- Intento de carga ---");
  console.log("Recibido:", password);
  console.log("Esperado (Env):", process.env.CAPTAIN_PASSWORD);

  if (!password || password !== process.env.CAPTAIN_PASSWORD) {
    await log("CLAVE_INCORRECTA", `Intento fallido en /resultado`);
    return res.status(401).json({ error: "Clave incorrecta" });
  }

  try {
    const result = await pool.query(
      `UPDATE partidos 
       SET goles_home = $1, goles_away = $2 
       WHERE fecha = $3 
       AND LOWER(TRIM(equipo_home)) = LOWER(TRIM($4)) 
       AND LOWER(TRIM(equipo_away)) = LOWER(TRIM($5))`,
      [goles_home, goles_away, parseInt(fecha), equipo_home, equipo_away]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No se encontró el partido en la base de datos" });
    }

    await log("RESULTADO_CARGADO", `Fecha ${fecha}: ${equipo_home} ${goles_home} - ${goles_away} ${equipo_away}`);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error en DB:", err);
    res.status(500).json({ error: "Error interno de la base de datos" });
  }
});

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
        tabla[home].pj++; tabla[away].pj++;
        tabla[home].gf += gH; tabla[home].gc += gA;
        tabla[away].gf += gA; tabla[away].gc += gH;

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
    console.error("Error al generar tabla:", err);
    res.status(500).json({ error: "Error al calcular tabla" });
  }
});

app.get("/jugadores/:equipo", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM jugadores WHERE equipo = $1 ORDER BY nombre ASC",
      [req.params.equipo]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/jugadores", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM jugadores ORDER BY equipo ASC, nombre ASC"
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/jugadores", async (req, res) => {
  const { equipo, nombre, password } = req.body
  if (password !== process.env.CAPTAIN_PASSWORD) {
    await log("CLAVE_INCORRECTA", `Intento fallido en /jugadores`)
    return res.status(401).json({ error: "Clave incorrecta" })
  }
  try {
    await pool.query(
      "INSERT INTO jugadores (equipo, nombre) VALUES ($1, $2)",
      [equipo, nombre]
    )
    await log("JUGADOR_AGREGADO", `${nombre} (${equipo})`)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete("/jugadores/:id", async (req, res) => {
  const { password } = req.body
  if (password !== process.env.ADMIN_PASSWORD) {
    await log("CLAVE_INCORRECTA", `Intento fallido en /jugadores DELETE`)
    return res.status(401).json({ error: "Clave incorrecta" })
  }
  try {
    await pool.query("DELETE FROM jugadores WHERE id = $1", [req.params.id])
    await log("JUGADOR_ELIMINADO", `ID: ${req.params.id}`)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/goles", async (req, res) => {
  const { partido_id, goles } = req.body
  try {
    await pool.query("DELETE FROM goles WHERE partido_id = $1", [partido_id])
    for (const g of goles) {
      if (g.cantidad > 0) {
        await pool.query(
          "INSERT INTO goles (partido_id, jugador_id, cantidad) VALUES ($1, $2, $3)",
          [partido_id, g.jugador_id, g.cantidad]
        )
      }
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/goleadores", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.nombre, j.equipo, SUM(g.cantidad) as total
      FROM goles g
      JOIN jugadores j ON j.id = g.jugador_id
      GROUP BY j.nombre, j.equipo
      ORDER BY total DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/proxima-fecha", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM partidos 
      WHERE goles_home IS NULL 
      ORDER BY fecha ASC 
      LIMIT 3
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/admin/logs", async (req, res) => {
  const { password } = req.query
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Clave incorrecta" })
  }
  try {
    const result = await pool.query(
      "SELECT * FROM logs ORDER BY fecha_hora DESC LIMIT 100"
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/goleadores/:equipo", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.nombre, SUM(g.cantidad) as total
      FROM goles g
      JOIN jugadores j ON j.id = g.jugador_id
      WHERE j.equipo = $1
      GROUP BY j.nombre
      ORDER BY total DESC
    `, [req.params.equipo])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

startServer();