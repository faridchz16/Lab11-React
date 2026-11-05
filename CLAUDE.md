# CLAUDE.md

## Descripción del repositorio

Este repositorio es **Lab10-React**, continuación del laboratorio 09
(https://github.com/faridchz16/Lab09-React): conserva su historial completo y añade encima los
componentes reutilizables, el estado y los eventos del laboratorio 10.

Contenido:

- **Laboratorio 08 – Backend Django** (raíz del repo): API REST de cuestionarios con Django REST Framework
  (`config/`, `quiz/`), cliente de consola `quizctl.py`, contrato OpenAPI `schema.yml` y pasarela
  segura del agente de IA (`agent/`). Sus subagentes de OpenCode están en `.opencode/agent/`.
- **Laboratorio 09 – Frontend React** (`frontend/`): cartelera de cine construida con React + Vite.
- **Laboratorio 10 – Componentes y eventos** (`frontend/`): `Button`, favoritas, buscador con
  retardo, estado vacío y persistencia en el navegador.

No modificar el backend Django (`config/`, `quiz/`, `agent/`, `quizctl.py`, `manage.py`,
`schema.yml`, `requirements.txt`) ni la carpeta `.opencode/` salvo petición explícita.

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
- Lo que se puede calcular a partir del estado o de las props **no se guarda en estado**.
- Los hooks propios van en `src/hooks/` con el prefijo `use`.
- **Código y comentarios en inglés**; **explicaciones al usuario en español**.
- **Un commit por tarea**, con el mensaje en español.
