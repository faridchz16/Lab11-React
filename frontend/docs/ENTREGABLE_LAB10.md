# Entregable – Laboratorio 10: Componentes y eventos

**Integrantes:** Alonso Abad Mejia y Farid Chavez · **Curso:** Desarrollo de Aplicaciones Empresariales · **Sección:** 4-C24-A

El proyecto es acumulativo: parte de la cartelera del laboratorio 09
([Lab09-React](https://github.com/faridchz16/Lab09-React)) y conserva su historial. El backend
Django del laboratorio 08 (`config/`, `quiz/`, `agent/`) no se modificó.

## Resultado

| Paso | Qué se hizo | Commit |
|------|-------------|--------|
| 1 | Se restauró el proyecto del lab 09: `npm ci`, lint y build sin errores | — |
| 2 | Hoja base con estilos de formulario, tipografía y utilidades | `Ampliación de la hoja base…` |
| 3 | Componente `Button` con `children`, `variant`, `size` y `href` | `Componente Button reutilizable…` |
| 4 | Estado `favoriteIds` en `App` y función `toggleFavorite` | `Estado de favoritas en App…` |
| 5 | `MovieCard` recibe `isFavorite` y `onToggleFavorite` y avisa al padre | `Botón de favorita en MovieCard…` |
| 6 | `MovieSearch` como entrada controlada | `Componente MovieSearch…` |
| 7 | Retardo de 300 ms con el hook `useDebouncedValue` | `Retardo en el buscador…` |
| 8 | `MovieList` filtra y dibuja `EmptyState` si nada coincide | `Filtrado de MovieList…` |
| 9 | Buscador y llamada a la acción dentro del banner | `Integración del buscador…` |
| 10 | Favoritas en `localStorage`, recuperadas al cargar | `Persistencia de las favoritas…` |
| 11 | Decisiones de estado y captura del estado vacío | este documento |
| 12 | Repositorio y entregable | este documento |

Además se añadieron 26 pruebas automatizadas (`npm test`), fuera de lo que pide la guía, para
respaldar los casos de prueba del entregable.

## Dónde vive cada dato (paso 11)

Criterio: un dato vive en el componente más bajo que cubre a todos los que lo usan, y lo que se
puede calcular no se guarda.

| Dato | Dónde vive | Por qué |
|------|------------|---------|
| `favoriteIds` | Estado de `App` | Lo usan dos ramas distintas: `Header` (contador) y `MovieCard` (botón). `App` es su ancestro común más cercano. |
| `searchText` | Estado de `App` | `MovieSearch` lo muestra, pero también lo vacía el botón de `EmptyState`, que está en otra rama. Si viviera en `MovieSearch`, habría que duplicarlo en `App` para poder limpiarlo. |
| Valor con retardo | Estado interno de `useDebouncedValue` | Es un detalle de temporización; `App` solo necesita el resultado. |
| Favoritas guardadas | `localStorage`, vía `favoritesStorage.js` | Es lo único que debe sobrevivir a una recarga. `App` lo lee una vez con un inicializador perezoso y lo escribe en un efecto. |
| `searchQuery` | No es estado: se calcula en `App` | Sale de `searchText` y del valor con retardo. |
| `visibleMovies` | No es estado: `useMemo` en `MovieList` | Sale de `movies` y `query`. Guardarlo obligaría a mantenerlo sincronizado. |
| `favoriteCount`, `isFavorite` | No son estado: se calculan al pasar las props | Salen de `favoriteIds`. |

`searchText` no se guarda en el navegador a propósito: una búsqueda es una acción momentánea, y
abrir la cartelera filtrada sin recordarlo confundiría al usuario.

## Componentes reutilizables y por qué lo son

| Componente | Cómo se reutiliza | Por qué es reutilizable |
|------------|-------------------|-------------------------|
| `Button` | En 4 sitios: llamada a la acción (enlace, `primary`), favorita (`primary`/`secondary`, `sm`), limpiar buscador (`ghost`, `sm`) y estado vacío (`secondary`) | No conoce películas ni búsquedas. El contenido llega por `children`, el aspecto por `variant` y `size`, y la conducta por las props que reenvía. Cambiar de sitio solo cambia sus props. |
| `EmptyState` | Hoy lo usa `MovieList`; sirve para cualquier lista vacía | Recibe el mensaje por `title` y la salida por `children`, así que no sabe qué lista está vacía. |
| `Hero` | Recibe sus acciones por `children` | El banner no importa `MovieSearch` ni `Button`; `App` decide qué va dentro. |
| `MovieSearch` | Es controlado: no tiene estado propio | Funciona con cualquier padre que le dé `value`, `onChange` y `onClear`. |
| `useDebouncedValue` | Hook genérico | Sirve para cualquier valor, no solo para texto de búsqueda. |

`MovieCard` y `MovieList` no se presentan como genéricos: conocen las películas y son específicos
de esta aplicación.

## Comunicación del hijo al padre

1. `App` define `toggleFavorite` y la pasa a `MovieList` como `onToggleFavorite`.
2. `MovieList` la entrega a cada `MovieCard`.
3. Al hacer clic, `MovieCard` llama a `onToggleFavorite(id)`. No cambia nada por su cuenta.
4. `App` actualiza `favoriteIds` y React vuelve a dibujar el contador y la tarjeta.

El caso `MovieCard › reports the movie id to its parent and keeps no state of its own` lo
comprueba: tras el clic, si el padre no cambia la prop, la tarjeta sigue igual.

## Medición del retardo (paso 7)

Se escribió `marte` a 120 ms por tecla en Chrome y se contaron las líneas de la consola.

| Configuración | Pulsaciones | Filtrados |
|---------------|-------------|-----------|
| Sin retardo (`SEARCH_DELAY_MS = 0`, cambio temporal sin commit) | 5 | 5 |
| Con retardo (`SEARCH_DELAY_MS = 300`) | 5 | 1 |

Capturas: `Evidencias_lab10/08_consola_sin_retardo.png` y `09_consola_con_retardo.png`. La traza
de consola solo existe en desarrollo (`debugLog`); la compilación de producción no la emite.

## Casos de prueba

| # | Caso | Esperado | Resultado |
|---|------|----------|-----------|
| 1 | Clic en favorita de dos películas | Contador en 2 y tarjetas marcadas | Correcto |
| 2 | Clic de nuevo en una favorita | Se quita y baja el contador | Correcto |
| 3 | Recargar la página | Siguen las 2 favoritas; `localStorage` guarda `[1,2]` | Correcto |
| 4 | Escribir `jardin` sin tilde | Encuentra «El jardín de relojes» | Correcto |
| 5 | Escribir `xyz` | Estado vacío con el texto buscado | Correcto |
| 6 | Pulsar «Ver toda la cartelera» | Vacía el buscador y vuelven las 8 películas | Correcto |
| 7 | Pulsar «Ver cartelera» | Baja a `#cartelera` sin recargar | Correcto |
| 8 | Guardar `{broken` en `localStorage` y recargar | La página carga con 0 favoritas | Correcto |
| 9 | Ancho de 390 px | Sin desbordamiento horizontal | Correcto |
| 10 | Consola durante el recorrido | Sin errores ni avisos | Correcto |

Los casos 1 a 9 se ejecutaron en Chrome sobre el servidor de desarrollo. Las 26 pruebas de
`npm test` cubren además `Button`, `MovieCard`, `MovieSearch`, `useDebouncedValue`,
`filterMovies`, `favoritesStorage` y el flujo completo de `App`.

## Observaciones

- El laboratorio 09 no tenía ningún `<button>` escrito a mano, así que en el paso 3 no hubo nada
  que sustituir. `Button` se estrenó con la llamada a la acción y se usó en todos los botones nuevos.
- La guía sugiere que el texto del buscador viva en el estado. Se puso en `App` y no dentro de
  `MovieSearch` por el botón de `EmptyState`: así hay una sola fuente de verdad y no se duplica.
- Vaciar el buscador no espera los 300 ms: el retardo evita trabajo mientras se escribe, pero
  al limpiar el usuario espera ver la lista enseguida.
- Se detectó en la revisión visual que el contador añadía una tercera fila a la cabecera fija en
  móvil. Se corrigió con una regla para pantallas estrechas.
- La primera captura de la consola salió mal: el guion escribía más lento que el retardo y las dos
  configuraciones daban igual. Se repitió a 120 ms por tecla, una velocidad normal.

## Uso de IA

El desarrollo se hizo con asistencia de Claude Code, igual que en el laboratorio 09. Los commits
lo indican con la línea `Co-Authored-By`.
