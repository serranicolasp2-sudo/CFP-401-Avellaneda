(() => {
  const board = document.getElementById("artboard");
  const stage = document.getElementById("stage");
  if (!board || !stage) return;

  const periodInput = document.querySelector("[data-period]");
  const fileInput = document.querySelector("[data-data-file]");
  const options = document.querySelector("[data-course-options]");
  const search = document.querySelector("[data-search]");
  const status = document.querySelector("[data-source-status]");
  const grid = board.querySelector("[data-course-grid]");
  const periodLabel = board.querySelector("[data-period-label]");
  const counter = board.querySelector("[data-course-count]");
  let courses = [];
  let selectedIds = new Set();
  let filterText = "";
  let currentPage = 0;
  const pageControls = document.querySelector("[data-page-controls]");
  const pageStatus = document.querySelector("[data-page-status]");

  const alignContactNotes = () => {
    board.querySelectorAll(".contact").forEach(contact => {
      const label = contact.querySelector(".contact-label");
      const note = contact.querySelector(".note");
      if (!label || !note) return;
      const syncWidth = () => { note.style.width = `${label.offsetWidth}px`; };
      syncWidth();
      if ("ResizeObserver" in window && !label.dataset.noteWidthObserved) {
        const observer = new ResizeObserver(syncWidth);
        observer.observe(label);
        label.dataset.noteWidthObserved = "true";
      }
    });
  };

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
  alignContactNotes();
  window.addEventListener("resize",alignContactNotes,{passive:true});
  document.fonts?.ready?.then(() => requestAnimationFrame(alignContactNotes));

  const normalizeCourse = (course,index) => {
    const name = String(course?.curso || course?.nombre || "").trim();
    if (!name) return null;
    return {
      id:String(course.slug || `${course.familia || "curso"}-${name}`).toLowerCase(),
      name,
      family:String(course.familia || "Formación profesional").trim(),
      duration:String(course.duracion || "").trim(),
      schedule:String(course.horarios || "A confirmar").trim() || "A confirmar",
      requirements:String(course.requisitos || "A confirmar").trim() || "A confirmar",
      sourceIndex:index
    };
  };

  const courseCycle = course => {
    const text = course.duration.toLocaleLowerCase("es-AR");
    if (text.includes("dos comisiones")) return {kind:"mixed",label:"ANUAL + CUATRIMESTRAL · CONFIRMAR",periods:["marzo","agosto"],suggested:false};
    if (text.includes("anual") && !text.includes("cuatrimestral")) return {kind:"annual",label:"ANUAL · MARZO",periods:["marzo"],suggested:true};
    if (text.includes("cuatrimestral")) {
      const march = text.includes("marzo") || text.includes("1° cuatrimestre") || text.includes("1º cuatrimestre");
      const august = text.includes("agosto") || text.includes("2° cuatrimestre") || text.includes("2º cuatrimestre");
      if (march && august) return {kind:"cuatrimestral",label:"CUATRIMESTRAL · MARZO / AGOSTO",periods:["marzo","agosto"],suggested:true};
      if (march) return {kind:"cuatrimestral",label:"CUATRIMESTRAL · MARZO",periods:["marzo"],suggested:true};
      if (august) return {kind:"cuatrimestral",label:"CUATRIMESTRAL · AGOSTO",periods:["agosto"],suggested:true};
      return {kind:"cuatrimestral",label:"CUATRIMESTRAL · CONFIRMAR INICIO",periods:[],suggested:false};
    }
    if (text.includes("anual")) return {kind:"mixed",label:"ANUAL + CUATRIMESTRAL · CONFIRMAR",periods:["marzo","agosto"],suggested:false};
    return {kind:"unknown",label:"PERÍODO A CONFIRMAR",periods:[],suggested:false};
  };

  const currentPeriod = () => periodInput?.value || "marzo";
  const suggestedCourses = () => courses.filter(course => {
    const cycle = courseCycle(course);
    return cycle.suggested && cycle.periods.includes(currentPeriod());
  });
  const checkedCourses = () => courses.filter(course => selectedIds.has(course.id));

  const courseOption = course => {
    const label = document.createElement("label");
    label.className = "course-option";
    label.dataset.searchText = `${course.name} ${course.family} ${course.duration}`.toLocaleLowerCase("es-AR");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = course.id;
    input.checked = selectedIds.has(course.id);
    const copy = document.createElement("span");
    copy.className = "course-option-copy";
    const name = document.createElement("span");
    name.className = "course-option-name";
    name.textContent = course.name;
    const meta = document.createElement("span");
    meta.className = "course-option-meta";
    meta.textContent = `${course.family} · ${courseCycle(course).label}`;
    copy.append(name,meta);
    label.append(input,copy);
    if (filterText && !label.dataset.searchText.includes(filterText)) label.hidden = true;
    return label;
  };

  const pageCapacity = () => {
    if (board.classList.contains("rows")) return Math.max(1,checkedCourses().length);
    return board.classList.contains("feed") ? 6 : 8;
  };
  const layoutFor = count => {
    const rowsMode = board.classList.contains("rows");
    const columns = rowsMode ? 1 : 2;
    const rows = Math.max(1,rowsMode ? count : Math.ceil(count / columns));
    const font = rowsMode ? (count <= 2 ? 22 : count <= 4 ? 18 : count <= 7 ? 15 : count <= 11 ? 12.5 : count <= 16 ? 11 : 9.8) : (count <= 2 ? 28 : count <= 4 ? 23 : 19);
    const detailFont = rowsMode ? (count <= 7 ? 15 : count <= 11 ? 13 : count <= 16 ? 11.5 : board.classList.contains("feed") ? 9.8 : 10.8) : (count <= 2 ? 14 : count <= 4 ? 13 : 12);
    const labelFont = rowsMode ? (count > 16 ? 8 : count > 10 ? 9 : 10) : 9;
    return {columns,rows,font,detailFont,labelFont,gap:rowsMode ? (count > 16 ? 2 : count > 10 ? 4 : 8) : (count <= 3 ? 16 : 10)};
  };

  const fitCardTitles = () => {
    grid.querySelectorAll(".course-card").forEach(card => {
      const title = card.querySelector(".course-name");
      let size = Number.parseFloat(getComputedStyle(title).fontSize);
      const min = board.classList.contains("feed") ? 13 : 14;
      while (size > min && title.scrollHeight > title.clientHeight + 1) {
        size = Math.max(min,size-.5);
        title.style.fontSize = `${size}px`;
      }
    });
  };

  const renderBoard = () => {
    const selected = checkedCourses();
    const period = currentPeriod();
    const capacity = pageCapacity();
    const pageCount = Math.max(1,Math.ceil(selected.length / capacity));
    currentPage = Math.min(currentPage,pageCount-1);
    const visible = selected.slice(currentPage*capacity,(currentPage+1)*capacity);
    const layout = layoutFor(visible.length);
    periodLabel.textContent = period.toLocaleUpperCase("es-AR");
    counter.textContent = String(selected.length).padStart(2,"0");
    if (pageControls) pageControls.hidden = pageCount <= 1;
    if (pageStatus) pageStatus.textContent = `Página ${currentPage+1} de ${pageCount} · ${selected.length} cursos`;
    grid.style.setProperty("--columns",layout.columns);
    grid.style.setProperty("--rows",layout.rows);
    grid.style.setProperty("--course-font",`${layout.font}px`);
    grid.style.setProperty("--detail-font",`${layout.detailFont}px`);
    grid.style.setProperty("--label-font",`${layout.labelFont}px`);
    grid.style.setProperty("--row-padding",visible.length > 16 ? "1px 3px" : visible.length > 10 ? "3px 6px" : "8px 12px");
    grid.style.setProperty("--grid-gap",`${layout.gap}px`);
    grid.replaceChildren();

    if (!selected.length) {
      grid.classList.add("is-empty");
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = courses.length ? "Elegí los cursos a incluir en el listado." : "Cargá data.js para elegir cursos y generar el listado.";
      grid.append(empty);
      return;
    }

    grid.classList.remove("is-empty");
    visible.forEach((course,index) => {
      const cycle = courseCycle(course);
      const rowsMode = board.classList.contains("rows");
      const card = document.createElement("article");
      card.className = "course-card";
      const family = document.createElement("div");
      family.className = "course-family";
      family.textContent = course.family;
      const number = document.createElement("span");
      number.className = "course-index";
      number.textContent = String(currentPage*capacity+index+1).padStart(2,"0");
      const title = document.createElement("div");
      title.className = "course-name";
      title.textContent = course.name;
      const type = document.createElement("div");
      type.className = "course-type";
      type.textContent = rowsMode
        ? cycle.kind === "annual" ? "ANUAL" : cycle.kind === "cuatrimestral" ? "CUATRIMESTRAL" : "*"
        : cycle.label;
      const details = document.createElement("div");
      details.className = "course-details";
      const schedule = document.createElement("p");
      schedule.className = "course-detail course-schedule";
      const scheduleLabel = document.createElement("strong");
      scheduleLabel.textContent = "DÍAS Y HORARIOS";
      const scheduleText = document.createElement("span");
      scheduleText.textContent = course.schedule;
      schedule.append(scheduleLabel,scheduleText);
      const requirements = document.createElement(rowsMode ? "div" : "p");
      requirements.className = "course-detail course-requirements";
      const requirementsLabel = document.createElement("strong");
      requirementsLabel.textContent = "REQUISITOS";
      const requirementsText = document.createElement("span");
      requirementsText.textContent = course.requirements;
      requirements.append(requirementsLabel,requirementsText);
      details.append(schedule,requirements);
      const heading = document.createElement("div");
      heading.className = "course-heading";
      if (rowsMode) heading.append(family,title);
      else heading.append(family,title,type);
      card.append(number,heading,details);
      if (rowsMode) card.append(type);
      grid.append(card);
    });
    requestAnimationFrame(fitCardTitles);
  };

  document.querySelector("[data-page-prev]")?.addEventListener("click",() => { currentPage=Math.max(0,currentPage-1); renderBoard(); });
  document.querySelector("[data-page-next]")?.addEventListener("click",() => { currentPage=Math.min(Math.ceil(checkedCourses().length/pageCapacity())-1,currentPage+1); renderBoard(); });

  const renderOptions = () => {
    options.replaceChildren(...courses.map(courseOption));
    if (!courses.length) {
      const empty = document.createElement("span");
      empty.className = "data-status";
      empty.textContent = "No se detectó el catálogo. Usá “Cargar/actualizar data.js”.";
      options.append(empty);
    }
  };

  const installCatalog = (input,sourceName="data.js") => {
    const normalized = Array.isArray(input) ? input.map(normalizeCourse).filter(Boolean) : [];
    if (!normalized.length) throw new Error("No encontré la lista courses en el archivo seleccionado.");
    courses = normalized;
    selectedIds = new Set(suggestedCourses().map(course => course.id));
    renderOptions();
    renderBoard();
    status.textContent = `Catálogo actualizado · ${courses.length} cursos · ${sourceName}`;
  };

  const parseDataFile = async file => {
    const source = await file.text();
    const marker = source.indexOf("window.CFP_DATA");
    const equals = marker >= 0 ? source.indexOf("=",marker) : -1;
    const end = source.lastIndexOf(";");
    if (equals < 0 || end <= equals) throw new Error("El archivo no tiene el formato esperado de data.js.");
    const data = JSON.parse(source.slice(equals+1,end).trim());
    installCatalog(data.courses,file.name);
  };

  document.querySelector("[data-load-data]")?.addEventListener("click",() => fileInput?.click());
  fileInput?.addEventListener("change",async event => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try { await parseDataFile(file); }
    catch (error) { status.textContent = error.message; }
  });
  periodInput?.addEventListener("change",() => {
    currentPage = 0;
    selectedIds = new Set(suggestedCourses().map(course => course.id));
    renderOptions();
    renderBoard();
  });
  options?.addEventListener("change",event => {
    currentPage = 0;
    const input = event.target.closest("input[type=checkbox]");
    if (!input) return;
    if (input.checked) selectedIds.add(input.value);
    else selectedIds.delete(input.value);
    renderBoard();
  });
  search?.addEventListener("input",event => {
    filterText = event.currentTarget.value.trim().toLocaleLowerCase("es-AR");
    renderOptions();
  });
  document.querySelector("[data-select-period]")?.addEventListener("click",() => {
    currentPage = 0;
    suggestedCourses().forEach(course => selectedIds.add(course.id));
    renderOptions();
    renderBoard();
  });
  document.querySelector("[data-select-all]")?.addEventListener("click",() => {
    currentPage = 0;
    selectedIds = new Set(courses.map(course => course.id));
    renderOptions();
    renderBoard();
  });
  document.querySelector("[data-clear]")?.addEventListener("click",() => {
    currentPage = 0;
    selectedIds.clear();
    renderOptions();
    renderBoard();
  });
  document.querySelector("[data-grid-toggle]")?.addEventListener("click",event => {
    const enabled = board.classList.toggle("grid-off") === false;
    event.currentTarget.setAttribute("aria-pressed",String(enabled));
    event.currentTarget.textContent = enabled ? "Quitar cuadrícula" : "Agregar cuadrícula";
  });

  const initialCourses = window.CFP_DATA?.courses;
  if (Array.isArray(initialCourses)) {
    try { installCatalog(initialCourses); }
    catch (error) { status.textContent = error.message; }
  } else {
    status.textContent = "Cargá data.js para comenzar";
    renderOptions();
    renderBoard();
  }
  document.fonts?.ready?.then(() => requestAnimationFrame(fitCardTitles));
})();
