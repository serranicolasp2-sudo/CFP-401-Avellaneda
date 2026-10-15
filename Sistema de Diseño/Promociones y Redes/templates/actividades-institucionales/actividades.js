(() => {
  const board = document.getElementById("artboard");
  const stage = document.getElementById("stage");
  if (!board || !stage) return;

  const dimensions = () => board.classList.contains("stories") ? [1080,1920] : board.classList.contains("a4") ? [1240,1754] : [1080,1350];
  const resize = () => {
    const [width,height] = dimensions();
    const scale = Math.min(1,Math.max(.3,(window.innerWidth-36)/width));
    stage.style.width = `${width*scale}px`;
    stage.style.height = `${height*scale}px`;
    board.style.setProperty("--scale",scale);
  };
  window.addEventListener("resize",resize,{passive:true});
  resize();

  // Placa: un solo renglón; si el texto es largo achica la letra (mínimo 28 px) en vez de salirse
  const tag = board.querySelector("[data-fit-width]");
  const fitTag = () => {
    if (!tag) return;
    tag.style.fontSize = "";
    let size = Number.parseFloat(getComputedStyle(tag).fontSize);
    const minSize = Number(tag.dataset.minFont) || 28;
    while (size > minSize && tag.scrollWidth > tag.clientWidth + 1) {
      size = Math.max(minSize,size-2);
      tag.style.fontSize = `${size}px`;
    }
  };

  // Titular y bajada: si no entran en su zona (o una palabra no entra de ancho), se achican juntos
  // en proporción con --fit, hasta la mitad. El panel hace lo mismo con ajustarZona().
  const zone = board.querySelector("[data-fit-zone]");
  const fitZone = () => {
    if (!zone) return;
    const content = zone.firstElementChild;
    const wide = [...zone.querySelectorAll(".headline")];
    let fit = 1;
    zone.style.setProperty("--fit","1");
    const overflows = () => content.offsetHeight > zone.clientHeight + 1 || wide.some(el => el.scrollWidth > el.clientWidth + 1);
    while (fit > .5 && overflows()) {
      fit = Math.max(.5,fit-.025);
      zone.style.setProperty("--fit",String(fit));
    }
  };
  const fitAll = () => { fitTag(); fitZone(); };
  board.querySelectorAll("[contenteditable]").forEach(element => element.addEventListener("input",fitAll));
  fitAll();
  document.fonts?.ready?.then(fitAll);

  document.querySelector("[data-arco-toggle]")?.addEventListener("click",event => {
    const visible = board.classList.toggle("sin-arco") === false;
    event.currentTarget.setAttribute("aria-pressed",String(visible));
    event.currentTarget.textContent = visible ? "Quitar arco" : "Agregar arco";
  });
  const photoButton = document.querySelector("[data-photo-button]");
  const photoInput = document.querySelector("[data-photo-input]");
  let activePhotoUrl = null;
  photoButton?.addEventListener("click",() => photoInput?.click());
  photoInput?.addEventListener("change",event => {
    const file = event.currentTarget.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const nextPhotoUrl = URL.createObjectURL(file);
    const image = board.querySelector("[data-photo-target]");
    if (image) { image.src = nextPhotoUrl; image.alt = "Fotografía de la actividad"; }
    if (activePhotoUrl) URL.revokeObjectURL(activePhotoUrl);
    activePhotoUrl = nextPhotoUrl;
  });
  document.querySelector("[data-reset]")?.addEventListener("click",() => window.location.reload());
})();
