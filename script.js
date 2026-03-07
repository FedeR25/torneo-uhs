let partidoSeleccionado = null;

async function init() {
    await cargarTabla();
    await cargarFixture();
}

async function cargarTabla() {
    const res = await fetch("/tabla");
    const data = await res.json();
    const tbody = document.querySelector("#tabla-posiciones tbody");
    tbody.innerHTML = data.map((t, i) => `
        <tr>
            <td>${i+1}</td>
            <td class="equipo-nombre">${t.equipo}</td>
            <td>${t.pj}</td><td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td>
            <td>${t.gf}</td><td>${t.gc}</td><td>${t.df}</td>
            <td><strong>${t.pts}</strong></td>
        </tr>
    `).join("");
}

async function cargarFixture() {
    const res = await fetch("/partidos");
    const partidos = await res.json();
    const container = document.getElementById("fixture-container");
    const fechas = [...new Set(partidos.map(p => p.fecha))].sort((a,b) => a-b);

    container.innerHTML = fechas.map(f => `
        <div class="fecha-grupo">
            <h3>Fecha ${f}</h3>
            ${partidos.filter(p => p.fecha === f).map(p => `
                <div class="partido-card" onclick='abrirModal(${JSON.stringify(p)})'>
                    <span>${p.equipo_home}</span>
                    <div class="resultado-badge">${p.goles_home !== null ? p.goles_home + ' - ' + p.goles_away : 'vs'}</div>
                    <span>${p.equipo_away}</span>
                </div>
            `).join("")}
        </div>
    `).join("");
}

function abrirModal(p) {
    partidoSeleccionado = p;
    document.getElementById("modal-titulo").innerText = `${p.equipo_home} vs ${p.equipo_away}`;
    document.getElementById("input-home").value = p.goles_home ?? "";
    document.getElementById("input-away").value = p.goles_away ?? "";
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal() { document.getElementById("modal").style.display = "none"; }

async function guardarResultado() {
    const gh = document.getElementById("input-home").value;
    const ga = document.getElementById("input-away").value;
    const pass = prompt("Clave de Capitán:");
    if (!pass) return;

    const res = await fetch("/resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fecha: partidoSeleccionado.fecha,
            equipo_home: partidoSeleccionado.equipo_home,
            equipo_away: partidoSeleccionado.equipo_away,
            goles_home: parseInt(gh),
            goles_away: parseInt(ga),
            password: pass
        })
    });

    if (res.ok) { alert("¡Guardado!"); location.reload(); }
    else { alert("Error: Clave incorrecta"); }
}

function showTab(tabId) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    document.getElementById('tab-' + tabId).classList.add('active');
}

init();