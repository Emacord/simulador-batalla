// Datos de los personajes
const personajes = [
    {
        nombre: "Guerrero",
        danioBase: 12,
        danioCritico: 18,
        probabilidadCritico: 0.2,
    },
    {
        nombre: "Mago",
        danioBase: 10,
        danioCritico: 20,
        probabilidadCritico: 0.3,
    },
    {
        nombre: "Arquero",
        danioBase: 8,
        danioCritico: 22,
        probabilidadCritico: 0.5,
    }
];

// Enemigo fijo
const enemigo = {
    nombre: "Dragón",
    vida: 100,
    danioBase: 10,
    danioCritico: 20,
    probabilidadCritico: 0.3
};

// Jugador (se carga al elegir personaje)
let jugador = {
    nombre: "",
    vida: 100,
    danioBase: 0,
    danioCritico: 0,
    probabilidadCritico: 0
};

let batallaActiva = false;

// Elementos del DOM
const seleccionPersonaje = document.getElementById("seleccionPersonaje");
const infoBatalla = document.getElementById("infoBatalla");
const nombrePersonaje = document.getElementById("nombrePersonaje");

const vidaJugadorBarra = document.getElementById("vidaJugador");
const vidaEnemigoBarra = document.getElementById("vidaEnemigo");
const vidaJugadorTexto = document.getElementById("vidaJugadorTexto");
const vidaEnemigoTexto = document.getElementById("vidaEnemigoTexto");

const btnAtacar = document.getElementById("btnAtacar");
const btnReiniciar = document.getElementById("btnReiniciar");
const logCombate = document.getElementById("logCombate");

// Elegir personaje
document.querySelectorAll("#seleccionPersonaje button").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.personaje;
        const personaje = personajes.find(p => p.nombre === nombre);
        jugador = { ...personaje, vida: 100 };
        enemigo.vida = 100;
        iniciarBatalla();
    });
});

function iniciarBatalla() {
    batallaActiva = true;
    seleccionPersonaje.classList.add("hidden");
    infoBatalla.classList.remove("hidden");
    nombrePersonaje.textContent = `Personaje: ${jugador.nombre}`;
    actualizarVidas();
    logCombate.innerHTML = `<p>¡La batalla comenzó entre ${jugador.nombre} y el ${enemigo.nombre}!</p>`;
}

function calcularDanio({ danioBase, danioCritico, probabilidadCritico }) {
    return Math.random() < probabilidadCritico ? danioCritico : danioBase;
}

function turnoJugador() {
    const danio = calcularDanio(jugador);
    enemigo.vida = Math.max(enemigo.vida - danio, 0);
    agregarLog(`🗡 ${jugador.nombre} hizo ${danio} de daño al ${enemigo.nombre}`);
}

function turnoEnemigo() {
    const danio = calcularDanio(enemigo);
    jugador.vida = Math.max(jugador.vida - danio, 0);
    agregarLog(`🔥 El ${enemigo.nombre} hizo ${danio} de daño a ${jugador.nombre}`);
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

    vidaEnemigoBarra.style.width = `${enemigo.vida}%`;
    vidaEnemigoTexto.textContent = enemigo.vida;
}

btnAtacar.addEventListener("click", () => {
    if (!batallaActiva) return;

    turnoJugador();
    actualizarVidas();

    if (enemigo.vida <= 0) {
        agregarLog(`🏆 ¡${jugador.nombre} derrotó al ${enemigo.nombre}!`);
        guardarResultado("Ganó");
        batallaActiva = false;
        return;
    }

    setTimeout(() => {
        turnoEnemigo();
        actualizarVidas();
        if (jugador.vida <= 0) {
            agregarLog(`💀 ¡El ${enemigo.nombre} derrotó a ${jugador.nombre}!`);
            guardarResultado("Perdió");
            batallaActiva = false;
        }
    }, 500);
});

btnReiniciar.addEventListener("click", () => {
    window.location.reload();
});

// Almacenar resultados en localStorage
function guardarResultado(resultado) {
    const historial = JSON.parse(localStorage.getItem("batallas")) || [];
    historial.push({
        personaje: jugador.nombre,
        resultado,
        fecha: new Date().toLocaleString()
    });
    localStorage.setItem("batallas", JSON.stringify(historial));
}

// Mostrar historial al cargar la página
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("batallas")) || [];
    const lista = document.getElementById("historialBatallas");
    lista.innerHTML = "";

    if (historial.length === 0) {
        lista.innerHTML = "<li>No hay batallas registradas aún.</li>";
        return;
    }

    historial.slice(-5).reverse().forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.fecha} - ${item.personaje} ${item.resultado}`;
        lista.appendChild(li);
    });
}

mostrarHistorial();
