# CFP N° 401 Avellaneda · Portal Institucional, Panel CMS & Design System

> **Institución:** Centro de Formación Profesional N° 401 de Avellaneda  
> **Sitio Web Oficial:** [cfp401avellaneda.com.ar](https://cfp401avellaneda.com.ar)  
> Plataforma web oficial, gestor de contenidos (CMS), generador de flyers promocionales y suite completa de identidad institucional.

---

## 🏛️ Descripción del Proyecto

Este repositorio contiene la infraestructura digital y de comunicación oficial del **CFP N° 401 de Avellaneda** (DGCyE - Provincia de Buenos Aires):

1. **Sitio Web Institucional (`CFP 401 Avellaneda WEB v2.0/site/`)**:
   - Catálogo de cursos oficiales y gratuitos con buscador en tiempo real, filtros por familia profesional y turnos.
   - Fichas compartibles por WhatsApp y redes con metadatos OpenGraph dinámicos (`curso.php`).
   - Frontend reactivo desarrollado en React / JSX compilado con Babel.
   - Totalmente responsive y optimizado para navegación móvil.

2. **Panel de Administración CMS (`admin.html` / `admin.js`)**:
   - Gestión integral de cursos, vacantes, estados de inscripción, efemérides y novedades.
   - Seguridad reforzada: autenticación Bcrypt con doble clave (equipo y maestra), sesiones seguras `HttpOnly`, protección CSRF, rate-limiting y escritura atómica con copias de respaldo rotativas.
   - Generador interactivo de flyers y promociones para redes sociales en formatos Feed (1:1 / 4:5), Stories (9:16) y afiches A4 para impresión.

3. **Sistema de Diseño Institucional (`Sistema de Diseño/`)**:
   - Design tokens institucionales (colores oficiales, tipografías, espaciado, elevaciones, bordes y movimiento).
   - 21 guías interactivas de diseño y marca.
   - Librería de componentes React y prototipos de interfaces visualizables offline.
   - Fototeca curada de talleres y recursos vectoriales de alta definición.

---

## ⚙️ Estructura del Repositorio

```text
Campus Virtual/
├── CFP 401 Avellaneda WEB v2.0/     # Aplicación web, panel y backend PHP
│   ├── site/                        # Contenido público que se despliega al servidor
│   │   ├── index.html               # Portal público
│   │   ├── admin.html               # Panel de administración visual
│   │   ├── data.js                  # Base de datos JSON de cursos y promociones
│   │   ├── api/                     # Endpoints PHP seguros (auth, guardado atómico, backups)
│   │   ├── plantillas-promo.js      # Motor de plantillas de flyers
│   │   └── tokens/                  # Tokens de diseño institucionales
│   ├── fuente-jsx/                  # Código fuente editable en React / JSX
│   │   ├── app.jsx                  # Código fuente de la web pública
│   │   ├── admin.jsx                # Código fuente del panel administrativo
│   │   └── plantillas-promo.jsx     # Fuente de las plantillas promocionales
│   └── herramientas/                # Scripts de validación, testing E2E y compilación
├── Sistema de Diseño/               # Suite integral de identidad y marketing
│   ├── tokens/                      # Variables CSS oficiales
│   ├── components/                  # Componentes modulares
│   ├── ui_kits/                     # Prototipos interactivos offline
│   ├── Promociones y Redes/         # Plantillas gráficas para redes
│   └── assets/                      # Logos, fotos institucionales y de talleres
├── REPORTE-MAESTRO-CONJUNTO.md      # Documento técnico maestro y bitácora
└── BITACORA-DE-INICIO.md            # Registro cronológico del proyecto
```

---

## 🚀 Despliegue y Desarrollo

- **Compilación de JSX:** Las fuentes React se editan en `fuente-jsx/` y se compilan a `site/` mediante Babel (`node herramientas/compilar.js`).
- **Validación Integral:** Se ejecuta `node herramientas/verificar-todo.js` para asegurar la sintaxis, paridad de Babel y endpoints PHP.
- **Despliegue a Producción:** Se sincroniza exclusivamente la carpeta `site/` hacia el servidor web mediante FTP seguro.
