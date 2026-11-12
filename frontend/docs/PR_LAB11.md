# Laboratorio 11: comunicación entre componentes, hooks propios y bibliotecas de interfaz

**Rama:** `lab11` → `main`

## Qué añade

La cartelera **Cine Aurora** (`frontend/`) pasa del laboratorio 10 al 11:

- **Estado en el ancestro común:**
  - Las favoritas (`useFavorites`) y el texto de búsqueda viven en `App`, porque los usan ramas
    distintas. `Header` recibe solo el número de favoritas.
  - Los estrenos viven en `PremieresSection`, que es la única que los usa.
- **Comunicación hijo → padre:**
  - `MovieCard` solo avisa con `onToggleFavorite(id)`, y `App` actualiza el estado y lanza el
    aviso.
  - El buscador, el botón «Quitar filtro» del banner y el estado vacío limpian el filtro con la
    misma función (`clearSearch`).
- **Cuatro hooks propios** en `src/hooks/`:
  - `useDebounce`, en `App` y `useWindowSize`;
  - `useWindowSize`, en `MovieList` y `PremiereCarousel`;
  - `usePremieres`, con los estados de carga, datos y error, cancelación y `retry`;
  - `useFavorites`.
- **Bibliotecas de interfaz:**
  - `react-hot-toast`, para los avisos al marcar o desmarcar favoritas;
  - `swiper`, para el carrusel de estrenos, accesible y en español.
- **Patrón adaptador:** `adaptMovie` / `adaptMovies` convierten los datos con forma de API
  (`snake_case`) al modelo de la aplicación.
- **Componentes nuevos:** `Skeleton`, `SkeletonCard`, `PremiereCarousel` y `PremieresSection`.
- **Utilidades CSS nuevas:** escala tipográfica, `.section`, `.grid` con `--columns` y `.skeleton`
  con `shimmer`, que respeta `prefers-reduced-motion`.
- **Script de capturas** `scripts/capture.mjs` (Playwright vía `npx`, no es dependencia del
  proyecto) y las 35 evidencias de `Evidencias_lab11/`.
- **Documentación:** `frontend/docs/ENTREGABLE_LAB11.md`, la sección «Lab11» del `README.md` y
  `CLAUDE.md` actualizado.

No se modifica el backend Django (`config/`, `quiz/`, `agent/`, `quizctl.py`, `manage.py`,
`schema.yml`, `requirements.txt`) ni `.opencode/`.

## Pasos y commits

| Paso | Commit | Resumen |
|------|--------|---------|
| 1 | `ce805d2` | Configuración: `CLAUDE.md`, dependencias y entregable |
| 2 | `ded89cf` | Tipografía y utilidades nuevas, y script de capturas |
| 3 | `1f256b1` | Adaptador de películas y cartelera pasada por `adaptMovies` |
| 4 | `5f47926` | Aviso emergente al marcar y desmarcar favoritas con `react-hot-toast` |
| 5 | `3932982` | Hook propio `useDebounce` en el buscador |
| 6 | `9a8cd87` | Hook propio `useWindowSize` para las tarjetas por fila |
| 7 | `ab02631` | Hook `usePremieres` con estados de carga, datos y error |
| 8 | `8bd4d76` | Esqueleto de carga y carrusel de estrenos con Swiper |
| 9 | `f66b4c7` | Favoritas en el ancestro común con `useFavorites` y contador en la cabecera |
| 10 | `7dbf6ba` | Botón del banner que limpia el filtro, con buscador y listado sincronizados |
| 11 | `84c2d62` | Árbol de componentes y explicación del estado elevado |
| 12 | último commit de la rama | README, cierre del entregable y esta descripción |

## Cómo probarlo

```powershell
git fetch origin
git switch lab11
cd frontend
npm install
npm test        # 18 archivos, 104 pruebas
npm run lint    # sin errores ni avisos
npm run build
npm run dev     # http://localhost:5173/
```

Recorrido en el navegador:

1. **Favoritas:** pulsa «Añadir a favoritas» en dos tarjetas. Aparece un aviso verde abajo a la
   derecha y la cabecera dice «2 favoritas». Desmarca una: aviso azul y «1 favorita». Recarga y
   siguen marcadas.
2. **Búsqueda:** escribe `faro`. A los 300 ms la cartelera muestra 1 película y el banner,
   «Filtrando por «faro»» y «Quitar filtro». Pulsa el botón: el buscador se vacía y vuelven las
   8 al instante. Prueba también `xyz` y «Ver toda la cartelera».
3. **Estrenos:** la sección «Próximos estrenos» muestra esqueletos durante 1,2 s y luego el
   carrusel. Muévete con las flechas, los puntos o las teclas ← →.
4. **Estados forzados (solo con `npm run dev`):**
   - `http://localhost:5173/?estrenos=lento`: carga de 4 s.
   - `http://localhost:5173/?estrenos=error`: aviso de error y «Reintentar», que vuelve a la
     carga.
5. **Ancho:** reduce la ventana. Las tarjetas y el carrusel pasan de 4 a 3, 2 y 1 por fila (cortes
   en 1200, 900 y 600 px).

## Comprobaciones hechas

- **`npm test`:** 104 pruebas superadas (eran 26 al empezar).
- **`npm run lint`:** sin avisos.
- **`npm run build`:** compila; JS 350.84 kB (109.63 kB gzip).
- **Capturas:** revisadas en escritorio y móvil. La carga y el carrusel miden lo mismo, así que la
  página no salta al llegar los estrenos.
- **Producción:** se comprobó con un build que el modo de simulación (`?estrenos=…`) no llega a
  ella.

Detalle completo en [`ENTREGABLE_LAB11.md`](ENTREGABLE_LAB11.md).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
