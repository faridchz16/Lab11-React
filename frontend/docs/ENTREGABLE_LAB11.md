# Entregable – Laboratorio 11: Comunicación entre componentes, hooks propios y bibliotecas de interfaz

**Integrantes:** Alonso Abad Mejia y Farid Chavez · **Curso:** Desarrollo de Aplicaciones Empresariales · **Sección:** 4-C24-A

## Paso 1: Preparación del proyecto

- **Punto de partida:** se partió del laboratorio 10
  ([Lab10-React](https://github.com/jordanabad797-pixel/Lab10-React)) en un repositorio nuevo,
  [Lab11-React](https://github.com/faridchz16/Lab11-React), que conserva todo su historial.
- **Rama de trabajo:** `lab11`. Todos los commits del laboratorio van en esta rama y al final se
  fusionan en `main` mediante un Pull Request. No se hacen commits directamente en `main`.
- **`CLAUDE.md`:** actualizado para el laboratorio 11 con las reglas nuevas (hooks propios en
  `src/hooks/`, estado en el ancestro común, avisos con `react-hot-toast`, carrusel con `swiper`).
- **Dependencias añadidas** en `frontend/`:

  | Paquete | Versión | Uso |
  |---------|---------|-----|
  | `react-hot-toast` | ^2.6.1 | Avisos emergentes |
  | `swiper` | ^14.4.0 | Carrusel |

- **Línea base** (con las dependencias ya instaladas, antes de cambiar código):

  | Comando | Resultado |
  |---------|-----------|
  | `npm test` | 7 archivos, 26 pruebas superadas |
  | `npm run lint` | Sin errores ni avisos |
  | `npm run build` | Correcto: 37 módulos, JS 228.85 kB (71.89 kB gzip), CSS 9.04 kB (2.28 kB gzip) |

  `npm audit` informa de 4 vulnerabilidades moderadas en `minimatch`, que llega a través de las
  herramientas de desarrollo (ESLint). No afectan a la compilación publicada ni vienen de los
  paquetes nuevos.

- **Evidencias:** las capturas del laboratorio se guardan en `Evidencias_lab11/`.

| Captura | Explicación |
|---------|-------------|
| [01_rama_lab11.png](../../Evidencias_lab11/01_rama_lab11.png) | Se apunta `origin` al repositorio nuevo, se sube `main`, se crea y se sube la rama `lab11`, y `git branch` confirma que es la rama activa. |
| [02_lab10_funcionando.png](../../Evidencias_lab11/02_lab10_funcionando.png) | La cartelera del laboratorio 10 en `localhost:5173` (cabecera con favoritas, banner con buscador y tarjetas) funciona como punto de partida. |

![Rama lab11](../../Evidencias_lab11/01_rama_lab11.png)
![Laboratorio 10 funcionando](../../Evidencias_lab11/02_lab10_funcionando.png)

### Capturas automáticas

Las capturas desde el paso 2 se toman con `scripts/capture.mjs`, que usa Playwright por `npx`
sin añadirlo a `frontend/package.json`. Con el servidor de desarrollo en marcha abre
`http://localhost:5173`, puede hacer clics, escribir, esperar a un elemento (por ejemplo, un aviso
emergente), capturar la página completa, la parte visible o un selector en escritorio
(1440x900) o móvil (390x844), y guardar la consola en un `.txt`.

```bash
npx -y playwright@1.56.1 install chromium   # solo la primera vez
npx -y -p playwright@1.56.1 node scripts/capture.mjs --mobile --full --out Evidencias_lab11/04_paso2_movil.png
```

## Paso 2: Tipografía y utilidades nuevas

Se amplió la hoja base sin tocar ningún componente. Las utilidades reutilizan los tokens: no hay
colores escritos a mano en `global.css`.

### Tokens nuevos (`frontend/src/styles/variables.css`)

| Grupo | Tokens | Para qué se usará |
|-------|--------|-------------------|
| Escala tipográfica | `--font-size-3xl`; `--line-height-none`, `-snug`, `-relaxed`; `--line-height-xs` … `-3xl` (una por tamaño) | Que cada tamaño de texto lleve su altura de línea; títulos grandes del carrusel |
| Pesos | `--font-weight-semibold` | Títulos de tarjetas y avisos |
| Espaciado y maquetación | `--space-9`, `--section-space`, `--grid-gap`, `--grid-min-column` | La clase `.section` y la rejilla `.grid` |
| Avisos | `--color-success`, `--color-error`, `--color-info` y su fondo `-bg`; `--toast-text`, `--toast-bg`, `--toast-border`, `--toast-radius`; `--z-toast` | Estilo de los avisos de `react-hot-toast` (éxito, error, info) |
| Esqueleto de carga | `--skeleton-base`, `--skeleton-highlight`, `--skeleton-radius`, `--skeleton-duration` | El marcador que se ve mientras cargan los datos |
| Movimiento | `--transition-base` | Transiciones algo más lentas que `--transition-fast` (carrusel, avisos) |

### Utilidades nuevas (`frontend/src/styles/global.css`)

| Clase | Qué hace | Para qué se usará |
|-------|----------|-------------------|
| `.text-xs`, `.text-lg`, `.text-xl` | Tamaño de texto con su altura de línea (se suman a `.text-sm`) | Textos de apoyo, avisos y títulos |
| `.font-regular`, `.font-medium`, `.font-semibold`, `.font-bold` | Peso de la fuente | Énfasis sin crear CSS en cada componente |
| `.section` | Espaciado vertical uniforme (`--section-space`) | Secciones nuevas de la página, como el carrusel |
| `.grid` | Rejilla con `repeat(var(--columns, 1), …)`; el número de columnas se cambia desde fuera con `style={{ '--columns': n }}` | Paso 6: `useWindowSize` calculará `--columns` según el ancho |
| `.skeleton`, `.skeleton-text` | Bloque gris con un brillo que se desplaza (`@keyframes shimmer`) | Estado de carga. Con `prefers-reduced-motion: reduce` la animación se desactiva y queda un bloque fijo |

### Comprobación visual

Se tomaron capturas de la página completa antes y después del cambio con los mismos parámetros.
Los archivos son **idénticos byte a byte** (`cmp` sin diferencias): los componentes existentes se
ven igual, porque ninguna clase nueva coincide con las que ya usaban. La consola no muestra errores
ni avisos.

| Captura | Explicación |
|---------|-------------|
| [03_paso2_escritorio.png](../../Evidencias_lab11/03_paso2_escritorio.png) | Página completa a 1440x900 tras ampliar la hoja: cabecera, banner con buscador, las 8 tarjetas en 4 columnas y pie, igual que en el laboratorio 10. |
| [04_paso2_movil.png](../../Evidencias_lab11/04_paso2_movil.png) | Página completa a 390x844: cabecera compacta, tarjetas en una columna y sin desbordamiento horizontal. |

![Paso 2 en escritorio](../../Evidencias_lab11/03_paso2_escritorio.png)
![Paso 2 en móvil](../../Evidencias_lab11/04_paso2_movil.png)

### Resultados

| Comando | Resultado |
|---------|-----------|
| `npm test` | 7 archivos, 26 pruebas superadas |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto. El CSS pasa de 9.04 kB a 11.10 kB (2.74 kB gzip); el JS no cambia (228.85 kB) |

### Observaciones

- En las primeras capturas completas, los carteles de las tarjetas que no se ven al abrir la
  página salían vacíos. Los carteles usan `loading="lazy"` y el navegador no los pedía porque la
  página nunca se desplazaba. Se corrigió en el script, no en la aplicación: con `--full` recorre
  la página, espera a que carguen las imágenes y vuelve arriba de forma instantánea. Si vuelve
  con `scroll-behavior: smooth`, la cabecera fija aparece a media página.

## Paso 3: Adaptador de películas

### Qué es el patrón adaptador

Un adaptador traduce los datos de una forma que no controlamos (la respuesta de una API) a la
forma que espera nuestra aplicación. Se coloca en la frontera: los datos entran por él una sola
vez y, a partir de ahí, la aplicación solo conoce su propio modelo. Si mañana la API cambia un
nombre o deja de enviar un campo, se corrige el adaptador y ningún componente se entera.

### Datos con forma de API

`frontend/src/data/movies.js` ahora exporta `apiMovies`: las mismas 8 películas con los mismos
valores, pero con los nombres en `snake_case` que usaría un servidor. Ya no se pinta
directamente: siempre pasa por `adaptMovies`. El objeto `cinema` (nombre, menú y contacto) no
cambió, porque no viene de la API de películas.

| Campo de la API | Campo de la app | Transformación |
|-----------------|-----------------|----------------|
| `id` | `id` | Se copia; `null` si falta |
| `title` | `title` | Texto sin espacios sobrantes; `'Sin título'` si falta o está vacío |
| `poster_url` | `image` | Texto; `null` si falta, para que React no ponga `src=""` y se vea el texto alternativo |
| `overview` | `synopsis` | Texto; `''` si falta |
| `certification` | `classification` | Texto; `'Sin clasificar'` si falta (`Hero` lo muestra con la insignia neutra) |
| `vote_average` | `rating` | Número en la escala 0-10; `0` si falta o no es un número; se limita a 0-10; acepta texto numérico (`'7.5'`) |
| `show_times` | `showtimes` | Lista sin entradas vacías; `[]` si falta o no es una lista |

### El código del adaptador

`frontend/src/utils/adaptMovie.js`:

```js
export function adaptMovie(apiMovie = {}) {
  const movie = apiMovie ?? {}
  return {
    id: movie.id ?? null,
    title: toText(movie.title, 'Sin título'),
    image: toText(movie.poster_url, null),
    synopsis: toText(movie.overview),
    classification: toText(movie.certification, UNKNOWN_CLASSIFICATION),
    rating: toRating(movie.vote_average),
    showtimes: toShowtimes(movie.show_times),
  }
}

export function adaptMovies(list) {
  return Array.isArray(list) ? list.map(adaptMovie) : []
}
```

- **`adaptMovie`** construye un objeto nuevo con los 7 campos de la app. Solo lee los campos que
  conoce, así que los campos extra de la API no se cuelan en la aplicación. `apiMovie ?? {}`
  evita que falle si llega `null` o `undefined`.
- **Tres funciones auxiliares** se encargan de los valores por defecto:
  - `toText` acepta solo texto no vacío y, si no, devuelve el valor por defecto.
  - `toRating` convierte a número, usa `0` si no es válido y lo mantiene entre 0 y 10.
  - `toShowtimes` devuelve `[]` si no recibe una lista y quita los horarios vacíos.
- **`adaptMovies`** aplica `adaptMovie` a toda la lista. Si la respuesta no es una lista, devuelve
  una cartelera vacía en lugar de romper el `.map` de `MovieList`.

En `App.jsx`, la cartelera se adapta una sola vez, fuera del componente, porque los datos son
estáticos:

```js
const movies = adaptMovies(apiMovies)
```

El adaptador se reutilizará en el paso 7 para los estrenos.

### Por qué los componentes no cambiaron

`Header`, `Hero`, `MovieList` y `MovieCard` reciben el mismo modelo
`{ id, title, image, synopsis, classification, rating, showtimes }` que antes. El cambio de forma
se queda en la frontera (`data/` → `adaptMovie` → `App`). Se comprobó con Node que
`adaptMovies(apiMovies)` es **idéntico** (`deepStrictEqual`) al arreglo `movies` del commit
anterior, y la captura de la página completa es idéntica byte a byte a la del paso 2.

### Pruebas

`frontend/src/utils/adaptMovie.test.js` añade 9 pruebas:

| Grupo | Qué comprueba |
|-------|---------------|
| Mapeo correcto | Cada campo de la API llega a su campo de la app, y el resultado solo tiene los 7 campos del modelo aunque la API envíe campos extra |
| Campos que faltan | Película con solo `id`; película `null` o `undefined`; valores inválidos (título en blanco, póster vacío, `vote_average: 'n/a'`, `show_times` que no es lista); valoración fuera de 0-10 o en texto; horarios vacíos |
| Lista completa | `adaptMovies(apiMovies)` devuelve las 8 películas, en orden y con todos sus valores; una respuesta que no es lista da `[]` |

### Evidencias

| Evidencia | Explicación |
|-----------|-------------|
| [05_paso3_cartelera_adaptada.png](../../Evidencias_lab11/05_paso3_cartelera_adaptada.png) | Página completa a 1440x900 con la cartelera pasando por `adaptMovies`: las 8 películas, la destacada (*Ecos de Marte*, 8.4) y las insignias se ven igual que antes. La consola no muestra errores ni avisos. |
| [06_paso3_tests.txt](../../Evidencias_lab11/06_paso3_tests.txt) | Salida detallada de las pruebas: 8 archivos y 35 pruebas superadas, 9 de ellas del adaptador. |

![Cartelera adaptada](../../Evidencias_lab11/05_paso3_cartelera_adaptada.png)

### Resultados

| Comando | Resultado |
|---------|-----------|
| `npm test` | 8 archivos, 35 pruebas superadas (26 anteriores + 9 del adaptador) |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto: 38 módulos, JS 229.51 kB (72.13 kB gzip) |

## Paso 4: Aviso emergente al marcar y desmarcar favoritas

### El flujo

```
MovieCard ──onToggleFavorite(id)──▶ MovieList ──▶ App.toggleFavorite(id)
                                                    ├─ wasFavorite = favoriteIds.includes(id)
                                                    ├─ setFavoriteIds(updater puro)
                                                    └─ toast.success(...) / toast(...)
                                                              │
                                                    <Toaster /> (montado una vez en App)
```

1. El usuario pulsa el botón de favorita de una tarjeta.
2. `MovieCard` llama a `onToggleFavorite(id)`, igual que en el laboratorio 10. No sabe nada más.
3. `App.toggleFavorite` comprueba si la película **ya era** favorita, actualiza el estado y lanza
   el aviso que corresponda.
4. El único `<Toaster />`, montado en `App` abajo a la derecha, lo muestra.

### Por qué la tarjeta no conoce la biblioteca

`MovieCard` es un componente de presentación: recibe `isFavorite` y avisa con
`onToggleFavorite`. Quien tiene el estado (`App`) es quien sabe si la película se añadió o se
quitó, así que es quien decide qué decir y cómo mostrarlo. Hay tres ventajas:

- **Se puede reutilizar:** la tarjeta sirve en cualquier lugar, también donde no haga falta aviso.
- **Se puede cambiar la biblioteca:** reemplazar `react-hot-toast` solo toca `App` y
  `utils/toastOptions.js`.
- **Las pruebas siguen igual:** `MovieCard.test.jsx` sigue pasando sin cambios.

Se comprobó con `grep` y con `git diff`:

```bash
$ grep -rn "react-hot-toast\|toast" frontend/src/components/
(sin resultados, código de salida 1)
$ git diff --quiet HEAD -- frontend/src/components/MovieCard && echo "MovieCard sin cambios"
MovieCard sin cambios
```

### El código explicado

`frontend/src/App.jsx`:

```js
function toggleFavorite(movieId) {
  const wasFavorite = favoriteIds.includes(movieId)
  const title = movies.find((movie) => movie.id === movieId)?.title ?? 'La película'

  setFavoriteIds((currentIds) =>
    currentIds.includes(movieId)
      ? currentIds.filter((id) => id !== movieId)
      : [...currentIds, movieId],
  )

  const toastId = `favorite-${movieId}`
  if (wasFavorite) {
    toast(`${title} quitada de favoritas`, { id: toastId })
  } else {
    toast.success(`♥ ${title} añadida a favoritas`, { id: toastId })
  }
}
```

- **`wasFavorite` se calcula antes de actualizar.** No hace falta esperar al nuevo estado: si ya
  estaba marcada, el clic la quita.
- **La función de actualización de `setFavoriteIds` sigue siendo pura:** solo calcula la lista
  nueva. El aviso se lanza **fuera** de ella, porque React puede ejecutar esa función dos veces
  (en `StrictMode` lo hace a propósito) y saldrían avisos duplicados.
- **El título** se busca en la cartelera ya adaptada (paso 3), porque la tarjeta solo envía el `id`.
- **`id: favorite-<id>`:** si se marca y desmarca la misma película seguido, el aviso nuevo
  reemplaza al anterior en vez de apilarse. Las películas distintas tienen avisos distintos.
- **Tipos de aviso:**
  - Añadir usa `toast.success` (éxito).
  - Quitar usa `toast()`, el tipo neutro (`blank`) de la biblioteca, que aquí tiene el estilo de
    info: `react-hot-toast` no trae un `toast.info`.

`frontend/src/utils/toastOptions.js` agrupa las props del `<Toaster />`:
`position: 'bottom-right'` y los estilos `success`, `error` y `blank`. Todos usan los tokens del
paso 2 mediante `var(--…)`:
- el fondo y el borde de color de cada tipo (`--color-success-bg`, `--color-info`, …);
- `--toast-text`, `--toast-radius`, `--shadow-md`;
- `--z-toast` para el contenedor.

No hay colores escritos a mano, y el aviso queda oscuro, como el resto de la página.
`App` lo monta con `<Toaster {...TOASTER_PROPS} />`.

### Pruebas

- **`App.test.jsx`** añade dos pruebas:
  - Al pulsar «Añadir a favoritas» aparece «♥ Ecos de Marte añadida a favoritas», dentro de un
    elemento `role="status"`. Al desmarcar aparece «Ecos de Marte quitada de favoritas» y el
    aviso anterior desaparece.
  - Dos películas distintas muestran dos avisos, cada uno con su título.
- **`MovieCard.test.jsx`** pasa sin cambios.
- **`src/test/setup.js`** se ajustó en dos puntos:
  - jsdom no tiene `window.matchMedia`, y `react-hot-toast` lo usa para comprobar
    `prefers-reduced-motion`, así que se añadió un sustituto **solo en las pruebas**.
  - El almacén de avisos es global, así que se vacía con `toast.remove()` después de cada prueba
    para que no pasen de una a otra.

### Evidencias

| Evidencia | Explicación |
|-----------|-------------|
| [07_paso4_aviso_anadida.png](../../Evidencias_lab11/07_paso4_aviso_anadida.png) | Tras pulsar «Añadir a favoritas» en *Ecos de Marte*: el aviso de éxito (verde) abajo a la derecha, el contador de la cabecera en **1 favorita** y la tarjeta marcada. |
| [08_paso4_aviso_quitada.png](../../Evidencias_lab11/08_paso4_aviso_quitada.png) | Tras desmarcarla: el aviso de info (azul) «Ecos de Marte quitada de favoritas», el contador vuelve a **0** y la tarjeta queda sin marcar. |
| [09_paso4_tests.txt](../../Evidencias_lab11/09_paso4_tests.txt) | Salida detallada de las pruebas: 37 superadas, incluidas las dos del aviso y las de `MovieCard` sin cambios. |

Las capturas se tomaron con `capture.mjs`: hace clic en el botón de la tarjeta y espera con
`--wait-text` a que aparezca el texto del aviso. No hizo falta tocar el código de la aplicación
para forzar el aviso. La consola no mostró errores ni avisos.

![Aviso al añadir](../../Evidencias_lab11/07_paso4_aviso_anadida.png)
![Aviso al quitar](../../Evidencias_lab11/08_paso4_aviso_quitada.png)

### Resultados

| Comando | Resultado |
|---------|-----------|
| `npm test` | 8 archivos, 37 pruebas superadas (35 anteriores + 2 del aviso) |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto: 41 módulos, JS 242.68 kB (77.01 kB gzip); `react-hot-toast` añade unos 13 kB (5 kB gzip) |

## Paso 5: Hook propio `useDebounce`

### Qué es el debounce

*Debounce* significa esperar a que algo **deje de cambiar** durante un tiempo antes de reaccionar.
Al escribir «faro» se producen cuatro cambios seguidos (`f`, `fa`, `far`, `faro`). Sin debounce,
la cartelera se filtraría cuatro veces. Con debounce de 300 ms, cada pulsación reinicia la espera
y la cartelera se filtra **una sola vez**, con `faro`, cuando el usuario hace una pausa.

### El código, línea por línea

`frontend/src/hooks/useDebounce.js`:

```js
import { useEffect, useState } from 'react'                       // 1

export function useDebounce(value, delayMs) {                     // 2
  const [debouncedValue, setDebouncedValue] = useState(value)     // 3

  useEffect(() => {                                               // 4
    const timerId = setTimeout(() => setDebouncedValue(value), delayMs) // 5
    return () => clearTimeout(timerId)                            // 6
  }, [value, delayMs])                                            // 7

  return debouncedValue                                           // 8
}
```

1. Importa los dos hooks de React que usa. Un hook propio no es más que una función que combina
   otros hooks.
2. El nombre empieza por `use`, así React (y la regla `react-hooks` de ESLint) lo trata como hook.
   Recibe el valor que cambia y la espera en milisegundos. Es genérico: sirve para texto, números
   u objetos.
3. Guarda el valor «calmado» en su propio estado. Empieza con el valor actual, así que el primer
   render no espera nada.
4. El efecto se ejecuta después de cada render en que cambió `value` o `delayMs`.
5. Programa la actualización para dentro de `delayMs`. Si nada lo cancela, el estado pasa a ser
   el último `value`.
6. **La limpieza.** React la ejecuta antes de volver a correr el efecto y al desmontar el
   componente. Cada cambio nuevo cancela el temporizador anterior, así que de una ráfaga solo
   sobrevive el último. Al desmontar no queda ningún temporizador pendiente que actualice un
   componente que ya no existe.
7. Dependencias: todo lo que el efecto lee de fuera (`value`, `delayMs`). Si cambia la espera, el
   temporizador también se reinicia.
8. Devuelve el valor con retardo. Quien llama decide qué hacer con él.

**Reglas de los hooks:**
- `useState` y `useEffect` se llaman siempre, en el mismo orden y en el nivel superior del hook.
  No hay condiciones, bucles ni funciones anidadas.
- `App` llama a `useDebounce` también en el nivel superior.
- `npm run lint` (con `eslint-plugin-react-hooks`) no da avisos.

### Uso en el buscador

`App.jsx` sigue aplicando el retardo, ahora con el hook nuevo:

```js
const debouncedText = useDebounce(searchText, SEARCH_DELAY_MS)  // 300 ms
// Emptying the box is not a typing burst: the full list comes back at once.
const searchQuery = searchText === '' ? '' : debouncedText
```

Se mantiene el comportamiento del Lab 10: al borrar el texto, o al pulsar «Limpiar» o «Ver toda
la cartelera», la lista completa vuelve **al instante**, sin esperar los 300 ms. Lo comprueban
las pruebas de `App.test.jsx` que ya existían: tras limpiar, esperan las 8 tarjetas enseguida,
sin `waitFor`.

### Diferencia con el Lab 10

| | Lab 10: `useDebouncedValue` | Lab 11: `useDebounce` |
|---|---|---|
| Nombre | `useDebouncedValue` | `useDebounce`, el que pide la guía |
| Lógica | `useState` + `useEffect` con `setTimeout` y `clearTimeout` | La misma, comentada línea a línea |
| Pruebas | 2: retardo y ráfaga | 5: valor inicial inmediato, retardo exacto, ráfaga con **una sola** actualización (se registra cada valor devuelto), cambio de espera y limpieza al desmontar |
| Uso | Solo el buscador | El buscador, y en el paso 6 también `useWindowSize` |

La lógica del Lab 10 ya era correcta, así que el cambio es de nombre, documentación y pruebas, no
de comportamiento. `useDebouncedValue.js` y su prueba se eliminaron, y `grep` no encuentra
ninguna referencia en `src/`. Git los registra como borrado + archivo nuevo, no como renombrado,
porque los comentarios y las pruebas nuevas cambian demasiado el contenido. El código anterior
sigue en el historial del laboratorio 10. Como prueba de que las pruebas nuevas sirven, se quitó temporalmente la línea 6 (la
limpieza): fallaron la de la ráfaga y la del desmontaje. Después se restauró.

> **Paso 6:** `useWindowSize` también usará `useDebounce`, para no recalcular las columnas en cada
> evento `resize`. Así el hook se usa en más de un sitio, como pide la guía («el hook se usa en
> más de un componente»).

### Evidencias

| Evidencia | Explicación |
|-----------|-------------|
| [10_paso5_busqueda_faro.png](../../Evidencias_lab11/10_paso5_busqueda_faro.png) | Página completa tras escribir «faro» letra a letra (120 ms por tecla): el buscador muestra `faro` y la cartelera, «1 de 8 películas para «faro»», con solo *El último faro*. |
| [11_paso5_consola.txt](../../Evidencias_lab11/11_paso5_consola.txt) | Consola del navegador durante la búsqueda: **4 pulsaciones** (`f`, `fa`, `far`, `faro`) y **un solo filtrado** (`filtered "faro": 1 movies`). Las dos líneas `filtered ""` del principio son el montaje inicial; salen dos porque `StrictMode` monta dos veces en desarrollo. |
| [12_paso5_tests.txt](../../Evidencias_lab11/12_paso5_tests.txt) | Salida detallada de las pruebas: 40 superadas, 5 de ellas de `useDebounce`. |

![Búsqueda de faro](../../Evidencias_lab11/10_paso5_busqueda_faro.png)

### Resultados

| Comando | Resultado |
|---------|-----------|
| `npm test` | 8 archivos, 40 pruebas superadas (37 anteriores − 2 de `useDebouncedValue` + 5 de `useDebounce`) |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto: 41 módulos, JS 242.68 kB (77.01 kB gzip), el mismo tamaño que en el paso 4 |

## Paso 6: Hook propio `useWindowSize` para las tarjetas por fila

### El código del hook

`frontend/src/hooks/useWindowSize.js`:

```js
export const RESIZE_DELAY_MS = 150

function readWindowSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}

export function useWindowSize() {
  const [size, setSize] = useState(readWindowSize)                 // 1

  useEffect(() => {                                                 // 2
    function handleResize() {                                       // 3
      const next = readWindowSize()
      setSize((current) =>                                          // 4
        current.width === next.width && current.height === next.height ? current : next,
      )
    }

    window.addEventListener('resize', handleResize)                 // 5
    return () => window.removeEventListener('resize', handleResize) // 6
  }, [])                                                            // 7

  return useDebounce(size, RESIZE_DELAY_MS)                         // 8
}
```

1. **Estado inicial perezoso:** `useState(readWindowSize)` recibe la función, no su resultado.
   Así el tamaño se lee una sola vez, en el primer render, y el hook devuelve el tamaño real desde
   el principio.
2. **Suscribirse a `window` es un efecto secundario**, así que va en `useEffect` y no en el cuerpo
   del componente, que debe ser puro.
3. **El manejador** se define dentro del efecto, así que es la misma función al añadirla y al
   quitarla.
4. **La actualización** devuelve el mismo objeto si el tamaño no cambió. React ve el mismo valor y
   se salta el render; pasa, por ejemplo, con eventos `resize` que solo cambian el zoom.
5. **Se suscribe** una sola vez, al montar.
6. **La limpieza** quita **la misma** función. Sin esto, cada montaje dejaría un listener vivo que
   intentaría actualizar un componente desmontado.
7. **Dependencias vacías:** el efecto no lee nada de las props ni del estado, así que se ejecuta
   solo al montar, y la limpieza solo al desmontar.
8. **Devuelve el tamaño a través de `useDebounce`** (paso 5).

Respeta las reglas de los hooks: `useState`, `useEffect` y `useDebounce` se llaman siempre, en el
mismo orden y en el nivel superior. `npm run lint` no da avisos.

### Por qué usa `useDebounce` por dentro

Arrastrar el borde de la ventana dispara decenas de eventos `resize` por segundo, uno por cada
pocos píxeles. Las columnas solo cambian al cruzar 600, 900 o 1200 px, así que no tiene sentido
recalcular la rejilla en cada uno.

- **El hook no reinventa el retardo:** reutiliza `useDebounce`. Así el mismo hook sirve para el
  texto del buscador y para el tamaño de la ventana, porque es genérico.
- **150 ms en lugar de 300:** el redimensionado debe sentirse rápido, y el buscador necesita más
  margen entre teclas.
- **Lo que se retrasa es el valor devuelto.** El estado interno sí cambia en cada evento, así que
  `MovieList` hace un render ligero por evento. Pero el tamaño que devuelve el hook, y por tanto
  `columns` y la rejilla, cambia **una sola vez** cuando el usuario suelta el borde. Lo comprueba
  la prueba de la ráfaga.

### Función pura `columnsForWidth` y uso en `MovieList`

`frontend/src/utils/columnsForWidth.js` decide las columnas solo a partir del ancho. No toca el DOM
ni el estado, así que se prueba con una tabla de valores. Ante un ancho inválido (`0`, negativo,
`NaN`) devuelve 1 columna.

| Ancho de la ventana | Columnas |
|---------------------|----------|
| menos de 600 px | 1 |
| de 600 a 899 px | 2 |
| de 900 a 1199 px | 3 |
| 1200 px o más | 4 |

En `MovieList`:

```jsx
const { width } = useWindowSize()
const columns = columnsForWidth(width)
// ...
<div className="grid movie-list__grid" style={{ '--columns': columns }} data-columns={columns}>
```

- **La rejilla es la utilidad `.grid` del paso 2:**
  `grid-template-columns: repeat(var(--columns, 1), minmax(var(--grid-min-column), 1fr))`, con el
  hueco `--grid-gap`.
- **Se quitó el `auto-fill`** de `MovieList.css`: el número de columnas ya no lo decide el
  navegador, sino `columnsForWidth`.
- **`data-columns`** deja el valor a la vista en las herramientas de desarrollo y en las pruebas.
- **`App` no cambia:** la maquetación es asunto de `MovieList`, que obtiene las columnas de su
  propio hook. `columns` no se guarda en estado: se calcula a partir de `width`.

**Cambio visible respecto al `auto-fill`:** antes, a 1024 px salían 4 columnas y a 768 px salían 3,
porque el navegador metía tantas columnas de 224 px como cupieran. Ahora salen 3 y 2, como indica
la tabla. A 1440 px y en móvil no cambia nada.

### Hook → dónde se usa

| Hook | Dónde se usa | Para qué |
|------|--------------|----------|
| `useDebounce` | `App` (buscador) | Aplica el texto de búsqueda 300 ms después de la última tecla |
| `useDebounce` | `useWindowSize` | Entrega el tamaño de la ventana 150 ms después del último `resize` |
| `useWindowSize` | `MovieList` | Calcula `--columns` con `columnsForWidth` |

`useDebounce` se reutiliza así en dos sitios distintos, con dos tipos de valor (texto y objeto) y
dos retardos.

### Pruebas

| Archivo | Pruebas |
|---------|---------|
| `useWindowSize.test.js` (4) | Devuelve el tamaño actual al momento; con temporizadores falsos, el tamaño nuevo llega a los 150 ms y no antes; un arrastre de 5 eventos produce una sola actualización (se registran los anchos devueltos: `[1440, 900]`); al desmontar quita **el mismo** listener que añadió y un `resize` posterior no programa nada |
| `columnsForWidth.test.js` (12) | Tabla de anchos con los bordes de cada tramo (599/600, 899/900, 1199/1200) y anchos inválidos |
| `MovieList.test.jsx` (2, nuevo) | A 1440 px la rejilla tiene la clase `grid` y `--columns: 4`; al cambiar a 390 px y pasar el retardo, pasa a `--columns: 1` |

### Evidencias

Capturas de la parte visible, desplazada hasta la cartelera, en cuatro anchos. En cada una, el
script escribió en la consola el valor real de la rejilla, y las columnas que calcula el navegador
coinciden con `--columns`:

```
CHECK innerWidth=1440 --columns=4 tracks=4
CHECK innerWidth=1024 --columns=3 tracks=3
CHECK innerWidth=768  --columns=2 tracks=2
CHECK innerWidth=390  --columns=1 tracks=1
```

| Evidencia | Explicación |
|-----------|-------------|
| [13_paso6_1440px_4columnas.png](../../Evidencias_lab11/13_paso6_1440px_4columnas.png) | 1440x900: 4 tarjetas por fila |
| [14_paso6_1024px_3columnas.png](../../Evidencias_lab11/14_paso6_1024px_3columnas.png) | 1024x768: 3 tarjetas por fila (antes, con `auto-fill`, eran 4) |
| [15_paso6_768px_2columnas.png](../../Evidencias_lab11/15_paso6_768px_2columnas.png) | 768x1024 (tableta vertical): 2 tarjetas por fila (antes eran 3) |
| [16_paso6_390px_1columna.png](../../Evidencias_lab11/16_paso6_390px_1columna.png) | 390x844 (móvil): 1 tarjeta por fila, cabecera compacta |
| [17_paso6_tests.txt](../../Evidencias_lab11/17_paso6_tests.txt) | Salida detallada de las pruebas: 11 archivos y 58 pruebas superadas |

![1440 px, 4 columnas](../../Evidencias_lab11/13_paso6_1440px_4columnas.png)
![1024 px, 3 columnas](../../Evidencias_lab11/14_paso6_1024px_3columnas.png)
![768 px, 2 columnas](../../Evidencias_lab11/15_paso6_768px_2columnas.png)
![390 px, 1 columna](../../Evidencias_lab11/16_paso6_390px_1columna.png)

### Resultados

| Comando | Resultado |
|---------|-----------|
| `npm test` | 11 archivos, 58 pruebas superadas (40 anteriores + 18 nuevas) |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto: 43 módulos, JS 243.26 kB (77.22 kB gzip), CSS 10.96 kB |

## Paso 7: Hook `usePremieres` con estados de carga, datos y error

Este paso prepara los datos de los estrenos. Todavía no muestra nada en pantalla: eso llega en el
paso 8.

### Piezas nuevas

| Archivo | Qué es |
|---------|--------|
| `src/data/premieres.js` | 6 estrenos ficticios en el **mismo formato de API** del paso 3 (`poster_url`, `overview`, `certification`, `vote_average`, `show_times`) más `release_date` (`YYYY-MM-DD`). Los `id` empiezan en 101 para no chocar con los de la cartelera, porque las favoritas se guardan por `id`. `vote_average` es 0 porque aún no se han estrenado. |
| `public/posters/*.svg` | 6 pósters nuevos (`marea-de-neon`, `el-ultimo-tren-a-orion`, `la-biblioteca-sumergida`, `cometa-de-papel`, `bajo-la-luna-roja`, `las-dunas-que-hablan`) con el estilo de los existentes: 300x450, degradado vertical, una figura sencilla y el título en dos líneas |
| `src/services/premieresService.js` | `fetchPremieres({ delayMs, shouldFail })`: simula la petición al servidor |
| `src/hooks/usePremieres.js` | El hook: pide los datos, los adapta y expone el estado |
| `src/utils/adaptMovie.js` | Ampliado con `release_date` → `releaseDate` |

### Los 3 estados

| `status` | Cuándo | `premieres` | `error` |
|----------|--------|-------------|---------|
| `'loading'` | Al montar, y al pulsar reintentar (`retry`) | `[]` | `null` |
| `'success'` | La petición respondió con datos | Los 6 estrenos, **ya adaptados** al modelo de la app | `null` |
| `'error'` | La petición falló | `[]` | El mensaje para el usuario: «No se pudo conectar con el servidor de estrenos» |

Los tres valores viven en **un solo objeto de estado**, así que cambian juntos y nunca puede
quedar, por ejemplo, `status: 'success'` con un `error` del intento anterior. El hook devuelve
además `retry`.

### El servicio

```js
export function fetchPremieres({ delayMs = DEFAULT_DELAY_MS, shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(PREMIERES_ERROR_MESSAGE))
      else resolve(structuredClone(apiPremieres))
    }, delayMs)
  })
}
```

Devuelve una `Promise`, como haría `fetch`. Tras el retardo (1,2 s por defecto), rechaza con un
`Error` de mensaje claro o resuelve con los datos **en formato de API**. Adaptarlos no es tarea
del servicio. Cada respuesta es una copia (`structuredClone`), como si llegara por la red, para
que nadie pueda modificar los datos de origen.

### El código del hook explicado

```js
const LOADING = { status: 'loading', premieres: [], error: null }

export function usePremieres({ delayMs, shouldFail } = simulationFromUrl()) {   // 1
  const [request, setRequest] = useState(LOADING)                              // 2
  const [attempt, setAttempt] = useState(0)                                    // 3

  useEffect(() => {
    let ignore = false                                                         // 4

    fetchPremieres({ delayMs, shouldFail }).then(                              // 5
      (data) => {
        if (!ignore) setRequest({ status: 'success', premieres: adaptMovies(data), error: null })
      },
      (error) => {
        const message = error?.message || PREMIERES_ERROR_MESSAGE
        if (!ignore) setRequest({ status: 'error', premieres: [], error: message })
      },
    )

    return () => { ignore = true }                                             // 6
  }, [delayMs, shouldFail, attempt])                                           // 7

  function retry() {                                                           // 8
    setRequest(LOADING)
    setAttempt((current) => current + 1)
  }

  return { ...request, retry }                                                 // 9
}
```

1. **Opciones:** el hook las recibe y, si no se le pasan, usa la simulación leída de la URL (ver
   más abajo). Se desestructuran en valores simples (`delayMs`, `shouldFail`) para que las
   dependencias del efecto no cambien en cada render, como pasaría con un objeto nuevo.
2. **Estado de la petición:** un solo objeto que empieza en `loading`.
3. **`attempt`** es un contador. Cambiarlo es la forma de pedir al efecto que repita la petición.
4. **La bandera de cancelación** de esta petición en concreto (ver el apartado siguiente).
5. **La petición** es asíncrona. Cuando responde, los datos pasan por `adaptMovies`, el mismo
   adaptador de la cartelera: el componente recibirá `image`, `synopsis` y `releaseDate`, nunca
   `poster_url` ni `release_date`. Si el error no trae mensaje, se usa uno claro.
6. **La limpieza** marca la petición como obsoleta.
7. **Dependencias:** se pide de nuevo si cambian las opciones o al reintentar.
8. **`retry`** es un manejador de eventos, no un efecto. Vuelve a `loading` enseguida, con lo que
   la interfaz responde al clic sin esperar, y sube `attempt` para que el efecto repita la
   petición. Poner `setRequest(LOADING)` dentro del efecto sería una actualización síncrona en un
   efecto, que React desaconseja porque provoca un render extra.
9. **Devuelve** el estado y `retry`.

**Reglas de los hooks:**
- `useState` (dos veces) y `useEffect` se llaman siempre, en el mismo orden y en el nivel
  superior.
- Las llamadas a `setRequest` están en las funciones de la promesa y en `retry`, no en el cuerpo
  del componente.
- `npm run lint` (`eslint-plugin-react-hooks` 7) no da avisos.

### Por qué hace falta la bandera de cancelación

Una petición no se puede «deshacer»: el `setTimeout` (o un `fetch` real) responde aunque ya no
interese. Sin la bandera, esa respuesta tardía actualizaría el estado igualmente. Pasa en dos
casos:

1. **Una petición vieja que llega tarde.** Si se reintenta o cambian las opciones mientras hay
   una petición en curso, quedan dos peticiones vivas y pueden responder **en cualquier orden**.
   Si la vieja llega última, pisaría los datos buenos de la nueva con datos o errores antiguos.
   Al cambiar las dependencias, la limpieza del efecto anterior pone su `ignore = true`, así que
   solo cuenta la respuesta de la petición más reciente.
2. **El componente se desmontó.** La respuesta llega cuando ya no hay nada que actualizar. Desde
   React 18 esto no da error, pero sería trabajo inútil: adaptar datos para un componente que ya
   no existe.

Las dos pruebas que lo comprueban se verificaron quitando las comprobaciones `if (!ignore)`:
**fallan sin la bandera y pasan con ella**. Una primera versión de la prueba del desmontaje
pasaba siempre, porque React 18 ignora esas actualizaciones sin avisar. Se reescribió para
comprobar que la respuesta tardía no llega a adaptarse.

### Modo de simulación (solo en desarrollo)

Los estados de carga y error duran poco o no ocurren nunca con datos locales. Para poder verlos y
capturarlos, la URL los fuerza:

| URL | Efecto en desarrollo |
|-----|----------------------|
| `http://localhost:5173/` | Carga normal de unos 1,2 s y luego datos |
| `http://localhost:5173/?estrenos=lento` | La carga dura 4 s |
| `http://localhost:5173/?estrenos=error` | La petición falla. Reintentar vuelve a fallar, como un servidor caído |

```js
export function readSimulation(search, isDev) {
  if (!isDev) return {}
  const mode = new URLSearchParams(search).get('estrenos')
  if (mode === 'error') return { shouldFail: true }
  if (mode === 'lento') return { delayMs: SLOW_DELAY_MS }
  return {}
}

export function simulationFromUrl() {
  return import.meta.env.DEV ? readSimulation(window.location.search, true) : {}
}
```

- **`readSimulation`** es una función pura: recibe la URL y el modo. Así se prueba con cualquier
  combinación, incluida «producción».
- **`simulationFromUrl`** la conecta con la página. Un valor desconocido (`?estrenos=otro`) se
  ignora.

### Por qué no afecta a producción

- **Vite sustituye `import.meta.env.DEV` por una constante** al compilar: `true` con
  `npm run dev` y `false` con `npm run build`. En producción la expresión queda como
  `false ? readSimulation(...) : {}`. El minificador la reduce a `{}` y elimina `readSimulation`,
  porque nada más la usa. Aunque alguien escriba `?estrenos=error` en la web publicada, la
  petición es la normal.
- **Se comprobó en un build real.** El build actual todavía no incluye los estrenos, porque nada
  los usa hasta el paso 8 y el empaquetador los descarta. Por eso se hizo un build temporal que
  sí llama a `fetchPremieres(simulationFromUrl())`, y después se restauró `main.jsx`:

  | Texto buscado en el JS de producción | Apariciones |
  |--------------------------------------|-------------|
  | `servidor de estrenos` (el mensaje de error real) | 1 |
  | `Marea de ne` (datos de los estrenos) | 1 |
  | `URLSearchParams` (lectura de la URL) | **0** |
  | `lento` (modo de simulación) | **0** |

  El servicio y los datos están, pero el código de simulación no existe en producción.
- **No hace falta código de producción especial para las capturas:** la simulación vive en el
  servicio, detrás de `import.meta.env.DEV`, y los componentes no la conocen. Cumple la regla de
  `CLAUDE.md` de forzar estados solo para las capturas sin ensuciar la producción.

### El adaptador ampliado

`release_date` → `releaseDate`. Solo se aceptan fechas reales en formato `YYYY-MM-DD`: no valen
`2026-02-30`, `04/12/2026` ni `2026-12-4`. La fecha se guarda como texto ISO y se formateará en la
interfaz del paso 8.

Para **no romper la cartelera**, `releaseDate` solo se añade al modelo si la API envía una fecha
válida. Las películas de la cartelera no tienen fecha, así que su modelo sigue siendo exactamente
`{ id, title, image, synopsis, classification, rating, showtimes }`. La prueba del paso 3 que
compara las 8 películas campo a campo, y la que comprueba que el modelo tiene solo esos 7 campos,
siguen pasando sin tocarlas.

### Pruebas

| Archivo | Pruebas nuevas |
|---------|----------------|
| `usePremieres.test.js` (7) | Con temporizadores falsos: empieza en `loading`; pasa a `success` a los 1200 ms (no a los 1199) con los datos adaptados (`releaseDate`, sin `release_date`); pasa a `error` con el mensaje; `retry` vuelve a `loading` y luego a `success` (el servicio se simula para fallar solo la primera vez); mensaje claro si el error no trae uno; no procesa la respuesta tras desmontar; una respuesta vieja y lenta no pisa a una nueva |
| `premieresService.test.js` (8) | Resuelve con los datos de API tras 1200 ms; devuelve una copia; rechaza con el mensaje en español; `?estrenos=error` y `?estrenos=lento` en desarrollo; sin parámetro o con un valor desconocido no cambia nada; **fuera de desarrollo se ignora**; `simulationFromUrl` lee la URL real |
| `adaptMovie.test.js` (+4) | `release_date` → `releaseDate`; sin fecha no aparece el campo (la cartelera no cambia); fechas inválidas descartadas; los 6 estrenos se adaptan con su fecha y su póster |

### Evidencias

| Evidencia | Explicación |
|-----------|-------------|
| [18_paso7_tests.txt](../../Evidencias_lab11/18_paso7_tests.txt) | Salida detallada de las pruebas: 13 archivos y 77 pruebas superadas, 19 de ellas nuevas en este paso |

### Resultados

| Comando | Resultado |
|---------|-----------|
| `npm test` | 13 archivos, 77 pruebas superadas (58 anteriores + 19 nuevas) |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto: 43 módulos, JS 243.49 kB (77.34 kB gzip). Los estrenos aún no se usan en pantalla, así que todavía no entran en el bundle |
