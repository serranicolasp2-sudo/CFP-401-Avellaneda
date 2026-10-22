(function (root) {
  'use strict';
  const ESTADOS_CUPO = new Set(['sin-confirmar', 'abierto', 'ultimos-cupos', 'completo']);
  const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';
  const VIGENCIA_CUPO_DIAS = 30;

  function normalizarFecha(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
  }

  function estadoCupoValido(curso) {
    return Boolean(curso && ESTADOS_CUPO.has(curso.estadoCupo));
  }

  function estadoCupoVencido(curso, hoy) {
    const fecha = normalizarFecha(curso && curso.cupoConfirmadoEn);
    if (!fecha) return true;
    const actual = hoy || new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(new Date());
    const dias = (Date.parse(`${actual}T12:00:00Z`) - Date.parse(`${fecha}T12:00:00Z`)) / 86400000;
    return dias < 0 || dias > VIGENCIA_CUPO_DIAS;
  }

  function puedePublicarUltimosCupos(curso, hoy) {
    return Boolean(estadoCupoValido(curso) && curso.estadoCupo === 'ultimos-cupos' && !estadoCupoVencido(curso, hoy));
  }

  // Huella de los datos del curso que se imprimen en las piezas. No incluye el estado de cupos: al
  // reconfirmarlo no deben quedar "desactualizadas" todas las promociones del curso (los avisos de
  // últimos cupos se validan aparte, en vivo). Mismo algoritmo (FNV-1a) en el navegador y en Node.
  function huellaCurso(curso) {
    if (!curso) return '';
    const campos = ['slug', 'curso', 'familia', 'duracion', 'horarios', 'requisitos', 'sede'];
    const contenido = campos.map(k => `${k}:${String(curso[k] == null ? '' : curso[k]).trim()}`).join('\n');
    let hash = 2166136261;
    for (let i = 0; i < contenido.length; i++) hash = Math.imul(hash ^ contenido.charCodeAt(i), 16777619);
    return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  function fechaLocal(now, zone) {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: zone || ZONA_HORARIA, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now || new Date());
    const part = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return `${part.year}-${part.month}-${part.day}`;
  }

  function popupVigente(promo, now) {
    if (!promo || promo.popupActivo !== true) return false;
    const desde = normalizarFecha(promo.popupDesde);
    const hasta = normalizarFecha(promo.popupHasta);
    if (desde && hasta && hasta < desde) return false;
    const hoy = fechaLocal(now, promo.popupZonaHoraria || ZONA_HORARIA);
    return (!desde || hoy >= desde) && (!hasta || hoy <= hasta);
  }

  function promoDesactualizada(promo, cursos) {
    if (!promo || !promo.huellaCurso) return false;
    const curso = (cursos || []).find(c => c.slug === promo.cursoSlug);
    return !curso || huellaCurso(curso) !== promo.huellaCurso;
  }

  // Turnos del curso: los marcados en el panel o, si no hay, los que surgen de los horarios
  // ("Mañana: …", "Tarde: …", "Noche: …" o la hora de inicio de cada franja).
  const TURNOS = ['Mañana', 'Tarde', 'Noche'];
  function turnoPorHora(horaInicio) {
    const [h, m] = horaInicio.split(':').map(Number);
    const minutos = h * 60 + (m || 0);
    if (minutos < 12 * 60) return 'Mañana';
    return minutos < 17 * 60 + 30 ? 'Tarde' : 'Noche';
  }
  function turnosDeCurso(curso) {
    if (!curso) return [];
    if (Array.isArray(curso.turnos) && curso.turnos.length) return TURNOS.filter(t => curso.turnos.includes(t));
    const encontrados = new Set();
    String(curso.horarios || '').split(/\s+·\s+/).forEach(franja => {
      const etiqueta = franja.match(/^\s*(mañana|tarde|noche)\b/i);
      if (etiqueta) { encontrados.add(etiqueta[1][0].toUpperCase() + etiqueta[1].slice(1).toLowerCase()); return; }
      const hora = franja.match(/\bde\s+(\d{1,2}(?::\d{2})?)\s+a\s+\d/i);
      if (hora) encontrados.add(turnoPorHora(hora[1]));
    });
    return TURNOS.filter(t => encontrados.has(t));
  }

  // Un curso responde a su slug y a los anteriores (cuando se renombra, los enlaces ya compartidos siguen andando)
  function slugsDeCurso(curso) {
    return curso ? [curso.slug, ...(curso.slugsAnteriores || [])].filter(Boolean) : [];
  }

  const api = { ESTADOS_CUPO: Array.from(ESTADOS_CUPO), ZONA_HORARIA, VIGENCIA_CUPO_DIAS, TURNOS, estadoCupoValido, estadoCupoVencido, puedePublicarUltimosCupos, huellaCurso, fechaLocal, popupVigente, promoDesactualizada, turnosDeCurso, slugsDeCurso };
  root.CFPReglas = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
