# Skill "Estudio CFP 401" (`cfp401-estudio`)

Instrucciones para que Claude trabaje como el estudio interno del CFP N° 401: respeta la marca (colores, tipografías, logos, voz) y los datos reales, y sabe cómo se hacen las piezas para redes, los cambios en el sitio y el panel, y los videos (Filmora, Premiere, After Effects).

## Qué hay en esta carpeta

| Archivo | Para qué |
|---|---|
| `cfp401-estudio/` | La skill en sí (fuente editable): `SKILL.md`, guías en `references/`, logos y tokens en `assets/` |
| `cfp401-estudio.skill` | La misma skill empaquetada, lista para instalar |
| `EVALUACION-CFP401-ESTUDIO.md` | Resultado de las pruebas con y sin la skill |

## Cómo usarla

- **En claude.ai (cualquier compañero o compañera):** en la configuración de claude.ai, sección de Skills, subir `cfp401-estudio.skill`. Funciona sola, sin el proyecto: trae los logos, los colores y las reglas adentro.
- **En Claude Code (en la computadora del proyecto):** copiar la carpeta `cfp401-estudio/` a `C:\Users\<usuario>\.claude\skills\`. Además de sus guías, usa las carpetas reales del proyecto (sitio, datos, fotos, bitácora).

No hace falta nombrarla: se activa sola cuando el pedido tiene que ver con el CFP 401, sus cursos, piezas, el sitio o videos.

## Cómo actualizarla

1. Editar los archivos de `cfp401-estudio/` (nunca el `.skill` directamente).
2. Volver a empaquetar con el empaquetador oficial de skills (skill-creator: `python -m scripts.package_skill "<ruta a cfp401-estudio>" "<esta carpeta>"`), que valida el formato y deja los archivos dentro de la carpeta `cfp401-estudio/` del paquete.
3. Registrar el cambio en la bitácora de `REPORTE-MAESTRO-CONJUNTO.md`.
4. Quien la tenga instalada en claude.ai tiene que volver a subir el `.skill` nuevo.
