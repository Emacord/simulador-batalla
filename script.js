// Estado y referencias
let DATA = null;            // Cargado desde data.json
let jugador = null;         // Se crea al elegir personaje
let enemigoBase = null;     // Inmutable (del JSON)
let enemigo = null;         // Instancia mutable por batalla
let batallaActiva = false;
let chart = null;

// Elementos del DOM
const personajesContainer = document.getElementById("personajesContainer");
const estadoCarga = document.getElementById("estadoCarga");
const seleccionPersonaje = document.getElementById("seleccionPersonaje");
const infoBatalla = document.getElementById("infoBatalla");
const nombrePersonaje = document.getElementById("nombrePersonaje");
const labelEnemigo = document.getElementById("labelEnemigo");

const vidaJugadorBarra = document.getElementById("vidaJugador");
const vidaEnemigoBarra = document.getElementById("vidaEnemigo");
const vidaJugadorTexto = document.getElementById("vidaJugadorTexto");
// span enemigo se re-renderiza, no retenemos referencia fija

const inputNombre = document.getElementById("inputNombre");
const selectDificultad = document.getElementById("selectDificultad");
const btnAtacar = document.getElementById("btnAtacar");
const btnReiniciar = document.getElementById("btnReiniciar");
const logCombate = document.getElementById("logCombate");
const listaHistorial = document.getElementById("historialBatallas");
const canvasChart = document.getElementById("chartHistorial");
const imgJugador = document.getElementById("imgJugador");
const imgEnemigo = document.getElementById("imgEnemigo");

// --- Utilidades ---
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const nowStr = () => (window.dayjs ? dayjs().format("YYYY-MM-DD HH:mm:ss") : new Date().toLocaleString());

// Helpers SweetAlert2 (con fallback)
const hasSwal = () => typeof window !== "undefined" && !!window.Swal;
const toast = (opts={}) => {
  if (!hasSwal()) return;
  const Toast = Swal.mixin({ toast:true, position:"top", showConfirmButton:false, timer:2200, timerProgressBar:true, background:"#1e1e1e", color:"#f0f0f0" });
  Toast.fire(opts);
}

// --- Daños ---
function calcularDanio(atacante) {
  const critico = Math.random() < atacante.probabilidadCritico;
  return { danio: critico ? atacante.danioCritico : atacante.danioBase, critico };
}

function aplicarDificultad(base, dificultad) {
  const factor = dificultad === "facil" ? 0.9 : dificultad === "dificil" ? 1.2 : 1.0;
  return clamp(Math.round(base * factor), 50, 200);
}

// --- Carga "remota" de datos (JSON) ---
async function cargarDatos() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("No se pudo cargar data.json");
    DATA = await res.json();
    enemigoBase = structuredClone(DATA.enemigo);
    renderPersonajes(DATA.personajes);
    estadoCarga.textContent = "Personajes cargados. Elegí uno para empezar.";
  } catch (err) {
    console.error(err);
    estadoCarga.textContent = "Error cargando datos. Reintenta.";
    if (hasSwal()) Swal.fire({title:"Error de carga", text:"No se pudo cargar data.json", icon:"error", background:"#1e1e1e", color:"#f0f0f0"});
  }
}

