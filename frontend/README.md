# Cartelera con React — Laboratorio 09

Cartelera del cine ficticio "Cine Aurora", hecha con **React 19 + Vite 8**. Forma parte del
repositorio Lab09-React, que continúa el laboratorio 08 (backend Django en la raíz). El README
completo está en la [raíz del repositorio](../README.md) y el registro paso a paso en
[`docs/ENTREGABLE.md`](docs/ENTREGABLE.md).

## Ejecución

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # compilación en dist/ (ignorada por Git)
npm run lint
```

## Estructura

```
src/
├── main.jsx          # monta <App /> e importa styles/global.css
├── App.jsx           # compone la página y reparte los datos por props
├── data/movies.js    # `movies` (8 películas) y `cinema` (nombre, navegación, contacto)
├── styles/           # variables.css (tokens) + global.css (estilos base)
└── components/       # Componente/Componente.jsx + Componente.css
    ├── Header/       # name, navLinks
    ├── Hero/         # movie → title, image, synopsis, classification, rating
    ├── MovieList/    # movies → <MovieCard key={movie.id} movie={movie} />
    ├── MovieCard/    # movie → title, image, rating, showtimes
    └── Footer/       # name, contact
public/posters/       # pósters SVG
```

Todos los componentes son funcionales y de presentación, sin estado ni hooks. `Hero` y
`MovieCard` reciben la película por props (`movie`) y desestructuran solo los campos que usan. Usan HTML semántico (`header`, `nav`, `main`, `section`, `article`,
`footer`) y todas las imágenes tienen `alt`.

## Dependencias

`react` y `react-dom` 19.3.1, `vite` 8.3.6 y `@vitejs/plugin-react` 6.2.1. Para el lint, `eslint`
10 con los plugins de React. No se añadió nada a la plantilla de Vite.

## Subagentes de Claude Code

Están en `../.claude/agents/` y son el equivalente a los de opencode del lab 08:
- **`react-dev`**: escribe los componentes y estilos (como `django-dev` hacía con el backend).
- **`ui-reviewer`**: revisor de solo lectura (responsabilidad única, props mínimas, avisos de
  React, `alt`).

## Commits

18 commits del laboratorio 09, desde `f1a9673` (creación del proyecto con Vite) hasta `3a05a81`
(registro de los errores de JSX). La lista completa está en el README de la raíz.

## Laboratorio 10

Se añadieron `Button`, `MovieSearch`, `EmptyState`, el hook `useDebouncedValue` y las utilidades de `src/utils/`. Las pruebas se ejecutan con `npm test`. El detalle está en [docs/ENTREGABLE_LAB10.md](docs/ENTREGABLE_LAB10.md).
