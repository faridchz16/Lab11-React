# CLAUDE.md

## Descripción del repositorio

Este repositorio es **Lab11-React**, continuación del laboratorio 10
(https://github.com/jordanabad797-pixel/Lab10-React): conserva su historial completo y añade el
**laboratorio 11: comunicación entre componentes, hooks propios y bibliotecas de interfaz**.

Contenido:

- **Laboratorio 08 – Backend Django** (raíz del repo): API REST de cuestionarios con Django REST Framework
  (`config/`, `quiz/`), cliente de consola `quizctl.py`, contrato OpenAPI `schema.yml` y pasarela
  segura del agente de IA (`agent/`). Sus subagentes de OpenCode están en `.opencode/agent/`.
- **Laboratorio 09 – Frontend React** (`frontend/`): cartelera de cine construida con React + Vite.
- **Laboratorio 10 – Componentes y eventos** (`frontend/`): `Button`, favoritas, buscador con
  retardo, estado vacío y persistencia en el navegador.
- **Laboratorio 11 – Comunicación, hooks y bibliotecas** (`frontend/`): comunicación entre
  componentes, hooks propios, avisos con `react-hot-toast` y carrusel con `swiper`.

No modificar el backend Django (`config/`, `quiz/`, `agent/`, `quizctl.py`, `manage.py`,
`schema.yml`, `requirements.txt`) ni la carpeta `.opencode/` salvo petición explícita.

## Ramas

- Todo el trabajo del laboratorio 11 va en la rama **`lab11`**. Al final se fusiona en `main`
  con un Pull Request.
- **Nunca hacer commit directamente en `main`.**

## Frontend

- Todo el código React vive en `frontend/`.
- Los comandos npm se ejecutan dentro de `frontend/`:
  - `npm install`
  - `npm run dev` — servidor de desarrollo de Vite
  - `npm run build` — compilación de producción
  - `npm run lint` — ESLint
  - `npm test` — pruebas con Vitest y Testing Library

## Reglas

- Componentes **funcionales** con nombre en **PascalCase**.
- **Una carpeta por componente**: `src/components/Componente/Componente.jsx` + `Componente.css`.
- Los componentes de presentación reciben datos y funciones por **props**. El estado compartido
  vive en `App`; un hijo nunca modifica el estado de otro, avisa al padre con la función recibida.
- El estado **sube solo hasta el ancestro común** de los componentes que lo necesitan, no más.
- Lo que se puede calcular a partir del estado o de las props **no se guarda en estado**.
- Los hooks propios van en `src/hooks/` con el prefijo `use` y **respetan las reglas de los
  hooks**: se llaman solo en el nivel superior de un componente o de otro hook, nunca dentro de
  condiciones, bucles ni funciones anidadas.
- Avisos emergentes con **`react-hot-toast`** y carrusel con **`swiper`**.
- Los componentes de presentación **no saben cómo se muestra un aviso**: el `toast` lo lanza
  quien tiene el estado (por ejemplo, `App`); el hijo solo avisa con su función de props.
- **Código y comentarios en inglés**; **explicaciones al usuario en español**.
- **Un commit por tarea**, con el mensaje en español.