// --- Render dinámico de tarjetas de personajes ---
function renderPersonajes(personajes) {
  personajesContainer.innerHTML = "";
  personajes.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img || 'assets/personajes/default.png'}" alt="${p.nombre}" class="card-img" />
      <h4>${p.nombre}</h4>
      <p>Daño base: ${p.danioBase}</p>
      <p>Daño crítico: ${p.danioCritico}</p>
      <p>Prob. crítico: ${(p.probabilidadCritico * 100).toFixed(0)}%</p>
      <button data-personaje="${p.nombre}">Elegir</button>
    `;
    card.querySelector("button").addEventListener("click", () => seleccionarPersonaje(p));
    personajesContainer.appendChild(card);
  });
}

// --- Flujo de batalla ---
function seleccionarPersonaje(p) {
  const nombreJugador = (inputNombre.value && inputNombre.value.trim()) || p.nombre;
  const dificultad = selectDificultad.value;

// Confirmación con SweetAlert2 (o fallback directo)
const confirmStart = () => {
  jugador = {
    tipo: p.nombre,
    nombre: nombreJugador,
    vida: 100,
    danioBase: p.danioBase,
    danioCritico: p.danioCritico,
    probabilidadCritico: p.probabilidadCritico,
    img: p.img || ('assets/personajes/' + p.nombre.toLowerCase() + '.png')
  };
    enemigo = {
      ...structuredClone(enemigoBase),
      img: (DATA && DATA.enemigo && DATA.enemigo.img) || 'assets/personajes/default.png',
      vida: aplicarDificultad(enemigoBase.vida, dificultad),
    };
    iniciarBatalla(dificultad);
  };

  if (hasSwal()) {
    Swal.fire({
      title: '¿Usar este personaje?',
      html: `<b>${p.nombre}</b> en dificultad <b>${dificultad}</b>.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, jugar',
      cancelButtonText: 'Cancelar',
      background: '#1e1e1e',
      color: '#f0f0f0'
    }).then((r)=>{ if (r.isConfirmed) confirmStart(); });
  } else {
    confirmStart();
  }
}

function iniciarBatalla(dificultad) {
  batallaActiva = true;

  // Ocultar selección y limpiar tarjetas
  seleccionPersonaje.classList.add("hidden");
  personajesContainer.innerHTML = "";

  infoBatalla.classList.remove("hidden");

  nombrePersonaje.textContent = `Jugador: ${jugador.nombre} (${jugador.tipo})`;
  labelEnemigo.innerHTML = `${enemigo.nombre} (${dificultad[0].toUpperCase()+dificultad.slice(1)}): <span id="vidaEnemigoTexto">${enemigo.vida}</span>`;

  actualizarVidas();

  if (imgJugador) imgJugador.src = jugador.img || 'assets/personajes/default.png';
  if (imgEnemigo) imgEnemigo.src = (enemigo.img || (DATA.enemigo && DATA.enemigo.img)) || 'assets/personajes/default.png';

  logCombate.innerHTML = `<p>⚔️ ¡La batalla comenzó entre ${jugador.nombre} y el ${enemigo.nombre}!</p>`;
  btnAtacar.disabled = false;

  toast({ icon:'info', title:`Batalla iniciada` });
}

function agregarLog(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  logCombate.appendChild(p);
  logCombate.scrollTop = logCombate.scrollHeight;
}

function actualizarVidas() {
  vidaJugadorBarra.style.width = `${jugador.vida}%`;
  vidaJugadorTexto.textContent = jugador.vida;

  const vidaEnemigoPct = clamp(Math.round((enemigo.vida / enemigoBase.vida) * 100), 0, 100);
  vidaEnemigoBarra.style.width = `${vidaEnemigoPct}%`;

  const vidaEnemigoTextoEl = document.getElementById("vidaEnemigoTexto");
  if (vidaEnemigoTextoEl) vidaEnemigoTextoEl.textContent = enemigo.vida;
}

function turnoJugador() {
  const { danio, critico } = calcularDanio(jugador);
  enemigo.vida = clamp(enemigo.vida - danio, 0, 999);
  agregarLog(`🗡 ${jugador.nombre} hizo ${danio} de daño${critico ? " (CRÍTICO)" : ""} al ${enemigo.nombre}`);
}

function turnoEnemigo() {
  const { danio, critico } = calcularDanio(enemigo);
  jugador.vida = clamp(jugador.vida - danio, 0, 100);
  agregarLog(`🔥 El ${enemigo.nombre} hizo ${danio} de daño${critico ? " (CRÍTICO)" : ""} a ${jugador.nombre}`);
}

