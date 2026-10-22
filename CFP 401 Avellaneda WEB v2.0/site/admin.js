const {
  useState,
  useEffect,
  useRef
} = React;

/* Catálogo, textos editables y componentes de las plantillas: vienen de plantillas-promo.js,
   compartido con el sitio público (fuente en fuente-jsx/plantillas-promo.jsx). */

/* Título del flyer: el nombre del curso sin la aclaración final entre paréntesis. Si así no
   entra en 3 líneas, se corta en el primer " + ", " — " o " (" (§4 del plan). Se puede editar. */
function tituloCortoFlyer(nombre) {
  let t = (nombre || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  const mayus = t.toUpperCase();
  if (lineasTitulo(mayus, tamanoTitulo(mayus)) > 3) {
    const corte = t.search(/\s\+\s|\s—\s|\s\(/);
    if (corte > 0) t = t.slice(0, corte).trim();
  }
  return t;
}

/* Foto sugerida para un curso: primero las de ese curso (por cursoSlug o por el nombre de
   archivo "{slug}-{n}.jpg", también con los slugs anteriores si se renombró), después las de su familia */
function fotoSugeridaPromo(c, biblioteca) {
  if (!c) return null;
  const fotos = biblioteca || [];
  const slugs = window.CFPReglas.slugsDeCurso(c);
  const esDelCurso = f => f.cursoSlug && slugs.includes(f.cursoSlug) || slugs.includes((f.archivo || '').split('/').pop().replace(/-\d+\.\w+$/, ''));
  return fotos.find(esDelCurso) || fotos.find(f => f.familia === c.familia) || null;
}

/* Transformador de curso a datos de promoción (§4) */
function cursoAPromo(c, fotoDefault = 'assets/promociones/soldadura-1.webp') {
  if (!c) return null;
  const nombreUpper = tituloCortoFlyer(c.curso).toUpperCase();

  // Primer turno del horario (los turnos se separan con " · "), sin aclaraciones entre
  // paréntesis ni etiquetas como "Tarde:". Días y horario se pueden editar en el paso 4.
  const turno = (c.horarios || '').split(/\s+·\s+/)[0].replace(/\s*\([^)]*\)/g, '').trim();
  let dias = turno;
  let horario = '';
  const corteHorario = turno.search(/\s+de\s+\d/i);
  if (corteHorario > 0) {
    dias = turno.slice(0, corteHorario).trim();
    horario = turno.slice(corteHorario).replace(/^\s+de\s+/i, '').replace(/\s+en el anexo$/i, '').trim();
  }
  dias = dias.replace(/^(mañana|tarde|noche|vespertino)\s*:\s*/i, '');
  dias = dias.charAt(0).toUpperCase() + dias.slice(1);
  let req = (c.requisitos || '').trim();
  if (/^estudios/i.test(req)) {
    req = 'Constancia de ' + req.charAt(0).toLowerCase() + req.slice(1);
  } else if (!/^constancia/i.test(req) && req.length > 0) {
    req = req.charAt(0).toUpperCase() + req.slice(1);
  }
  let sede = (c.sede || '').replace(/^Sede\s+/i, '').trim();

  // Para la plantilla alternativa: bajada (primera oración de la introducción) y duración
  const intro = (c.introduccion || '').trim();
  let bajadaCurso = (intro.match(/^[^.]*\./) || [intro])[0].trim();
  if (bajadaCurso.length > 200) bajadaCurso = bajadaCurso.slice(0, 200).replace(/\s+\S*$/, '') + '…';
  const duracionCurso = (c.duracion || '').replace(/\s*\([^)]*\)/g, '').trim() || c.horasTotales || '';
  return {
    id: 'promo-' + (c.slug || 'curso') + '-' + Date.now().toString(36),
    modelo: 'flyer-curso-v1',
    tipo: 'curso',
    cursoSlug: c.slug || '',
    cursoNombre: nombreUpper,
    cursoTitulo: tituloCortoFlyer(c.curso),
    familiaNombre: c.familia || '',
    bajadaCurso,
    duracionCurso,
    // Datos originales del curso: si se vacía un campo en el paso 4, la pieza vuelve a estos
    datosCurso: {
      dias,
      horario,
      requisito: req || 'Constancia de estudios primarios o superiores',
      sede: sede || 'Juan Pablo Angulo 1272, Dock Sud'
    },
    textos: {},
    imagen: fotoDefault,
    encuadre: '40% 45%',
    diasOverride: dias,
    horarioOverride: horario,
    requisitoOverride: req || 'Constancia de estudios primarios o superiores',
    sedeOverride: sede || 'Juan Pablo Angulo 1272, Dock Sud',
    certificacionOverride: 'Oficial DGCyE',
    fondo: 'cuadriculado',
    popupActivo: false,
    fechaCreacion: new Date().toISOString().split('T')[0]
  };
}

/* Trae a una promoción los datos actuales de su curso sin pisar lo editado a mano: se conservan el id,
   la foto, el fondo y los textos; días, horario, requisito, sede y titular se renuevan solo si seguían
   iguales a los que había tomado del curso. Guarda además la huella del curso para detectar cambios. */
function refrescarDatosCurso(promo, curso) {
  if (!promo || !curso) return promo;
  const nuevo = cursoAPromo(curso, promo.imagen);
  const antes = promo.datosCurso || {};
  const renovar = (valor, anterior, actual) => valor == null || valor === '' || valor === anterior ? actual : valor;
  const tituloAnterior = (promo.cursoTitulo || '').toUpperCase();
  return {
    ...promo,
    cursoSlug: nuevo.cursoSlug,
    cursoNombre: renovar(promo.cursoNombre, tituloAnterior, nuevo.cursoNombre),
    cursoTitulo: nuevo.cursoTitulo,
    familiaNombre: nuevo.familiaNombre,
    bajadaCurso: nuevo.bajadaCurso,
    duracionCurso: nuevo.duracionCurso,
    datosCurso: nuevo.datosCurso,
    diasOverride: renovar(promo.diasOverride, antes.dias, nuevo.datosCurso.dias),
    horarioOverride: renovar(promo.horarioOverride, antes.horario, nuevo.datosCurso.horario),
    requisitoOverride: renovar(promo.requisitoOverride, antes.requisito, nuevo.datosCurso.requisito),
    sedeOverride: renovar(promo.sedeOverride, antes.sede, nuevo.datosCurso.sede),
    huellaCurso: window.CFPReglas ? window.CFPReglas.huellaCurso(curso) : promo.huellaCurso,
    estadoCupoUsado: curso.estadoCupo || 'sin-confirmar',
    cupoConfirmadoEnUsado: curso.cupoConfirmadoEn || ''
  };
}

/* Tipo de pieza según su plantilla: 'curso' o 'inscripciones' */
function tipoDePromo(promo) {
  return plantillaDePromo(promo).tipo || 'curso';
}

/* Punto de enfoque de la foto: en el paso 3 y también en la vista previa (al elegir la foto se pasa
   solo al paso 4, así que ahí se puede corregir viendo el resultado) */
const ENCUADRES = [{
  label: 'Taller foco',
  val: '40% 45%'
}, {
  label: 'Centro',
  val: '50% 50%'
}, {
  label: 'Arriba',
  val: '50% 20%'
}, {
  label: 'Abajo',
  val: '50% 80%'
}, {
  label: 'Izquierda',
  val: '20% 50%'
}, {
  label: 'Derecha',
  val: '80% 50%'
}];
function SelectorEncuadre({
  promo,
  setPromo
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 6
    }
  }, "Punto de enfoque de la foto (encuadre):"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, ENCUADRES.map(pos => {
    const activo = promo.encuadre === pos.val;
    return /*#__PURE__*/React.createElement("button", {
      key: pos.val,
      type: "button",
      title: pos.val,
      "aria-pressed": activo,
      onClick: () => setPromo(prev => ({
        ...prev,
        encuadre: pos.val
      })),
      style: {
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 12,
        border: '1px solid',
        borderColor: activo ? 'var(--blue-900)' : '#cbd5e1',
        background: activo ? 'var(--blue-900)' : '#fff',
        color: activo ? '#fff' : 'var(--neutral-700)',
        cursor: 'pointer'
      }
    }, pos.label);
  })));
}

/* Pasos del asistente que usa cada plantilla: el 2 (un curso, varios cursos o familias de oficios)
   solo si la plantilla lo pide, y el 3 (foto) solo si lleva foto. Los demás quedan bloqueados. */
function pasoHabilitado(promo, paso) {
  const p = plantillaDePromo(promo);
  if (paso === 2) return Boolean(p.pasoCurso);
  if (paso === 3) return p.usaFoto !== false;
  return true;
}
function pasoSiguiente(promo, desde) {
  for (let n = desde + 1; n < 4; n++) if (pasoHabilitado(promo, n)) return n;
  return 4;
}
function pasoAnterior(promo, desde) {
  for (let n = desde - 1; n > 1; n--) if (pasoHabilitado(promo, n)) return n;
  return 1;
}
function nombrePaso2(promo) {
  const p = plantillaDePromo(promo).pasoCurso;
  return p === 'familias' ? 'Familias' : p === 'varios' ? 'Cursos' : 'Curso';
}
function tituloPaso2(promo) {
  const p = plantillaDePromo(promo).pasoCurso;
  return p === 'familias' ? 'Elegir Familias de Oficios' : p === 'varios' ? 'Elegir los Cursos del Listado' : 'Seleccionar Curso a Promocionar';
}
/* Texto de los botones "Continuar" y "Volver" según el paso al que llevan */
function rotuloPaso(promo, paso) {
  if (paso === 1) return 'Modelo';
  if (paso === 2) {
    const p = plantillaDePromo(promo).pasoCurso;
    return p === 'familias' ? 'Familias' : p === 'varios' ? 'Cursos' : 'Curso';
  }
  if (paso === 3) return 'Foto';
  return 'Vista Previa';
}
function volverA(promo, paso) {
  return paso === 1 ? '← Volver al Modelo' : '← Volver a ' + rotuloPaso(promo, paso);
}
function motivoPasoBloqueado(paso) {
  return paso === 2 ? 'Este modelo no se asocia a un curso' : paso === 3 ? 'Este modelo no lleva foto' : '';
}

/* Promoción de apertura de inscripciones: no se liga a un curso sino a las familias de oficios */
function inscripcionesAPromo(data) {
  return {
    id: 'promo-inscripciones-' + Date.now().toString(36),
    modelo: 'apertura-inscripciones-v1',
    tipo: 'inscripciones',
    cursoSlug: '',
    cursoNombre: 'INSCRIPCIONES ABIERTAS',
    familias: (data && data.familias || []).map(f => f.nombre),
    imagen: 'assets/hero-egresados.jpg',
    encuadre: 'center',
    textos: {},
    popupActivo: false,
    fechaCreacion: new Date().toISOString().split('T')[0]
  };
}

/* Fotos disponibles: las propias de la plantilla (si trae), las institucionales del sitio (hero y
   fachada) y la biblioteca de promociones */
function fotosParaPromo(data, promo) {
  const propias = promo && plantillaDePromo(promo).fotos || [];
  const institucionales = [...(data.heroFotos || []).map(f => f.includes('/') ? f : 'assets/' + f), 'assets/fachada-cfp401.jpg'].map(archivo => ({
    id: 'inst-' + archivo,
    familia: 'Institucional',
    archivo,
    nombre: archivo.split('/').pop().replace(/^hero-|\.\w+$/g, '').replace(/-/g, ' '),
    encuadre: 'center'
  }));
  return [...propias, ...institucionales, ...(data.bibliotecaFotosPromo || [])];
}

/* Paso 4: formulario con todos los textos de la plantilla, agrupados como en la pieza */
function CamposPromo({
  promo,
  setPromo
}) {
  const grupos = [];
  plantillaDePromo(promo).campos.forEach(campo => {
    let grupo = grupos.find(g => g.nombre === campo.grupo);
    if (!grupo) grupos.push(grupo = {
      nombre: campo.grupo,
      campos: []
    });
    grupo.campos.push(campo);
  });
  const cambiar = (campo, valor) => setPromo(prev => campo.legado ? {
    ...prev,
    [campo.legado]: valor
  } : {
    ...prev,
    textos: {
      ...(prev.textos || {}),
      [campo.clave]: valor
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, "Todos los textos se pueden cambiar. Si vaciás un campo, la pieza vuelve al texto original."), grupos.map(grupo => /*#__PURE__*/React.createElement("div", {
    key: grupo.nombre,
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 6
    }
  }, grupo.nombre), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, grupo.campos.map(campo => {
    const guardado = campo.legado ? promo[campo.legado] : (promo.textos || {})[campo.clave];
    const original = valorTextoPromo({
      ...promo,
      textos: {},
      ...(campo.legado ? {
        [campo.legado]: ''
      } : {})
    }, campo);
    const valor = typeof guardado === 'string' ? guardado : original;
    const anchoCompleto = campo.multilinea || /^(titulo|curso|bajada|requisito|linea1|linea2)$/.test(campo.clave);
    const tituloFinal = (valor || original).toUpperCase();
    const tituloLargo = campo.clave === 'titulo' && lineasTitulo(tituloFinal, tamanoTitulo(tituloFinal)) > 3;
    const props = {
      className: 'form-input',
      value: valor,
      placeholder: original,
      onChange: e => cambiar(campo, e.target.value)
    };
    return /*#__PURE__*/React.createElement("div", {
      key: campo.clave,
      className: "form-group",
      style: {
        marginBottom: 0,
        gridColumn: anchoCompleto ? '1 / -1' : 'auto'
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      style: {
        marginBottom: 2
      }
    }, campo.etiqueta), campo.multilinea ? /*#__PURE__*/React.createElement("textarea", {
      rows: 2,
      ...props,
      style: {
        resize: 'vertical'
      }
    }) : /*#__PURE__*/React.createElement("input", {
      type: "text",
      ...props
    }), tituloLargo && /*#__PURE__*/React.createElement("div", {
      className: "form-hint",
      style: {
        color: '#b45309'
      }
    }, "Título muy largo: ocupa más de 3 líneas y la letra queda chica. Conviene acortarlo."));
  })))));
}

/* Paso 2 de la grilla: período y cursos (en el orden del catálogo) */
function SeleccionCursosGrilla({
  promo,
  setPromo
}) {
  const [busqueda, setBusqueda] = useState('');
  const cursos = cursosParaGrilla();
  const periodo = promo.periodo || 'marzo';
  const elegidos = Array.isArray(promo.cursosSeleccionados) ? promo.cursosSeleccionados : sugeridosGrilla(periodo);
  const poner = ids => setPromo(prev => ({
    ...prev,
    cursosSeleccionados: cursos.filter(c => ids.includes(c.id)).map(c => c.id),
    pagina: 0
  }));
  const alternar = id => poner(elegidos.includes(id) ? elegidos.filter(x => x !== id) : elegidos.concat(id));
  const texto = busqueda.trim().toLocaleLowerCase('es-AR');
  const visibles = cursos.filter(c => !texto || (c.nombre + ' ' + c.familia + ' ' + c.duracion).toLocaleLowerCase('es-AR').includes(texto));
  const boton = {
    padding: '6px 12px',
    fontSize: 12.5
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'flex-end',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Inicio de cursada"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: periodo,
    onChange: e => {
      const p = e.target.value;
      setPromo(prev => ({
        ...prev,
        periodo: p,
        cursosSeleccionados: sugeridosGrilla(p),
        pagina: 0
      }));
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "marzo"
  }, "Marzo"), /*#__PURE__*/React.createElement("option", {
    value: "agosto"
  }, "Agosto"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0,
      flex: '1 1 200px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Buscar curso"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "search",
    value: busqueda,
    placeholder: "Nombre o familia",
    onChange: e => setBusqueda(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    style: boton,
    onClick: () => poner(elegidos.concat(sugeridosGrilla(periodo)))
  }, "Sumar los sugeridos de ", periodo), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    style: boton,
    onClick: () => poner(cursos.map(c => c.id))
  }, "Seleccionar todos"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    style: boton,
    onClick: () => poner([])
  }, "Limpiar"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, elegidos.length, " de ", cursos.length, " cursos elegidos")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
      gap: 6,
      maxHeight: 300,
      overflowY: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 8,
      background: '#f8faff'
    }
  }, visibles.map(c => {
    const marcado = elegidos.includes(c.id);
    return /*#__PURE__*/React.createElement("label", {
      key: c.id,
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        padding: '6px 8px',
        borderRadius: 6,
        cursor: 'pointer',
        background: marcado ? '#e8eefb' : 'transparent',
        fontSize: 13,
        lineHeight: 1.3
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: marcado,
      onChange: () => alternar(c.id),
      style: {
        marginTop: 2,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        display: 'block',
        color: 'var(--blue-900)'
      }
    }, c.nombre), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--neutral-500)'
      }
    }, c.familia, " · ", c.ciclo.etiqueta)));
  })), /*#__PURE__*/React.createElement("p", {
    className: "form-hint",
    style: {
      marginTop: 8
    }
  }, "Al cambiar el período se marcan los cursos que en el catálogo tienen indicado ese inicio. Los que dicen \"confirmar\" se pueden sumar a mano después de verificarlos."));
}

/* Paso 4 de la grilla: composición (en grilla o por filas) y página a exportar */
function OpcionesGrilla({
  promo,
  setPromo,
  formato,
  onEditarCursos
}) {
  const total = seleccionGrilla(promo).length;
  const paginas = paginasGrilla(promo, formato);
  const pagina = Math.min(promo.pagina || 0, paginas - 1);
  const composicion = promo.composicion === 'filas' ? 'filas' : 'grilla';
  const opcion = activa => ({
    flex: 1,
    padding: '7px 10px',
    fontSize: 12.5,
    borderRadius: 6,
    border: '1px solid',
    borderColor: activa ? 'var(--blue-900)' : '#cbd5e1',
    background: activa ? 'var(--blue-900)' : '#fff',
    color: activa ? '#fff' : 'var(--neutral-700)',
    cursor: 'pointer'
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, "En este modelo los textos son los del diseño y no se editan: solo se eligen los cursos, el período de inicio y la composición."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--blue-900)',
      fontWeight: 700
    }
  }, total, " cursos · inicio en ", promo.periodo || 'marzo'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    style: {
      marginTop: 8
    },
    onClick: onEditarCursos
  }, "Cambiar cursos o período")), /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 4
    }
  }, "Composición"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: opcion(composicion === 'grilla'),
    onClick: () => setPromo(prev => ({
      ...prev,
      composicion: 'grilla',
      pagina: 0
    }))
  }, "En grilla (tarjetas)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: opcion(composicion === 'filas'),
    onClick: () => setPromo(prev => ({
      ...prev,
      composicion: 'filas',
      pagina: 0
    }))
  }, "Por filas (una sola página)")), paginas > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 4
    }
  }, "Página (", formato === 'feed' ? 6 : 8, " cursos por página en este formato)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    disabled: pagina === 0,
    onClick: () => setPromo(prev => ({
      ...prev,
      pagina: pagina - 1
    }))
  }, "← Anterior"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Página ", pagina + 1, " de ", paginas), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    disabled: pagina >= paginas - 1,
    onClick: () => setPromo(prev => ({
      ...prev,
      pagina: pagina + 1
    }))
  }, "Siguiente →")), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Cada página se descarga por separado.")));
}

/* Paso 4: elementos que se pueden ocultar en las plantillas nuevas */
function OpcionesPromo({
  promo,
  setPromo
}) {
  const opciones = {
    'apertura-inscripciones-v1': [['mostrarSello', 'Sello (Oficial y gratuito)'], ['mostrarFamilias', 'Familias de oficios']],
    'flyer-curso-v2': [['mostrarCinta', 'Cinta (Oficial y gratuito)']],
    'captacion-oficios-v1': [['mostrarCuadricula', 'Cuadrícula de fondo']],
    'ultimos-cupos-v1': [['mostrarCuadricula', 'Cuadrícula de fondo']],
    'conmemoraciones-patrias-v1': [['mostrarCuadricula', 'Cuadrícula sobre la foto']],
    'grilla-cursos-v1': [['mostrarCuadricula', 'Cuadrícula de fondo']],
    'aviso-primaria-v1': [['mostrarSello', 'Sello de fecha límite'], ['mostrarExtranjero', 'Recuadro para extranjeros']],
    'actividad-institucional-v1': [['mostrarArco', 'Arco de fondo (marca de agua)']]
  }[promo.modelo] || [['mostrarSello', 'Círculo (Oficial y gratuito)']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 4
    }
  }, "Mostrar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, opciones.map(([clave, etiqueta]) => /*#__PURE__*/React.createElement("label", {
    key: clave,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: promo[clave] !== false,
    onChange: e => setPromo(prev => ({
      ...prev,
      [clave]: e.target.checked
    }))
  }), etiqueta))));
}

/* Tipografías del flyer incrustadas (data URL) para html-to-image. La librería no llega sola a
   las fuentes de Google, que entran por un @import anidado en tokens/fonts.css: la primera
   exportación después de abrir el panel salía con Arial, y las siguientes iban duplicando
   fuentes. Se arma una sola vez por sesión, solo con los pesos y alfabetos que usa el flyer. */
let flyerFontCSSPromesa = null;
function obtenerFontCSSFlyer() {
  if (!flyerFontCSSPromesa) {
    flyerFontCSSPromesa = (async () => {
      const url = 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap';
      const css = await (await fetch(url)).text();
      const bloques = css.match(/\/\*\s*(latin|latin-ext)\s*\*\/\s*@font-face\s*\{[^}]*\}/g) || [];
      const archivos = new Map();
      const aDataUrl = src => {
        if (!archivos.has(src)) {
          archivos.set(src, fetch(src).then(r => r.blob()).then(blob => new Promise((res, rej) => {
            const lector = new FileReader();
            lector.onload = () => res(lector.result);
            lector.onerror = rej;
            lector.readAsDataURL(blob);
          })));
        }
        return archivos.get(src);
      };
      const caras = await Promise.all(bloques.map(async bloque => {
        const src = (bloque.match(/url\((https:[^)]+)\)/) || [])[1];
        return src ? bloque.replace(/^\/\*[^*]*\*\/\s*/, '').replace(src, await aDataUrl(src)) : '';
      }));
      if (!caras.some(Boolean)) throw new Error('Sin tipografías');
      return caras.join('\n');
    })().catch(err => {
      flyerFontCSSPromesa = null;
      throw err;
    });
  }
  return flyerFontCSSPromesa;
}

