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
   archivo "{slug}-{n}.jpg"), después las de su familia */
function fotoSugeridaPromo(c, biblioteca) {
  if (!c) return null;
  const fotos = biblioteca || [];
  const esDelCurso = f => f.cursoSlug && f.cursoSlug === c.slug || (f.archivo || '').split('/').pop().replace(/-\d+\.\w+$/, '') === c.slug;
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

/* Tipo de pieza según su plantilla: 'curso' o 'inscripciones' */
function tipoDePromo(promo) {
  return plantillaDePromo(promo).tipo || 'curso';
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

/* Fotos disponibles: las institucionales del sitio (hero y fachada) más la biblioteca de promociones */
function fotosParaPromo(data) {
  const institucionales = [...(data.heroFotos || []).map(f => f.includes('/') ? f : 'assets/' + f), 'assets/fachada-cfp401.jpg'].map(archivo => ({
    id: 'inst-' + archivo,
    familia: 'Institucional',
    archivo,
    nombre: archivo.split('/').pop().replace(/^hero-|\.\w+$/g, '').replace(/-/g, ' '),
    encuadre: 'center'
  }));
  return [...institucionales, ...(data.bibliotecaFotosPromo || [])];
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
    'apertura-inscripciones-v1': [['mostrarSello', 'Sello (100% gratuito)'], ['mostrarFamilias', 'Familias de oficios']],
    'flyer-curso-v2': [['mostrarCinta', 'Cinta (100% gratuito)']],
    'captacion-oficios-v1': [['mostrarCuadricula', 'Cuadrícula de fondo']],
    'ultimos-cupos-v1': [['mostrarCuadricula', 'Cuadrícula de fondo']],
    'conmemoraciones-patrias-v1': [['mostrarCuadricula', 'Cuadrícula sobre la foto']],
    'grilla-cursos-v1': [['mostrarCuadricula', 'Cuadrícula de fondo']]
  }[promo.modelo] || [['mostrarSello', 'Círculo (100% gratuito)']];
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
async function exportarPromoPNG(promo, formato = 'feed', showToast) {
  if (!window.htmlToImage) {
    if (showToast) showToast('La biblioteca html-to-image no se encuentra cargada.', 'error');
    return;
  }
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
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `promo-${slug}-${formato}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast(`¡Flyer ${formato.toUpperCase()} descargado con éxito!`);
  } catch (err) {
    console.error('Error al exportar flyer PNG:', err);
    if (showToast) showToast('Error al generar la imagen. Probá nuevamente.', 'error');
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
      selloGrande: '100%',
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
      cintaGrande: '100%',
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
      selloGrande: '100%',
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
  'grilla-cursos-v1': {
    id: 'muestra-grilla',
    modelo: 'grilla-cursos-v1',
    tipo: 'grilla',
    periodo: 'marzo',
    composicion: 'grilla',
    textos: {}
  }
};
function AdminApp() {
  // Autenticación
  const [autenticado, setAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Datos y estado de cambios
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('cursos');
  const [dirty, setDirty] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);

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
  const [promoIndex, setPromoIndex] = useState(-1);
  const [promoStep, setPromoStep] = useState(1); // 1: modelo, 2: curso, 3: foto & encuadre, 4: preview & overrides
  const [promoPreviewFormat, setPromoPreviewFormat] = useState('feed'); // 'feed' | 'historia' | 'a4'
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
          titulo: 'Nuevas inscripciones A PARTIR DE NOVIEMBRE',
          detalle: 'Lunes a viernes de 9 a 22 hs · Juan Pablo Angulo 1272, Dock Sud',
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
            titulo: '100% gratuito',
            descripcion: 'Sin costo de inscripción ni de cursada: solo necesitás la documentación pedida.'
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
    if (!initial.nosotros) {
      initial.nosotros = {
        header: {
          subtitulo: 'Nosotros',
          titulo: 'Más de cuatro décadas formando trabajadores'
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
      setPasswordInput('');
      setAutenticado(true);
      showToast('Sesión iniciada correctamente');
    } catch (err) {
      // Si estamos probando sin servidor web PHP activo localmente, permitir login con fallback
      if (passwordInput.length >= 6) {
        setAutenticado(true);
        showToast('Ingreso local habilitado');
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
          data: data
        })
      });
      if (sesionVencida(res)) return;
      const json = await res.json();
      if (json.success) {
        setDirty(false);
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
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Contraseña de acceso"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      className: "form-input",
      placeholder: "Ingresá la contraseña",
      value: passwordInput,
      onChange: e => setPasswordInput(e.target.value),
      autoFocus: true,
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
  }, "Admin 2.0"), /*#__PURE__*/React.createElement("div", {
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
  }, "10 secciones")), /*#__PURE__*/React.createElement("select", {
    className: "form-select admin-mobile-select",
    value: activeTab,
    onChange: e => handleTabChange(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "cursos"
  }, "📖 Gestión de Cursos (", cursos.length, ")"), /*#__PURE__*/React.createElement("option", {
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
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Horarios:"), " ", c.horarios), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Duración:"), " ", c.duracion, " • ", /*#__PURE__*/React.createElement("strong", null, "Horas totales:"), " ", c.horasTotales || '360 horas reloj', " • ", /*#__PURE__*/React.createElement("strong", null, "Sede:"), " ", c.sede), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Requisitos:"), " ", c.requisitos))), /*#__PURE__*/React.createElement("div", {
      className: "admin-course-actions"
    }, c.slug && /*#__PURE__*/React.createElement("a", {
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
  }, "No se encontraron cursos con los filtros aplicados."))), activeTab === 'promociones' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    const activas = (data.promociones || []).filter(p => p.popupActivo);
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
    return /*#__PURE__*/React.createElement("div", {
      key: p.id || idx,
      className: "promo-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "promo-card-preview",
      style: {
        aspectRatio: '1080 / 1350'
      }
    }, /*#__PURE__*/React.createElement(RenderPromoFlyer, {
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
    }, plantilla.nombre), p.popupActivo && /*#__PURE__*/React.createElement("span", {
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
    }, tipoDePromo(p) === 'inscripciones' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Familias:"), " ", familiasPromo(p).join(', ') || '(ninguna)'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, textosPromo(p).dato1Label, ":"), " ", textosPromo(p).dato1)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Días:"), " ", textosPromo(p).dias, " • ", /*#__PURE__*/React.createElement("strong", null, "Horario:"), " ", textosPromo(p).horario), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Sede:"), " ", textosPromo(p).sede), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Requisitos:"), " ", textosPromo(p).requisito)))), /*#__PURE__*/React.createElement("div", {
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
        setPromoModal({
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
    }, "Descargar:"), /*#__PURE__*/React.createElement("button", {
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
    }), " Historia 9:16"), /*#__PURE__*/React.createElement("button", {
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
  }), " Cinta Amarilla Destacada (Home)"), /*#__PURE__*/React.createElement("div", {
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
    placeholder: "Ej: Nuevas inscripciones A PARTIR DE NOVIEMBRE"
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
    placeholder: "Ej: Lunes a viernes de 9 a 22 hs · Juan Pablo Angulo 1272, Dock Sud"
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
  }, "Descripción General"), /*#__PURE__*/React.createElement("textarea", {
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
    placeholder: "Ej: Presentar 4 fotocopias del DNI y la constancia de estudios requerida..."
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
    placeholder: "Ej: Más de cuatro décadas formando trabajadores"
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
  }), " Tarjeta Red de CFP / Convenio (Body Tarjeta)"), /*#__PURE__*/React.createElement("div", {
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
    placeholder: "Lunes a viernes de 9 a 22 hs"
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
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "save-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "save-bar-status"
  }, dirty ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--brand-accent)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--blue-900)'
    }
  }, "Tenés cambios sin guardar")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--green-600)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--neutral-600)'
    }
  }, "Todos los datos sincronizados"))), /*#__PURE__*/React.createElement("div", {
    className: "save-bar-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: handleDescargarDataJs,
    title: "Descargar archivo data.js listo para FTP"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "download",
    style: {
      width: 16
    }
  }), " Descargar data.js"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleGuardarServidor,
    disabled: guardando
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "save",
    style: {
      width: 16
    }
  }), " ", guardando ? 'Guardando en PHP...' : '💾 Guardar en Servidor (PHP)'))), cursoModal && /*#__PURE__*/React.createElement("div", {
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
  }, "Cualquier cambio aquí se refleja inmediatamente en el recuadro \"Días y horarios\" de la página propia del curso.")), /*#__PURE__*/React.createElement("div", {
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
        detalles: cursoModal.detalles || ''
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
  }, "Los modelos de curso toman los datos del curso que elijas. El de inscripciones es un aviso general con las familias de oficios."), /*#__PURE__*/React.createElement("div", {
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
        if (plt.tipo === 'curso') {
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
    }, muestra && /*#__PURE__*/React.createElement(RenderPromoFlyer, {
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
  }, cursos.filter(c => (c.curso || '').toLowerCase().includes(filtroPromoCursoSelect.toLowerCase())).map(c => {
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
          popupActivo: promoModal.popupActivo === true
        });
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
  }, "📸 Todas las fotos (institucionales, talleres y temáticas)"), /*#__PURE__*/React.createElement("optgroup", {
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
  }, fotosParaPromo(data).filter(f => {
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
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    style: {
      marginBottom: 6
    }
  }, "Punto de enfoque de la foto (Encuadre):"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, [{
    label: 'Taller foco (40% 45%)',
    val: '40% 45%'
  }, {
    label: 'Centro (50% 50%)',
    val: '50% 50%'
  }, {
    label: 'Arriba (50% 20%)',
    val: '50% 20%'
  }, {
    label: 'Abajo (50% 80%)',
    val: '50% 80%'
  }, {
    label: 'Izquierda (20% 50%)',
    val: '20% 50%'
  }, {
    label: 'Derecha (80% 50%)',
    val: '80% 50%'
  }].map(pos => /*#__PURE__*/React.createElement("button", {
    key: pos.val,
    type: "button",
    onClick: () => setPromoModal(prev => ({
      ...prev,
      encuadre: pos.val
    })),
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      border: '1px solid',
      borderColor: promoModal.encuadre === pos.val ? 'var(--blue-900)' : '#cbd5e1',
      background: promoModal.encuadre === pos.val ? 'var(--blue-900)' : '#fff',
      color: promoModal.encuadre === pos.val ? '#fff' : 'var(--neutral-700)',
      cursor: 'pointer'
    }
  }, pos.label)))), /*#__PURE__*/React.createElement("div", {
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
  }].map(fmt => /*#__PURE__*/React.createElement("button", {
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
  }, "Previsualización dinámica a escala real (", promoPreviewFormat.toUpperCase(), ")")), /*#__PURE__*/React.createElement("div", {
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
  }, promoModal.popupActivo ? 'Activo en portada' : 'Inactivo'))))))), promoStep === 4 && /*#__PURE__*/React.createElement("div", {
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
  }), " Historia"), /*#__PURE__*/React.createElement("button", {
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
      const promoFinal = {
        ...promoModal,
        cursoNombre: (promoModal.tituloOverride || promoModal.cursoNombre || tituloPromo(promoModal)).toUpperCase(),
        fechaActualizacion: new Date().toISOString().split('T')[0]
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
