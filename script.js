async function cargarPartidos() {
  const res = await fetch("/partidos")
  const partidos = await res.json()
  return partidos
}

function calcularTabla(partidos) {
  const tabla = {}
  const equipos = ["Dealers", "Aston Birra", "Kaiser", "Caranchos", "Magos", "Golosos"]
  
  equipos.forEach(e => {
    tabla[e] = { pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 }
  })

  partidos.forEach(p => {
    if (p.goles_home === null) return
    const h = tabla[p.equipo_home]
    const a = tabla[p.equipo_away]
    h.pj++; a.pj++
    h.gf += p.goles_home; h.gc += p.goles_away
    a.gf += p.goles_away; a.gc += p.goles_home
    if (p.goles_home > p.goles_away) { h.pg++; h.pts+=3; a.pp++ }
    else if (p.goles_home < p.goles_away) { a.pg++; a.pts+=3; h.pp++ }
    else { h.pe++; h.pts++; a.pe++; a.pts++ }
  })

  return Object.entries(tabla)
    .map(([nombre, s]) => ({ nombre, ...s }))
    .sort((a, b) => b.pts - a.pts || (b.gf-b.gc) - (a.gf-a.gc))
}

function renderTabla(partidos) {
  const tabla = calcularTabla(partidos)
  const tbody = document.querySelector("#tabla-posiciones tbody")
  tbody.innerHTML = tabla.map((t, i) => `
    <tr>
      <td>${i+1}</td>
      <td onclick="abrirModalEquipo('${t.nombre}')" style="cursor:pointer;">${t.nombre}</td>
      <td>${t.pj}</td><td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td>
      <td>${t.gf}</td><td>${t.gc}</td>
      <td>${t.gf - t.gc}</td>
      <td><strong>${t.pts}</strong></td>
    </tr>
  `).join("")
}

function renderFixture(partidos) {
  const container = document.getElementById("fixture-container")
  const fechas = {}
  partidos.forEach(p => {
    if (!fechas[p.fecha]) fechas[p.fecha] = []
    fechas[p.fecha].push(p)
  })

  container.innerHTML = Object.entries(fechas).map(([fecha, ps]) => `
    <div class="fecha">
      <h3>Fecha ${fecha}</h3>
      ${ps.map(p => `
        <div class="partido" onclick="abrirModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
          <span>${p.equipo_home}</span>
          <span class="score">${p.goles_home !== null ? p.goles_home + ' - ' + p.goles_away : 'vs'}</span>
          <span>${p.equipo_away}</span>
        </div>
      `).join("")}
    </div>
  `).join("")
}

function abrirModal(partido) {
  const modal = document.getElementById("modal")
  document.getElementById("modal-titulo").textContent = `${partido.equipo_home} vs ${partido.equipo_away}`
  document.getElementById("input-home").value = partido.goles_home !== null ? partido.goles_home : ""
  document.getElementById("input-away").value = partido.goles_away !== null ? partido.goles_away : ""
  modal.dataset.home = partido.equipo_home
  modal.dataset.away = partido.equipo_away
  modal.dataset.fecha = partido.fecha
  modal.style.display = "flex"
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none"
}

// Buscá la función que se encarga de guardar y dejala así:
async function guardarGoles(fecha, equipo_home, equipo_away, goles_home, goles_away) {
    // 1. Pedir la clave al usuario
    const password = prompt("Ingresá la Clave de Capitán para confirmar:");
    if (!password) return; // Si cancela, no hace nada

    const response = await fetch("/resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fecha,
            equipo_home,
            equipo_away,
            goles_home,
            goles_away,
            password // <--- Esto es lo que Render está esperando ahora
        })
    });

    if (response.ok) {
        alert("✅ ¡Resultado guardado!");
        location.reload();
    } else {
        const errorData = await response.json();
        alert("❌ Error: " + errorData.error);
    }
}

function showTab(nombre) {
  document.querySelectorAll(".seccion").forEach(s => s.style.display = "none")
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
  document.getElementById(nombre).style.display = "block"
  event.target.classList.add("active")
}
function abrirModalEquipo(nombre) {
  cargarPartidos().then(partidos => {
    const jugados = partidos.filter(p => 
      (p.equipo_home === nombre || p.equipo_away === nombre) && p.goles_home !== null
    )
    document.getElementById("modal-equipo-titulo").textContent = nombre
    document.getElementById("modal-equipo-partidos").innerHTML = jugados.length === 0
      ? "<p style='text-align:center;color:#aaa'>Sin partidos jugados todavía</p>"
      : jugados.map(p => `
          <div class="partido-fila">
            <span>${p.equipo_home}</span>
            <span class="score-fila">${p.goles_home} - ${p.goles_away}</span>
            <span>${p.equipo_away}</span>
          </div>
        `).join("")
    document.getElementById("modal-equipo").classList.add("abierto")
  })
}

function cerrarModalEquipo() {
  document.getElementById("modal-equipo").classList.remove("abierto")
}
async function init() {
  const partidos = await cargarPartidos()
  renderTabla(partidos)
  renderFixture(partidos)
}

init()