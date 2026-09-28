# UI kit — Campus Virtual

Recreación del aula virtual del CFP N° 401, construida sobre la marca `Logo-campus-horizontal.png` / `Logo-isotipo.png`. No se entregó código ni capturas del LMS real, por lo que la estructura sigue el modelo de aula por módulos típico de los CFP (cursos → módulos → entregas → calificaciones → foro) usando exclusivamente los componentes y tokens de este sistema.

| Pantalla | Archivo |
|---|---|
| Login partido azul + formulario | `LoginScreen.jsx` |
| Shell con sidebar navy y topbar | `CampusShell.jsx` |
| Tablero del estudiante | `DashboardScreen.jsx` |
| Aula del curso (contenidos, entregas, calificaciones, foro) | `CourseScreen.jsx` |

Flujo interactivo: ingresar → tablero → abrir curso → subir entrega (modal) → ver estado corregido.

**Declarado:** la estructura de navegación es una propuesta, no una copia verificada del campus en producción.