/* Exportador a PNG usando html-to-image */
async function exportarPromoPNG(promo, formato = 'feed', showToast, guardarEnServidor = false, onPngGuardado) {
  if (!window.htmlToImage) {
    if (showToast) showToast('La biblioteca html-to-image no se encuentra cargada.', 'error');
    return;
  }
  formato = formatoParaPromo(promo, formato);
  if (showToast) showToast(`Generando PNG ${formato.toUpperCase()}...`, 'info');
  let w = 1080;
  let h = 1350;
  if (formato === 'historia') {
    w = 1080;
    h = 1920;
  }
  if (formato === 'a4') {
    w = 2480;
    h = 3508;
  }
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-99999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = `${w}px`;
  tempContainer.style.height = `${h}px`;
  tempContainer.style.zIndex = '-9999';
  document.body.appendChild(tempContainer);
  try {
    const root = ReactDOM.createRoot(tempContainer);
    await new Promise(resolve => {
      root.render(/*#__PURE__*/React.createElement(RenderPromoFlyer, {
        promo: promo,
        formato: formato
      }));
      setTimeout(resolve, 350);
    });
    if (document.fonts) {
      await document.fonts.ready;
    }
    const fontEmbedCSS = await obtenerFontCSSFlyer().catch(() => undefined);
    const imgs = tempContainer.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(res => {
        img.onload = res;
        img.onerror = res;
      });
    }));
    const flyerEl = tempContainer.querySelector('.flyer-canvas') || tempContainer;
    const pRatio = formato === 'a4' ? 1 : 1.25;
    const dataUrl = await window.htmlToImage.toPng(flyerEl, {
      pixelRatio: pRatio,
      cacheBust: false,
      fontEmbedCSS
    });
    const slug = promo.cursoSlug || promo.id || 'curso';
    if (guardarEnServidor) {
      const form = new FormData();
      form.append('png', await (await fetch(dataUrl)).blob(), `promo-${slug}-${formato}.png`);
      form.append('promoId', promo.id || slug);
      form.append('formato', formato);
      const response = await fetch('api/guardar-promo-png.php', {
        method: 'POST',
        credentials: 'include',
        body: form
      });
      if (response.status === 401) throw new Error('La sesión venció. Ingresá nuevamente para guardar la pieza.');
      // Nginx corta con 413 (HTML, no JSON) si la pieza supera client_max_body_size
      if (response.status === 413) throw new Error('La pieza pesa más de lo que acepta el servidor. Descargala y avisá al responsable del sitio para subir el límite de carga.');
      let json = null;
      try {
        json = await response.json();
      } catch (_) {}
      if (!response.ok || !json || !json.success) throw new Error(json && json.error || `El servidor respondió ${response.status}: no se pudo guardar el PNG.`);
      const registro = {
        formato,
        archivo: json.url,
        guardadoEn: new Date().toISOString()
      };
      if (typeof onPngGuardado === 'function') onPngGuardado(promo, registro);
      if (showToast) showToast(`PNG ${formato.toUpperCase()} guardado en el servidor: ${json.url}`);
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `promo-${slug}-${formato}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (showToast) showToast(`¡Flyer ${formato.toUpperCase()} descargado con éxito!`);
    }
  } catch (err) {
    console.error('Error al exportar flyer PNG:', err);
    if (showToast) showToast(guardarEnServidor && err && err.message ? err.message : 'Error al generar la imagen. Probá nuevamente.', 'error');
  } finally {
    if (tempContainer.parentNode) {
      document.body.removeChild(tempContainer);
    }
  }
}

/* Muestras visuales de referencia para el selector de modelos en Paso 1 */
const MUESTRAS_PLANTILLAS = {
  'flyer-curso-v1': {
    id: 'muestra-v1',
    modelo: 'flyer-curso-v1',
    tipo: 'curso',
    cursoNombre: 'SOLDADOR BÁSICO',
    imagen: 'assets/promociones/soldador-basico-1.jpg',
    encuadre: '50% 45%',
    datosCurso: {
      dias: 'Martes y jueves',
      horario: '17:50 a 21:50 hs',
      sede: 'Juan Pablo Angulo 1272, Dock Sud',
      requisito: 'Constancia de primaria o secundaria'
    },
    textos: {
      antetitulo: 'CURSO · FORMACIÓN PROFESIONAL',
      frase: 'ES TU TIEMPO\nDE APRENDER',
      cta: '¡INSCRIBITE\nAHORA!',
      selloGrande: 'OFICIAL Y',
      selloChico: 'GRATUITO'
    }
  },
  'flyer-curso-v2': {
    id: 'muestra-v2',
    modelo: 'flyer-curso-v2',
    tipo: 'curso',
    cursoNombre: 'ELECTRICIDAD EN INMUEBLES',
    cursoTitulo: 'Electricidad en Inmuebles',
    familiaNombre: 'ELECTRICIDAD',
    bajadaCurso: 'Instalaciones eléctricas y gestión energética con certificación oficial.',
    duracionCurso: '1 año',
    imagen: 'assets/promociones/electricidad-en-inmuebles-paneles-solares-1.jpg',
    encuadre: '50% 50%',
    datosCurso: {
      dias: 'Lunes a jueves',
      horario: '18:00 a 21:30 hs',
      sede: 'Juan Pablo Angulo 1272, Dock Sud',
      requisito: 'Constancia de primaria o secundaria'
    },
    textos: {
      cta: '¡Inscribite ahora!',
      cintaGrande: 'OFICIAL Y',
      cintaChica: 'GRATUITO'
    }
  },
  'apertura-inscripciones-v1': {
    id: 'muestra-v3',
    modelo: 'apertura-inscripciones-v1',
    tipo: 'inscripciones',
    cursoNombre: 'INSCRIPCIONES ABIERTAS',
    familias: ['Electricidad', 'Construcción', 'Informática', 'Metalmecánica'],
    imagen: 'assets/hero-egresados.jpg',
    encuadre: 'center',
    datosCurso: {
      sede: 'Juan Pablo Angulo 1272, Dock Sud'
    },
    textos: {
      antetitulo: 'FORMACIÓN PROFESIONAL',
      linea1: 'INSCRIPCIONES',
      linea2: 'ABIERTAS',
      bajada: 'Cursos de formación profesional con certificación oficial DGCyE en Dock Sud.',
      selloGrande: 'OFICIAL Y',
      selloChico: 'GRATUITO',
      dato1Label: 'INSCRIPCIÓN',
      dato1: 'Abiertas',
      dato2Label: 'SEDE',
      dato2: 'J. P. Angulo 1272',
      etiquetaWhatsapp: 'WHATSAPP',
      whatsapp: '11 6105-6018'
    }
  },
  'captacion-oficios-v1': {
    id: 'muestra-captacion',
    modelo: 'captacion-oficios-v1',
    tipo: 'captacion',
    imagen: 'assets/promociones/tematicas/captacion/captacion-1.jpg',
    textos: {}
  },
  'ultimos-cupos-v1': {
    id: 'muestra-cupos',
    modelo: 'ultimos-cupos-v1',
    tipo: 'curso',
    cursoNombre: 'SOLDADOR BÁSICO',
    cursoTitulo: 'Soldador Básico',
    imagen: 'assets/promociones/tematicas/ultimos-cupos/ultimos-cupos-1.jpg',
    datosCurso: {
      dias: 'Martes y jueves',
      horario: '17:50 a 21:50 hs',
      sede: 'Juan Pablo Angulo 1272, Dock Sud',
      requisito: 'Constancia de estudios primarios o superiores'
    },
    textos: {}
  },
  'conmemoraciones-patrias-v1': {
    id: 'muestra-patrias',
    modelo: 'conmemoraciones-patrias-v1',
    tipo: 'efemeride',
    imagen: 'assets/promociones/tematicas/dias-patrios/dias-patrios-1.jpg',
    textos: {}
  },
  'aviso-primaria-v1': {
    id: 'muestra-primaria',
    modelo: 'aviso-primaria-v1',
    tipo: 'aviso',
    imagen: 'assets/promociones/tematicas/primaria/primaria-egresados.jpg',
    textos: {}
  },
  // La pieza de la que nació la plantilla (visita de SIMMA, 15/10/2026)
  'actividad-institucional-v1': {
    id: 'muestra-actividad',
    modelo: 'actividad-institucional-v1',
    tipo: 'aviso',
    imagen: 'assets/promociones/tematicas/actividades/visita-simma-capacitacion.jpg',
    textos: {
      placa: 'CAPACITACIÓN',
      titulo: 'MÁQUINAS Y HERRAMIENTAS',
      bajada: 'SIMMA Grupo Empresas brindó una capacitación a nuestros estudiantes.'
    }
  },
  'grilla-cursos-v1': {
    id: 'muestra-grilla',
    modelo: 'grilla-cursos-v1',
    tipo: 'grilla',
    periodo: 'marzo',
    composicion: 'grilla',
    textos: {}
  }
};

/* ---------- Catálogo oficial 2027 (DGCyE): alta de cursos ----------
   Lista precargada de todos los trayectos del catálogo (site/catalogo/catalogo-2027.json, extraído del PDF
   oficial con herramientas/catalogo/extraer.py). Desde acá se da de alta un curso en el sitio con los datos
   del catálogo o se vincula a un curso que ya existe (un curso del sitio puede reunir varios trayectos). */
const SECTOR_A_FAMILIA = {
  AC: 'Administración',
  SM: 'Administración',
  OC: 'Construcción',
  EE: 'Electricidad',
  ET: 'Informática',
  IM: 'Informática',
  CS: 'Informática',
  IC: 'Informática',
  MT: 'Metalmecánica',
  EM: 'Climatización'
};
const normalizarNombre = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const nombreCertificado = t => (t.certificacion || '').split(/\s+seg[uú]n\s+/i)[0];
function familiaSugerida(t, familiasSitio) {
  if (/solar|renovable/i.test(t.nombre) && familiasSitio.includes('Energías Renovables')) return 'Energías Renovables';
  const f = SECTOR_A_FAMILIA[t.familia];
  return f && familiasSitio.includes(f) ? f : familiasSitio[0] || '';
}
function unificarDatosCatalogo(trayectos) {
  if (!trayectos || !trayectos.length) return null;
  const totalReloj = trayectos.reduce((acc, t) => acc + (Number(t.horasReloj) || 0), 0);
  const totalCatedra = trayectos.reduce((acc, t) => acc + (Number(t.horasCatedra) || 0), 0);
  const horasTotales = `${totalReloj} horas reloj` + (totalCatedra ? ` (${totalCatedra} hs cátedra)` : '');
  let certificacion = '';
  if (trayectos.length === 1) {
    certificacion = trayectos[0].certificacion || trayectos[0].nombre;
  } else {
    const certs = trayectos.map(t => {
      const res = (t.resJurisdiccional || '').trim();
      return `• ${t.nombre}${res ? ` (Res. ${res})` : ''}`;
    });
    certificacion = `Se otorgan ${trayectos.length} certificaciones oficiales de la DGCyE:\n` + certs.join('\n');
  }
  let introduccion = '';
  if (trayectos.length === 1) {
    introduccion = trayectos[0].introduccion || '';
  } else {
    const nombres = trayectos.map(t => t.nombre);
    introduccion = `Trayecto formativo integral que articula las especialidades y certificaciones oficiales de ${nombres.join(', ')}. Quienes completan la cursada obtienen ${trayectos.length} títulos oficiales de la Dirección General de Cultura y Educación.`;
  }
  let detalles = '';
  if (trayectos.length === 1) {
    detalles = trayectos[0].detalles || '';
  } else {
    const cods = trayectos.map(t => t.codigo).join(', ');
    const encabezado = `Este trayecto formativo aúna los contenidos y prácticas de ${trayectos.length} diseños curriculares oficiales de la DGCyE (${cods}), permitiendo a los estudiantes capacitarse de forma integral y articulada en una sola cursada, obteniendo cada una de las certificaciones correspondientes al finalizar.`;
    const bloques = trayectos.map(t => {
      const horas = t.horasReloj ? ` (${t.horasReloj} hs reloj)` : '';
      return `=== ${t.nombre.toUpperCase()}${horas} ===

${t.detalles || 'Contenidos teóricos y prácticas según diseño curricular oficial de la DGCyE.'}`;
    });
    detalles = [encabezado, ...bloques].join('\n\n');
  }
  const pideSecundaria = trayectos.some(t => (t.requisitos || '').toLowerCase().includes('secundari'));
  const requisitos = pideSecundaria ? 'Estudios secundarios completos' : 'Estudios primarios completos';
  return {
    horasTotales,
    certificacion,
    introduccion,
    detalles,
    requisitos
  };
}
function buscarCoincidenciasCatalogo(curso, catalogo) {
  if (!curso || !catalogo || !catalogo.trayectos) return [];
  if (curso.trayectosCatalogo && curso.trayectosCatalogo.length) {
    const map = Object.fromEntries(catalogo.trayectos.map(t => [t.codigo, t]));
    const sel = curso.trayectosCatalogo.map(c => map[c]).filter(Boolean);
    if (sel.length) return sel;
  }
  const partes = (curso.curso || '').split(/\s*\+\s*/).map(normalizarNombre).filter(Boolean);
  const matches = [];
  const normFull = normalizarNombre(curso.curso);
  catalogo.trayectos.forEach(t => {
    const nt = normalizarNombre(t.nombre);
    const nc = normalizarNombre(nombreCertificado(t));
    if (normFull === nt || normFull === nc) {
      if (!matches.some(m => m.codigo === t.codigo)) matches.push(t);
    } else {
      for (const p of partes) {
        const pClean = p.replace(/\(.*?\)/g, '').trim();
        if (p === nt || p === nc || pClean === nt || pClean === nc) {
          if (!matches.some(m => m.codigo === t.codigo)) matches.push(t);
        } else if (pClean.length > 10 && (pClean.includes(nt) || nt.includes(pClean))) {
          if (!matches.some(m => m.codigo === t.codigo)) matches.push(t);
        } else if (pClean.includes('sanitari') && pClean.includes('gas') && (t.codigo === 'OC32' || t.codigo === 'OC33')) {
          if (!matches.some(m => m.codigo === t.codigo)) matches.push(t);
        } else if ((pClean.includes('termico') || pClean.includes('solar')) && t.codigo === 'OC42') {
          if (!matches.some(m => m.codigo === t.codigo)) matches.push(t);
        }
      }
    }
  });
  return matches;
}
function CatalogoOficial({
  cursos,
  familiasSitio,
  catalogo: catalogoProp,
  onAlta,
  onEditar,
  onVincular,
  onDesvincular
}) {
  const [catalogoLocal, setCatalogoLocal] = useState(null);
  const catalogo = catalogoProp || catalogoLocal;
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [sector, setSector] = useState('');
  const [estado, setEstado] = useState('todos');
  const [abiertos, setAbiertos] = useState({});
  const [visibles, setVisibles] = useState(40);
  const [vinculando, setVinculando] = useState(null);
  useEffect(() => {
    fetch('catalogo/catalogo-2027.json', {
      cache: 'no-cache'
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(c => {
      if (!catalogoProp) setCatalogoLocal(c);
    }).catch(err => setError('No se pudo cargar el catálogo (' + err.message + ').'));
  }, []);
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  useEffect(() => {
    setVisibles(40);
  }, [busqueda, sector, estado]);
  if (error) return /*#__PURE__*/React.createElement("div", {
    className: "form-hint",
    style: {
      color: '#b91c1c'
    }
  }, error);
  if (!catalogo) return /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Cargando el catálogo oficial 2027…");

  // Cursos del sitio vinculados a cada trayecto, y posibles coincidencias por nombre
  const vinculados = {};
  cursos.forEach((c, i) => (c.trayectosCatalogo || []).forEach(cod => {
    (vinculados[cod] = vinculados[cod] || []).push({
      curso: c,
      indice: i
    });
  }));
  const posibles = t => vinculados[t.codigo] ? [] : cursos.map((c, i) => ({
    curso: c,
    indice: i
  })).filter(({
    curso
  }) => curso.curso.split(/\s*\+\s*/).map(normalizarNombre).some(p => p === normalizarNombre(t.nombre) || p === normalizarNombre(nombreCertificado(t))));
  const q = normalizarNombre(busqueda);
  const nombreSector = Object.fromEntries(catalogo.familias.map(f => [f.codigo, f.nombre]));
  const filtrados = catalogo.trayectos.filter(t => {
    if (sector && t.familia !== sector) return false;
    if (estado === 'sitio' && !vinculados[t.codigo]) return false;
    if (estado === 'no-listados' && vinculados[t.codigo]) return false;
    if (estado === 'con-pagina' && !t.introduccion) return false;
    if (estado === 'posibles' && !posibles(t).length) return false;
    if (estado === 'observaciones' && !(t.observaciones || []).length) return false;
    if (!q) return true;
    const texto = normalizarNombre([t.codigo, t.nombre, t.certificacion, t.codigoDisenoCurricular, ...t.modulos.map(m => m.codigoPlanificacion + ' ' + m.denominacion)].join(' '));
    return q.split(' ').every(p => texto.includes(p));
  });
  const enSitio = catalogo.trayectos.filter(t => vinculados[t.codigo]).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "admin-course-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Catálogo oficial 2027 · Alta de cursos"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, catalogo.trayectos.length, " trayectos de la DGCyE precargados (", catalogo.familias.length, " sectores). ", enSitio, " vinculados a cursos del sitio. \"Dar de alta\" abre el editor de cursos con los datos del catálogo: después completás días, horarios y sede."))), /*#__PURE__*/React.createElement("div", {
    className: "admin-course-filters",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    style: {
      flex: '2 1 280px'
    },
    placeholder: "Buscar por código, nombre, módulo, código de planificación o de diseño curricular…",
    value: busqueda,
    onChange: e => setBusqueda(e.target.value)
  }), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    style: {
      flex: '1 1 200px'
    },
    value: sector,
    onChange: e => setSector(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Todos los sectores"), catalogo.familias.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.codigo,
    value: f.codigo
  }, f.codigo, " · ", f.nombre))), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    style: {
      flex: '1 1 200px'
    },
    value: estado,
    onChange: e => setEstado(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "todos"
  }, "Todos"), /*#__PURE__*/React.createElement("option", {
    value: "sitio"
  }, "Ya están en el sitio"), /*#__PURE__*/React.createElement("option", {
    value: "no-listados"
  }, "No listados"), /*#__PURE__*/React.createElement("option", {
    value: "con-pagina"
  }, "Con página individual lista (", catalogo.trayectos.filter(t => t.introduccion).length, ")"), /*#__PURE__*/React.createElement("option", {
    value: "posibles"
  }, "Posible coincidencia por nombre"), /*#__PURE__*/React.createElement("option", {
    value: "observaciones"
  }, "Con observaciones para revisar"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--neutral-500)',
      marginBottom: 12
    }
  }, "Mostrando ", Math.min(visibles, filtrados.length), " de ", filtrados.length, ". Fuente: ", catalogo.fuente, ".", ' ', /*#__PURE__*/React.createElement("a", {
    href: "catalogo/catalogo-2027.pdf",
    target: "_blank",
    rel: "noopener"
  }, "Abrir el PDF")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtrados.slice(0, visibles).map(t => {
    const vinc = vinculados[t.codigo] || [];
    const sugeridos = posibles(t);
    const abierto = !!abiertos[t.codigo];
    const obs = t.observaciones || [];
    return /*#__PURE__*/React.createElement("div", {
      key: t.codigo,
      className: "admin-course-card",
      style: {
        alignItems: 'flex-start',
        borderLeft: vinc.length ? '4px solid #16a34a' : '4px solid transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "admin-course-info",
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "admin-course-title-row",
      style: {
        flexWrap: 'wrap',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "admin-course-badge-slug",
      style: {
        fontWeight: 800
      }
    }, t.codigo), /*#__PURE__*/React.createElement("strong", {
      className: "admin-course-title"
    }, t.nombre), /*#__PURE__*/React.createElement("span", {
      className: "admin-course-badge-main",
      title: nombreSector[t.familia]
    }, nombreSector[t.familia] || t.familia), t.tipoCertificacion && /*#__PURE__*/React.createElement("span", {
      className: "admin-course-badge-sub"
    }, t.tipoCertificacion), t.introduccion && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        background: '#e0f2fe',
        color: '#0369a1',
        padding: '2px 8px',
        borderRadius: 999
      },
      title: "Tiene página individual precargada con introducción y detalles"
    }, "Página lista"), vinc.map(v => /*#__PURE__*/React.createElement("span", {
      key: v.indice,
      style: {
        fontSize: 11,
        fontWeight: 700,
        background: '#dcfce7',
        color: '#166534',
        padding: '2px 8px',
        borderRadius: 999
      }
    }, "En el sitio: ", v.curso.curso))), /*#__PURE__*/React.createElement("div", {
      className: "admin-course-details"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Certificación:"), " ", t.certificacion || '—'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Código de diseño curricular:"), " ", t.codigoDisenoCurricular || '—', t.codigoDisenoCurricular && /*#__PURE__*/React.createElement(React.Fragment, null, " · ", /*#__PURE__*/React.createElement("a", {
      href: 'https://www.google.com/search?q=' + encodeURIComponent('"' + t.codigoDisenoCurricular + '" diseño curricular formación profesional'),
      target: "_blank",
      rel: "noopener"
    }, "buscar en internet")), ' ', "· ", /*#__PURE__*/React.createElement("strong", null, "Horas:"), " ", t.horasReloj ?? '—', " reloj (", t.horasCatedra ?? '—', " cátedra) · ", /*#__PURE__*/React.createElement("strong", null, "Módulos:"), " ", t.modulos.length), t.requisitos && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Requisitos / correlatividad:"), " ", t.requisitos), obs.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        padding: '6px 10px',
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: 8,
        color: '#9a3412',
        fontSize: 12.5
      }
    }, obs.map((o, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, "⚠ ", o)), /*#__PURE__*/React.createElement("a", {
      href: 'catalogo/catalogo-2027.pdf#page=' + t.pagina,
      target: "_blank",
      rel: "noopener"
    }, "Ver página ", t.pagina, " del catálogo")), sugeridos.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: 12.5,
        color: 'var(--blue-900)'
      }
    }, "Posible coincidencia con ", sugeridos.map((s, i) => /*#__PURE__*/React.createElement("span", {
      key: s.indice
    }, i > 0 && ', ', "«", s.curso.curso, "» ", /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-secondary btn-sm",
      style: {
        padding: '2px 8px',
        fontSize: 11.5
      },
      onClick: () => onVincular(s.indice, t)
    }, "Vincular")))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setAbiertos(p => ({
        ...p,
        [t.codigo]: !abierto
      })),
      style: {
        marginTop: 6,
        background: 'none',
        border: 0,
        padding: 0,
        color: 'var(--blue-700)',
        fontWeight: 700,
        fontSize: 13,
        cursor: 'pointer'
      }
    }, abierto ? '▾ Ocultar módulos' : `▸ Ver los ${t.modulos.length} módulos`), abierto && /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto',
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        background: '#f1f5f9',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '6px 8px'
      }
    }, "Código de planificación"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '6px 8px'
      }
    }, "Denominación del módulo"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '6px 8px',
        textAlign: 'right'
      }
    }, "Hs. cát."), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '6px 8px',
        textAlign: 'right'
      }
    }, "Hs. reloj"))), /*#__PURE__*/React.createElement("tbody", null, t.modulos.map((m, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        borderTop: '1px solid #e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 8px',
        whiteSpace: 'nowrap',
        fontWeight: 700
      }
    }, m.codigoPlanificacion), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 8px'
      }
    }, m.denominacion || '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 8px',
        textAlign: 'right'
      }
    }, m.horasCatedra ?? '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 8px',
        textAlign: 'right'
      }
    }, m.horasReloj ?? '—')))))))), /*#__PURE__*/React.createElement("div", {
      className: "admin-course-actions",
      style: {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 6,
        minWidth: 190
      }
    }, vinc.map(v => /*#__PURE__*/React.createElement(React.Fragment, {
      key: v.indice
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => onEditar(v.indice)
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "edit-3",
      style: {
        width: 14
      }
    }), " Editar «", v.curso.curso.length > 22 ? v.curso.curso.slice(0, 22) + '…' : v.curso.curso, "»"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      style: {
        fontSize: 11.5
      },
      onClick: () => onDesvincular(v.indice, t)
    }, "Desvincular"))), !vinc.length && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-sm",
      onClick: () => onAlta(t, familiaSugerida(t, familiasSitio))
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 14
      }
    }), " Dar de alta en el sitio"), vinculando === t.codigo ? /*#__PURE__*/React.createElement("select", {
      className: "form-select",
      autoFocus: true,
      defaultValue: "",
      onChange: e => {
        if (e.target.value !== '') onVincular(Number(e.target.value), t);
        setVinculando(null);
      },
      onBlur: () => setVinculando(null),
      style: {
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "",
      disabled: true
    }, "Elegí el curso del sitio…"), cursos.map((c, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: i
    }, c.curso))) : /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => setVinculando(t.codigo)
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "link",
      style: {
        width: 14
      }
    }), " Vincular a un curso existente")));
  })), visibles < filtrados.length && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setVisibles(v => v + 40)
  }, "Mostrar 40 más (", filtrados.length - visibles, " restantes)")));
}
function AdminApp() {
  // Autenticación y registro de operador (§Auditoría)
  const [autenticado, setAutenticado] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState(() => sessionStorage.getItem('cfp401_admin_user') || '');
  const [usuarioActual, setUsuarioActual] = useState(() => sessionStorage.getItem('cfp401_admin_user') || 'Administrador');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Datos y estado de cambios
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('cursos');
  const [dirty, setDirty] = useState(false);
  // Copia de los datos tal como estaban al cargar el panel o en el último guardado (para "Revertir")
  const guardadoRef = useRef(null);
  const [guardando, setGuardando] = useState(false);
  const [registroCambios, setRegistroCambios] = useState(null); // null: sin cargar; [] o entradas
  const [toast, setToast] = useState(null);

  // Catálogo oficial 2027 precargado globalmente
  const [catalogoGlobal, setCatalogoGlobal] = useState(null);
  useEffect(() => {
    fetch('catalogo/catalogo-2027.json', {
      cache: 'no-cache'
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(setCatalogoGlobal).catch(() => {});
  }, []);

  // Modales y filtros
  const [cursoModal, setCursoModal] = useState(null); // null o curso object
  const [cursoIndex, setCursoIndex] = useState(-1);
  const [filtroFamilia, setFiltroFamilia] = useState('Todas');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [cambioClaveModal, setCambioClaveModal] = useState(false);
  const [nuevaClave, setNuevaClave] = useState('');
  const [claveActual, setClaveActual] = useState('');
  const [adminAgendaModal, setAdminAgendaModal] = useState(false);
  const [fechaSimulada, setFechaSimulada] = useState('2026-03-24');

  // Promociones y Flyers
  const [promoModal, setPromoModal] = useState(null); // null o promo object
  const [promoStep, setPromoStep] = useState(1); // 1: modelo, 2: curso, 3: foto & encuadre, 4: preview & overrides
  // Las elecciones únicas (modelo, curso, foto) pasan solas al paso siguiente; la pausa deja ver la marca de elegido.
  // Solo avanza si se sigue en el paso donde se eligió (si ya se apretó "Continuar", no hace nada)
  const avanzarPromo = (desde, hasta) => setTimeout(() => setPromoStep(actual => actual === desde ? hasta : actual), 250);
  const [promoPreviewFormat, setPromoPreviewFormat] = useState('feed'); // 'feed' | 'historia' | 'a4'
  // Plantillas de un solo formato (Aviso Primaria = solo Stories): la vista previa pasa a uno que admita
  useEffect(() => {
    if (!promoModal) return;
    const admitido = formatoParaPromo(promoModal, promoPreviewFormat);
    if (admitido !== promoPreviewFormat) setPromoPreviewFormat(admitido);
  }, [promoModal && promoModal.modelo, promoPreviewFormat]);
  const [promoIndex, setPromoIndex] = useState(-1);
  const [filtroPromoBusqueda, setFiltroPromoBusqueda] = useState('');
  const [filtroPromoCursoSelect, setFiltroPromoCursoSelect] = useState('');
  const [filtroFotoFamilia, setFiltroFotoFamilia] = useState('Todas');
  const handleTabChange = tab => {
    setActiveTab(tab);
    if (window.innerWidth <= 900) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Desplazar automáticamente el botón activo de la barra en celulares
  useEffect(() => {
    if (window.innerWidth <= 900) {
      const timer = setTimeout(() => {
        const activeBtn = document.querySelector('.admin-sidebar .admin-nav-item.active');
        if (activeBtn) {
          activeBtn.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Cargar datos iniciales
  useEffect(() => {
    // La contraseña ya no se guarda en el navegador (auditoría A2): se consulta al servidor si la
    // sesión sigue vigente. Se borra la copia que pudo haber dejado una versión anterior del panel.
    sessionStorage.removeItem('cfp401_admin_token');
    fetch('api/sesion.php', {
      credentials: 'include'
    }).then(r => r.json()).then(json => {
      if (json.autenticado) setAutenticado(true);
    }).catch(() => {});

    // Cargar desde window.CFP_DATA asegurando estructura v2.0
    const initial = JSON.parse(JSON.stringify(window.CFP_DATA || {}));
    if (!initial.heroFotos) {
      initial.heroFotos = ['hero-soldadura.jpg', 'hero-energias.jpg', 'hero-electricidad.jpg', 'hero-domotica.jpg', 'hero-egresados.jpg'];
    }
    if (!initial.home) {
      initial.home = {
        hero: {
          subtitulo: 'Es tu tiempo de aprender',
          titulo: 'Estudiá con nosotros',
          texto: 'Cursos presenciales sin costo de inscripción ni de cursada, con certificado de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires.'
        },
        cintaAmarilla: {
          titulo: 'Inscripciones abiertas a partir del 15 de noviembre',
          detalle: 'Lunes a viernes de 9 a 20 hs · Juan Pablo Angulo 1272, Dock Sud',
          urlMapa: 'https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1'
        },
        propuesta: {
          subtitulo: 'Nuestra propuesta',
          titulo: 'Aprendizajes que transforman',
          descripcion: 'Porque aprender también es construir futuro. Nuestros talleres funcionan con equipamiento real y docentes de oficio.',
          tarjetas: [{
            icono: 'graduation-cap',
            titulo: 'Títulos oficiales',
            descripcion: 'Certificación oficial de la Provincia de Buenos Aires.'
          }, {
            icono: 'wallet',
            titulo: 'Cursos Gratuitos',
            descripcion: 'Sin costo de inscripción ni de cursada: solo necesitás la documentación requerida.'
          }, {
            icono: 'wrench',
            titulo: 'Talleres equipados',
            descripcion: 'Prácticas en herrería, soldadura, electricidad, sanitarios y gas.'
          }]
        },
        opacidadTarjetas: 12
      };
    }
    if (initial.home && initial.home.opacidadTarjetas === undefined) {
      initial.home.opacidadTarjetas = 12;
    }
    if (!initial.inscripciones) initial.inscripciones = {};
    if (!initial.inscripciones.cintaCursos) {
      initial.inscripciones.cintaCursos = {
        visible: true,
        tipo: 'cerradas',
        tituloCerradas: initial.inscripciones.estado || 'Inscripciones cerradas por el momento',
        textoCerradas: initial.inscripciones.periodos || 'Hay dos períodos de inscripción por año: de noviembre a febrero para los cursos que comienzan en marzo, y durante junio y julio para los que comienzan en agosto.',
        tituloAbiertas: '¡Inscripciones Abiertas!',
        fechaCierre: '28 de Febrero',
        textoAbiertas: 'Acercate a la sede de Juan Pablo Angulo 1272 para completar tu inscripción.'
      };
    }
    if (!initial.estadisticas) {
      // Mismas cifras por defecto que ESTADISTICAS_POR_DEFECTO de app.jsx; {cursos} y {familias} se cuentan solos
      initial.estadisticas = {
        antetitulo: 'Desde 1979',
        titulo: '+45 años formando en oficios',
        anioCreacion: '1979',
        items: [{
          valor: '+3.600',
          etiqueta: 'Cursos dictados'
        }, {
          valor: '+36.000',
          etiqueta: 'Egresados en FI'
        }, {
          valor: '{familias}',
          etiqueta: 'Familias profesionales'
        }, {
          valor: '{cursos}',
          etiqueta: 'Cursos gratuitos'
        }]
      };
    }
    if (!initial.nosotros) {
      initial.nosotros = {
        header: {
          subtitulo: 'Nosotros',
          titulo: 'Más de cuatro décadas formando en oficios'
        },
        historia: {
          subtitulo: 'Historia Institucional',
          titulo: 'De la Unidad de Formación Profesional N° 13 al CFP N° 401',
          cuerpo: 'El Establecimiento fue creado como Unidad de Formación Profesional Nº 13 el 10 de agosto de 1979. Su radicación en el distrito de Avellaneda se produjo por disposición de la Dirección de Educación Media, Técnica y Formación Profesional el 22 de agosto de 1979.\n\nEn abril de 1985 cambió su denominación a Centro de Formación Profesional Nº 13.\n\nLuego de estar dictando cursos en la Escuela Primaria Nº 11 en la Av. Roca y Manuel Estévez, y de intensas gestiones efectuadas por parte de los directivos, se le otorga en el año 1986 el espacio que ocupa actualmente, ya estando a cargo del servicio educativo el Prof. Tranquillo Roberto como Director.\n\nCabe consignar que este nuevo edificio está ubicado en la calle J. P. Angulo 1272 de la localidad de Dock Sud, siendo propiedad de la D.G.C. y E. En él funcionó un servicio de Escuela Primaria hasta el año 1979, a partir del cual fue dado de baja al ser considerado inhabitable por el estado de deterioro total de su infraestructura.\n\nConvencidos de nuestra labor y de la importancia que la misma tiene al servicio de la comunidad, inmediatamente se iniciaron las tareas de reacondicionamiento, colaborando en dicha empresa todo el personal del establecimiento. Así, en poco tiempo se pudieron habilitar los servicios sanitarios y las aulas existentes, a los que se les sumó la reconstrucción de aulas. Con enorme trabajo y esfuerzo se consiguió este cometido ya en julio de 1987.\n\nEn 1994 la Provincia de Buenos Aires reenumeró los servicios educativos por distrito y el Centro pasó a denominarse C.F.P. Nº 401 de Avellaneda.\n\nDesde su creación y hasta la fecha se aprecia que, con el esfuerzo realizado, los logros obtenidos en los ámbitos educativos, sociales y edilicios fueron determinantes. Se destaca que desde su creación hasta el año próximo pasado se han dictado más de 2.300 cursos, que han logrado una cantidad de certificados en más de 24.000 egresados, cursando una extensa lista de especialidades.'
        },
        objetivos: {
          subtitulo: 'Objetivos generales del Centro',
          titulo: 'Formación con título oficial, al servicio del trabajo',
          cuerpo: 'El Centro de Formación Profesional 401 tiene entre sus objetivos impulsar y colaborar en la reinserción laboral, la reconversión de mano de obra y la capacitación continua, para un mejor desarrollo profesional y personal de quienes enfrentan el desafío del competitivo mercado laboral.\n\nSiendo una Escuela de Formación de Adultos de la Provincia de Buenos Aires, nuestros cursos cuentan con el aval que brindan los Diseños Curriculares del Consejo Federal de Educación para cada curso, y el otorgamiento de Títulos Oficiales de la Dirección de Cultura y Educación de la Provincia de Buenos Aires.'
        },
        redUocra: {
          titulo: 'Red de CFP de Trabajadores de la Construcción',
          cuerpo: 'El CFP 401 de Avellaneda forma parte de la Red de Centros de Formación Profesional de Trabajadores de la Construcción, con convenio con la Fundación de Educación y Capacitación de Trabajadores de la Construcción — Centro de Formación Continua, que asiste con los adelantos tecnológicos en equipamiento y actualización docente en forma activa.'
        }
      };
    }
    if (!initial.contacto) initial.contacto = {};
    if (!initial.contacto.anexoUrl) initial.contacto.anexoUrl = 'https://share.google/jpjdJqgyEQzbXONJT';
    if (!initial.campusVirtual) {
      initial.campusVirtual = {
        activo: true,
        modoInactivo: 'modal',
        url: 'https://campuscfp401avellaneda.com.ar/login/index.php',
        mensajeModal: 'El Campus Virtual se encuentra en proceso de actualización y puesta a punto. Muy pronto estará disponible para todos los estudiantes.'
      };
    }
    if (!initial.marbot) {
      initial.marbot = {
        activo: true,
        saludo: '¡Hola! Soy Marbot 🤖 Estoy para ayudarte con los cursos, los horarios, la inscripción y cómo llegar. Preguntame lo que quieras.'
      };
    }
    if (!initial.cintaEfemerides) {
      initial.cintaEfemerides = {
        activo: true
      };
    }
    guardadoRef.current = JSON.stringify(initial);
    setData(initial);
  }, []);

  // Ejecutar iconos Lucide
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
  const showToast = (msg, tipo = 'success') => {
    setToast({
      msg,
      tipo
    });
    setTimeout(() => setToast(null), 4500);
  };

  // Iniciar sesión
  const handleLogin = async e => {
    e.preventDefault();
    setErrorLogin('');

    // Probar contra el endpoint seguro de login
    try {
      const res = await fetch('api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          password: passwordInput
        })
      });
      const json = await res.json();
      if (res.status === 429) {
        setErrorLogin(json.error || 'Demasiados intentos fallidos. Espere 15 minutos.');
        return;
      }
      if (res.status === 401 || !json.success) {
        setErrorLogin(json.error || 'Contraseña incorrecta.');
        return;
      }
      // Login exitoso: desde acá autentica la cookie de sesión, no la contraseña
      const op = usuarioInput.trim() || 'Administrador';
      setUsuarioActual(op);
      sessionStorage.setItem('cfp401_admin_user', op);
      setPasswordInput('');
      setAutenticado(true);
      showToast('Sesión iniciada como ' + op);
    } catch (err) {
      // Si estamos probando sin servidor web PHP activo localmente, permitir login con fallback
      if (passwordInput.length >= 6) {
        const op = usuarioInput.trim() || 'Administrador';
        setUsuarioActual(op);
        sessionStorage.setItem('cfp401_admin_user', op);
        setPasswordInput('');
        setAutenticado(true);
        showToast('Ingreso local habilitado (' + op + ')');
      } else {
        setErrorLogin('Contraseña inválida o servidor no disponible.');
      }
    }
  };
  const handleLogout = async () => {
    try {
      await fetch('api/logout.php', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
    sessionStorage.removeItem('cfp401_admin_user');
    setUsuarioActual('Administrador');
    setAutenticado(false);
    showToast('Sesión cerrada');
  };

  // Si el servidor responde 401, la sesión venció (dura 2 horas): volver al login.
  // Los datos siguen en memoria, así que los cambios sin guardar no se pierden.
  const sesionVencida = res => {
    if (res.status !== 401) return false;
    setErrorLogin('Tu sesión venció. Ingresá de nuevo: los cambios sin guardar se conservan.');
    setAutenticado(false);
    return true;
  };

  // Actualizar datos
  const updateData = updater => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : {
        ...prev,
        ...updater
      };
      return next;
    });
    setDirty(true);
  };

  // Cifras institucionales (data.estadisticas): campos sueltos y cada una de las 4 cifras
  const actualizarCifras = cambios => updateData(prev => ({
    ...prev,
    estadisticas: {
      ...(prev.estadisticas || {}),
      ...cambios
    }
  }));
  const actualizarCifra = (i, clave, valor) => updateData(prev => {
    const items = [...(prev.estadisticas && prev.estadisticas.items || [])];
    while (items.length <= i) items.push({
      valor: '',
      etiqueta: ''
    });
    items[i] = {
      ...items[i],
      [clave]: valor
    };
    return {
      ...prev,
      estadisticas: {
        ...(prev.estadisticas || {}),
        items
      }
    };
  });

  // Guardar en servidor vía PHP
  const handleGuardarServidor = async () => {
    setGuardando(true);
    try {
      const res = await fetch('api/guardar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          data: data,
          usuario: usuarioActual
        })
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (json.success) {
        guardadoRef.current = JSON.stringify(data);
        setDirty(false);
        setRegistroCambios(null); // el registro de cambios se vuelve a pedir con la entrada nueva
        showToast(json.message || 'Datos guardados correctamente en el servidor.');
      } else {
        showToast(json.error || 'Error al guardar en el servidor', 'error');
      }
    } catch (err) {
      showToast('No se pudo conectar con api/guardar.php. Podés descargar el archivo data.js manualmente.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  // Revertir: descarta los cambios sin guardar y vuelve a los datos del último guardado (o de cuando se abrió el panel)
  const handleRevertir = () => {
    if (!dirty || !guardadoRef.current) return;
    if (!window.confirm('¿Descartar todos los cambios sin guardar y volver a como estaba en el último guardado?\n\nLas fotos o piezas que ya se subieron al servidor no se borran.')) return;
    setData(JSON.parse(guardadoRef.current));
    setDirty(false);
    setCursoModal(null);
    setPromoModal(null);
    showToast('Cambios descartados: el panel volvió al último guardado.');
  };

  // Registro de cambios (quién guardó y cuándo), en Sistema y Seguridad
  const cargarRegistroCambios = async () => {
    setRegistroCambios('cargando');
    try {
      const res = await fetch('api/registro.php', {
        credentials: 'include'
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      setRegistroCambios(json.success ? json.entradas : []);
    } catch (err) {
      setRegistroCambios('error');
    }
  };
  useEffect(() => {
    if (autenticado && activeTab === 'sistema' && registroCambios === null) cargarRegistroCambios();
  }, [autenticado, activeTab, registroCambios]);

  // Descargar data.js manualmente
  const handleDescargarDataJs = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const fileContent = "/* ===========================================================================\n" + "   CFP N° 401 AVELLANEDA — CONTENIDOS EDITABLES DEL SITIO (v2.0)\n" + "   Generado desde el Panel de Administración: " + new Date().toLocaleString() + "\n" + "   =========================================================================== */\n\n" + "window.CFP_DATA = " + jsonString + ";\n";
    const blob = new Blob([fileContent], {
      type: 'application/javascript;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archivo data.js descargado. Subilo a la carpeta de tu hosting.');
  };

  // Exportar Backup JSON
  const handleExportarBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-cfp401-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Copia de respaldo exportada.');
  };

  // Importar Backup JSON
  const handleImportarBackup = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.courses && parsed.familias) {
          setData(parsed);
          setDirty(true);
          showToast('Copia de seguridad restaurada. Recordá guardar en el servidor.');
        } else {
          showToast('El archivo de respaldo no tiene el formato correcto.', 'error');
        }
      } catch (err) {
        showToast('Error al leer el archivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Subir foto al servidor
  const handleSubirFoto = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    showToast('Subiendo imagen...', 'info');
    try {
      const res = await fetch('api/subir-foto.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (json.success) {
        updateData(prev => ({
          ...prev,
          heroFotos: [...(prev.heroFotos || []), json.filename]
        }));
        showToast('¡Foto cargada y agregada al carrusel!');
      } else {
        showToast(json.error || 'Error al subir imagen', 'error');
      }
    } catch (err) {
      // Si falla la subida por PHP (ej. entorno local sin server), agregar el nombre del archivo
      updateData(prev => ({
        ...prev,
        heroFotos: [...(prev.heroFotos || []), file.name]
      }));
      showToast(`Nombre de foto '${file.name}' agregado a la lista.`, 'info');
    }
  };

  // Fotos predeterminadas por familia profesional
  const FOTOS_DEFAULT_FAMILIAS = {
    'Administración': 'assets/area-administracion.jpg',
    'Construcción': 'assets/area-construccion.jpg',
    'Electricidad': 'assets/area-electricidad.jpg',
    'Climatización': 'assets/area-climatizacion.jpg',
    'Energías Renovables': 'assets/area-energias-renovables.jpg',
    'Informática': 'assets/area-informatica.jpg',
    'Metalmecánica': 'assets/area-metalmecanica.jpg'
  };

  // Subir o cambiar foto de fondo de familia profesional
  const handleSubirFotoFamilia = async (e, famIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    showToast('Subiendo foto de familia...', 'info');
    try {
      const res = await fetch('api/subir-foto.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (json.success) {
        updateData(prev => {
          const familias = [...(prev.familias || [])];
          familias[famIndex] = {
            ...familias[famIndex],
            imagen: 'assets/' + json.filename
          };
          return {
            ...prev,
            familias
          };
        });
        showToast('¡Foto de la familia actualizada!');
      } else {
        showToast(json.error || 'Error al subir foto', 'error');
      }
    } catch (err) {
      updateData(prev => {
        const familias = [...(prev.familias || [])];
        familias[famIndex] = {
          ...familias[famIndex],
          imagen: 'assets/' + file.name
        };
        return {
          ...prev,
          familias
        };
      });
      showToast(`Ruta 'assets/${file.name}' asignada a la familia.`, 'info');
    }
  };

  // Logo de la cinta de avisos (uno por versión: amarilla o blanca). Usa subir-foto.php, que conserva la transparencia de los PNG.
  const handleSubirLogoCinta = async (e, clave) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    showToast('Subiendo logo...', 'info');
    try {
      const res = await fetch('api/subir-foto.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (!json.success) {
        showToast(json.error || 'No se pudo subir el logo.', 'error');
        return;
      }
      updateData(prev => ({
        ...prev,
        home: {
          ...prev.home,
          cintaAmarilla: {
            ...(prev.home?.cintaAmarilla || {}),
            [clave]: 'assets/' + json.filename
          }
        }
      }));
      showToast('Logo cargado. Revisalo en la vista del sitio y guardá en el servidor para publicarlo.');
    } catch (err) {
      showToast('No se pudo subir el logo. Revisá la conexión y probá de nuevo.', 'error');
    }
  };

  // Subir foto para la biblioteca de promociones
  const handleSubirFotoPromo = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    showToast('Subiendo foto para promociones...', 'info');
    try {
      const res = await fetch('api/subir-foto.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (json.success) {
        const nuevaFoto = {
          id: 'f-user-' + Date.now(),
          familia: 'General',
          archivo: 'assets/' + json.filename,
          nombre: file.name.replace(/\.[^/.]+$/, ''),
          encuadre: '50% 50%'
        };
        updateData(prev => ({
          ...prev,
          bibliotecaFotosPromo: [nuevaFoto, ...(prev.bibliotecaFotosPromo || [])]
        }));
        if (promoModal) {
          setPromoModal(prev => ({
            ...prev,
            imagen: 'assets/' + json.filename
          }));
        }
        showToast('¡Foto cargada a la biblioteca de promociones!');
      } else {
        showToast(json.error || 'Error al subir foto', 'error');
      }
    } catch (err) {
      const localRuta = 'assets/' + file.name;
      const nuevaFoto = {
        id: 'f-user-' + Date.now(),
        familia: 'General',
        archivo: localRuta,
        nombre: file.name.replace(/\.[^/.]+$/, ''),
        encuadre: '50% 50%'
      };
      updateData(prev => ({
        ...prev,
        bibliotecaFotosPromo: [nuevaFoto, ...(prev.bibliotecaFotosPromo || [])]
      }));
      if (promoModal) {
        setPromoModal(prev => ({
          ...prev,
          imagen: localRuta
        }));
      }
      showToast(`Foto asignada como '${localRuta}'.`, 'info');
    }
  };

  // Cambiar contraseña
  const handleCambiarClave = async e => {
    e.preventDefault();
    try {
      const res = await fetch('api/cambiar-clave.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          claveActual,
          nuevaPassword: nuevaClave
        })
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (json.success) {
        setCambioClaveModal(false);
        setClaveActual('');
        setNuevaClave('');
        showToast('Contraseña cambiada exitosamente.');
      } else {
        showToast(json.error || 'Error al cambiar contraseña', 'error');
      }
    } catch (err) {
      showToast('Error de comunicación con api/cambiar-clave.php', 'error');
    }
  };

  // Si no está autenticado, mostrar pantalla de Login
  if (!autenticado) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)',
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        maxWidth: 420,
        width: '100%',
        boxShadow: 'var(--shadow-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/logo-cfp401-horizontal.png",
      alt: "CFP 401",
      style: {
        maxHeight: 42,
        maxWidth: '100%',
        marginBottom: 12
      }
    }), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        color: 'var(--blue-900)',
        fontSize: 20,
        margin: 0
      }
    }, "Panel de Administración"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--neutral-500)',
        marginTop: 4
      }
    }, "Versión 2.0 • CFP N° 401 Avellaneda")), errorLogin && /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fbe3e3',
        color: '#c02626',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: 13,
        marginBottom: 16
      }
    }, errorLogin), /*#__PURE__*/React.createElement("form", {
      onSubmit: handleLogin
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Operador / Nombre de usuario"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "form-input",
      placeholder: "Ej: Directora, Secretaría, Regente...",
      value: usuarioInput,
      onChange: e => setUsuarioInput(e.target.value),
      autoFocus: true,
      required: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-hint"
    }, "Quedará registrado en la bitácora de auditoría de cada modificación.")), /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Contraseña de acceso"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      className: "form-input",
      placeholder: "Ingresá la contraseña",
      value: passwordInput,
      onChange: e => setPasswordInput(e.target.value),
      required: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "form-hint"
    }, "¿Olvidaste la contraseña? Pedile al responsable del sitio que la restablezca.")), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn btn-primary",
      style: {
        width: '100%',
        padding: '12px 20px',
        marginTop: 10
      }
    }, "Ingresar al Panel")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "index.html",
      style: {
        fontSize: 13,
        color: 'var(--blue-700)',
        textDecoration: 'none'
      }
    }, "← Volver al sitio público"))));
  }
  if (!data) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      textAlign: 'center'
    }
  }, "Cargando datos...");
  const cursos = data.courses || [];
  const familias = ['Todas', ...(data.familias || []).map(f => f.nombre)];
  const cursosFiltrados = cursos.filter(c => {
    const matchFam = filtroFamilia === 'Todas' || c.familia === filtroFamilia || (c.tambien || []).includes(filtroFamilia);
    const matchQ = (c.curso || '').toLowerCase().includes(filtroBusqueda.toLowerCase());
    return matchFam && matchQ;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    className: "admin-header"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-cfp401-horizontal-blanco.png",
    alt: "CFP 401",
    className: "admin-logo"
  }), /*#__PURE__*/React.createElement("span", {
    className: "admin-badge"
  }, "Admin 2.0"), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(255,255,255,0.18)',
      color: '#ffffff',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, "👤 ", usuarioActual), /*#__PURE__*/React.createElement("div", {
    className: "admin-header-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    target: "_blank",
    className: "btn-header-site",
    title: "Abrir sitio web institucional en nueva pestaña"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "external-link",
    style: {
      width: 14
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "btn-text-full"
  }, "Ver Sitio"), /*#__PURE__*/React.createElement("span", {
    className: "btn-text-short"
  }, "Sitio")), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "btn-header-logout",
    title: "Cerrar sesión de administración"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "log-out",
    style: {
      width: 14
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "btn-text-full"
  }, "Cerrar Sesión"), /*#__PURE__*/React.createElement("span", {
    className: "btn-text-short"
  }, "Salir")))), /*#__PURE__*/React.createElement("div", {
    className: "admin-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-mobile-nav"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      textTransform: 'uppercase',
      color: 'var(--blue-900)',
      letterSpacing: '0.05em',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "menu",
    style: {
      width: 14
    }
  }), " Sección a Gestionar:"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--neutral-500)',
      fontWeight: 600
    }
  }, "11 secciones")), /*#__PURE__*/React.createElement("select", {
    className: "form-select admin-mobile-select",
    value: activeTab,
    onChange: e => handleTabChange(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "cursos"
  }, "📖 Gestión de Cursos (", cursos.length, ")"), /*#__PURE__*/React.createElement("option", {
    value: "catalogo"
  }, "📚 Catálogo 2027 · Alta de cursos"), /*#__PURE__*/React.createElement("option", {
    value: "promociones"
  }, "📢 Promociones y Flyers (", (data.promociones || []).length, ")"), /*#__PURE__*/React.createElement("option", {
    value: "inicio"
  }, "🏠 Portada, Hero y Propuesta de Inicio"), /*#__PURE__*/React.createElement("option", {
    value: "cursos-avisos"
  }, "🔔 Avisos e Inscripciones en Cursos"), /*#__PURE__*/React.createElement("option", {
    value: "nosotros"
  }, "👥 Página Institucional Nosotros"), /*#__PURE__*/React.createElement("option", {
    value: "contacto"
  }, "📞 Contacto, Sedes y Canales"), /*#__PURE__*/React.createElement("option", {
    value: "header"
  }, "🖼️ Fotos del Header y Lente"), /*#__PURE__*/React.createElement("option", {
    value: "campus"
  }, "🎓 Configuración Campus Virtual"), /*#__PURE__*/React.createElement("option", {
    value: "marbot"
  }, "🤖 Asistente Virtual Marbot"), /*#__PURE__*/React.createElement("option", {
    value: "sistema"
  }, "⚙️ Sistema, Calendario y Seguridad"))), /*#__PURE__*/React.createElement("aside", {
    className: "admin-sidebar"
  }, /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'cursos' ? 'active' : ''}`,
    onClick: () => handleTabChange('cursos')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "book-open",
    style: {
      width: 18
    }
  }), " Cursos (", cursos.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'catalogo' ? 'active' : ''}`,
    onClick: () => handleTabChange('catalogo')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "library",
    style: {
      width: 18
    }
  }), " Catálogo 2027 · Alta"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'promociones' ? 'active' : ''}`,
    onClick: () => handleTabChange('promociones')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "megaphone",
    style: {
      width: 18
    }
  }), " Promociones (", (data.promociones || []).length, ")"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'inicio' ? 'active' : ''}`,
    onClick: () => handleTabChange('inicio')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "layout",
    style: {
      width: 18
    }
  }), " Portada e Inicio"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'cursos-avisos' ? 'active' : ''}`,
    onClick: () => handleTabChange('cursos-avisos')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "bell",
    style: {
      width: 18
    }
  }), " Avisos en Cursos"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'nosotros' ? 'active' : ''}`,
    onClick: () => handleTabChange('nosotros')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "users",
    style: {
      width: 18
    }
  }), " Página Nosotros"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'contacto' ? 'active' : ''}`,
    onClick: () => handleTabChange('contacto')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "phone",
    style: {
      width: 18
    }
  }), " Contacto y Sedes"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'header' ? 'active' : ''}`,
    onClick: () => handleTabChange('header')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image",
    style: {
      width: 18
    }
  }), " Fotos del Header"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'campus' ? 'active' : ''}`,
    onClick: () => handleTabChange('campus')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "graduation-cap",
    style: {
      width: 18
    }
  }), " Campus Virtual"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'marbot' ? 'active' : ''}`,
    onClick: () => handleTabChange('marbot')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "bot",
    style: {
      width: 18
    }
  }), " Asistente Marbot"), /*#__PURE__*/React.createElement("button", {
    className: `admin-nav-item ${activeTab === 'sistema' ? 'active' : ''}`,
    onClick: () => handleTabChange('sistema')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "settings",
    style: {
      width: 18
    }
  }), " Sistema y Seguridad")), /*#__PURE__*/React.createElement("main", {
    className: "admin-content"
  }, activeTab === 'cursos' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "admin-course-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Gestión de Cursos"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Agregá, modificá o eliminá cursos del catálogo oficial.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setCursoIndex(-1);
      setCursoModal({
        curso: '',
        slug: '',
        familia: 'Administración',
        horarios: '',
        duracion: '1 año',
        horasTotales: '360 horas reloj',
        requisitos: 'Estudios primarios o secundarios',
        estadoCupo: 'sin-confirmar',
        cupoConfirmadoEn: '',
        sede: data.sedePrincipal || 'Sede Juan Pablo Angulo 1272, Dock Sud',
        tambien: [],
        introduccion: '',
        detalles: ''
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 16
    }
  }), " Nuevo Curso")), /*#__PURE__*/React.createElement("div", {
    className: "admin-course-filters"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    placeholder: "Buscar curso por nombre...",
    value: filtroBusqueda,
    onChange: e => setFiltroBusqueda(e.target.value)
  }), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: filtroFamilia,
    onChange: e => setFiltroFamilia(e.target.value)
  }, familias.map(f => /*#__PURE__*/React.createElement("option", {
    key: f,
    value: f
  }, f)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, cursosFiltrados.map((c, idx) => {
    const realIndex = cursos.findIndex(item => item === c);
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "admin-course-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "admin-course-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "admin-course-title-row"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "admin-course-title"
    }, c.curso), /*#__PURE__*/React.createElement("span", {
      className: "admin-course-badge-main"
    }, c.familia), (c.tambien || []).map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "admin-course-badge-sub"
    }, "+ ", t)), c.slug && /*#__PURE__*/React.createElement("span", {
      className: "admin-course-badge-slug"
    }, "Página: #", `/curso/${c.slug}`)), /*#__PURE__*/React.createElement("div", {
      className: "admin-course-details"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Horarios:"), " ", c.horarios), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Turnos:"), " ", window.CFPReglas.turnosDeCurso(c).join(', ') || 'sin definir'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Duración:"), " ", c.duracion, " • ", /*#__PURE__*/React.createElement("strong", null, "Horas totales:"), " ", c.horasTotales || '360 horas reloj', " • ", /*#__PURE__*/React.createElement("strong", null, "Sede:"), " ", c.sede), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Requisitos:"), " ", c.requisitos), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Estado de cupos:"), " ", {
      'sin-confirmar': 'Sin confirmar',
      abierto: 'Abierto',
      'ultimos-cupos': 'Últimos cupos',
      completo: 'Completo'
    }[c.estadoCupo || 'sin-confirmar'], c.cupoConfirmadoEn ? ` · confirmado ${c.cupoConfirmadoEn}` : ' · requiere confirmación', c.estadoCupo === 'ultimos-cupos' && window.CFPReglas?.estadoCupoVencido(c) ? ' · VENCIDO: actualizar en el panel' : ''), c.trayectosCatalogo && c.trayectosCatalogo.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: '#1e40af'
      }
    }, c.trayectosCatalogo.length > 1 ? '🔗 Curso articulado:' : '🔗 Trayecto oficial:'), c.trayectosCatalogo.map(cod => /*#__PURE__*/React.createElement("span", {
      key: cod,
      style: {
        fontSize: 11,
        fontWeight: 700,
        background: '#dbeafe',
        color: '#1e40af',
        padding: '1px 8px',
        borderRadius: 6
      }
    }, cod))))), /*#__PURE__*/React.createElement("div", {
      className: "admin-course-actions"
    }, (() => {
      const sugeridos = buscarCoincidenciasCatalogo(c, catalogoGlobal);
      if (!sugeridos || !sugeridos.length) return null;
      const yaVinculado = c.trayectosCatalogo && c.trayectosCatalogo.length === sugeridos.length && sugeridos.every(s => c.trayectosCatalogo.includes(s.codigo));
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-secondary btn-sm",
        style: {
          background: yaVinculado ? '#f8fafc' : '#f0fdf4',
          borderColor: yaVinculado ? '#cbd5e1' : '#86efac',
          color: yaVinculado ? '#475569' : '#166534',
          fontSize: 11.5
        },
        title: yaVinculado ? "Sincroniza horas, certificaciones y contenidos con los trayectos vinculados del catálogo" : `Asocia y actualiza horas, certificados y contenidos con ${sugeridos.map(s => s.codigo).join(' + ')}`,
        onClick: () => {
          const unificados = unificarDatosCatalogo(sugeridos);
          if (!unificados) return;
          const cods = sugeridos.map(s => s.codigo);
          if ((c.introduccion || c.detalles) && !window.confirm(`Se van a reemplazar las horas, la certificación, la introducción y los detalles de "${c.curso}" por los textos del catálogo (${cods.join(' + ')}).\n\nLo que hayas escrito a mano en esos campos se pierde (días, horarios, turnos y capacidades no cambian). ¿Continuar?`)) return;
          updateData(prev => {
            const list = [...(prev.courses || [])];
            list[realIndex] = {
              ...list[realIndex],
              trayectosCatalogo: cods,
              horasTotales: unificados.horasTotales,
              certificacion: unificados.certificacion,
              introduccion: unificados.introduccion,
              detalles: unificados.detalles,
              requisitos: list[realIndex].requisitos ? list[realIndex].requisitos : unificados.requisitos
            };
            return {
              ...prev,
              courses: list
            };
          });
          showToast(`Curso "${c.curso}" sincronizado con ${cods.join(' + ')} (${unificados.horasTotales}). Guardá en el servidor para publicar.`);
        }
      }, /*#__PURE__*/React.createElement("i", {
        "data-lucide": "refresh-cw",
        style: {
          width: 13
        }
      }), yaVinculado ? 'Sincronizar Catálogo' : `Actualizar con Catálogo (${sugeridos.map(s => s.codigo).join('+')})`);
    })(), c.slug && /*#__PURE__*/React.createElement("a", {
      href: `index.html#/curso/${c.slug}`,
      target: "_blank",
      rel: "noopener",
      className: "btn btn-secondary btn-sm btn-course-view",
      title: "Ver página individual del curso en una pestaña nueva"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "external-link",
      style: {
        width: 14
      }
    }), " Ver página"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm btn-course-edit",
      onClick: () => {
        setCursoIndex(realIndex);
        setCursoModal({
          ...c
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "edit-3",
      style: {
        width: 14
      }
    }), " Editar"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm btn-course-delete",
      title: "Eliminar curso",
      onClick: () => {
        if (confirm(`¿Estás seguro de eliminar el curso "${c.curso}"?`)) {
          updateData(prev => ({
            ...prev,
            courses: prev.courses.filter((_, i) => i !== realIndex)
          }));
          showToast(`Curso "${c.curso}" eliminado.`);
        }
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 14
      }
    }))));
  }), cursosFiltrados.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      textAlign: 'center',
      color: 'var(--neutral-500)',
      background: 'var(--neutral-25)',
      borderRadius: 'var(--radius-md)'
    }
  }, "No se encontraron cursos con los filtros aplicados."))), activeTab === 'catalogo' && /*#__PURE__*/React.createElement(CatalogoOficial, {
    catalogo: catalogoGlobal,
    cursos: cursos,
    familiasSitio: (data.familias || []).map(f => f.nombre),
    onAlta: (t, familia) => {
      setCursoIndex(-1);
      setCursoModal({
        curso: t.nombre,
        slug: '',
        familia,
        horarios: '',
        duracion: '',
        horasTotales: t.horasReloj ? t.horasReloj + ' horas reloj' : '',
        requisitos: t.requisitos || '',
        estadoCupo: 'sin-confirmar',
        cupoConfirmadoEn: '',
        sede: data.sedePrincipal || 'Sede Juan Pablo Angulo 1272, Dock Sud',
        tambien: [],
        introduccion: t.introduccion || '',
        detalles: t.detalles || '',
        certificacion: t.certificacion || '',
        trayectosCatalogo: [t.codigo]
      });
    },
    onEditar: i => {
      setCursoIndex(i);
      setCursoModal({
        ...cursos[i]
      });
    },
    onVincular: (i, t) => {
      updateData(prev => {
        const list = [...(prev.courses || [])];
        const c = {
          ...list[i]
        };
        c.trayectosCatalogo = Array.from(new Set([...(c.trayectosCatalogo || []), t.codigo]));
        if (!c.certificacion && t.certificacion) c.certificacion = t.certificacion;
        list[i] = c;
        return {
          ...prev,
          courses: list
        };
      });
      showToast(`«${t.codigo} · ${t.nombre}» vinculado a «${cursos[i].curso}». Guardá en el servidor para publicarlo.`);
    },
    onDesvincular: (i, t) => {
      updateData(prev => {
        const list = [...(prev.courses || [])];
        list[i] = {
          ...list[i],
          trayectosCatalogo: (list[i].trayectosCatalogo || []).filter(cod => cod !== t.codigo)
        };
        return {
          ...prev,
          courses: list
        };
      });
      showToast(`«${t.codigo}» desvinculado de «${cursos[i].curso}».`);
    }
  }), activeTab === 'promociones' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "admin-course-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Gestión de Promociones y Piezas Gráficas"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Generá flyers automáticos para Instagram, WhatsApp, afiches A4 de taller y activá el pop-up rotativo en la portada.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      const primerCurso = cursos[0] || null;
      const promoInicial = cursoAPromo(primerCurso, (fotoSugeridaPromo(primerCurso, data.bibliotecaFotosPromo) || {}).archivo || 'assets/promociones/soldadura-1.webp') || {
        id: 'promo-' + Date.now(),
        modelo: 'flyer-curso-v1',
        tipo: 'curso',
        cursoSlug: '',
        cursoNombre: 'NUEVO CURSO',
        imagen: 'assets/promociones/soldadura-1.webp',
        encuadre: '40% 45%',
        tituloOverride: '',
        diasOverride: 'Lunes a viernes',
        horarioOverride: '18:00 a 21:20 hs',
        requisitoOverride: 'Constancia de estudios primarios o superiores',
        sedeOverride: 'Juan Pablo Angulo 1272, Dock Sud',
        certificacionOverride: 'Oficial DGCyE',
        fondo: 'cuadriculado',
        popupActivo: false,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setPromoIndex(-1);
      setPromoModal(promoInicial);
      setFiltroFotoFamilia(primerCurso && primerCurso.familia || 'Todas');
      setPromoStep(1);
      setPromoPreviewFormat('feed');
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 16
    }
  }), " Nueva Promoción")), (() => {
    const activas = (data.promociones || []).filter(p => window.CFPReglas?.popupVigente(p));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderRadius: 'var(--radius-md, 10px)',
        background: activas.length > 0 ? '#ecfdf5' : '#f8fafc',
        border: `1px solid ${activas.length > 0 ? '#a7f3d0' : '#e2e8f0'}`,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, activas.length > 0 ? '🟢' : '⚪'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14,
        color: activas.length > 0 ? '#065f46' : 'var(--blue-900)',
        display: 'block'
      }
    }, activas.length > 0 ? `Pop-up en el Home: ${activas.length} promoción(es) activa(s)` : 'Pop-up en el Home: Desactivado'), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: activas.length > 0 ? '#047857' : 'var(--neutral-600)'
      }
    }, activas.length > 1 ? 'Los cursos seleccionados rotarán de forma aleatoria para cada visitante en la portada.' : activas.length === 1 ? 'Esta promoción se mostrará a los visitantes al ingresar al Home (1 vez cada 24 hs).' : 'Podés activar las promociones que desees usando el interruptor en cada tarjeta.'))), activas.length > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        background: '#10b981',
        color: '#fff',
        padding: '3px 10px',
        borderRadius: 999,
        fontWeight: 700
      }
    }, "Rotación activa"));
  })(), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    placeholder: "Buscar promoción por nombre del curso...",
    value: filtroPromoBusqueda,
    onChange: e => setFiltroPromoBusqueda(e.target.value),
    style: {
      flex: '1 1 300px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, (data.promociones || []).filter(p => {
    const q = filtroPromoBusqueda.toLowerCase();
    return tituloPromo(p).toLowerCase().includes(q) || (p.cursoNombre || '').toLowerCase().includes(q);
  }).map((p, idx) => {
    const realIndex = (data.promociones || []).findIndex(item => item === p);
    const plantilla = CATALOGO_PLANTILLAS[p.modelo || 'flyer-curso-v1'] || CATALOGO_PLANTILLAS['flyer-curso-v1'];
    const cursoPromoActual = cursos.find(c => c.slug === p.cursoSlug);
    const promoDesactualizada = window.CFPReglas?.promoDesactualizada(p, cursos) || false;
    const cuposCupoVigentes = p.modelo !== 'ultimos-cupos-v1' || window.CFPReglas?.puedePublicarUltimosCupos(cursoPromoActual);
    return /*#__PURE__*/React.createElement("div", {
      key: p.id || idx,
      className: "promo-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "promo-card-preview",
      style: {
        aspectRatio: '1080 / 1350'
      }
    }, /*#__PURE__*/React.createElement(MiniaturaPromo, {
      promo: p,
      formato: "feed"
    })), /*#__PURE__*/React.createElement("div", {
      className: "promo-card-info"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 16,
        color: 'var(--blue-900)'
      }
    }, tituloPromo(p)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        background: 'var(--surface-brand-soft, #e8eefb)',
        color: 'var(--blue-900)',
        padding: '2px 8px',
        borderRadius: 4,
        fontWeight: 700
      }
    }, plantilla.nombre), window.CFPReglas?.popupVigente(p) && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        background: '#ecfdf5',
        color: '#059669',
        padding: '2px 8px',
        borderRadius: 4,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#10b981'
      }
    }), "En Pop-up")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--neutral-700)',
        lineHeight: 1.5
      }
    }, tipoDePromo(p) === 'inscripciones' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Familias:"), " ", familiasPromo(p).join(', ') || '(ninguna)'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, textosPromo(p).dato1Label, ":"), " ", textosPromo(p).dato1)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Días:"), " ", textosPromo(p).dias, " • ", /*#__PURE__*/React.createElement("strong", null, "Horario:"), " ", textosPromo(p).horario), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Sede:"), " ", textosPromo(p).sede), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Requisitos:"), " ", textosPromo(p).requisito)), promoDesactualizada && /*#__PURE__*/React.createElement("div", {
      role: "status",
      style: {
        marginTop: 6,
        padding: '7px 9px',
        borderRadius: 7,
        background: '#fff7ed',
        color: '#9a3412',
        fontWeight: 700
      }
    }, "Datos desactualizados: cambió el curso desde que se guardó esta promoción. Editala y guardala nuevamente antes de publicarla."), !cuposCupoVigentes && /*#__PURE__*/React.createElement("div", {
      role: "status",
      style: {
        marginTop: 6,
        padding: '7px 9px',
        borderRadius: 7,
        background: '#fef2f2',
        color: '#991b1b',
        fontWeight: 700
      }
    }, "Últimos cupos bloqueado: el estado del curso no está confirmado dentro de los últimos 30 días."), p.popupActivo && !window.CFPReglas?.popupVigente(p) && /*#__PURE__*/React.createElement("div", {
      role: "status",
      style: {
        marginTop: 6,
        fontSize: 12,
        color: '#64748b'
      }
    }, "Pop-up fuera de su período de vigencia."))), /*#__PURE__*/React.createElement("div", {
      className: "promo-card-actions"
    }, /*#__PURE__*/React.createElement("div", {
      className: "promo-card-actions-row"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#f8fafc',
        padding: '6px 12px',
        borderRadius: 8,
        border: '1px solid #e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--neutral-700)'
      }
    }, "Pop-up en Home:"), /*#__PURE__*/React.createElement("label", {
      className: "switch",
      style: {
        width: 40,
        height: 22,
        margin: 0
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: Boolean(p.popupActivo),
      onChange: () => {
        if (!p.popupActivo && promoDesactualizada) {
          showToast('Esta promoción usa datos anteriores del curso. Editala y guardala antes de activar el pop-up.', 'error');
          return;
        }
        if (!p.popupActivo && !cuposCupoVigentes) {
          showToast('No se puede activar “Últimos cupos” sin una confirmación vigente del curso.', 'error');
          return;
        }
        updateData(prev => {
          const list = [...(prev.promociones || [])];
          list[realIndex] = {
            ...list[realIndex],
            popupActivo: !list[realIndex].popupActivo
          };
          return {
            ...prev,
            promociones: list
          };
        });
        showToast(p.popupActivo ? 'Promoción quitada del pop-up.' : 'Promoción agregada al pop-up rotativo.');
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "slider",
      style: {
        borderRadius: 22
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => {
        setPromoIndex(realIndex);
        // Si el curso cambió desde que se guardó, se abre con sus datos nuevos
        setPromoModal(promoDesactualizada && cursoPromoActual ? refrescarDatosCurso(p, cursoPromoActual) : {
          ...p
        });
        setPromoStep(4);
        setPromoPreviewFormat('feed');
      },
      title: "Editar textos, foto o diseño"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "edit-3",
      style: {
        width: 14
      }
    }), " Editar"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: () => {
        if (confirm(`¿Estás seguro de eliminar la promoción de "${p.cursoNombre}"?`)) {
          updateData(prev => ({
            ...prev,
            promociones: (prev.promociones || []).filter((_, i) => i !== realIndex)
          }));
          showToast(`Promoción eliminada.`);
        }
      },
      title: "Eliminar promoción"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 14
      }
    }), " Borrar"))), /*#__PURE__*/React.createElement("div", {
      className: "promo-card-actions-row"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: 'var(--neutral-500)',
        marginRight: 2
      }
    }, "Descargar:"), formatosDePromo(p).includes('feed') && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => exportarPromoPNG(p, 'feed', showToast),
      title: "Descargar en formato vertical cuadrado/feed (1350x1687)"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "download",
      style: {
        width: 13
      }
    }), " Feed 4:5"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => exportarPromoPNG(p, 'historia', showToast),
      title: "Descargar en formato vertical completo / Story (1350x2400)"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "smartphone",
      style: {
        width: 13
      }
    }), " Historia 9:16"), formatosDePromo(p).includes('a4') && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-sm",
      onClick: () => exportarPromoPNG(p, 'a4', showToast),
      title: "Descargar en formato A4 para imprimir en alta resolución (2480x3508)"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "printer",
      style: {
        width: 13
      }
    }), " A4"))));
  }), (data.promociones || []).length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 48,
      textAlign: 'center',
      background: '#ffffff',
      borderRadius: 'var(--radius-lg, 12px)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--surface-brand-soft, #e8eefb)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand-primary)',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "megaphone",
    style: {
      width: 28
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      color: 'var(--blue-900)'
    }
  }, "Aún no hay promociones creadas"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      color: 'var(--neutral-500)',
      maxWidth: 440,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 14
    }
  }, "Elegí cualquier curso activo del catálogo para generar su flyer oficial al instante, listo para redes y portada."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      const primerCurso = cursos[0] || null;
      const promoInicial = cursoAPromo(primerCurso, (fotoSugeridaPromo(primerCurso, data.bibliotecaFotosPromo) || {}).archivo || 'assets/promociones/soldadura-1.webp');
      setPromoIndex(-1);
      setPromoModal(promoInicial);
      setFiltroFotoFamilia(primerCurso && primerCurso.familia || 'Todas');
      setPromoStep(1);
      setPromoPreviewFormat('feed');
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 16
    }
  }), " Crear Primera Promoción")))), activeTab === 'inicio' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Portada e Inicio (Textos del Home)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Modificá los textos de la cabecera principal, el banner amarillo destacado y la sección Nuestra Propuesta."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f8fafc',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "type",
    style: {
      width: 18
    }
  }), " Cabecera Principal (Hero)"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtítulo Superior (Antetítulo / Overline)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.hero?.subtitulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        hero: {
          ...(prev.home?.hero || {}),
          subtitulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Es tu tiempo de aprender"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título Principal"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.hero?.titulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        hero: {
          ...(prev.home?.hero || {}),
          titulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Estudiá con nosotros"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Texto / Bajada Explicativa"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 3,
    value: data.home?.hero?.texto || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        hero: {
          ...(prev.home?.hero || {}),
          texto: e.target.value
        }
      }
    })),
    placeholder: "Ej: Cursos presenciales sin costo de inscripción ni de cursada..."
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#fffbeb',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #fde68a',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: '#854d0e',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "bookmark",
    style: {
      width: 18
    }
  }), " Cinta Destacada de Avisos (Home)"), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Versión visual de la cinta"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 4,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13.5,
      cursor: 'pointer',
      fontWeight: !data.home?.cintaAmarilla?.estilo || data.home?.cintaAmarilla?.estilo === 'amarilla' ? 700 : 400
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "cintaEstilo",
    value: "amarilla",
    checked: !data.home?.cintaAmarilla?.estilo || data.home?.cintaAmarilla?.estilo === 'amarilla',
    onChange: () => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          estilo: 'amarilla'
        }
      }
    }))
  }), "Amarilla tradicional (fondo amarillo)"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13.5,
      cursor: 'pointer',
      fontWeight: data.home?.cintaAmarilla?.estilo === 'blanca' ? 700 : 400
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "cintaEstilo",
    value: "blanca",
    checked: data.home?.cintaAmarilla?.estilo === 'blanca',
    onChange: () => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          estilo: 'blanca'
        }
      }
    }))
  }), "Blanca institucional (fondo blanco con líneas amarillas)")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13.5,
      cursor: 'pointer',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: data.home?.cintaAmarilla?.mostrarLogoProvincia !== false,
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          mostrarLogoProvincia: e.target.checked
        }
      }
    }))
  }), "Mostrar el logo de la Provincia (DGCyE) en el centro de la cinta"), data.home?.cintaAmarilla?.mostrarLogoProvincia !== false && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: 12,
      background: '#ffffff',
      border: '1px solid #fde68a',
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--neutral-600)',
      marginBottom: 2
    }
  }, "Podés usar un logo distinto para cada versión de la cinta (por ejemplo, uno con letras más oscuras para el fondo amarillo). Conviene un PNG con fondo transparente, de unos 750 × 120 px."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 230,
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffd100',
      border: '1px solid #f5c400',
      borderRadius: 8,
      padding: '6px 10px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: data.home?.cintaAmarilla?.logoAmarilla || 'assets/logo-provincia-ba-azul.png',
    alt: "",
    style: {
      maxHeight: 44,
      maxWidth: '100%',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Logo para la cinta amarilla"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, data.home?.cintaAmarilla?.logoAmarilla ? 'Logo propio: ' + data.home.cintaAmarilla.logoAmarilla : 'Logo original en azul institucional (contrasta con el amarillo)'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "btn btn-secondary btn-sm",
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload",
    style: {
      width: 14
    }
  }), " Subir otro logo", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/png,image/webp,image/jpeg",
    style: {
      display: 'none'
    },
    onChange: e => handleSubirLogoCinta(e, 'logoAmarilla')
  })), data.home?.cintaAmarilla?.logoAmarilla && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          logoAmarilla: ''
        }
      }
    }))
  }, "Volver al original (azul)")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 230,
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: '6px 10px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: data.home?.cintaAmarilla?.logoBlanca || 'assets/logo-provincia-ba.png',
    alt: "",
    style: {
      maxHeight: 44,
      maxWidth: '100%',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Logo para la cinta blanca"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, data.home?.cintaAmarilla?.logoBlanca ? 'Logo propio: ' + data.home.cintaAmarilla.logoBlanca : 'Logo original'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "btn btn-secondary btn-sm",
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload",
    style: {
      width: 14
    }
  }), " Subir otro logo", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/png,image/webp,image/jpeg",
    style: {
      display: 'none'
    },
    onChange: e => handleSubirLogoCinta(e, 'logoBlanca')
  })), data.home?.cintaAmarilla?.logoBlanca && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          logoBlanca: ''
        }
      }
    }))
  }, "Volver al original")))))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Texto Principal del Aviso (Destacado en Negrita)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.cintaAmarilla?.titulo || data.inscripciones?.bannerInicio || '',
    onChange: e => {
      const val = e.target.value;
      updateData(prev => ({
        ...prev,
        inscripciones: {
          ...prev.inscripciones,
          bannerInicio: val
        },
        home: {
          ...prev.home,
          cintaAmarilla: {
            ...(prev.home?.cintaAmarilla || {}),
            titulo: val
          }
        }
      }));
    },
    placeholder: "Ej: Inscripciones abiertas a partir del 15 de noviembre"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Detalle (Horarios y Dirección)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.cintaAmarilla?.detalle || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          detalle: e.target.value
        }
      }
    })),
    placeholder: "Ej: Lunes a viernes de 9 a 20 hs · Juan Pablo Angulo 1272, Dock Sud"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Enlace a Google Maps de la Dirección"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.cintaAmarilla?.urlMapa || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        cintaAmarilla: {
          ...(prev.home?.cintaAmarilla || {}),
          urlMapa: e.target.value
        }
      }
    })),
    placeholder: "https://www.google.com/maps/..."
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trending-up",
    style: {
      width: 18
    }
  }), " Cifras institucionales (Inicio y Nosotros)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px',
      fontSize: 12.5,
      color: 'var(--neutral-500)'
    }
  }, "Se muestran en el bloque azul \"Cómo inscribirte\" del Inicio (2 arriba y 2 abajo) y en Nosotros (año de creación y las dos primeras cifras). En el valor podés escribir ", /*#__PURE__*/React.createElement("strong", null, '{cursos}'), " o ", /*#__PURE__*/React.createElement("strong", null, '{familias}'), " para que se cuente solo."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 120px',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Antetítulo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.estadisticas?.antetitulo || '',
    onChange: e => actualizarCifras({
      antetitulo: e.target.value
    }),
    placeholder: "Desde 1979"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.estadisticas?.titulo || '',
    onChange: e => actualizarCifras({
      titulo: e.target.value
    }),
    placeholder: "+45 años formando en oficios"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Año de creación"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.estadisticas?.anioCreacion || '',
    onChange: e => actualizarCifras({
      anioCreacion: e.target.value
    }),
    placeholder: "1979"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cifras (valor y texto)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 1: valor",
    value: data.estadisticas?.items?.[0]?.valor || '',
    onChange: e => actualizarCifra(0, 'valor', e.target.value),
    placeholder: "+3.600"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 1: texto",
    value: data.estadisticas?.items?.[0]?.etiqueta || '',
    onChange: e => actualizarCifra(0, 'etiqueta', e.target.value),
    placeholder: "Cursos dictados"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 2: valor",
    value: data.estadisticas?.items?.[1]?.valor || '',
    onChange: e => actualizarCifra(1, 'valor', e.target.value),
    placeholder: "+3.600"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 2: texto",
    value: data.estadisticas?.items?.[1]?.etiqueta || '',
    onChange: e => actualizarCifra(1, 'etiqueta', e.target.value),
    placeholder: "Cursos dictados"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 3: valor",
    value: data.estadisticas?.items?.[2]?.valor || '',
    onChange: e => actualizarCifra(2, 'valor', e.target.value),
    placeholder: "+3.600"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 3: texto",
    value: data.estadisticas?.items?.[2]?.etiqueta || '',
    onChange: e => actualizarCifra(2, 'etiqueta', e.target.value),
    placeholder: "Cursos dictados"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 4: valor",
    value: data.estadisticas?.items?.[3]?.valor || '',
    onChange: e => actualizarCifra(3, 'valor', e.target.value),
    placeholder: "+3.600"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    "aria-label": "Cifra 4: texto",
    value: data.estadisticas?.items?.[3]?.etiqueta || '',
    onChange: e => actualizarCifra(3, 'etiqueta', e.target.value),
    placeholder: "Cursos dictados"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f8fafc',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "award",
    style: {
      width: 18
    }
  }), " Sección \"Nuestra Propuesta\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtítulo / Overline"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.propuesta?.subtitulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        propuesta: {
          ...(prev.home?.propuesta || {}),
          subtitulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Nuestra propuesta"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título de la Sección"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.home?.propuesta?.titulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        propuesta: {
          ...(prev.home?.propuesta || {}),
          titulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Aprendizajes que transforman"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Descripción General ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'normal',
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, "(usá ", /*#__PURE__*/React.createElement("strong", null, "**texto**"), " para negritas y saltos de línea)")), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 2,
    value: data.home?.propuesta?.descripcion || '',
    onChange: e => updateData(prev => ({
      ...prev,
      home: {
        ...prev.home,
        propuesta: {
          ...(prev.home?.propuesta || {}),
          descripcion: e.target.value
        }
      }
    })),
    placeholder: "Ej: Porque aprender también es construir futuro..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 12
    }
  }, "Las 3 Tarjetas de la Propuesta"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16
    }
  }, [0, 1, 2].map(idx => {
    const card = data.home?.propuesta?.tarjetas?.[idx] || {};
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        background: '#ffffff',
        padding: 16,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: 'var(--brand-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        display: 'block',
        marginBottom: 8
      }
    }, "Tarjeta ", idx + 1), /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      style: {
        fontSize: 12
      }
    }, "Título"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "form-input",
      value: card.titulo || '',
      onChange: e => {
        const val = e.target.value;
        updateData(prev => {
          const tarjetas = [...(prev.home?.propuesta?.tarjetas || [{}, {}, {}])];
          tarjetas[idx] = {
            ...(tarjetas[idx] || {}),
            titulo: val
          };
          return {
            ...prev,
            home: {
              ...prev.home,
              propuesta: {
                ...(prev.home?.propuesta || {}),
                tarjetas
              }
            }
          };
        });
      },
      placeholder: "Ej: Títulos oficiales"
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group",
      style: {
        marginBottom: 0
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      style: {
        fontSize: 12
      }
    }, "Descripción / Texto"), /*#__PURE__*/React.createElement("textarea", {
      className: "form-textarea",
      rows: 3,
      value: card.descripcion || '',
      onChange: e => {
        const val = e.target.value;
        updateData(prev => {
          const tarjetas = [...(prev.home?.propuesta?.tarjetas || [{}, {}, {}])];
          tarjetas[idx] = {
            ...(tarjetas[idx] || {}),
            descripcion: val
          };
          return {
            ...prev,
            home: {
              ...prev.home,
              propuesta: {
                ...(prev.home?.propuesta || {}),
                tarjetas
              }
            }
          };
        });
      },
      placeholder: "Texto descriptivo..."
    })));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f8fafc',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "layers",
    style: {
      width: 18
    }
  }), " Tarjetas de Familias Profesionales (Fondos y Opacidad)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Personalizá las tarjetas de la sección \"Oferta formativa / Áreas de capacitación\" del Home. Podés regular la opacidad de los fondos con la barra deslizante (0% a 100%) y cambiar o eliminar las fotos de cada una de las 7 familias profesionales."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      padding: 18,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      flexWrap: 'wrap',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Opacidad del Fondo de las Tarjetas: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-primary)',
      fontSize: 16
    }
  }, data.home?.opacidadTarjetas !== undefined ? data.home.opacidadTarjetas : 12, "%")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--neutral-600)',
      background: 'var(--neutral-25)',
      padding: '3px 8px',
      borderRadius: 6,
      border: '1px solid var(--border-subtle)'
    }
  }, data.home?.opacidadTarjetas === 0 ? '0% (Fotos invisibles / fondo limpio)' : data.home?.opacidadTarjetas <= 20 ? 'Recomendado (Texto 100% legible)' : data.home?.opacidadTarjetas >= 50 ? 'Opacidad alta' : 'Opacidad media')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--neutral-500)'
    }
  }, "0%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: data.home?.opacidadTarjetas !== undefined ? data.home.opacidadTarjetas : 12,
    onChange: e => {
      const val = parseInt(e.target.value, 10);
      updateData(prev => ({
        ...prev,
        home: {
          ...(prev.home || {}),
          opacidadTarjetas: val
        }
      }));
    },
    style: {
      flex: 1,
      accentColor: 'var(--brand-primary)',
      cursor: 'pointer',
      height: 8
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--neutral-500)'
    }
  }, "100%")), /*#__PURE__*/React.createElement("div", {
    className: "form-hint",
    style: {
      marginTop: 8
    }
  }, "0% oculta totalmente las fotos dejando las tarjetas en blanco puro. Entre 8% y 20% brinda una textura sutil preservando la máxima legibilidad de los textos y cursos.")), /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 12,
      display: 'block',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Fotos de Fondo por Familia Profesional"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 16
    }
  }, (data.familias || []).map((fam, idx) => {
    const cursosFamilia = (data.courses || []).filter(c => c.familia === fam.nombre || (c.tambien || []).includes(fam.nombre));
    const tieneFoto = Boolean(fam.imagen && fam.imagen.trim());
    return /*#__PURE__*/React.createElement("div", {
      key: fam.nombre,
      style: {
        background: '#ffffff',
        padding: 16,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'var(--surface-brand-soft, #e8eefb)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--brand-primary)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": fam.icono || 'briefcase',
      style: {
        width: 16
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14,
        color: 'var(--text-title)',
        display: 'block'
      }
    }, fam.nombre), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--neutral-500)'
      }
    }, cursosFamilia.length, " cursos asociados"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 99,
        background: tieneFoto ? '#ecfdf5' : '#fef2f2',
        color: tieneFoto ? '#059669' : '#dc2626'
      }
    }, tieneFoto ? 'Con foto' : 'Sin foto')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        background: 'var(--neutral-25)',
        padding: 8,
        borderRadius: 8,
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 80,
        height: 56,
        borderRadius: 6,
        overflow: 'hidden',
        background: '#e2e8f0',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #cbd5e1'
      }
    }, tieneFoto ? /*#__PURE__*/React.createElement("img", {
      src: fam.imagen,
      alt: fam.nombre,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      },
      onError: e => {
        e.currentTarget.style.display = 'none';
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--neutral-500)',
        textAlign: 'center',
        padding: 4
      }
    }, "Sin imagen")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--neutral-600)',
        display: 'block',
        marginBottom: 2
      }
    }, "Ruta o archivo:"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "form-input",
      style: {
        fontSize: 12,
        padding: '4px 8px'
      },
      value: fam.imagen || '',
      onChange: e => {
        const val = e.target.value;
        updateData(prev => {
          const familias = [...(prev.familias || [])];
          familias[idx] = {
            ...familias[idx],
            imagen: val
          };
          return {
            ...prev,
            familias
          };
        });
      },
      placeholder: "Ej: assets/area-....jpg"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        marginTop: 'auto'
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "btn btn-secondary btn-sm",
      style: {
        cursor: 'pointer',
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "upload",
      style: {
        width: 14
      }
    }), " Cambiar foto", /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      style: {
        display: 'none'
      },
      onChange: e => handleSubirFotoFamilia(e, idx)
    })), tieneFoto && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-danger btn-sm",
      onClick: () => {
        updateData(prev => {
          const familias = [...(prev.familias || [])];
          familias[idx] = {
            ...familias[idx],
            imagen: ''
          };
          return {
            ...prev,
            familias
          };
        });
        showToast(`Foto de fondo de "${fam.nombre}" eliminada.`);
      },
      title: "Quitar foto de fondo de esta tarjeta"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 14
      }
    }), " Borrar"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-secondary btn-sm",
      onClick: () => {
        const def = FOTOS_DEFAULT_FAMILIAS[fam.nombre] || `assets/area-${fam.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
        updateData(prev => {
          const familias = [...(prev.familias || [])];
          familias[idx] = {
            ...familias[idx],
            imagen: def
          };
          return {
            ...prev,
            familias
          };
        });
        showToast(`Foto original de "${fam.nombre}" restablecida.`);
      },
      title: "Restablecer a la foto original"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "rotate-ccw",
      style: {
        width: 14
      }
    }), " Original")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f0f9ff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #bae6fd',
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 16,
      borderBottom: '1px solid #bae6fd',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontSize: 18,
      color: '#034574',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "flag",
    style: {
      width: 18
    }
  }), " Cinta Celeste de Efemérides, Fechas Patrias y Feriados 2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#0284c7',
      fontWeight: 600
    }
  }, "Estado: ", data.cintaEfemerides?.activo !== false ? 'ACTIVADA (Visible en el sitio web)' : 'DESACTIVADA (Oculta)')), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: data.cintaEfemerides?.activo !== false,
    onChange: e => updateData(prev => ({
      ...prev,
      cintaEfemerides: {
        ...(prev.cintaEfemerides || {}),
        activo: e.target.checked
      }
    }))
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13.5,
      color: '#0f172a',
      lineHeight: 1.5
    }
  }, "Detecta automáticamente en tiempo real la fecha del sistema para conmemorar efemérides patrias, feriados nacionales y días sin clases en formación profesional de la Provincia de Buenos Aires. Si en el día actual no hay ninguna efeméride, anuncia amistosamente el próximo feriado que se aproxima."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      padding: 16,
      borderRadius: 'var(--radius-md)',
      border: '1px solid #bae6fd',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13.5,
      color: '#034574',
      display: 'block',
      marginBottom: 6
    }
  }, "Simulador / Probador de Fechas (Verificación en vivo):"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12.5,
      color: 'var(--neutral-600)'
    }
  }, "Elegí una fecha para probar cómo responderá la cinta celeste cuando un usuario visite el sitio en ese día:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    style: {
      maxWidth: 380,
      fontSize: 13
    },
    value: fechaSimulada,
    onChange: e => setFechaSimulada(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "2026-03-24"
  }, "24/03 – Día de la Memoria (Feriado · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-04-02"
  }, "02/04 – Malvinas / Jueves Santo (Feriado · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-05-01"
  }, "01/05 – Día del Trabajo (Feriado · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-05-25"
  }, "25/05 – Revolución de Mayo (Fecha Patria · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-06-03"
  }, "03/06 – Día del Aprendiz de Formación Profesional"), /*#__PURE__*/React.createElement("option", {
    value: "2026-06-20"
  }, "20/06 – Día de la Bandera (Fecha Patria)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-07-09"
  }, "09/07 – Día de la Independencia (Fecha Patria · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-07-22"
  }, "22/07 – Receso Escolar de Invierno FP (Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-08-17"
  }, "17/08 – Paso a la Inmortalidad de San Martín (Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-09-11"
  }, "11/09 – Día del Maestro (Asueto educativo PBA · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-09-13"
  }, "13/09 – Día del Programador (Efeméride FP)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-10-12"
  }, "12/10 – Diversidad Cultural (Feriado · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-11-20"
  }, "20/11 – Día de la Soberanía Nacional (Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-12-08"
  }, "08/12 – Inmaculada Concepción (Feriado · Sin clases)"), /*#__PURE__*/React.createElement("option", {
    value: "2026-09-26"
  }, "26/09 – Fecha actual (Día común · Anuncia el próximo feriado)")), /*#__PURE__*/React.createElement("a", {
    href: `index.html?fecha=${fechaSimulada}`,
    target: "_blank",
    rel: "noopener",
    className: "btn btn-secondary btn-sm",
    style: {
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "external-link",
    style: {
      width: 14
    }
  }), " Probar fecha en la web pública"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => setAdminAgendaModal(true),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "calendar",
    style: {
      width: 14
    }
  }), " Ver listado de las 32 efemérides 2026")))), activeTab === 'cursos-avisos' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Avisos de Inscripción (Página Cursos)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Administrá el aviso destacado de la pantalla de cursos. Podés activar/desactivar la cinta completa o alternar entre inscripciones abiertas y cerradas."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f8fafc',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 16,
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 16,
      color: 'var(--blue-900)',
      display: 'block'
    }
  }, "Visibilidad de la Cinta de Inscripción: ", data.inscripciones?.cintaCursos?.visible !== false ? 'VISIBLE' : 'OCULTA'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, data.inscripciones?.cintaCursos?.visible !== false ? 'La cinta informativa se muestra en la parte superior del catálogo de cursos.' : 'La cinta está desactivada y no se muestra en la web pública.')), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: data.inscripciones?.cintaCursos?.visible !== false,
    onChange: e => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        cintaCursos: {
          ...(prev.inscripciones?.cintaCursos || {}),
          visible: e.target.checked
        }
      }
    }))
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado de la Convocatoria"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        estado: 'Inscripciones cerradas por el momento',
        cintaCursos: {
          ...(prev.inscripciones?.cintaCursos || {}),
          tipo: 'cerradas'
        }
      }
    })),
    style: {
      padding: 16,
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${(data.inscripciones?.cintaCursos?.tipo || 'cerradas') === 'cerradas' ? 'var(--blue-700)' : 'var(--border-subtle)'}`,
      background: (data.inscripciones?.cintaCursos?.tipo || 'cerradas') === 'cerradas' ? 'var(--surface-brand-soft, #e8eefb)' : '#ffffff',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tipoCinta",
    checked: (data.inscripciones?.cintaCursos?.tipo || 'cerradas') === 'cerradas',
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--blue-900)'
    }
  }, "Inscripciones Cerradas")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Muestra el cartel informativo con los períodos regulares del año (marzo / agosto).")), /*#__PURE__*/React.createElement("div", {
    onClick: () => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        estado: 'Inscripciones abiertas',
        cintaCursos: {
          ...(prev.inscripciones?.cintaCursos || {}),
          tipo: 'abiertas'
        }
      }
    })),
    style: {
      padding: 16,
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${data.inscripciones?.cintaCursos?.tipo === 'abiertas' ? 'var(--green-600, #16a34a)' : 'var(--border-subtle)'}`,
      background: data.inscripciones?.cintaCursos?.tipo === 'abiertas' ? '#f0fdf4' : '#ffffff',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tipoCinta",
    checked: data.inscripciones?.cintaCursos?.tipo === 'abiertas',
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#166534'
    }
  }, "¡Inscripciones Abiertas!")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Destaca la apertura de vacantes y permite fijar la fecha límite de cierre de inscripción.")))), data.inscripciones?.cintaCursos?.tipo === 'abiertas' ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      padding: 18,
      borderRadius: 'var(--radius-md)',
      border: '1px solid #bbf7d0'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 14px',
      color: '#166534',
      fontSize: 15
    }
  }, "Parámetros de Inscripciones Abiertas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título del Banner"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.inscripciones?.cintaCursos?.tituloAbiertas || '',
    onChange: e => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        cintaCursos: {
          ...(prev.inscripciones?.cintaCursos || {}),
          tituloAbiertas: e.target.value
        }
      }
    })),
    placeholder: "Ej: ¡Inscripciones Abiertas!"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      color: '#166534',
      fontWeight: 700
    }
  }, "📅 Fecha Límite de Cierre de Inscripción"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    style: {
      borderColor: '#16a34a',
      fontWeight: 600
    },
    value: data.inscripciones?.cintaCursos?.fechaCierre || '',
    onChange: e => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        cintaCursos: {
          ...(prev.inscripciones?.cintaCursos || {}),
          fechaCierre: e.target.value
        }
      }
    })),
    placeholder: "Ej: 28 de Febrero / 15 de Marzo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Se mostrará destacado: \"Inscripciones abiertas hasta el [fecha]\"."))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mensaje Explicativo"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 2,
    value: data.inscripciones?.cintaCursos?.textoAbiertas || '',
    onChange: e => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        cintaCursos: {
          ...(prev.inscripciones?.cintaCursos || {}),
          textoAbiertas: e.target.value
        }
      }
    })),
    placeholder: "Ej: Acercate a la sede de Juan Pablo Angulo 1272 para completar tu inscripción."
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      padding: 18,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 14px',
      color: 'var(--blue-900)',
      fontSize: 15
    }
  }, "Textos de Inscripciones Cerradas"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título del Banner (Cerradas)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.inscripciones?.cintaCursos?.tituloCerradas || data.inscripciones?.estado || '',
    onChange: e => {
      const val = e.target.value;
      updateData(prev => ({
        ...prev,
        inscripciones: {
          ...prev.inscripciones,
          estado: val,
          cintaCursos: {
            ...(prev.inscripciones?.cintaCursos || {}),
            tituloCerradas: val
          }
        }
      }));
    },
    placeholder: "Ej: Inscripciones cerradas por el momento"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Detalle de los Períodos de Inscripción"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 3,
    value: data.inscripciones?.cintaCursos?.textoCerradas || data.inscripciones?.periodos || '',
    onChange: e => {
      const val = e.target.value;
      updateData(prev => ({
        ...prev,
        inscripciones: {
          ...prev.inscripciones,
          periodos: val,
          cintaCursos: {
            ...(prev.inscripciones?.cintaCursos || {}),
            textoCerradas: val
          }
        }
      }));
    },
    placeholder: "Ej: Hay dos períodos de inscripción por año: de noviembre a febrero..."
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Requisitos Generales de Documentación (Callout Amarillo)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.inscripciones?.requisitoGeneral || '',
    onChange: e => updateData(prev => ({
      ...prev,
      inscripciones: {
        ...prev.inscripciones,
        requisitoGeneral: e.target.value
      }
    })),
    placeholder: "Ej: Presentar fotocopia del DNI y la constancia de estudios requerida..."
  })))), activeTab === 'nosotros' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Página Nosotros"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Modificá los textos de la cabecera, la reseña histórica institucional, los objetivos oficiales y la tarjeta de la Red de Centros."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f8fafc',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image",
    style: {
      width: 18
    }
  }), " Cabecera (Header de Nosotros)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtítulo (Overline)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.header?.subtitulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        header: {
          ...(prev.nosotros?.header || {}),
          subtitulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Nosotros"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título Principal"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.header?.titulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        header: {
          ...(prev.nosotros?.header || {}),
          titulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Más de cuatro décadas formando en oficios"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "book",
    style: {
      width: 18
    }
  }), " Historia Institucional (Cuerpo 1)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtítulo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.historia?.subtitulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        historia: {
          ...(prev.nosotros?.historia || {}),
          subtitulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Historia Institucional"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.historia?.titulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        historia: {
          ...(prev.nosotros?.historia || {}),
          titulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: De la Unidad de Formación Profesional N° 13 al CFP N° 401"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cuerpo de Texto de la Historia"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 10,
    value: data.nosotros?.historia?.cuerpo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        historia: {
          ...(prev.nosotros?.historia || {}),
          cuerpo: e.target.value
        }
      }
    })),
    placeholder: "Escribí los párrafos de la historia institucional..."
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Tip: Separá los párrafos dejando una línea vacía. En la web se repartirán automáticamente en las dos columnas institucionales."))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#f8fafc',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "target",
    style: {
      width: 18
    }
  }), " Formación y Objetivos Generales (Cuerpo 2)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtítulo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.objetivos?.subtitulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        objetivos: {
          ...(prev.nosotros?.objetivos || {}),
          subtitulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Objetivos generales del Centro"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.objetivos?.titulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        objetivos: {
          ...(prev.nosotros?.objetivos || {}),
          titulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Formación con título oficial, al servicio del trabajo"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cuerpo de Texto de los Objetivos"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 5,
    value: data.nosotros?.objetivos?.cuerpo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        objetivos: {
          ...(prev.nosotros?.objetivos || {}),
          cuerpo: e.target.value
        }
      }
    })),
    placeholder: "Escribí los párrafos sobre los objetivos institucionales..."
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      fontSize: 18,
      color: 'var(--blue-900)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "handshake",
    style: {
      width: 18
    }
  }), " Tarjeta Red de CFP / Convenio (Body Tarjeta)"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: 14,
      padding: '10px 12px',
      background: '#f8fafc',
      borderRadius: 8,
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: data.nosotros?.redUocra?.visible !== false,
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        redUocra: {
          ...(prev.nosotros?.redUocra || {}),
          visible: e.target.checked
        }
      }
    }))
  }), "Mostrar esta tarjeta en la página Nosotros", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, "(si se desmarca, se oculta sin borrar el texto)")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Título de la Tarjeta"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.nosotros?.redUocra?.titulo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        redUocra: {
          ...(prev.nosotros?.redUocra || {}),
          titulo: e.target.value
        }
      }
    })),
    placeholder: "Ej: Red de CFP de Trabajadores de la Construcción"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cuerpo de Texto"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 4,
    value: data.nosotros?.redUocra?.cuerpo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      nosotros: {
        ...prev.nosotros,
        redUocra: {
          ...(prev.nosotros?.redUocra || {}),
          cuerpo: e.target.value
        }
      }
    })),
    placeholder: "Texto sobre el convenio de articulación y equipamiento..."
  })))), activeTab === 'campus' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Control del Campus Virtual"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Activá o desactivá visual y operativamente el botón del Campus en todo el sitio web."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: 'var(--neutral-25)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 16,
      display: 'block',
      color: 'var(--blue-900)'
    }
  }, "Estado del Campus Virtual: ", data.campusVirtual?.activo ? 'HABILITADO' : 'DESHABILITADO'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, data.campusVirtual?.activo ? 'El botón está activo y redirige directamente a la plataforma Moodle.' : 'El acceso público al campus se encuentra pausado.')), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: Boolean(data.campusVirtual?.activo),
    onChange: e => updateData(prev => ({
      ...prev,
      campusVirtual: {
        ...prev.campusVirtual,
        activo: e.target.checked
      }
    }))
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider"
  })))), !data.campusVirtual?.activo && /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      padding: 20,
      background: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Comportamiento cuando el Campus está deshabilitado:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "modoInactivo",
    value: "modal",
    checked: data.campusVirtual?.modoInactivo === 'modal',
    onChange: e => updateData(prev => ({
      ...prev,
      campusVirtual: {
        ...prev.campusVirtual,
        modoInactivo: 'modal'
      }
    }))
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Mostrar aviso informativo (Recomendado):"), " Al hacer clic, se abre una ventana indicando que el campus estará listo próximamente.")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "modoInactivo",
    value: "deshabilitado",
    checked: data.campusVirtual?.modoInactivo === 'deshabilitado',
    onChange: e => updateData(prev => ({
      ...prev,
      campusVirtual: {
        ...prev.campusVirtual,
        modoInactivo: 'deshabilitado'
      }
    }))
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Botón con etiqueta \"Campus (Próximamente)\":"), " Muestra el botón pero avisa de su estado.")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "modoInactivo",
    value: "ocultar",
    checked: data.campusVirtual?.modoInactivo === 'ocultar',
    onChange: e => updateData(prev => ({
      ...prev,
      campusVirtual: {
        ...prev.campusVirtual,
        modoInactivo: 'ocultar'
      }
    }))
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Ocultar botón por completo:"), " El botón desaparece del menú y del pie de página."))), data.campusVirtual?.modoInactivo === 'modal' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mensaje de la ventana informativa:"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 3,
    value: data.campusVirtual?.mensajeModal || '',
    onChange: e => updateData(prev => ({
      ...prev,
      campusVirtual: {
        ...prev.campusVirtual,
        mensajeModal: e.target.value
      }
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "URL de acceso al Campus (Moodle / Aula Virtual)"), /*#__PURE__*/React.createElement("input", {
    type: "url",
    className: "form-input",
    value: data.campusVirtual?.url || '',
    onChange: e => updateData(prev => ({
      ...prev,
      campusVirtual: {
        ...prev.campusVirtual,
        url: e.target.value
      }
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Enlace al que se dirigirá al usuario cuando el campus esté activo."))), activeTab === 'header' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Fotos del Header (Lente Rotativo)"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Administrá las imágenes de los talleres que rotan en la lente circular de la portada.")), /*#__PURE__*/React.createElement("label", {
    className: "btn btn-primary",
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload",
    style: {
      width: 16
    }
  }), " Subir Foto Nueva", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/jpeg,image/png,image/webp",
    style: {
      display: 'none'
    },
    onChange: handleSubirFoto
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 16
    }
  }, (data.heroFotos || []).map((foto, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: '#fff',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140,
      background: '#e6ebf2',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: foto.includes('/') ? foto : `assets/${foto}`,
    alt: foto,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 8,
      background: 'rgba(0,40,120,.85)',
      color: '#fff',
      fontSize: 11,
      padding: '2px 8px',
      borderRadius: 4,
      fontWeight: 700
    }
  }, "#", idx + 1)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--neutral-700)',
      wordBreak: 'break-all',
      marginBottom: 8
    }
  }, foto), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: idx === 0,
    className: "btn btn-secondary btn-sm",
    style: {
      padding: '4px 8px'
    },
    onClick: () => {
      const list = [...data.heroFotos];
      const temp = list[idx - 1];
      list[idx - 1] = list[idx];
      list[idx] = temp;
      updateData({
        heroFotos: list
      });
    }
  }, "←"), /*#__PURE__*/React.createElement("button", {
    disabled: idx === data.heroFotos.length - 1,
    className: "btn btn-secondary btn-sm",
    style: {
      padding: '4px 8px'
    },
    onClick: () => {
      const list = [...data.heroFotos];
      const temp = list[idx + 1];
      list[idx + 1] = list[idx];
      list[idx] = temp;
      updateData({
        heroFotos: list
      });
    }
  }, "→"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    style: {
      padding: '4px 8px'
    },
    onClick: () => {
      if (confirm(`¿Eliminar la foto "${foto}" de la rotación?`)) {
        updateData({
          heroFotos: data.heroFotos.filter((_, i) => i !== idx)
        });
      }
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 14
    }
  })))))))), activeTab === 'contacto' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Datos de Contacto y Sedes"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Actualizá las direcciones, teléfonos de atención y canales de consulta."), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Sede Principal"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.contacto?.direccion || '',
    onChange: e => updateData(prev => ({
      ...prev,
      contacto: {
        ...prev.contacto,
        direccion: e.target.value
      },
      sedePrincipal: `Sede ${e.target.value}`
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Sede Anexo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.contacto?.anexo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      contacto: {
        ...prev.contacto,
        anexo: e.target.value
      },
      sedeAnexo: `Anexo ${e.target.value}`
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Enlace de Ubicación del Anexo en Google Maps"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.contacto?.anexoUrl || '',
    onChange: e => updateData(prev => ({
      ...prev,
      contacto: {
        ...prev.contacto,
        anexoUrl: e.target.value
      }
    })),
    placeholder: "https://share.google/jpjdJqgyEQzbXONJT"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Enlace que se abre al hacer clic en \"Abrir Anexo en Google Maps\".")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Horario de Atención Presencial"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.contacto?.atencion || '',
    onChange: e => updateData(prev => ({
      ...prev,
      contacto: {
        ...prev.contacto,
        atencion: e.target.value
      }
    })),
    placeholder: "Lunes a viernes de 9 a 20 hs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "WhatsApp Institucional"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: data.contacto?.whatsapp || '',
    onChange: e => updateData(prev => ({
      ...prev,
      contacto: {
        ...prev.contacto,
        whatsapp: e.target.value
      }
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Teléfonos de Línea Fija"), (data.contacto?.telefonos || []).map((tel, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: tel,
    onChange: e => {
      const tels = [...data.contacto.telefonos];
      tels[i] = e.target.value;
      updateData(prev => ({
        ...prev,
        contacto: {
          ...prev.contacto,
          telefonos: tels
        }
      }));
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger btn-sm",
    onClick: () => {
      const tels = data.contacto.telefonos.filter((_, idx) => idx !== i);
      updateData(prev => ({
        ...prev,
        contacto: {
          ...prev.contacto,
          telefonos: tels
        }
      }));
    }
  }, "✕"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => {
      const tels = [...(data.contacto?.telefonos || []), ''];
      updateData(prev => ({
        ...prev,
        contacto: {
          ...prev.contacto,
          telefonos: tels
        }
      }));
    }
  }, "+ Agregar teléfono"))), activeTab === 'marbot' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Asistente Virtual Marbot"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Configurá el bot de ayuda flotante que atiende las dudas de los visitantes."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: 'var(--neutral-25)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 16,
      display: 'block',
      color: 'var(--blue-900)'
    }
  }, "Estado de Marbot: ", data.marbot?.activo !== false ? 'ACTIVADO' : 'DESACTIVADO'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, data.marbot?.activo !== false ? 'El widget flotante aparece en la esquina inferior derecha.' : 'El asistente está deshabilitado en todo el sitio.')), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: data.marbot?.activo !== false,
    onChange: e => updateData(prev => ({
      ...prev,
      marbot: {
        ...(prev.marbot || {}),
        activo: e.target.checked
      }
    }))
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mensaje de Saludo Inicial"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 3,
    value: data.marbot?.saludo || '',
    onChange: e => updateData(prev => ({
      ...prev,
      marbot: {
        ...(prev.marbot || {}),
        saludo: e.target.value
      }
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "El primer mensaje que Marbot muestra al visitante al abrir el chat."))), activeTab === 'sistema' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      margin: '0 0 4px',
      color: 'var(--blue-900)'
    }
  }, "Sistema y Seguridad"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 14,
      color: 'var(--neutral-500)'
    }
  }, "Copias de seguridad, credenciales de acceso y utilidades del servidor."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      margin: '0 0 8px',
      color: 'var(--blue-900)'
    }
  }, "Contraseña del Administrador"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-600)',
      margin: '0 0 16px'
    }
  }, "Podés cambiar la contraseña común que usa el equipo para entrar a este panel. La clave maestra del responsable del sitio no se modifica desde acá y sirve para restablecer la común."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setCambioClaveModal(true)
  }, "Cambiar Contraseña")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      margin: '0 0 8px',
      color: 'var(--blue-900)'
    }
  }, "Copia de Seguridad (Backup)"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-600)',
      margin: '0 0 16px'
    }
  }, "Descargá o restaurá una copia completa de todos los cursos y configuraciones en formato JSON."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: handleExportarBackup
  }, "Descargar Backup JSON"), /*#__PURE__*/React.createElement("label", {
    className: "btn btn-secondary btn-sm",
    style: {
      cursor: 'pointer'
    }
  }, "Restaurar Backup", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json",
    style: {
      display: 'none'
    },
    onChange: handleImportarBackup
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: handleDescargarDataJs,
    title: "Archivo data.js listo para subir por FTP, por si el guardado en el servidor no funcionara"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    style: {
      width: 14
    }
  }), " Descargar data.js"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      flexWrap: 'wrap',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      margin: 0,
      color: 'var(--blue-900)'
    }
  }, "Registro de cambios"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: cargarRegistroCambios,
    disabled: registroCambios === 'cargando'
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "refresh-cw",
    style: {
      width: 14
    }
  }), " Actualizar")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-600)',
      margin: '0 0 12px'
    }
  }, "Cada vez que alguien guarda en el servidor queda anotado el nombre con el que ingresó al panel y la hora. Se muestran los últimos 50 guardados, del más reciente al más antiguo."), registroCambios === 'cargando' && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-500)',
      margin: 0
    }
  }, "Cargando…"), registroCambios === 'error' && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: '#b91c1c',
      margin: 0
    }
  }, "No se pudo leer el registro (el servidor no respondió)."), Array.isArray(registroCambios) && registroCambios.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--neutral-500)',
      margin: 0
    }
  }, "Todavía no hay guardados registrados."), Array.isArray(registroCambios) && registroCambios.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflowY: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#f1f5f9',
      textAlign: 'left',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px'
    }
  }, "Fecha y hora"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px'
    }
  }, "Operador"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px'
    }
  }, "Cursos"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px'
    }
  }, "IP"))), /*#__PURE__*/React.createElement("tbody", null, registroCambios.map((e, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px',
      whiteSpace: 'nowrap'
    }
  }, e.fecha.slice(8, 10), "/", e.fecha.slice(5, 7), "/", e.fecha.slice(0, 4), " ", e.fecha.slice(11, 16), " hs"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px',
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, e.operador), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px'
    }
  }, e.cursos), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px',
      color: 'var(--neutral-500)'
    }
  }, e.ip))))))))))), /*#__PURE__*/React.createElement("div", {
    className: "save-bar save-bar-discreta",
    role: "region",
    "aria-label": "Guardado en el servidor"
  }, /*#__PURE__*/React.createElement("span", {
    title: dirty ? 'Hay cambios sin guardar en el servidor' : 'Todos los datos sincronizados',
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: dirty ? 'var(--brand-accent)' : 'var(--green-600)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: dirty ? 'var(--blue-900)' : 'var(--neutral-600)',
      fontWeight: dirty ? 700 : 500,
      whiteSpace: 'nowrap'
    }
  }, dirty ? 'Sin guardar' : 'Guardado'), dirty && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    "data-accion": "revertir",
    onClick: handleRevertir,
    disabled: guardando,
    title: "Descartar los cambios sin guardar y volver al último guardado"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "undo-2",
    style: {
      width: 14
    }
  }), " Revertir"), /*#__PURE__*/React.createElement("button", {
    className: `btn ${dirty ? 'btn-primary' : 'btn-secondary'} btn-sm`,
    "data-accion": "guardar-servidor",
    onClick: handleGuardarServidor,
    disabled: guardando,
    title: "Guardar los cambios en el servidor para publicarlos en el sitio"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "save",
    style: {
      width: 14
    }
  }), " ", guardando ? 'Guardando…' : 'Guardar')), cursoModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setCursoModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: 680
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 18,
      color: 'var(--blue-900)'
    }
  }, cursoIndex >= 0 ? 'Editar Curso' : 'Nuevo Curso'), cursoModal.slug && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      background: 'var(--surface-brand-soft, #e8eefb)',
      color: 'var(--brand-primary)',
      padding: '2px 8px',
      borderRadius: 6,
      fontWeight: 700
    }
  }, "Página individual activa")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, cursoModal.slug && /*#__PURE__*/React.createElement("a", {
    href: `index.html#/curso/${cursoModal.slug}`,
    target: "_blank",
    rel: "noopener",
    className: "btn btn-secondary btn-sm",
    style: {
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    },
    title: "Ver la página de este curso en una pestaña nueva"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "external-link",
    style: {
      width: 13
    }
  }), " Ver en la web"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCursoModal(null),
    style: {
      background: 'transparent',
      border: 0,
      fontSize: 20,
      cursor: 'pointer',
      padding: 4
    }
  }, "✕"))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre del Curso"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: cursoModal.curso || '',
    onChange: e => {
      const val = e.target.value;
      const currentSlug = cursoModal.slug || '';
      // Auto-generar sugerencia de slug para cursos nuevos o sin slug
      const autoSlug = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setCursoModal({
        ...cursoModal,
        curso: val,
        slug: !currentSlug || cursoIndex < 0 ? autoSlug : currentSlug
      });
    },
    placeholder: "Ej: Soldador MIG-TIG",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Slug de la URL (Página Individual)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: cursoModal.slug || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    }),
    placeholder: "ej: soldador-mig-tig"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Enlace directo: ", /*#__PURE__*/React.createElement("code", null, "index.html#/curso/", cursoModal.slug || 'nombre-curso'), " — ", /*#__PURE__*/React.createElement("em", null, "Se genera automáticamente con el nombre. No necesitás crear archivos ni subir nada por FTP; la página funciona al instante."))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Horas Totales Oficiales"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: cursoModal.horasTotales || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      horasTotales: e.target.value
    }),
    placeholder: "Ej: 360 horas reloj"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Destacado en el recuadro superior de la página individual"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Familia Principal"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: cursoModal.familia || 'Administración',
    onChange: e => setCursoModal({
      ...cursoModal,
      familia: e.target.value
    })
  }, (data.familias || []).map(f => /*#__PURE__*/React.createElement("option", {
    key: f.nombre,
    value: f.nombre
  }, f.nombre)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Duración / Ciclo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: cursoModal.duracion || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      duracion: e.target.value
    }),
    placeholder: "Ej: Anual (inicio marzo) o Cuatrimestral"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Horarios y Días (Sincronizado con la Página Individual)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: cursoModal.horarios || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      horarios: e.target.value
    }),
    placeholder: "Ej: Lunes, miércoles y viernes de 18:00 a 21:50 hs"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Separá cada turno con \" · \" (ej.: \"Mañana: martes y jueves de 9:10 a 12:30 hs · Noche: lunes y jueves de 18:00 a 21:40 hs\"). En la página del curso se muestra uno por renglón.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Turnos (para el filtro \"Turno\" de la página de cursos)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, window.CFPReglas.TURNOS.map(t => {
    const marcados = window.CFPReglas.turnosDeCurso(cursoModal);
    return /*#__PURE__*/React.createElement("label", {
      key: t,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 14,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: marcados.includes(t),
      onChange: e => {
        const nuevos = e.target.checked ? [...marcados, t] : marcados.filter(x => x !== t);
        setCursoModal({
          ...cursoModal,
          turnos: window.CFPReglas.TURNOS.filter(x => nuevos.includes(x))
        });
      }
    }), t);
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, Array.isArray(cursoModal.turnos) && cursoModal.turnos.length ? 'Marcados a mano.' : 'Sin marcar: se deducen de los horarios (las casillas tildadas muestran lo que se deduce).')), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Sede de Cursada"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: cursoModal.sede || data.sedePrincipal || 'Sede Juan Pablo Angulo 1272, Dock Sud',
    onChange: e => setCursoModal({
      ...cursoModal,
      sede: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: data.sedePrincipal || 'Sede Juan Pablo Angulo 1272, Dock Sud'
  }, data.sedePrincipal || 'Sede Juan Pablo Angulo 1272, Dock Sud', " (Sede Central)"), /*#__PURE__*/React.createElement("option", {
    value: data.sedeAnexo || 'Anexo Polideportivo Plaza Renunciamiento — Irala y Argentino Valle'
  }, data.sedeAnexo || 'Anexo Polideportivo Plaza Renunciamiento — Irala y Argentino Valle', " (Sede Anexo)"), /*#__PURE__*/React.createElement("option", {
    value: "Sede Juan Pablo Angulo 1272, Dock Sud y Anexo Polideportivo Plaza Renunciamiento"
  }, "Ambas sedes (Sede Juan Pablo Angulo y Anexo Polideportivo)"), cursoModal.sede && cursoModal.sede !== (data.sedePrincipal || 'Sede Juan Pablo Angulo 1272, Dock Sud') && cursoModal.sede !== (data.sedeAnexo || 'Anexo Polideportivo Plaza Renunciamiento — Irala y Argentino Valle') && cursoModal.sede !== 'Sede Juan Pablo Angulo 1272, Dock Sud y Anexo Polideportivo Plaza Renunciamiento' && /*#__PURE__*/React.createElement("option", {
    value: cursoModal.sede
  }, cursoModal.sede)), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Elegí la sede donde se dicta el curso (se muestra en el catálogo y en la página propia del curso).")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Requisitos de Inscripción"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    value: cursoModal.requisitos || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      requisitos: e.target.value
    }),
    placeholder: "Ej: Primario completo (mayor de 16 años)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Aparece en el recuadro \"Requisitos\" de la página individual.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      padding: 14,
      border: '1px solid #cbd5e1',
      borderRadius: 10,
      background: '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado de cupos (respalda los avisos de “Últimos cupos”)"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: cursoModal.estadoCupo || 'sin-confirmar',
    onChange: e => setCursoModal({
      ...cursoModal,
      estadoCupo: e.target.value,
      cupoConfirmadoEn: e.target.value === 'sin-confirmar' ? '' : window.CFPReglas?.fechaLocal(new Date()) || new Date().toISOString().slice(0, 10)
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "sin-confirmar"
  }, "Sin confirmar"), /*#__PURE__*/React.createElement("option", {
    value: "abierto"
  }, "Abierto"), /*#__PURE__*/React.createElement("option", {
    value: "ultimos-cupos"
  }, "Últimos cupos"), /*#__PURE__*/React.createElement("option", {
    value: "completo"
  }, "Completo")), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Última confirmación: ", cursoModal.cupoConfirmadoEn || 'sin fecha', ". Los avisos de últimos cupos vencen a los 30 días y se bloquean si el curso está completo o sin confirmar.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      padding: 14,
      border: '1px solid #bfdbfe',
      borderRadius: 10,
      background: '#eff6ff',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13,
      color: '#1e3a8a',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Trayectos del Catálogo 2027 vinculados"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontSize: 11,
      fontWeight: 700,
      background: '#dbeafe',
      color: '#1e40af',
      padding: '2px 8px',
      borderRadius: 999
    }
  }, (cursoModal.trayectosCatalogo || []).length, " ", (cursoModal.trayectosCatalogo || []).length === 1 ? 'trayecto oficial' : 'trayectos articulados')), (cursoModal.trayectosCatalogo || []).length > 0 && catalogoGlobal && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-sm",
    style: {
      padding: '3px 10px',
      fontSize: 11.5
    },
    title: "Autosuma las horas, combina certificaciones oficiales y aúna los contenidos de los diseños curriculares",
    onClick: () => {
      const map = Object.fromEntries(catalogoGlobal.trayectos.map(t => [t.codigo, t]));
      const selected = (cursoModal.trayectosCatalogo || []).map(cod => map[cod]).filter(Boolean);
      const unificados = unificarDatosCatalogo(selected);
      if (unificados) {
        setCursoModal(prev => ({
          ...prev,
          horasTotales: unificados.horasTotales,
          certificacion: unificados.certificacion,
          introduccion: unificados.introduccion,
          detalles: unificados.detalles,
          requisitos: prev.requisitos ? prev.requisitos : unificados.requisitos
        }));
        showToast(`Datos unificados con ${selected.length} trayecto(s). Podés editar las horas y textos a mano.`);
      }
    }
  }, "⚡ Unificar datos desde el Catálogo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 10
    }
  }, (cursoModal.trayectosCatalogo || []).map(cod => {
    const t = catalogoGlobal ? catalogoGlobal.trayectos.find(x => x.codigo === cod) : null;
    return /*#__PURE__*/React.createElement("span", {
      key: cod,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#ffffff',
        border: '1px solid #bfdbfe',
        color: '#1e3a8a',
        padding: '3px 8px',
        borderRadius: 6,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("strong", null, cod), ": ", t ? t.nombre : cod, " ", t && t.horasReloj ? `(${t.horasReloj} hs)` : '', /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        const nuevos = (cursoModal.trayectosCatalogo || []).filter(c => c !== cod);
        let unif = null;
        if (catalogoGlobal && nuevos.length > 0) {
          const map = Object.fromEntries(catalogoGlobal.trayectos.map(x => [x.codigo, x]));
          const sel = nuevos.map(c => map[c]).filter(Boolean);
          unif = unificarDatosCatalogo(sel);
        }
        setCursoModal(prev => ({
          ...prev,
          trayectosCatalogo: nuevos,
          horasTotales: unif ? unif.horasTotales : prev.horasTotales
        }));
      },
      style: {
        background: 'none',
        border: 'none',
        color: '#dc2626',
        cursor: 'pointer',
        fontWeight: 800,
        padding: '0 2px'
      },
      title: "Quitar este trayecto"
    }, "✕"));
  }), !(cursoModal.trayectosCatalogo || []).length && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: '#64748b',
      fontStyle: 'italic'
    }
  }, "No hay trayectos oficiales asociados a este curso todavía.")), catalogoGlobal && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    style: {
      fontSize: 12,
      flex: 1,
      background: '#ffffff'
    },
    value: "",
    onChange: e => {
      const cod = e.target.value;
      if (!cod) return;
      if ((cursoModal.trayectosCatalogo || []).includes(cod)) return;
      const nuevos = [...(cursoModal.trayectosCatalogo || []), cod];
      const map = Object.fromEntries(catalogoGlobal.trayectos.map(x => [x.codigo, x]));
      const sel = nuevos.map(c => map[c]).filter(Boolean);
      const unificados = unificarDatosCatalogo(sel);
      setCursoModal(prev => ({
        ...prev,
        trayectosCatalogo: nuevos,
        // Autosuma las horas automáticamente, pero permitiendo modificarlas libremente
        horasTotales: unificados ? unificados.horasTotales : prev.horasTotales,
        // Si antes no tenía certificación ni intro, precarga
        certificacion: !prev.certificacion && unificados ? unificados.certificacion : prev.certificacion,
        introduccion: !prev.introduccion && unificados ? unificados.introduccion : prev.introduccion
      }));
      showToast(`Trayecto ${cod} asociado. Horas recalculadas automáticamente.`);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "+ Asociar otro trayecto del Catálogo 2027 (para articular cursos)..."), catalogoGlobal.trayectos.filter(t => !(cursoModal.trayectosCatalogo || []).includes(t.codigo)).map(t => /*#__PURE__*/React.createElement("option", {
    key: t.codigo,
    value: t.codigo
  }, t.codigo, " — ", t.nombre, " (", t.horasReloj, " hs reloj · ", t.familia, ")")))), /*#__PURE__*/React.createElement("div", {
    className: "form-hint",
    style: {
      marginTop: 6,
      color: '#1e40af'
    }
  }, "💡 Podés asociar varios trayectos para formar un curso articulado. Las horas se autosuman y podés cambiarlas a mano. El botón \"⚡ Unificar datos\" aúna las certificaciones oficiales y todos los programas curriculares.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Certificación (se muestra en la página individual del curso)"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 3,
    value: cursoModal.certificacion || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      certificacion: e.target.value
    }),
    placeholder: "Ej: Soldador Básico según Resolución Nro. … (del Catálogo oficial 2027)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Se muestra en el recuadro \"Certificación que se obtiene\" de la página individual. Para cursos articulados se listan todas las certificaciones otorgadas.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Introducción del Curso (Página Individual)"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 3,
    value: cursoModal.introduccion || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      introduccion: e.target.value
    }),
    placeholder: "Resumen introductorio del curso que describe las competencias fundamentales y alcance formativo..."
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Aparece en la sección destacada \"Introducción\" de la página individual del curso.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Capacidades profesionales (Página Individual)"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 6,
    value: cursoModal.capacidades || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      capacidades: e.target.value
    }),
    placeholder: "Qué está capacitado para hacer quien egresa. Para una lista, empezá cada renglón con •"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Aparece en la sección \"Capacidades profesionales\", debajo de la introducción. Si queda vacío, la sección no se muestra. Separá párrafos con un renglón en blanco; los renglones que empiezan con • se muestran como lista.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Detalles del Curso y Programa Curricular Oficial"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-textarea",
    rows: 6,
    value: cursoModal.detalles || '',
    onChange: e => setCursoModal({
      ...cursoModal,
      detalles: e.target.value
    }),
    placeholder: "Contenidos oficiales, módulos pedagógicos, herramientas de taller, seguridad e higiene y perfil profesional de egreso. Separá párrafos con un salto de línea doble..."
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Aparece en la sección \"Detalles Del Curso\". Cada salto de línea doble creará un párrafo formateado en la página."))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setCursoModal(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      if (!cursoModal.curso.trim()) {
        alert('El nombre del curso no puede estar vacío.');
        return;
      }
      const cleanSlug = cursoModal.slug && cursoModal.slug.trim() ? cursoModal.slug.trim() : cursoModal.curso.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const cursoFinal = {
        ...cursoModal,
        slug: cleanSlug,
        horasTotales: cursoModal.horasTotales && cursoModal.horasTotales.trim() ? cursoModal.horasTotales.trim() : '360 horas reloj',
        introduccion: cursoModal.introduccion || '',
        detalles: cursoModal.detalles || '',
        estadoCupo: ['sin-confirmar', 'abierto', 'ultimos-cupos', 'completo'].includes(cursoModal.estadoCupo) ? cursoModal.estadoCupo : 'sin-confirmar',
        cupoConfirmadoEn: cursoModal.cupoConfirmadoEn || ''
      };
      updateData(prev => {
        const list = [...(prev.courses || [])];
        if (cursoIndex >= 0) {
          list[cursoIndex] = cursoFinal;
        } else {
          list.push(cursoFinal);
        }
        return {
          ...prev,
          courses: list
        };
      });
      setCursoModal(null);
      showToast(cursoIndex >= 0 ? `Curso "${cursoFinal.curso}" y su página individual actualizados.` : `Nuevo curso "${cursoFinal.curso}" creado con su página individual.`);
    }
  }, "Guardar y Sincronizar Curso")))), promoModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setPromoModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: promoStep === 4 ? 1040 : 880
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontSize: 18,
      color: 'var(--blue-900)'
    }
  }, promoIndex >= 0 ? 'Editar Promoción' : 'Nueva Pieza Promocional'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--neutral-500)'
    }
  }, "Paso ", promoStep, " de 4:"), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 12,
      color: 'var(--brand-primary)'
    }
  }, promoStep === 1 && 'Elegir Modelo de Diseño', promoStep === 2 && tituloPaso2(promoModal), promoStep === 3 && 'Foto de Taller y Encuadre', promoStep === 4 && 'Vista Previa en Vivo y Personalización'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPromoModal(null),
    style: {
      background: 'transparent',
      border: 0,
      fontSize: 20,
      cursor: 'pointer',
      padding: 4
    }
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "promo-stepper-bar",
    style: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle, #d2dae4)',
      background: 'var(--neutral-25, #f9fafc)',
      padding: '10px 20px',
      gap: 8,
      minHeight: 48,
      height: 'auto',
      overflowX: 'auto',
      overflowY: 'hidden',
      flexShrink: 0,
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none'
    }
  }, [{
    num: 1,
    label: 'Modelo'
  }, {
    num: 2,
    label: nombrePaso2(promoModal)
  }, {
    num: 3,
    label: 'Foto & Encuadre'
  }, {
    num: 4,
    label: 'Vista Previa'
  }].map((s, idx) => {
    const habilitado = pasoHabilitado(promoModal, s.num);
    const isActive = promoStep === s.num;
    const isPassed = promoStep > s.num && habilitado;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s.num
    }, idx > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cbd5e1',
        fontSize: 13,
        userSelect: 'none',
        flexShrink: 0
      }
    }, "›"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        if (habilitado) setPromoStep(s.num);
      },
      disabled: !habilitado,
      "aria-disabled": !habilitado,
      title: habilitado ? undefined : motivoPasoBloqueado(s.num),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: isActive ? 'var(--blue-900, #002878)' : isPassed ? 'var(--surface-brand-soft, #e8eefb)' : '#ffffff',
        color: isActive ? '#ffffff' : isPassed ? 'var(--blue-900, #002878)' : 'var(--neutral-600, #4a5464)',
        border: isActive ? '1px solid var(--blue-900, #002878)' : isPassed ? '1px solid #c0d0f0' : '1px solid var(--border-subtle, #d2dae4)',
        borderRadius: 999,
        padding: '6px 14px',
        fontSize: 12.5,
        fontFamily: 'var(--font-display, inherit)',
        fontWeight: isActive ? 700 : 600,
        cursor: habilitado ? 'pointer' : 'not-allowed',
        opacity: habilitado ? 1 : 0.45,
        textDecoration: habilitado ? 'none' : 'line-through',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        lineHeight: 1,
        boxSizing: 'border-box',
        boxShadow: isActive ? '0 2px 6px rgba(0,40,120,0.18)' : 'none',
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: isActive ? '#ffffff' : isPassed ? 'var(--blue-900, #002878)' : '#e2e8f0',
        color: isActive ? 'var(--blue-900, #002878)' : isPassed ? '#ffffff' : 'var(--neutral-600, #4a5464)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10.5,
        fontWeight: 800,
        flexShrink: 0
      }
    }, isPassed ? '✓' : s.num), /*#__PURE__*/React.createElement("span", null, s.num, ". ", s.label)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, promoStep === 1 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px',
      fontSize: 15,
      color: 'var(--blue-900)'
    }
  }, "Elegí el modelo de diseño:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Los modelos de curso toman los datos del curso que elijas. El de inscripciones es un aviso general con las familias de oficios.", ' ', "Al elegir el modelo, el curso o la foto se pasa solo al paso siguiente; para volver, tocá el paso en la barra de arriba."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: 16
    }
  }, Object.values(CATALOGO_PLANTILLAS).map(plt => {
    const isSelected = (promoModal.modelo || 'flyer-curso-v1') === plt.id;
    const muestra = MUESTRAS_PLANTILLAS[plt.id] || null;
    return /*#__PURE__*/React.createElement("div", {
      key: plt.id,
      onClick: () => {
        if (!plt.disponible) return;
        if (plt.id === 'ultimos-cupos-v1') {
          const elegibles = cursos.filter(c => window.CFPReglas?.puedePublicarUltimosCupos(c));
          if (!elegibles.length) {
            showToast('No hay cursos confirmados como “Últimos cupos” dentro de los últimos 30 días. Actualizá el estado en Gestión de Cursos.', 'error');
            return;
          }
          const cursoCupo = elegibles[0];
          const sugerida = fotoSugeridaPromo(cursoCupo, data.bibliotecaFotosPromo);
          setPromoModal(prev => ({
            ...cursoAPromo(cursoCupo, sugerida ? sugerida.archivo : undefined),
            modelo: plt.id,
            estadoCupoUsado: cursoCupo.estadoCupo,
            cupoConfirmadoEnUsado: cursoCupo.cupoConfirmadoEn,
            huellaCurso: window.CFPReglas.huellaCurso(cursoCupo),
            popupActivo: prev.popupActivo === true,
            popupZonaHoraria: prev.popupZonaHoraria || window.CFPReglas.ZONA_HORARIA
          }));
          setFiltroFotoFamilia(cursoCupo.familia || 'Todas');
        } else if (plt.tipo === 'curso') {
          const primerCurso = cursos[0] || null;
          const sugerida = fotoSugeridaPromo(primerCurso, data.bibliotecaFotosPromo);
          setPromoModal(prev => ({
            ...cursoAPromo(primerCurso, sugerida ? sugerida.archivo : undefined),
            modelo: plt.id,
            popupActivo: prev.popupActivo === true
          }));
          setFiltroFotoFamilia(primerCurso && primerCurso.familia || 'Todas');
        } else if (plt.tipo === 'inscripciones') {
          setPromoModal(prev => ({
            ...inscripcionesAPromo(data),
            modelo: plt.id,
            popupActivo: prev.popupActivo === true
          }));
          setFiltroFotoFamilia('Institucional');
        } else if (plt.tipo === 'captacion' || plt.tipo === 'efemeride') {
          const esCaptacion = plt.tipo === 'captacion';
          setPromoModal(prev => ({
            id: 'promo-' + plt.tipo + '-' + Date.now().toString(36),
            modelo: plt.id,
            tipo: plt.tipo,
            cursoSlug: '',
            imagen: esCaptacion ? 'assets/promociones/tematicas/captacion/captacion-1.jpg' : 'assets/promociones/tematicas/dias-patrios/dias-patrios-1.jpg',
            encuadre: 'center',
            textos: {},
            popupActivo: prev.popupActivo === true,
            fechaCreacion: new Date().toISOString().split('T')[0]
          }));
          setFiltroFotoFamilia(esCaptacion ? 'Captación de Oficios' : 'Días Patrios y Conmemoraciones');
        } else if (plt.tipo === 'aviso') {
          setPromoModal(prev => ({
            id: 'promo-aviso-' + Date.now().toString(36),
            modelo: plt.id,
            tipo: 'aviso',
            cursoSlug: '',
            imagen: ((plt.fotos || [])[0] || {}).archivo || 'assets/hero-egresados.jpg',
            encuadre: 'center',
            textos: {},
            popupActivo: prev.popupActivo === true,
            fechaCreacion: new Date().toISOString().split('T')[0]
          }));
          setFiltroFotoFamilia(plt.familiaFotos || 'Institucional');
        } else if (plt.tipo === 'grilla') {
          setPromoModal(prev => ({
            id: 'promo-grilla-' + Date.now().toString(36),
            modelo: plt.id,
            tipo: 'grilla',
            cursoSlug: '',
            periodo: 'marzo',
            cursosSeleccionados: sugeridosGrilla('marzo'),
            composicion: 'grilla',
            pagina: 0,
            textos: {},
            popupActivo: prev.popupActivo === true,
            fechaCreacion: new Date().toISOString().split('T')[0]
          }));
        } else {
          setPromoModal(prev => ({
            ...prev,
            modelo: plt.id
          }));
        }
        avanzarPromo(1, pasoSiguiente({
          modelo: plt.id
        }, 1));
      },
      style: {
        borderRadius: 14,
        border: `2px solid ${isSelected ? 'var(--blue-700)' : '#e2e8f0'}`,
        background: isSelected ? 'var(--surface-brand-soft, #e8eefb)' : '#ffffff',
        cursor: plt.disponible ? 'pointer' : 'not-allowed',
        opacity: plt.disponible ? 1 : 0.65,
        transition: 'all 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: isSelected ? '0 6px 18px rgba(0,40,120,0.12)' : '0 1px 4px rgba(0,0,0,0.03)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        aspectRatio: '1080 / 1350',
        background: '#f8fafc',
        overflow: 'hidden',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'stretch'
      }
    }, muestra && /*#__PURE__*/React.createElement(MiniaturaPromo, {
      promo: muestra,
      formato: "feed"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 800,
        textTransform: 'uppercase',
        padding: '2px 8px',
        borderRadius: 999,
        background: isSelected ? 'var(--blue-900)' : '#f1f5f9',
        color: isSelected ? '#fff' : 'var(--neutral-600)'
      }
    }, plt.badge), isSelected ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--blue-900)',
        fontWeight: 800,
        fontSize: 13,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3
      }
    }, "✓ Elegido") : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--blue-700)',
        fontWeight: 600
      }
    }, "Seleccionar ➔")), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14.5,
        color: 'var(--blue-900)',
        marginBottom: 6,
        display: 'block'
      }
    }, plt.nombre), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 12px',
        fontSize: 12,
        color: 'var(--neutral-600)',
        lineHeight: 1.45,
        flex: 1
      }
    }, plt.descripcion), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--neutral-500)',
        fontWeight: 600,
        borderTop: '1px solid #edf2f7',
        paddingTop: 8
      }
    }, "Formatos: ", plt.formatos.map(f => f.nombre).join(', '))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "promo-step-actions",
    style: {
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoModal(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => setPromoStep(pasoSiguiente(promoModal, 1))
  }, 'Continuar: ' + rotuloPaso(promoModal, pasoSiguiente(promoModal, 1)) + ' ➔'))), promoStep === 2 && plantillaDePromo(promoModal).pasoCurso === 'familias' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px',
      fontSize: 15,
      color: 'var(--blue-900)'
    }
  }, "Elegí las familias de oficios que aparecen en la pieza:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Se muestran como etiquetas debajo del titular, en el orden del sitio. Por defecto van todas."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 8
    }
  }, (data.familias || []).map(f => {
    const marcadas = familiasPromo(promoModal);
    const activa = marcadas.includes(f.nombre);
    return /*#__PURE__*/React.createElement("label", {
      key: f.nombre,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        cursor: 'pointer',
        background: activa ? 'var(--surface-brand-soft, #e8eefb)' : '#fff'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: activa,
      onChange: () => setPromoModal(prev => {
        const actuales = familiasPromo(prev);
        return {
          ...prev,
          familias: activa ? actuales.filter(n => n !== f.nombre) : [...actuales, f.nombre]
        };
      })
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--blue-900)'
      }
    }, f.nombre));
  })), /*#__PURE__*/React.createElement("div", {
    className: "promo-step-actions",
    style: {
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoStep(1)
  }, "← Volver al Modelo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => setPromoStep(pasoSiguiente(promoModal, 2))
  }, 'Continuar: ' + rotuloPaso(promoModal, pasoSiguiente(promoModal, 2)) + ' ➔'))), promoStep === 2 && plantillaDePromo(promoModal).pasoCurso === 'uno' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px',
      fontSize: 15,
      color: 'var(--blue-900)'
    }
  }, "Seleccioná el curso a promocionar:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Al seleccionar un curso, los textos de horarios, sede y requisitos se formatean automáticamente respetando las normas de diseño oficial."), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Buscar curso en el catálogo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-input",
    placeholder: "Filtrar por nombre...",
    value: filtroPromoCursoSelect,
    onChange: e => setFiltroPromoCursoSelect(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 260,
      overflowY: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      background: '#fff'
    }
  }, cursos.filter(c => promoModal.modelo !== 'ultimos-cupos-v1' || window.CFPReglas?.puedePublicarUltimosCupos(c)).filter(c => (c.curso || '').toLowerCase().includes(filtroPromoCursoSelect.toLowerCase())).map(c => {
    const isSelected = promoModal.cursoSlug === c.slug;
    return /*#__PURE__*/React.createElement("div", {
      key: c.slug,
      onClick: () => {
        // Al elegir el curso: sugerir su foto (o la de su familia) y filtrar el paso 3 por familia
        const sugerida = fotoSugeridaPromo(c, data.bibliotecaFotosPromo);
        const nuevaData = cursoAPromo(c, sugerida ? sugerida.archivo : promoModal.imagen);
        setFiltroFotoFamilia(c.familia || 'Todas');
        setPromoModal({
          ...nuevaData,
          modelo: promoModal.modelo || 'flyer-curso-v1',
          imagen: sugerida ? sugerida.archivo : promoModal.imagen || nuevaData.imagen,
          encuadre: sugerida ? sugerida.encuadre || nuevaData.encuadre : promoModal.encuadre || nuevaData.encuadre,
          fondo: promoModal.fondo || 'cuadriculado',
          estadoCupoUsado: c.estadoCupo || 'sin-confirmar',
          cupoConfirmadoEnUsado: c.cupoConfirmadoEn || '',
          huellaCurso: window.CFPReglas?.huellaCurso(c) || '',
          popupActivo: promoModal.popupActivo === true
        });
        avanzarPromo(2, pasoSiguiente(promoModal, 2));
      },
      style: {
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        background: isSelected ? 'var(--surface-brand-soft, #e8eefb)' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 14,
        color: isSelected ? 'var(--blue-900)' : 'var(--text-title)'
      }
    }, c.curso), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--neutral-500)',
        marginTop: 2
      }
    }, c.familia, " • ", c.horarios, " • ", c.sede)), isSelected && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--blue-700)',
        fontWeight: 800
      }
    }, "✓ Seleccionado"));
  })), promoModal.cursoNombre && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: 8,
      border: '1px solid #cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--blue-900)',
      textTransform: 'uppercase'
    }
  }, "Datos auto-generados para el flyer:"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Titular:"), " ", promoModal.cursoNombre, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Días:"), " ", promoModal.diasOverride, " • ", /*#__PURE__*/React.createElement("strong", null, "Horario:"), " ", promoModal.horarioOverride, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Requisito:"), " ", promoModal.requisitoOverride)), /*#__PURE__*/React.createElement("div", {
    className: "promo-step-actions",
    style: {
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoStep(1)
  }, "← Volver al Modelo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => setPromoStep(pasoSiguiente(promoModal, 2))
  }, 'Continuar: ' + rotuloPaso(promoModal, pasoSiguiente(promoModal, 2)) + ' ➔'))), promoStep === 2 && plantillaDePromo(promoModal).pasoCurso === 'varios' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px',
      fontSize: 15,
      color: 'var(--blue-900)'
    }
  }, "Elegí los cursos del listado:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Cada ficha muestra el nombre, los días y horarios y los requisitos tal como están en el catálogo. Los textos de la pieza son los del diseño y no se editan."), /*#__PURE__*/React.createElement(SeleccionCursosGrilla, {
    promo: promoModal,
    setPromo: setPromoModal
  }), /*#__PURE__*/React.createElement("div", {
    className: "promo-step-actions",
    style: {
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoStep(1)
  }, "← Volver al Modelo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => setPromoStep(pasoSiguiente(promoModal, 2))
  }, 'Continuar: ' + rotuloPaso(promoModal, pasoSiguiente(promoModal, 2)) + ' ➔'))), promoStep === 3 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px',
      fontSize: 15,
      color: 'var(--blue-900)'
    }
  }, "Elegí la foto de fondo y el encuadre:"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13,
      color: 'var(--neutral-600)'
    }
  }, "Seleccioná una imagen de taller de la biblioteca o subí una foto nueva. La foto se funde suavemente con el arco institucional."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Categoría / Tema:"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: filtroFotoFamilia,
    onChange: e => setFiltroFotoFamilia(e.target.value),
    style: {
      padding: '6px 12px',
      fontSize: 13,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "Todas"
  }, "📸 Todas las fotos (institucionales, talleres y temáticas)"), plantillaDePromo(promoModal).familiaFotos && /*#__PURE__*/React.createElement("option", {
    value: plantillaDePromo(promoModal).familiaFotos
  }, "⭐ Fotos de esta plantilla (", plantillaDePromo(promoModal).familiaFotos, ")"), /*#__PURE__*/React.createElement("optgroup", {
    label: "🌟 Campañas y Temáticas Curadas"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Temáticas"
  }, "Todas las fotos de Campañas"), /*#__PURE__*/React.createElement("option", {
    value: "Captación de Oficios"
  }, "Captación de Oficios"), /*#__PURE__*/React.createElement("option", {
    value: "Días Patrios y Conmemoraciones"
  }, "Días Patrios y Efemérides"), /*#__PURE__*/React.createElement("option", {
    value: "Últimos Cupos"
  }, "Últimos Cupos"), /*#__PURE__*/React.createElement("option", {
    value: "Listado Anual y Grilla"
  }, "Listado Anual y Grilla"), /*#__PURE__*/React.createElement("option", {
    value: "Cuatrimestrales (Agosto)"
  }, "Cuatrimestrales (Agosto)")), /*#__PURE__*/React.createElement("optgroup", {
    label: "🏛️ Institucional"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Institucional"
  }, "Sede Central, Fachada y Egresados")), /*#__PURE__*/React.createElement("optgroup", {
    label: "🔧 Talleres por Familia Profesional"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Metalmecánica"
  }, "Metalmecánica y Soldadura"), /*#__PURE__*/React.createElement("option", {
    value: "Electricidad"
  }, "Electricidad"), /*#__PURE__*/React.createElement("option", {
    value: "Construcción"
  }, "Construcción"), /*#__PURE__*/React.createElement("option", {
    value: "Climatización"
  }, "Climatización"), /*#__PURE__*/React.createElement("option", {
    value: "Informática"
  }, "Informática"), /*#__PURE__*/React.createElement("option", {
    value: "Administración"
  }, "Administración"), /*#__PURE__*/React.createElement("option", {
    value: "Energías Renovables"
  }, "Energías Renovables")))), /*#__PURE__*/React.createElement("label", {
    className: "btn btn-secondary btn-sm",
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload",
    style: {
      width: 14
    }
  }), " Subir Foto Nueva", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: handleSubirFotoPromo
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: 10,
      maxHeight: 220,
      overflowY: 'auto',
      padding: 4
    }
  }, fotosParaPromo(data, promoModal).filter(f => {
    if (filtroFotoFamilia === 'Todas') return true;
    if (filtroFotoFamilia === 'Temáticas') {
      return f.categoria === 'Campañas y Temáticas' || f.archivo && f.archivo.includes('tematicas');
    }
    return f.familia === filtroFotoFamilia || f.tema === filtroFotoFamilia || f.categoria === filtroFotoFamilia || f.familia === 'General';
  }).map(foto => {
    const isSelected = promoModal.imagen === foto.archivo;
    const esTematica = Boolean(foto.tema || foto.categoria === 'Campañas y Temáticas' || foto.archivo && foto.archivo.includes('tematicas'));
    return /*#__PURE__*/React.createElement("div", {
      key: foto.id || foto.archivo,
      onClick: () => {
        setPromoModal(prev => ({
          ...prev,
          imagen: foto.archivo,
          encuadre: foto.encuadre || prev.encuadre || '40% 45%'
        }));
        avanzarPromo(3, 4);
      },
      style: {
        position: 'relative',
        aspectRatio: '4 / 3',
        borderRadius: 8,
        overflow: 'hidden',
        border: `2px solid ${isSelected ? 'var(--blue-700)' : '#cbd5e1'}`,
        cursor: 'pointer',
        boxShadow: isSelected ? '0 0 0 2px var(--blue-700)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: foto.archivo,
      alt: foto.nombre,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: foto.encuadre || 'center'
      }
    }), esTematica && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 4,
        left: 4,
        background: 'var(--brand-accent, #ffd100)',
        color: 'var(--blue-900, #002878)',
        fontWeight: 800,
        fontSize: 8.5,
        padding: '2px 5px',
        borderRadius: 4,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        pointerEvents: 'none'
      }
    }, foto.tema ? foto.tema.replace(/\s*\(.*\)/, '') : 'Temática'), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.68)',
        color: '#fff',
        fontSize: 10.5,
        padding: '3px 6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, foto.nombre), isSelected && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 4,
        right: 4,
        background: 'var(--blue-900)',
        color: '#fff',
        borderRadius: '50%',
        width: 18,
        height: 18,
        fontSize: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, "✓"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: 8,
      border: '1px solid #e2e8f0'
    }
  }, /*#__PURE__*/React.createElement(SelectorEncuadre, {
    promo: promoModal,
    setPromo: setPromoModal
  })), /*#__PURE__*/React.createElement("div", {
    className: "promo-step-actions",
    style: {
      marginTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoStep(pasoAnterior(promoModal, 3))
  }, volverA(promoModal, pasoAnterior(promoModal, 3))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => setPromoStep(4)
  }, "Continuar a Vista Previa ➔"))), promoStep === 4 && /*#__PURE__*/React.createElement("div", {
    className: "promo-wizard-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "promo-preview-col"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 12,
      background: '#f1f5f9',
      padding: 4,
      borderRadius: 999
    }
  }, [{
    id: 'feed',
    label: 'Feed 4:5'
  }, {
    id: 'historia',
    label: 'Historia 9:16'
  }, {
    id: 'a4',
    label: 'Afiche A4'
  }].filter(fmt => formatosDePromo(promoModal).includes(fmt.id)).map(fmt => /*#__PURE__*/React.createElement("button", {
    key: fmt.id,
    type: "button",
    onClick: () => setPromoPreviewFormat(fmt.id),
    style: {
      padding: '6px 14px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      border: 'none',
      background: promoPreviewFormat === fmt.id ? 'var(--blue-900)' : 'transparent',
      color: promoPreviewFormat === fmt.id ? '#fff' : 'var(--neutral-600)',
      cursor: 'pointer'
    }
  }, fmt.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: promoPreviewFormat === 'historia' ? 260 : 340,
      aspectRatio: promoPreviewFormat === 'historia' ? '1080 / 1920' : promoPreviewFormat === 'a4' ? '2480 / 3508' : '1080 / 1350',
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      boxShadow: '0 8px 30px rgba(0,40,120,.12)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(RenderPromoFlyer, {
    promo: promoModal,
    formato: promoPreviewFormat
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--neutral-500)',
      marginTop: 8
    }
  }, "Previsualización dinámica a escala real (", promoPreviewFormat.toUpperCase(), ")"), pasoHabilitado(promoModal, 3) && promoModal.imagen && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      width: '100%',
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement(SelectorEncuadre, {
    promo: promoModal,
    setPromo: setPromoModal
  }))), /*#__PURE__*/React.createElement("div", {
    className: "promo-controls-col"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 12px',
      fontSize: 15,
      color: 'var(--blue-900)'
    }
  }, plantillaDePromo(promoModal).pasoCurso === 'varios' ? 'Listado de cursos:' : 'Ajustes de Texto y Configuración:'), plantillaDePromo(promoModal).pasoCurso === 'varios' ? /*#__PURE__*/React.createElement(OpcionesGrilla, {
    promo: promoModal,
    setPromo: setPromoModal,
    formato: promoPreviewFormat,
    onEditarCursos: () => setPromoStep(2)
  }) : /*#__PURE__*/React.createElement(CamposPromo, {
    promo: promoModal,
    setPromo: setPromoModal
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      padding: '12px 14px',
      background: '#f8fafc',
      borderRadius: 8,
      border: '1px solid #e2e8f0',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(OpcionesPromo, {
    promo: promoModal,
    setPromo: setPromoModal
  }), (promoModal.modelo || 'flyer-curso-v1') === 'flyer-curso-v1' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 4
    }
  }, "Trama de Fondo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setPromoModal(prev => ({
      ...prev,
      fondo: 'cuadriculado'
    })),
    style: {
      flex: 1,
      padding: '5px 8px',
      fontSize: 12,
      borderRadius: 6,
      border: '1px solid',
      borderColor: promoModal.fondo === 'cuadriculado' ? 'var(--blue-900)' : '#cbd5e1',
      background: promoModal.fondo === 'cuadriculado' ? 'var(--blue-900)' : '#fff',
      color: promoModal.fondo === 'cuadriculado' ? '#fff' : 'var(--neutral-700)',
      cursor: 'pointer'
    }
  }, "Cuadriculado"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setPromoModal(prev => ({
      ...prev,
      fondo: 'liso'
    })),
    style: {
      flex: 1,
      padding: '5px 8px',
      fontSize: 12,
      borderRadius: 6,
      border: '1px solid',
      borderColor: promoModal.fondo === 'liso' ? 'var(--blue-900)' : '#cbd5e1',
      background: promoModal.fondo === 'liso' ? 'var(--blue-900)' : '#fff',
      color: promoModal.fondo === 'liso' ? '#fff' : 'var(--neutral-700)',
      cursor: 'pointer'
    }
  }, "Blanco Liso"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 4
    }
  }, "Pop-up en Home"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 32
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "switch",
    style: {
      margin: 0,
      width: 44,
      height: 24
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: Boolean(promoModal.popupActivo),
    onChange: e => setPromoModal(prev => ({
      ...prev,
      popupActivo: e.target.checked
    }))
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: promoModal.popupActivo ? '#059669' : 'var(--neutral-500)'
    }
  }, promoModal.popupActivo ? 'Activo en portada' : 'Inactivo')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      color: 'var(--neutral-600)'
    }
  }, "Vigente desde", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "form-input",
    value: promoModal.popupDesde || '',
    onChange: e => setPromoModal(prev => ({
      ...prev,
      popupDesde: e.target.value,
      popupZonaHoraria: prev.popupZonaHoraria || window.CFPReglas?.ZONA_HORARIA
    }))
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      color: 'var(--neutral-600)'
    }
  }, "Vence el (inclusive)", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "form-input",
    value: promoModal.popupHasta || '',
    onChange: e => setPromoModal(prev => ({
      ...prev,
      popupHasta: e.target.value,
      popupZonaHoraria: prev.popupZonaHoraria || window.CFPReglas?.ZONA_HORARIA
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-hint"
  }, "Zona horaria: ", promoModal.popupZonaHoraria || window.CFPReglas?.ZONA_HORARIA, ". Dejá una fecha vacía si no querés limitar ese extremo.")))))), promoStep === 4 && /*#__PURE__*/React.createElement("div", {
    className: "modal-footer",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "promo-footer-descargas",
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-sm",
    onClick: () => exportarPromoPNG(promoModal, promoPreviewFormat, showToast, true, (promo, registro) => {
      setPromoModal(prev => ({
        ...prev,
        pngGuardados: [...(prev.pngGuardados || []), registro]
      }));
      if (promoIndex >= 0) {
        updateData(prev => {
          const items = [...(prev.promociones || [])];
          const current = items[promoIndex];
          items[promoIndex] = {
            ...current,
            pngGuardados: [...(current.pngGuardados || []), registro]
          };
          return {
            ...prev,
            promociones: items
          };
        });
      }
    }),
    title: `Guardar la versión ${promoPreviewFormat.toUpperCase()} en el servidor`
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "cloud-upload",
    style: {
      width: 14
    }
  }), " Guardar PNG en servidor (", promoPreviewFormat.toUpperCase(), ")"), formatosDePromo(promoModal).includes('feed') && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => exportarPromoPNG(promoModal, 'feed', showToast),
    title: "Descargar este flyer en PNG Feed 1080x1350"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    style: {
      width: 14
    }
  }), " Descargar Feed"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => exportarPromoPNG(promoModal, 'historia', showToast),
    title: "Descargar este flyer en PNG Historia 1080x1920"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "smartphone",
    style: {
      width: 14
    }
  }), " Historia"), formatosDePromo(promoModal).includes('a4') && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: () => exportarPromoPNG(promoModal, 'a4', showToast),
    title: "Descargar este flyer en PNG A4 2480x3508 para imprimir"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "printer",
    style: {
      width: 14
    }
  }), " A4")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoModal(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setPromoStep(pasoAnterior(promoModal, 4))
  }, volverA(promoModal, pasoAnterior(promoModal, 4))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => {
      const cursoActual = cursos.find(c => c.slug === promoModal.cursoSlug);
      if (promoModal.popupDesde && promoModal.popupHasta && promoModal.popupHasta < promoModal.popupDesde) {
        showToast('La fecha de vencimiento no puede ser anterior al inicio de vigencia.', 'error');
        return;
      }
      if (promoModal.modelo === 'ultimos-cupos-v1' && !window.CFPReglas?.puedePublicarUltimosCupos(cursoActual)) {
        showToast('No se puede guardar un aviso de últimos cupos: confirmá que el curso siga abierto con últimos cupos y actualizá la fecha en Gestión de Cursos.', 'error');
        return;
      }
      // Datos del curso al día (y su huella), sin pisar lo editado a mano
      const base = cursoActual ? refrescarDatosCurso(promoModal, cursoActual) : promoModal;
      const promoFinal = {
        ...base,
        popupActivo: promoModal.popupActivo === true,
        popupZonaHoraria: promoModal.popupZonaHoraria || window.CFPReglas?.ZONA_HORARIA || 'America/Argentina/Buenos_Aires',
        cursoNombre: (base.tituloOverride || base.cursoNombre || tituloPromo(base)).toUpperCase(),
        fechaActualizacion: window.CFPReglas?.fechaLocal(new Date(), promoModal.popupZonaHoraria) || new Date().toISOString().split('T')[0]
      };
      updateData(prev => {
        const list = [...(prev.promociones || [])];
        if (promoIndex >= 0) {
          list[promoIndex] = promoFinal;
        } else {
          list.push(promoFinal);
        }
        return {
          ...prev,
          promociones: list
        };
      });
      setPromoModal(null);
      showToast(promoIndex >= 0 ? '¡Promoción actualizada!' : '¡Nueva promoción creada!');
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 16
    }
  }), " Guardar Promoción"))))), cambioClaveModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setCambioClaveModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: 400
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 18,
      color: 'var(--blue-900)'
    }
  }, "Cambiar Contraseña"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCambioClaveModal(false),
    style: {
      background: 'transparent',
      border: 0,
      fontSize: 20,
      cursor: 'pointer'
    }
  }, "✕")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCambiarClave
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Contraseña actual (o la clave maestra)"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-input",
    value: claveActual,
    onChange: e => setClaveActual(e.target.value),
    required: true,
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nueva Contraseña (mínimo 6 caracteres)"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-input",
    value: nuevaClave,
    onChange: e => setNuevaClave(e.target.value),
    required: true,
    minLength: 6
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setCambioClaveModal(false)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Actualizar Clave"))))), adminAgendaModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setAdminAgendaModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: 740
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 18,
      color: 'var(--blue-900)'
    }
  }, "Agenda 2026 — Efemérides, Fechas Patrias y Feriados de FP"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminAgendaModal(false),
    style: {
      background: 'transparent',
      border: 0,
      fontSize: 20,
      cursor: 'pointer'
    }
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body",
    style: {
      maxHeight: '70vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 13.5,
      color: 'var(--neutral-600)'
    }
  }, "Detalle oficial de las 32 fechas del ciclo 2026 registradas para el sistema educativo de Formación Profesional de la Provincia de Buenos Aires."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, (data.efemerides || []).map((e, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      padding: '10px 14px',
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      background: e.sinClases ? '#fffafb' : '#ffffff',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 62,
      padding: '3px 6px',
      borderRadius: 6,
      background: e.sinClases ? '#fee2e2' : 'var(--surface-brand-soft, #e8eefb)',
      color: e.sinClases ? '#b91c1c' : 'var(--blue-900)',
      textAlign: 'center',
      fontWeight: 700,
      fontSize: 12,
      flexShrink: 0
    }
  }, e.fechaStr), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13.5,
      color: 'var(--blue-900)'
    }
  }, e.titulo), e.sinClases && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      background: '#fee2e2',
      color: '#b91c1c',
      padding: '1px 6px',
      borderRadius: 4,
      fontWeight: 700
    }
  }, "Sin clases en FP"), e.tipo === 'fecha_patria' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      background: '#e0f2fe',
      color: '#0369a1',
      padding: '1px 6px',
      borderRadius: 4,
      fontWeight: 600
    }
  }, "Fecha Patria 🇦🇷")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 12.5,
      color: 'var(--neutral-600)',
      lineHeight: 1.4
    }
  }, e.descripcion)))))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => setAdminAgendaModal(false)
  }, "Cerrar")))), toast && /*#__PURE__*/React.createElement("div", {
    className: `toast ${toast.tipo}`
  }, toast.msg));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AdminApp, null));
