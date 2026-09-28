(() => {
  const board = document.getElementById("artboard");
  const stage = document.getElementById("stage");
  if (!board || !stage) return;

  const resize = () => {
    const width = board.classList.contains("stories") ? 1080 : board.classList.contains("a4") ? 1240 : 1080;
    const height = board.classList.contains("stories") ? 1920 : board.classList.contains("a4") ? 1754 : 1350;
    const scale = Math.min(1, Math.max(.3, (window.innerWidth - 36) / width));
    stage.style.width = `${width * scale}px`;
    stage.style.height = `${height * scale}px`;
    board.style.setProperty("--scale", scale);
  };

  window.addEventListener("resize", resize, { passive: true });
  resize();

  const picker = document.getElementById("photo-picker");
  let currentObjectUrl = null;
  picker?.addEventListener("change", () => {
    const file = picker.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(file);
    board.querySelectorAll("[data-photo]").forEach(img => { img.src = currentObjectUrl; });
  });

  document.querySelector("[data-reset]")?.addEventListener("click", () => window.location.reload());
  const gridToggle = document.querySelector("[data-grid-toggle]");
  gridToggle?.addEventListener("click", () => {
    const gridEnabled = board.classList.toggle("grid-off") === false;
    gridToggle.setAttribute("aria-pressed", String(gridEnabled));
    gridToggle.textContent = gridEnabled ? "Quitar cuadrícula" : "Agregar cuadrícula";
  });
  window.addEventListener("pagehide", () => {
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  });
})();
