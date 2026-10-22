# Catálogo oficial de Formación Profesional (DGCyE)

Pasa el PDF del catálogo oficial a `site/catalogo/catalogo-2027.json`. Ese archivo es el que usa la sección **Catálogo 2027 · Alta** del panel.

## Uso

```bash
pip install pdfplumber
python herramientas/catalogo/extraer.py                      # usa site/catalogo/catalogo-2027.pdf
python herramientas/catalogo/extraer.py salida.json otro.pdf # otro catálogo u otra salida
python herramientas/catalogo/auditar.py site/catalogo/catalogo-2027.json
```

## Qué contiene

- **30 familias o sectores**, **338 trayectos** y **990 módulos** (catálogo 2027).
- **Datos de cada trayecto:** código, nombre, tipo de certificación, certificación, resoluciones, cohortes, horas cátedra y reloj, requisitos o correlatividad, código de diseño curricular y diseños reemplazados.
- **Datos de cada módulo:** código de planificación, denominación y horas.
- **Página del PDF** de cada trayecto y **observaciones**: avisos de lo que conviene revisar a mano.

## Cómo resuelve los casos difíciles del PDF

- **Celdas combinadas:** los datos de un trayecto a veces empiezan una fila antes que su código. Esas filas quedan en espera hasta que aparece el código.
- **Código de diseño curricular** (`GH33 - FI15`): indica a qué trayecto pertenece cada fila.
- **Texto fuera de la celda:** se lee por posición. Cada palabra se asigna al trayecto cuyo renglón queda más cerca, y se corta antes del pie de página.
- **Corte de página:** un módulo repetido al final de un trayecto pasa al siguiente. Los módulos del borde se mueven solo si eso reduce la diferencia de horas entre los dos.
- **Correcciones manuales** (CC13, CC14 y MT42): están dentro de `extraer.py`, en `CORRECCIONES`, y se verificaron contra el texto del PDF.
- **Texto superpuesto en el propio PDF** (páginas 21 y 33): si el trayecto tiene un solo módulo, se usa el nombre del módulo. Los requisitos ilegibles quedan vacíos y marcados.

## Control

`auditar.py` compara las horas de cada trayecto con la suma de sus módulos. Quedan 3 diferencias, todas marcadas en el panel:

- **OC07:** 221 contra 220, redondeo del propio catálogo.
- **OC45:** un módulo sin horas legibles.
- **SP08:** diferencia que trae el catálogo.

Los 44 trayectos con observaciones muestran un enlace a su página del PDF (`site/catalogo/catalogo-2027.pdf`).

Las filas que no se pudieron leer se guardan en `.local/catalogo-anomalias.json`.
