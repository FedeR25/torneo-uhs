let partidoSeleccionado = null;

async function init() {
    await cargarTabla();
    await cargarFixture();
}

// 1. Cargar la Tabla desde el servidor
async function cargarTabla() {
    try {
        const res = await fetch("/tabla");
        const data = await res.json();
        const tbody = document.querySelector("#tabla-posiciones tbody");
        if (!tbody) return;
        
        tbody.innerHTML = data.map((t, i) => `
            <tr>
                <td>${i+1}</td>
                <td class="equipo-nombre">${t.equipo}</td>
                <td>${t.pj}</td><td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td>
                <td>${t.gf}</td><td>${t.gc}</td><td>${t.df}</td>
                <td><strong>${t.pts}</strong></td>
            </tr>
        `).join("");
    } catch (err) {
        console.error("Error cargando tabla:", err);
    }
}

// 2. Cargar el Fixture
async function cargarFixture() {
    try {
        const res = await fetch("/partidos");
        const partidos = await res.json();
        const container = document.getElementById("fixture-container");
        if (!container) return;
        
        const fechas = [...new Set(partidos.map(p => p.fecha))].sort((a,b) => a-b);

        container.innerHTML = fechas.map(f => `
            <div class="fecha-grupo">
                <h3>Fecha ${f}</h3>
                ${partidos.filter(p => p.fecha === f).map(p => `
                    <div class="partido-card" onclick='abrirModal(${JSON.stringify(p)})'>
                        <span>${p.equipo_home}</span>
                        <div class="resultado-badge ${p.goles_home !== null ? 'con-goles' : ''}">
                            ${p.goles_home !== null ? p.goles_home + ' - ' + p.goles_away : 'vs'}
                        </div>
                        <span>${p.equipo_away}</span>
                    </div>
                `).join("")}
            </div>
        `).join("");
    } catch (err) {
        console.error("Error cargando fixture:", err);
    }
}

// 3. Manejo del Modal
function abrirModal(p) {
    partidoSeleccionado = p;
    document.getElementById("modal-titulo").innerText = `${p.equipo_home} vs ${p.equipo_away}`;
    // Si ya tiene goles, los mostramos; si no, dejamos vacío
    document.getElementById("input-home").value = p.goles_home !== null ? p.goles_home : "";
    document.getElementById("input-away").value = p.goles_away !== null ? p.goles_away : "";
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal() { 
    document.getElementById("modal").style.display = "none"; 
}

// 4. GUARDAR RESULTADO (Corregido para evitar NaN)
async function guardarResultado() {
    const valHome = document.getElementById("input-home").value;
    const valAway = document.getElementById("input-away").value;

    // Validación: Si están vacíos, no enviamos nada
    if (valHome === "" || valAway === "") {
        alert("Por favor, ingresá los goles de ambos equipos.");
        return;
    }

    const gh = parseInt(valHome);
    const ga = parseInt(valAway);

    const pass = prompt("Clave de Capitán (UHS2026):");
    if (!pass) return;

    try {
        const res = await fetch("/resultado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fecha: parseInt(partidoSeleccionado.fecha),
                equipo_home: partidoSeleccionado.equipo_home,
                equipo_away: partidoSeleccionado.equipo_away,
                goles_home: gh,
                goles_away: ga,
                password: pass
            })
        });

        const data = await res.json();

        if (res.ok) { 
            alert("✅ ¡Guardado con éxito!"); 
            cerrarModal();
            location.reload(); 
        } else { 
            alert("❌ Error: " + (data.error || "Clave incorrecta")); 
        }
    } catch (error) {
        console.error("Error en fetch:", error);
        alert("❌ Error de conexión