// Eventos
btnAtacar.addEventListener("click", () => {
  if (!batallaActiva) return;

  turnoJugador();
  actualizarVidas();

  if (imgJugador) imgJugador.src = jugador.img || 'assets/personajes/default.png';
  if (imgEnemigo) imgEnemigo.src = (enemigo.img || (DATA.enemigo && DATA.enemigo.img)) || 'assets/personajes/default.png';

  if (enemigo.vida <= 0) {
    agregarLog(`🏆 ¡${jugador.nombre} derrotó al ${enemigo.nombre}!`);
    guardarResultado("Ganó", jugador, enemigo);
    batallaActiva = false;
    btnAtacar.disabled = true;
    renderHistorial();

    if (hasSwal()) {
      Swal.fire({
        title: '¡Victoria!',
        text: `¡${jugador.nombre} derrotó al ${enemigo.nombre}!`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        background: '#1e1e1e',
        color: '#f0f0f0'
      });
    }
    return;
  }

  setTimeout(() => {
    turnoEnemigo();
    actualizarVidas();

    if (imgJugador) imgJugador.src = jugador.img || 'assets/personajes/default.png';
    if (imgEnemigo) imgEnemigo.src = (enemigo.img || (DATA.enemigo && DATA.enemigo.img)) || 'assets/personajes/default.png';
    if (jugador.vida <= 0) {
      agregarLog(`💀 ¡El ${enemigo.nombre} derrotó a ${jugador.nombre}!`);
      guardarResultado("Perdió", jugador, enemigo);
      batallaActiva = false;
      btnAtacar.disabled = true;
      renderHistorial();

      if (hasSwal()) {
        Swal.fire({
          title: 'Derrota...',
          text: `El ${enemigo.nombre} venció a ${jugador.nombre}.`,
          icon: 'error',
          confirmButtonText: 'Reintentar',
          background: '#1e1e1e',
          color: '#f0f0f0'
        });
      }
    }
  }, 500);
});

btnReiniciar.addEventListener("click", () => {
  if (hasSwal()) {
    Swal.fire({
      title:'Reiniciar juego',
      text:'Esto reseteará la batalla y volverá a la selección de personaje.',
      icon:'warning',
      showCancelButton:true,
      confirmButtonText:'Reiniciar',
      cancelButtonText:'Cancelar',
      background:'#1e1e1e',
      color:'#f0f0f0'
    }).then((r)=>{ if (r.isConfirmed) window.location.reload(); });
  } else {
    window.location.reload();
  }
});

// --- Persistencia (localStorage) ---
function obtenerHistorial() {
  try {
    return JSON.parse(localStorage.getItem("batallas")) || [];
  } catch {
    return [];
  }
}

function guardarResultado(resultado, jugador, enemigo) {
  const historial = obtenerHistorial();
  historial.push({
    personaje: jugador.tipo,
    nombreJugador: jugador.nombre,
    enemigo: enemigo.nombre,
    resultado,
    fecha: nowStr()
  });
  localStorage.setItem("batallas", JSON.stringify(historial));
}

function renderHistorial() {
  const historial = obtenerHistorial();
  listaHistorial.innerHTML = "";

  if (historial.length === 0) {
    listaHistorial.innerHTML = "<li>No hay batallas registradas aún.</li>";
  } else {
    historial.slice(-5).reverse().forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.fecha} - ${item.nombreJugador} (${item.personaje}) ${item.resultado}`;
      listaHistorial.appendChild(li);
    });
  }

  const ultimas = historial.slice(-20);
  const ganadas = ultimas.filter(i => i.resultado === "Ganó").length;
  const perdidas = ultimas.length - ganadas;
  dibujarChart(ganadas, perdidas);
}

// --- Chart.js ---
function dibujarChart(ganadas, perdidas) {
  if (!canvasChart || !window.Chart) return;
  const data = {
    labels: ["Ganadas", "Perdidas"],
    datasets: [{ label: "Resultados (últimas 20)", data: [ganadas, perdidas] }]
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true, precision: 0, ticks: { stepSize: 1 } } }
  };

  if (chart) chart.destroy();
  chart = new Chart(canvasChart, { type: "bar", data, options });
}

// --- Inicio ---
renderHistorial();
cargarDatos();
