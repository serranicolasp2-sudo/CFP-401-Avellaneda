(() => {
  const board = document.getElementById("artboard");
  const stage = document.getElementById("stage");
  if (!board || !stage) return;

  const dimensions = () => board.classList.contains("stories")
    ? [1080, 1920]
    : board.classList.contains("a4") ? [1240, 1754] : [1080, 1350];

  const resize = () => {
    const [width, height] = dimensions();
    const scale = Math.min(1, Math.max(.3, (window.innerWidth - 36) / width));
    stage.style.width = `${width * scale}px`;
    stage.style.height = `${height * scale}px`;
    board.style.setProperty("--scale", scale);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const headlines = [...board.querySelectorAll("[data-fit]")];
  const fitHeadline = element => {
    const baseSize = Number(element.dataset.baseFont) || Number.parseFloat(getComputedStyle(element).fontSize);
    const minSize = Number(element.dataset.minFont) || 54;
    element.dataset.baseFont = String(baseSize);
    let size = baseSize;
    element.style.fontSize = `${size}px`;
    while (size > minSize && (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1)) {
      size = Math.max(minSize, size - 2);
      element.style.fontSize = `${size}px`;
    }
    element.dataset.needsShorterCopy = String(element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1);
  };
  headlines.forEach(element => {
    element.addEventListener("input", () => fitHeadline(element));
    fitHeadline(element);
  });
  document.fonts?.ready?.then(() => headlines.forEach(fitHeadline));

  document.querySelector("[data-grid-toggle]")?.addEventListener("click", event => {
    const enabled = board.classList.toggle("grid-off") === false;
    event.currentTarget.setAttribute("aria-pressed", String(enabled));
    event.currentTarget.textContent = enabled ? "Quitar cuadrícula" : "Agregar cuadrícula";
  });
  const photoButton = document.querySelector("[data-photo-button]");
  const photoInput = document.querySelector("[data-photo-input]");
  let activePhotoUrl = null;
  photoButton?.addEventListener("click", () => photoInput?.click());
  photoInput?.addEventListener("change", event => {
    const file = event.currentTarget.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const nextPhotoUrl = URL.createObjectURL(file);
    const photoTarget = board.querySelector("[data-photo-target]");
    if (photoTarget) photoTarget.src = nextPhotoUrl;
    else board.style.setProperty("--photo-url", `url("${nextPhotoUrl}")`);
    if (activePhotoUrl) URL.revokeObjectURL(activePhotoUrl);
    activePhotoUrl = nextPhotoUrl;
  });
  document.querySelector("[data-reset]")?.addEventListener("click", () => window.location.reload());
})();
