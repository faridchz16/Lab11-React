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
