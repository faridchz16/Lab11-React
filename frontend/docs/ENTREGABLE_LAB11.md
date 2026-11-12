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
