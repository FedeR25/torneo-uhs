// Variables globales para manejar el estado de la app
let partidosData = [];
let partidoSeleccionado = null;

// 1. Al cargar la página, inicializamos todo
document.addEventListener("DOMContentLoaded", () => {
    init();
});

async function init() {
    await cargarTabla();
    await cargarFixture();
}

// 2. Cargar la Tabla de Posiciones desde el servidor
async function cargarTabla() {
    try {
        const res = await fetch("/tabla");
        const data = await res.json();
        const tbody = document.querySelector("#tabla-posiciones tbody");
        
        if (!tbody) return;
        tbody.innerHTML = "";

        data.forEach((equipo, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td class="equipo-nombre" onclick="verEquipo('${equipo.equipo}')" style="cursor:pointer; color: #3498db;">
                    ${equipo.equipo}
                </td>
                <td>${equipo.pj}</td>
                <td>${equipo.pg}</td>
                <td>${equipo.pe}</td>
                <td>${equipo.pp}</td>
                <td>${equipo.gf}</td>
                <td>${equipo.gc}</td>
                <td>${equipo.df}</td>
                <td><strong>${equipo.pts}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error al cargar tabla:", err);
    }
}

// 3. Cargar el Fixture desde el servidor
async function cargarFixture() {
    try {
        const res = await fetch("/partidos");
        partidosData = await res.json();
        const container = document.getElementById("fixture-container");
        
        if (!container) return;
        container.innerHTML = "";

        // Agrupamos los partidos por número de fecha
        const fechas = [...new Set(partidosData.map(p => p.fecha))].sort((a, b) => a - b);

        fechas.forEach(f => {
            const divFecha = document.createElement("div");
            divFecha.className = "fecha-grupo";
            divFecha.innerHTML = `<h3>Fecha ${f}</h3>`;

            const partidosDeFecha = partidosData.filter(p => p.fecha === f);
            
            partidosDeFecha.forEach(p => {
                const tieneResultado = p.goles_home !== null;
                const divPartido = document.createElement("div");
                divPartido.className = "partido-card";
                
                // Pasamos el objeto partido completo a la función abrirModal
                divPartido.onclick = () => abrirModal(p);
                
                divPartido.innerHTML = `
                    <div class="partido-info">
                        <span>${p.equipo_home}</span>
                        <span class="resultado-badge ${tieneResultado ? 'con-goles' : ''}">
                            ${tieneResultado ? p.goles_home + " - " + p.goles_away : "vs"}
                        </span>
                        <span>${p.equipo_away}</span>
                    </div>
                `;
                divFecha.appendChild(divPartido);
            });
            container.appendChild(divFecha);
        });
    } catch (err) {
        console.error("Error al cargar fixture:", err);
    }
}

// 4. Funciones del Modal de Carga de Goles
function abrirModal(partido) {
    partidoSeleccionado = partido;
    const modal = document.getElementById("modal");
    
    document.getElementById("modal-titulo").innerText = `${partido.equipo_home} vs ${partido.equipo_away}`;
    document.getElementById("input-home").value = partido.goles_home !== null ? partido.goles_home : "";
    document.getElementById("input-away").value = partido.goles_away !== null ? partido.goles_away : "";
    
    modal.style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
    partidoSeleccionado = null;
}

// 5. GUARDAR RESULTADO (Envío al Servidor)
async function guardarResultado() {
    const gh = document.getElementById("input-home").value;
    const ga = document.getElementById("input-away").value;

    if (gh === "" || ga === "") {
        alert("Por favor, ingresá los goles de ambos equipos.");
        return;
    }

    const password = prompt("Ingresá la Clave de Capitán para confirmar:");
    if (!password) return;

    try {
        const response = await fetch("/resultado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fecha: parseInt(partidoSeleccionado.fecha),
                equipo_home: partidoSeleccionado.equipo_home,
                equipo_away: partidoSeleccionado.equipo_away,
                goles_home: parseInt(gh),
                goles_away: parseInt(ga),
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ ¡Resultado guardado correctamente!");
            cerrarModal();
            // Recargamos los datos sin refrescar toda la página para mayor fluidez
            await init();
        } else {
            alert("❌ Error: " + (data.error || "No se pudo guardar el resultado"));
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("❌ Error de comunicación con el servidor. Revisá tu conexión.");
    }
}

// 6. Navegación de pestañas (Tabs)
function showTab(tabId) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    const seccionActiva = document.getElementById(tabId);
    if (seccionActiva) seccionActiva.style.display = 'block';
    
    const botonActivo = document.getElementById('tab-' + tabId);
    if (botonActivo) botonActivo.classList.add('active');
}

// 7. Modal de detalles por equipo
async function verEquipo(nombreEquipo) {
    const modal = document.getElementById('modal-equipo');
    const titulo = document.getElementById('modal-equipo-titulo');
    const container = document.getElementById('modal-equipo-partidos');

    titulo.innerText = `Partidos de ${nombreEquipo}`;
    
    // Filtramos los partidos del equipo seleccionado
    const misPartidos = partidosData.filter(p => 
        p.equipo_home === nombreEquipo || p.equipo_away === nombreEquipo
    );

    container.innerHTML = misPartidos.map(p => `
        <div class="partido-mini">
            <span>F${p.fecha}: ${p.equipo_home} ${p.goles_home ?? ''} - ${p.goles_away ?? ''} ${p.equipo_away}</span>
        </div>
    `).join('');

    modal.style.display = 'flex';
}

function cerrarModalEquipo() {
    document.getElementById('modal-equipo').style.display = 'none';
}