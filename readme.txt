# Simulador de Batalla — Versión Mejorada

Este proyecto es una evolución del simulador de batalla original hecho en JavaScript. En esta nueva versión, se reemplazaron las interacciones por consola y `alert()` por una **interfaz gráfica más amigable e interactiva en el navegador**.

---

##  Cambios principales respecto a la versión anterior

- **Selección de personaje con botones** (ya no se usa `prompt`).
- **Combate por turnos con interfaz visual**: se muestran barras de vida animadas y mensajes de combate en pantalla.
- **Sistema de daño crítico y probabilidades** mejor implementado.
- **Historial de batallas guardado con `localStorage`**, para que el usuario pueda ver los últimos combates jugados.
- **Botón de reinicio rápido** para volver a jugar sin recargar manualmente la consola.
- **Todo el flujo del juego se maneja visualmente**, sin necesidad de abrir la consola del navegador.

---

## ¿Cómo jugar?

1. Abrí el archivo `index.html` en tu navegador.
2. Elegí tu personaje entre Guerrero, Mago o Arquero.
3. Atacá al dragón haciendo clic en el botón **Atacar**.
4. El combate se desarrolla por turnos:
   - Primero ataca el jugador.
   - Luego el enemigo (Dragón).
5. El juego termina cuando alguno llega a 0 de vida.
6. Podés reiniciar la batalla o ver tu historial de partidas.

---

## Archivos del proyecto

- `index.html` → Interfaz principal del simulador.
- `style.css` → Estilos visuales del juego (barras, botones, layout).
- `script.js` → Lógica completa del combate, interfaz, turnos, almacenamiento de historial.

---

## Requisitos

- Un navegador moderno (Chrome, Firefox, Edge, etc.)
- No se necesita instalación ni backend.

---

## Aprendizajes aplicados

- Manipulación del DOM con JavaScript
- Eventos y control de flujo
- Funciones, arrays y objetos
- Almacenamiento local con `localStorage`
- Diseño de interfaz simple con HTML + CSS

---

## Autor

Desarrollado por Emanuel Córdoba como proyecto práctico de aprendizaje en JavaScript.