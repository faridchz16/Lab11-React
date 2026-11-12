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
