let partidoSeleccionado = null;

function getFechaReal(numeroFecha) {
    const fecha1 = new Date(2026, 2, 4);
    const fecha = new Date(fecha1);
    fecha.setDate(fecha1.getDate() + (numeroFecha - 1) * 7);
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
}

async function init() {
    await cargarTabla();
    await cargarFixture();
}

async function cargarTabla() {
    try {
        const res = await fetch("/tabla");
        const data = await res.json();
        const tbody = document.querySelector("#tabla-posiciones tbody");
        if (!tbody) return;
        
        tbody.innerHTML = data.map((t, i) => `
            <tr>
                <td>${i+1}</td>
                <td class="equipo-nombre" onclick="abrirModalEquipo('${t.equipo}')">${t.equipo}</td>
                <td>${t.pj}</td><td>${t.pg}</td><td>${t.pe}</td><td>${t.pp}</td>
                <td>${t.gf}</td><td>${t.gc}</td><td>${t.df}</td>
                <td><strong>${t.pts}</strong></td>
            </tr>
        `).join("");
    } catch (err) {
        console.error("Error cargando tabla:", err);
    }
}

async function cargarFixture() {
    try {
        const res = await fetch("/partidos");
        const partidos = await res.json();
        const container = document.getElementById("fixture-container");
        if (!container) return;
        
        const fechas = [...new Set(partidos.map(p => p.fecha))].sort((a,b) => a-b);

        container.innerHTML = fechas.map(f => `
            <div class="fecha-grupo">
                <h3>Fecha ${f} — ${getFechaReal(f)}</h3>
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

async function cargarGoleadores() {
    try {
        const res = await fetch("/goleadores");
        const data = await res.json();
        const tbody = document.querySelector("#tabla-goleadores tbody");
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;color:#aaa;padding:20px'>Sin goles registrados todavía</td></tr>";
            return;
        }

        tbody.innerHTML = data.map((g, i) => `
            <tr>
                <td>${i+1}</td>
                <td>${g.nombre}</td>
                <td>${g.equipo}</td>
                <td><strong>${g.total}</strong></td>
            </tr>
        `).join("");
    } catch (err) {
        console.error("Error cargando goleadores:", err);
    }
}

async function abrirModalEquipo(nombre) {
    try {
        const [resPartidos, resGoleadores] = await Promise.all([
            fetch("/partidos"),
            fetch(`/goleadores/${encodeURIComponent(nombre)}`)
        ])
        const partidos = await resPartidos.json()
        const goleadores = await resGoleadores.json()

        const jugados = partidos.filter(p =>
            (p.equipo_home === nombre || p.equipo_away === nombre) && p.goles_home !== null
        )
        const proximos = partidos.filter(p =>
            (p.equipo_home === nombre || p.equipo_away === nombre) && p.goles_home === null
        )

        document.getElementById("modal-equipo-titulo").textContent = nombre

        document.getElementById("modal-equipo-partidos").innerHTML = `
            ${goleadores.length > 0 ? `
                <div class="modal-seccion">
                    <h4>⚽ Goleadores</h4>
                    ${goleadores.map(g => `
                        <div class="goleador-equipo-fila">
                            <span>${g.nombre}</span>
                            <span class="goles-badge">${g.total}</span>
                        </div>
                    `).join("")}
                </div>
            ` : ""}

            <div class="modal-seccion">
                <h4>📅 Partidos jugados</h4>
                ${jugados.length === 0
                    ? "<p style='text-align:center;color:#aaa;padding:10px'>Sin partidos jugados todavía</p>"
                    : jugados.map(p => `
                        <div class="partido-fila">
                            <span>${p.equipo_home}</span>
                            <span class="score-fila">${p.goles_home} - ${p.goles_away}</span>
                            <span>${p.equipo_away}</span>
                        </div>
                    `).join("")
                }
            </div>

            ${proximos.length > 0 ? `
                <div class="modal-seccion">
                    <h4>🗓️ Próximos partidos</h4>
                    ${proximos.slice(0, 3).map(p => `
                        <div class="partido-fila">
                            <span>${p.equipo_home}</span>
                            <span class="score-fila">${getFechaReal(p.fecha)}</span>
                            <span>${p.equipo_away}</span>
                        </div>
                    `).join("")}
                </div>
            ` : ""}
        `

        document.getElementById("modal-equipo").classList.add("abierto")
    } catch (err) {
        console.error("Error cargando estadísticas del equipo:", err)
    }
}

function cerrarModalEquipo() {
    document.getElementById("modal-equipo").classList.remove("abierto");
}

async function abrirModal(p) {
    partidoSeleccionado = p;
    document.getElementById("modal-titulo").innerText = `${p.equipo_home} vs ${p.equipo_away}`;
    document.getElementById("input-home").value = p.goles_home !== null ? p.goles_home : "";
    document.getElementById("input-away").value = p.goles_away !== null ? p.goles_away : "";

    document.getElementById("modal").style.display = "flex";

    await cargarGoleadoresModal(p.equipo_home, "goleadores-home")
    await cargarGoleadoresModal(p.equipo_away, "goleadores-away")
}

async function cargarGoleadoresModal(equipo, contenedorId) {
    const contenedor = document.getElementById(contenedorId)
    try {
        const res = await fetch(`/jugadores/${encodeURIComponent(equipo)}`)
        const jugadores = await res.json()

        if (jugadores.length === 0) {
            contenedor.innerHTML = `<p style='color:#aaa;font-size:0.8rem;margin:5px 0'>Sin jugadores cargados para ${equipo}</p>`
            return
        }

        contenedor.innerHTML = `
            <div class="goleadores-seccion">
                <h4>⚽ ${equipo}</h4>
                ${jugadores.map(j => `
                    <div class="goleador-fila">
                        <span>${j.nombre}</span>
                        <input class="goleador-input" type="number" min="0" value="0" 
                               id="gol-${j.id}" data-jugador="${j.id}">
                    </div>
                `).join("")}
            </div>
        `
    } catch (err) {
        contenedor.innerHTML = ""
    }
}

function cerrarModal() { 
    document.getElementById("modal").style.display = "none"; 
}

async function guardarResultado() {
    const valHome = document.getElementById("input-home").value;
    const valAway = document.getElementById("input-away").value;

    const gh = valHome === "" ? null : parseInt(valHome);
    const ga = valAway === "" ? null : parseInt(valAway);

    const pass = prompt("Clave de Capitán:");
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
            const inputs = document.querySelectorAll(".goleador-input")
            const goles = []
            inputs.forEach(input => {
                const cantidad = parseInt(input.value) || 0
                if (cantidad > 0) {
                    goles.push({ jugador_id: parseInt(input.dataset.jugador), cantidad })
                }
            })

            if (goles.length > 0) {
                await fetch("/goles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ partido_id: partidoSeleccionado.id, goles })
                })
            }

            alert("✅ ¡Guardado con éxito!"); 
            cerrarModal();
            location.reload(); 
        } else { 
            alert("❌ Error: " + (data.error || "Clave incorrecta")); 
        }
    } catch (error) {
        console.error("Error en fetch:", error);
        alert("❌ Error de conexión con el servidor.");
    }
}

function showTab(tabId) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    document.getElementById('tab-' + tabId).classList.add('active');
    if (tabId === 'goleadores') cargarGoleadores();
    if (tabId === 'proxima') cargarProximaFecha();
    if (tabId === 'jugadores') cargarJugadores();
}

async function cargarProximaFecha() {
    try {
        const res = await fetch("/proxima-fecha");
        const partidos = await res.json();
        const container = document.getElementById("proxima-container");
        if (!container) return;

        if (partidos.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:#aaa;padding:20px'>¡Todos los partidos jugados!</p>";
            return;
        }

        const fecha = partidos[0].fecha;
        container.innerHTML = `
            <div class="fecha-grupo">
                <h3>Fecha ${fecha} — ${getFechaReal(fecha)}</h3>
                ${partidos.map(p => `
                    <div class="partido-card" onclick='abrirModal(${JSON.stringify(p)})'>
                        <span>${p.equipo_home}</span>
                        <div class="resultado-badge">vs</div>
                        <span>${p.equipo_away}</span>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (err) {
        console.error("Error cargando próxima fecha:", err);
    }
}

async function cargarJugadores() {
    try {
        const res = await fetch("/jugadores");
        const jugadores = await res.json();
        const container = document.getElementById("lista-jugadores");
        if (!container) return;

        if (jugadores.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:#aaa;padding:20px'>Sin jugadores cargados todavía</p>";
            return;
        }

        const porEquipo = {};
        jugadores.forEach(j => {
            if (!porEquipo[j.equipo]) porEquipo[j.equipo] = [];
            porEquipo[j.equipo].push(j);
        });

        container.innerHTML = Object.entries(porEquipo).map(([equipo, jugadores]) => `
            <div class="equipo-jugadores">
                <h3>${equipo}</h3>
                ${jugadores.map(j => `
                    <div class="jugador-item">
                        <span>${j.nombre}</span>
                        <button class="btn-eliminar" onclick="eliminarJugador(${j.id})">Eliminar</button>
                    </div>
                `).join("")}
            </div>
        `).join("");
    } catch (err) {
        console.error("Error cargando jugadores:", err);
    }
}

async function agregarJugador() {
    const equipo = document.getElementById("select-equipo").value;
    const nombre = document.getElementById("input-nombre-jugador").value.trim();

    if (!equipo || !nombre) {
        alert("Seleccioná un equipo y escribí el nombre del jugador");
        return;
    }

    const pass = prompt("Clave de Capitán:");
    if (!pass) return;

    try {
        const res = await fetch("/jugadores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ equipo, nombre, password: pass })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById("input-nombre-jugador").value = "";
            await cargarJugadores();
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (err) {
        alert("❌ Error de conexión");
    }
}

async function eliminarJugador(id) {
    const pass = prompt("Clave Admin:");
    if (!pass) return;

    try {
        const res = await fetch(`/jugadores/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pass })
        });
        const data = await res.json();
        if (res.ok) {
            await cargarJugadores();
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (err) {
        alert("❌ Error de conexión");
    }
}

init();