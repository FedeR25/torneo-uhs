const express = require("express");
const app = express();
const { pool, inicializarTablas } = require("./database");

app.use(express.json());
app.use(express.static("."));

const equipos = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"];

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

// Rutas de la API
app.get("/equipos", (req, res) => {
  res.json(equipos);
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
  const { fecha, equipo_home, equipo_away, goles_home, goles_away } = req.body;
  try {
    await pool.query(
      `UPDATE partidos 
       SET goles_home = $1, goles_away = $2 
       WHERE fecha = $3 AND equipo_home = $4 AND equipo_away = $5`,
      [goles_home, goles_away, fecha, equipo_home, equipo_away]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al guardar resultado:", err);
    res.status(500).json({ error: "No se pudo guardar el resultado" });
  }
});

// Arrancamos todo
startServer();