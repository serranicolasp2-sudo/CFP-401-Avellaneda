# Aviso Primaria · Stories (1080 × 1920)

Pieza para WhatsApp e Instagram Stories que avisa sobre terminalidad primaria. **Solo formato Historia.**
En el generador del panel es el modelo `aviso-primaria-v1` ("Aviso Primaria (Stories)").

## Versión vigente: "Ficha numerada" (elegida el 09/10/2026)

![Referencia](referencia-ficha-numerada.png)

- **Arriba:** logo, antetítulo, titular en dos líneas (blanca y amarilla) y bajada sobre la foto en duotono azul.
- **Sello de fecha límite:** amarillo, a caballo del corte entre la foto y la ficha. Se puede ocultar.
- **Ficha 1-2-3:** para quién, extranjeros (se puede ocultar y la numeración se reacomoda) y sede.
- **WhatsApp a lo ancho:** 11 6200-0967. Es el contacto propio de primaria, confirmado por el responsable, y distinto del WhatsApp del CFP.
- **Zona segura:** logo y botón quedan a 192 px de los bordes, igual que el resto de las piezas Stories del generador.
- **Textos largos:** el bloque de arriba y la ficha achican la letra en proporción (hasta 55–60 %) y nada se pisa. El día del sello se achica si tiene más de dos caracteres (por ejemplo "15/10").
- **Fotos propias:** `site/assets/promociones/tematicas/primaria/` (egresados y fachada). Son copias optimizadas de las del diseño original.

El código está en `CFP 401 Avellaneda WEB v2.0/fuente-jsx/plantillas-promo.jsx` (`AvisoPrimariaV1` y `CSS_PLANTILLAS_PROPIAS.primaria`). Este modelo no pasa por `importar-estilos-plantillas.js`: su CSS se mantiene a mano en ese archivo.

## Historia

`original-claude-design/` guarda el diseño que hizo Claude Design. Se dejó de lado porque casi la mitad de la pieza era espacio negativo, con una foto circular de poca relevancia. Según `marca.md`, además, la foto circular está reservada para Inscripciones. Antes de descartarlo también se le habían encontrado otros problemas:
- el recuadro de extranjeros quedaba descentrado;
- la tilde de la Ñ se salía de la caja amarilla;
- el logo y el pie quedaban fuera de la zona segura;
- los textos largos se recortaban sin aviso.

`direcciones-evaluadas.png` muestra las tres direcciones que se compararon: A, afiche tipográfico; B, ficha numerada (la elegida); C, cuenta regresiva.
