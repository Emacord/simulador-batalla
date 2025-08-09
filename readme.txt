# Simulador de Batalla — Versión Mejorada con Alertas, Estadísticas y Fetch

Este proyecto es una evolución del simulador de batalla original hecho en JavaScript.  
En esta nueva versión se incorporaron mejoras visuales y funcionales: ahora cuenta con **interfaz gráfica avanzada**, alertas interactivas con **SweetAlert2**, estadísticas dinámicas con **Chart.js**, y carga de datos mediante **peticiones fetch**.

---

## Cambios principales respecto a la versión anterior

- **Selección de personaje con confirmación visual** (usando SweetAlert2).
- **Combate por turnos con interfaz visual**: barras de vida animadas, sprites compactos y centrados.
- **Mensajes de victoria y derrota personalizados** con SweetAlert2.
- **Sistema de daño crítico y probabilidades** optimizado.
- **Historial de batallas guardado con `localStorage`** para ver los últimos combates jugados.
- **Gráficos estadísticos** con Chart.js que muestran victorias y derrotas de las últimas 20 partidas.
- **Botón de reinicio con confirmación** para volver a jugar.
- **Carga dinámica de datos desde `data.json` usando fetch**.
- **Interfaz completamente visual y responsive**, sin necesidad de consola.

---

## ¿Cómo jugar?

1. Abrí el archivo `index.html` en tu navegador.
2. Escribí tu nombre (opcional).
3. Elegí tu personaje (Guerrero, Mago o Arquero) y la dificultad (Fácil, Normal, Difícil).
4. Confirmá tu selección.
5. Atacá al dragón haciendo clic en el botón **Atacar**.
6. El combate se desarrolla por turnos:
   - Primero ataca el jugador.
   - Luego el enemigo (Dragón).
7. El juego termina cuando alguno llega a 0 de vida.
8. Podés reiniciar la batalla o ver tu historial y estadísticas.

---

## Archivos del proyecto

- `index.html` → Interfaz principal del simulador.
- `style.css` → Estilos visuales del juego (barras, botones, layout, sprites).
- `script.js` → Lógica completa del combate, interfaz, turnos, historial, SweetAlert2, gráficos y peticiones fetch.
- `data.json` → Datos de personajes y enemigo.
- Carpeta `assets/personajes` → Imágenes de los personajes y enemigo.

---

## Requisitos

- Un navegador moderno (Chrome, Firefox, Edge, etc.).
- No se necesita instalación ni backend.
- Conexión a Internet para cargar librerías externas (SweetAlert2 y Chart.js).

---

## Aprendizajes aplicados

- Manipulación avanzada del DOM con JavaScript.
- Eventos y control de flujo.
- Funciones, arrays y objetos.
- Almacenamiento local con `localStorage`.
- Integración de librerías externas: **SweetAlert2** y **Chart.js**.
- **Uso de peticiones fetch** para cargar datos externos (`data.json`).
- Diseño responsive con HTML + CSS.
- Mejora de la experiencia de usuario mediante confirmaciones y visualizaciones.

---

## Autor

Desarrollado por Emanuel Córdoba como proyecto final de aprendizaje en JavaScript.
