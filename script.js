// Constantes del enemigo
const ENEMIGO = "Dragón";
const DANIO_CRITICO_ENEMIGO = 20;
const DANIO_BASE_ENEMIGO = 10;

let vidaJugador = 100;
let vidaEnemigo = 100;

let personajeElegido = "";
let danioBaseJugador = 0;
let danioCriticoJugador = 0;
let probabilidadCriticoJugador = 0;

// Muestra el estado en consola
function mostrarEstado() {
    console.log(`⚔ Vida del ${personajeElegido}: ${vidaJugador}`);
    console.log(`🐉 Vida del ${ENEMIGO}: ${vidaEnemigo}`);
}

// Calcula daño del jugador
function calcularDanioJugador() {
    const esCritico = Math.random() < probabilidadCriticoJugador;
    if (esCritico) {
        console.log("💥 ¡Golpe crítico del jugador!");
        return danioCriticoJugador;
    } else {
        return danioBaseJugador;
    }
}

// Calcula daño del enemigo
function calcularDanioEnemigo() {
    const esCritico = Math.random() < 0.3;
    if (esCritico) {
        console.log("🔥 ¡Golpe crítico del Dragón!");
        return DANIO_CRITICO_ENEMIGO;
    } else {
        return DANIO_BASE_ENEMIGO;
    }
}

// Turno del jugador
function turnoJugador() {
    const danio = calcularDanioJugador();
    vidaEnemigo -= danio;
    if (vidaEnemigo < 0) vidaEnemigo = 0;
    alert(`Atacaste al ${ENEMIGO} e hiciste ${danio} de daño.`);
}

// Turno del enemigo
function turnoEnemigo() {
    const danio = calcularDanioEnemigo();
    vidaJugador -= danio;
    if (vidaJugador < 0) vidaJugador = 0;
    alert(`El ${ENEMIGO} te atacó e hizo ${danio} de daño.`);
}

// Permite elegir el personaje y setea sus atributos
function elegirPersonaje() {
    let opcion = prompt("Elige tu personaje:\n1. Guerrero (alto daño, critico bajo)\n2. Mago (daño medio, critico medio)\n3. Arquero (daño bajo, critico alto)");
    
    switch(opcion) {
        case "1":
        personajeElegido = "Guerrero";
        danioBaseJugador = 12;
        danioCriticoJugador = 18;
        probabilidadCriticoJugador = 0.2;
        break;
        case "2":
        personajeElegido = "Mago";
        danioBaseJugador = 10;
        danioCriticoJugador = 20;
        probabilidadCriticoJugador = 0.3;
        break;
        case "3":
        personajeElegido = "Arquero";
        danioBaseJugador = 8;
        danioCriticoJugador = 22;
        probabilidadCriticoJugador = 0.5;
        break;
        default:
        alert("Opción inválida, se asignará Guerrero por defecto.");
        personajeElegido = "Guerrero";
        danioBaseJugador = 12;
        danioCriticoJugador = 18;
        probabilidadCriticoJugador = 0.2;
    }

    alert(`Elegiste: ${personajeElegido}`);
}

// Lógica principal de la batalla
function iniciarBatalla() {
    vidaJugador = 100;
    vidaEnemigo = 100;

    elegirPersonaje();

    alert(`¡Comienza la batalla entre ${personajeElegido} y el ${ENEMIGO}!`);

    while (vidaJugador > 0 && vidaEnemigo > 0) {
        turnoJugador();
        if (vidaEnemigo <= 0) break;

        turnoEnemigo();
        mostrarEstado();
    }

    if (vidaJugador <= 0) {
        alert("💀 ¡Has sido derrotado por el Dragón!");
    } else if (vidaEnemigo <= 0) {
        alert(`🏆 ¡El ${personajeElegido} ha derrotado al Dragón!`);
    }
}

// Asociamos el botón al inicio de la batalla
document.getElementById("btnIniciar").addEventListener("click", iniciarBatalla);
