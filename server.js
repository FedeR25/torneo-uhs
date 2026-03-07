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
  const { fecha, equipo_home, equipo_away, goles_home, goles_away, password } = req.body;

  // ESTA ES LA SEGURIDAD: Compara la clave que llega con la de Render
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Clave incorrecta. No tenés permiso para cargar goles." });
  }

  try {
    await pool.query(
  `UPDATE partidos 
   SET goles_home = $1, goles_away = $2 
   WHERE fecha = $3 
   AND LOWER(equipo_home) = LOWER($4) 
   AND LOWER(equipo_away) = LOWER($5)`,
  [goles_home, goles_away, fecha, equipo_home, equipo_away]
);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// Arrancamos todo
startServer();