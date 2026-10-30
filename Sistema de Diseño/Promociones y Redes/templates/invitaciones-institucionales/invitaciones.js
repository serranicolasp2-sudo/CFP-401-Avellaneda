(() => {
  const board = document.getElementById("artboard");
  const stage = document.getElementById("stage");
  if (!board || !stage) return;

  const dimensions = () => board.classList.contains("stories") ? [1080, 1920] : [1080, 1350];
  
  const resize = () => {
    const [width, height] = dimensions();
    const scale = Math.min(1, Math.max(0.25, (window.innerWidth - 40) / width));
    stage.style.width = `${width * scale}px`;
    stage.style.height = `${height * scale}px`;
    board.style.setProperty("--scale", scale);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Ajuste inteligente de escala tipográfica (--fit) para evitar desbordes
  const fitZone = zone => {
    const inner = zone.querySelector(".fit-inner");
    if (!inner) return;
    zone.style.setProperty("--fit", "1");
    let fit = 1;
    const overflow = () => inner.scrollHeight > zone.clientHeight + 1 ||
      [...inner.querySelectorAll(".fit-width")].some(el => el.scrollWidth > el.clientWidth + 1);
    while (fit > 0.50 && overflow()) {
      fit = Math.max(0.50, fit - 0.02);
      zone.style.setProperty("--fit", String(fit));
    }
  };

  const fitClosing = () => {
    const closing = board.querySelector(".closing");
    if (!closing) return;
    closing.style.setProperty("--fit", "1");
    let fit = 1;
    while (fit > 0.55 && closing.scrollWidth > closing.clientWidth + 1) {
      fit = Math.max(0.55, fit - 0.02);
      closing.style.setProperty("--fit", String(fit));
    }
  };

  const fitAll = () => {
    board.querySelectorAll("[data-fit-zone]").forEach(fitZone);
    fitClosing();
  };

  board.querySelectorAll("[contenteditable]").forEach(element => {
    element.addEventListener("input", fitAll);
  });
  fitAll();
  document.fonts?.ready?.then(fitAll);

  // Selector interactivo de fotos auténticas de la fototeca institucional
  const photoImg = document.getElementById("taller-photo");
  const photoSelect = document.getElementById("photo-select");
  const photoCaption = document.getElementById("photo-caption");

  const captions = {
    "assets/fotos/taller-domotica-integral.jpg": "Taller de Domótica y Energías Renovables · Estudiantes en práctica",
    "assets/fotos/taller-soldadura-chispas.jpg": "Taller de Soldadura y Metalmecánica · Práctica con equipo completo",
    "assets/fotos/muestra-proyectos-diseno.jpg": "Exposición de Proyectos y Diseño · Producción de los estudiantes",
    "assets/fotos/comunidad-egresados.jpg": "Comunidad institucional y egresados de Formación Profesional",
    "assets/fotos/capacitacion-alumnos.jpg": "Jornadas de capacitación técnica y nuevas tecnologías",
    "assets/fotos/fachada-sede-docksud.jpg": "Sede Central CFP N° 401 · Juan Pablo Angulo 1272, Dock Sud"
  };

  if (photoSelect && photoImg) {
    photoSelect.addEventListener("change", (e) => {
      const src = e.target.value;
      photoImg.style.opacity = "0.2";
      setTimeout(() => {
        photoImg.src = src;
        photoImg.onload = () => {
          photoImg.style.opacity = "1";
        };
        if (photoCaption && captions[src]) {
          photoCaption.textContent = captions[src];
        }
      }, 150);
    });
  }

  // Cargar foto propia desde la PC
  const fileInput = document.getElementById("custom-file-input");
  if (fileInput && photoImg) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          photoImg.src = event.target.result;
          if (photoCaption) photoCaption.textContent = "Fotografía de taller institucional";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Alternar marca de agua institucional
  document.querySelector("[data-arc-toggle]")?.addEventListener("click", event => {
    const visible = board.classList.toggle("sin-arco") === false;
    event.currentTarget.setAttribute("aria-pressed", String(visible));
    event.currentTarget.textContent = visible ? "Quitar arco" : "Agregar arco";
  });

  // Alternar trama de fondo: Cuadriculado vs Degradé institucional
  document.querySelector("[data-grid-toggle]")?.addEventListener("click", event => {
    const isGrid = board.classList.toggle("con-cuadricula");
    event.currentTarget.setAttribute("aria-pressed", String(isGrid));
    event.currentTarget.textContent = isGrid ? "Fondo: Cuadriculado" : "Fondo: Degradé";
  });

  // Botón restablecer
  document.querySelector("[data-reset]")?.addEventListener("click", () => window.location.reload());
})();
