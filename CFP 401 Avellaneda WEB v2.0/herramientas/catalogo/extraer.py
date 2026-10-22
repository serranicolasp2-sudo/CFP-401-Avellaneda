# Extrae el Catálogo oficial 2027 (DGCyE, Formación Profesional) a JSON: familias → trayectos → módulos
import json, re, sys
import pdfplumber

import os
# Uso: python extraer.py [salida.json] [catalogo.pdf]   (por defecto: site/catalogo/catalogo-2027.json y .pdf)
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SALIDA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'site', 'catalogo', 'catalogo-2027.json')
PDF = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, 'site', 'catalogo', 'catalogo-2027.pdf')

RE_TRAYECTO = re.compile(r'^[A-Z]{2}\d{2,3}[A-Z]?$')          # AA01, IN105…
RE_FAMILIA = re.compile(r'^([A-Z]{2})\s*-\s*(.+)$')            # "AA - Actividades Agropecuarias"
RE_MODULO = re.compile(r'^[A-Z]{2}\d{3,5}(\.\d+)?$')           # AA0001.1
CAMPOS = {1: 'nombre', 2: 'tipoCertificacion', 3: 'certificacion', 4: 'resJurisdiccional', 5: 'resValidezNacional',
          6: 'cohortes', 7: 'horasCatedra', 8: 'horasReloj', 9: 'requisitos', 14: 'codigoDisenoCurricular', 15: 'disenosReemplazados'}
NUMERICOS = {'horasCatedra', 'horasReloj'}
COLS_INICIO = [2, 7, 8]   # nivel de certificación y horas: solo aparecen en la fila donde arranca un trayecto

def limpio(c):
    if c is None:
        return ''
    t = str(c).replace('\r', '')
    t = re.sub(r'-\n(?=[a-záéíóúñ])', '-', t)   # "Fruti-\nhortícola" → "Fruti-hortícola"
    t = re.sub(r'\s*\n\s*', ' ', t)
    return re.sub(r'\s{2,}', ' ', t).strip()

def entero(t):
    m = re.search(r'\d+', t or '')
    return int(m.group()) if m else None

def normalizar(fila):
    c = [limpio(x) for x in fila]
    if len(c) == 17:   # "Diseños reemplazados" partido en dos columnas
        c = c[:15] + [(c[15] + ' ' + c[16]).strip()]
    return c + [''] * (16 - len(c))

def mezclar(t, c, antes=False):
    """Suma los datos de una fila al trayecto: completa vacíos y concatena texto (antes o después)."""
    for i, clave in CAMPOS.items():
        if not c[i]:
            continue
        if clave in NUMERICOS:
            if t[clave] is None:
                t[clave] = entero(c[i])
        elif not t[clave]:
            t[clave] = c[i]
        elif clave != 'codigoDisenoCurricular':
            t[clave] = (c[i] + ' ' + t[clave]) if antes else (t[clave] + ' ' + c[i])

def agregar_modulo(t, c):
    if c[10] or c[11]:
        if not c[10] and t['modulos']:
            t['modulos'][-1]['denominacion'] += ' ' + c[11]
        else:
            t['modulos'].append({'codigoPlanificacion': c[10], 'denominacion': c[11], 'horasCatedra': entero(c[12]), 'horasReloj': entero(c[13])})

familias, trayectos, anomalias, rescatados = [], [], [], []
familia_actual, trayecto_actual = None, None
anclas = {}       # por página: centros verticales de filas de trayecto y de familia
pendientes = []   # filas sin código con datos del trayecto que todavía no apareció (celda combinada más abajo)

with pdfplumber.open(PDF) as pdf:
    for npag, pag in enumerate(pdf.pages, 1):
        tablas = pag.find_tables()
        principal = next((t for t in tablas if len(t.columns) in (16, 17)), None)
        cols_x = [(col.bbox[0], col.bbox[2]) if col.bbox else None for col in principal.columns] if principal else None
        limite_seguro = 0
        for tabla in tablas:
            filas = tabla.extract()
            ancho = len(filas[0]) if filas else 0
            if ancho == 5:
                # Módulos en tabla aparte: van al trayecto de la misma página cuya fila empieza más cerca por encima
                for f, fo in zip(filas, tabla.rows):
                    c = [limpio(x) for x in f]
                    candidatos = [t for t in trayectos if t['_pos'][0] == npag and t['_pos'][1] <= fo.bbox[1] + 2]
                    destino = max(candidatos, key=lambda t: t['_pos'][1]) if candidatos else None
                    if RE_MODULO.match(c[0]) and destino is not None:
                        destino['modulos'].append({'codigoPlanificacion': c[0], 'denominacion': c[1], 'horasCatedra': entero(c[2]), 'horasReloj': entero(c[3])})
                        if c[4] and not destino['codigoDisenoCurricular']:
                            destino['codigoDisenoCurricular'] = c[4]
                    else:
                        anomalias.append({'pagina': npag, 'fila': c, 'motivo': 'tabla de 5 columnas sin destino'})
                continue
            if ancho not in (16, 17):
                anomalias.append({'pagina': npag, 'fila': [limpio(x) for x in filas[0]] if filas else [], 'motivo': f'tabla de {ancho} columnas (se ignora)'})
                continue
            fondo_anterior = tabla.bbox[1]
            for fila, fila_obj in zip(filas, tabla.rows):
                c = normalizar(fila)
                fondo_previo, fondo_anterior = fondo_anterior, fila_obj.bbox[3]
                # Módulo con nombre u horas fuera de la celda detectada: se leen por posición dentro de su fila
                if RE_MODULO.match(c[10]) and cols_x and not (c[11] and c[12] and c[13]):
                    for i in (11, 12, 13):
                        if not c[i] and cols_x[i]:
                            x0, x1 = cols_x[i]
                            c[i] = limpio(pag.crop((x0, fila_obj.bbox[1], x1, fila_obj.bbox[3])).extract_text(y_tolerance=1))
                            if i == 11 and c[i] and trayecto_actual is not None and trayecto_actual['modulos']:
                                previo = trayecto_actual['modulos'][-1]['denominacion']
                                palabras = c[i].split(' ')
                                for k in range(len(palabras) - 1, 1, -1):
                                    if previo.endswith(' '.join(palabras[:k])):
                                        c[i] = ' '.join(palabras[k:])
                                        break
                if c[0] == 'Código' or c[1].startswith('Nombre del') or c[10] == 'Código de Planificación':
                    continue
                if not any(c):
                    continue
                m = RE_FAMILIA.match(c[0])
                if m and not any(c[1:]):
                    if pendientes:
                        anomalias.append({'pagina': npag, 'motivo': 'filas pendientes sin trayecto', 'filas': pendientes})
                        pendientes = []
                    limite_seguro = fila_obj.bbox[3]
                    anclas.setdefault(npag, []).append((fila_obj.bbox[1] + fila_obj.bbox[3]) / 2)
                    familia_actual = {'codigo': m.group(1), 'nombre': m.group(2).strip()}
                    familias.append(familia_actual)
                    continue
                if RE_TRAYECTO.match(c[0]):
                    trayecto_actual = {'codigo': c[0], 'familia': familia_actual['codigo'] if familia_actual else ''}
                    for i, clave in CAMPOS.items():
                        trayecto_actual[clave] = entero(c[i]) if clave in NUMERICOS else c[i]
                    trayecto_actual['modulos'] = []
                    trayecto_actual['pagina'] = npag
                    trayecto_actual['_pos'] = (npag, fila_obj.bbox[1])
                    centro = (fila_obj.bbox[1] + fila_obj.bbox[3]) / 2
                    anclas.setdefault(npag, []).append(centro)
                    trayecto_actual['_franja'] = (npag, centro, cols_x)
                    # Filas que vinieron antes que el código: sus datos y módulos van primero
                    for p in reversed(pendientes):
                        mezclar(trayecto_actual, p, antes=True)
                    modulos_previos = []
                    for p in pendientes:
                        tmp = {'modulos': modulos_previos}
                        agregar_modulo(tmp, p)
                    trayecto_actual['modulos'] = modulos_previos
                    pendientes = []
                    agregar_modulo(trayecto_actual, c)
                    trayectos.append(trayecto_actual)
                    limite_seguro = fila_obj.bbox[3]
                    continue
                if c[0]:
                    anomalias.append({'pagina': npag, 'fila': c, 'motivo': 'primera columna desconocida'})
                    continue
                datos_trayecto = any(c[i] for i in COLS_INICIO)
                ya_completo = trayecto_actual is not None and trayecto_actual['tipoCertificacion'] and trayecto_actual['horasReloj'] is not None
                # El código de diseño curricular de la fila delata a qué trayecto pertenece (ej.: "GH33 - FI15")
                cdc_ajeno = bool(c[14]) and trayecto_actual is not None and not c[14].replace(' ', '').startswith(trayecto_actual['codigo'])
                if (datos_trayecto and (trayecto_actual is None or ya_completo)) or cdc_ajeno:
                    pendientes.append(c)      # pertenece al próximo trayecto
                    continue
                if pendientes:
                    pendientes.append(c)      # módulos que siguen a una fila pendiente
                    continue
                if trayecto_actual is None:
                    anomalias.append({'pagina': npag, 'fila': c, 'motivo': 'fila sin trayecto'})
                    continue
                mezclar(trayecto_actual, c)
                agregar_modulo(trayecto_actual, c)
    if pendientes:
        anomalias.append({'motivo': 'filas pendientes al final', 'filas': pendientes})

    # Último recurso: trayectos sin nombre (la fila vino solo con el código y nada la completó)
    for t in trayectos:
        npag, centro, cols_x = t.pop('_franja')
        if t['nombre'] or not cols_x:
            continue
        pag = pdf.pages[npag - 1]
        vecinos = sorted(anclas.get(npag, []))
        arriba = [a for a in vecinos if a < centro - 0.5]
        abajo = [a for a in vecinos if a > centro + 0.5]
        top = (arriba[-1] + centro) / 2 if arriba else 0
        # Sin vecino abajo: hasta el pie de página ("IF-2026-…" / "Página N de 37"), que no es parte del trayecto
        pie = [w['top'] for w in pag.extract_words() if w['top'] > pag.height * 0.75 and (w['text'].startswith('IF-20') or w['text'].startswith('Página'))]
        bottom = (centro + abajo[0]) / 2 if abajo else (min(pie) - 1 if pie else pag.height)
        for i, clave in CAMPOS.items():
            if cols_x[i] and not t[clave]:
                x0, x1 = cols_x[i]
                txt = limpio(pag.crop((x0, top, x1, bottom)).extract_text(y_tolerance=1))
                t[clave] = entero(txt) if clave in NUMERICOS else txt
        rescatados.append(t['codigo'])
        t['_leidoPorPosicion'] = True
    # Conciliación por horas: módulos de borde entre dos trayectos seguidos (celdas partidas entre páginas)
    def suma(t): return sum(m['horasReloj'] or 0 for m in t['modulos'])
    def error(t): return abs(suma(t) - t['horasReloj']) if t['horasReloj'] else 0
    conciliados = []
    for a_, b_ in zip(trayectos, trayectos[1:]):
        # Un módulo repetido al final de A es el comienzo de B que quedó del otro lado del corte de página
        while len(a_['modulos']) > 1 and a_['modulos'][-1]['codigoPlanificacion'] in [m['codigoPlanificacion'] for m in a_['modulos'][:-1]]:
            b_['modulos'].insert(0, a_['modulos'].pop())
            conciliados.append((a_['codigo'], '→', b_['codigo'], 'repetido'))
        if not a_['horasReloj'] or not b_['horasReloj']:
            continue
        # Mover módulos de borde solo si baja el desajuste total de horas de los dos trayectos
        while a_['modulos']:
            antes = error(a_) + error(b_)
            b_['modulos'].insert(0, a_['modulos'].pop())
            if error(a_) + error(b_) < antes:
                conciliados.append((a_['codigo'], '→', b_['codigo']))
            else:
                a_['modulos'].append(b_['modulos'].pop(0))
                break
        while b_['modulos']:
            antes = error(a_) + error(b_)
            a_['modulos'].append(b_['modulos'].pop(0))
            if error(a_) + error(b_) < antes:
                conciliados.append((b_['codigo'], '→', a_['codigo']))
            else:
                b_['modulos'].insert(0, a_['modulos'].pop())
                break
    print('conciliados', conciliados)
    # Correcciones manuales verificadas contra el texto del PDF (casos partidos entre páginas que la lectura automática mezcla)
    CORRECCIONES = {
        'CC13': {'nombre': 'Marroquinera/o', 'tipoCertificacion': 'Nivel II de FP inicial',
                 'certificacion': 'Marroquinera/o según Resolución Nro. RESOC-2021-3524-GDEBA-DGCYE / RESOL-2023-869-APN-ME / DI-2025-5-APN-DVNTYE#ME',
                 'resJurisdiccional': 'RESOC-2021-3524-GDEBA-DGCYE', 'resValidezNacional': 'RESOL-2023-869-APN-ME / DI-2025-5-APN-DVNTYE#ME',
                 'cohortes': '2025 al 2029', 'horasCatedra': 450, 'horasReloj': 300, 'requisitos': 'Primaria o EGB Terminado',
                 'codigoDisenoCurricular': 'CC13 - FI21', '_modulos': ['CC0011.1', 'CC0012.1', 'CC0019.2', 'CC0020.2'], '_paginas': '14 y 15'},
        'CC14': {'nombre': 'Confeccionista de Prendas de Cuero', 'tipoCertificacion': 'Nivel II de FP inicial',
                 'certificacion': 'Confeccionista de Prendas de Cuero según Resolución Nro. RESOC-2022-2322-GDEBA-DGCYE / RESOL-2025-554-APN-SE#MCH',
                 'resJurisdiccional': 'RESOC-2022-2322-GDEBA-DGCYE', 'resValidezNacional': 'RESOL-2025-554-APN-SE#MCH',
                 'cohortes': '2025 al 2029', 'horasCatedra': 525, 'horasReloj': 350, 'requisitos': 'Primaria o EGB Terminado',
                 '_modulos': ['CC0011.1', 'CC0012.1', 'CC0021.2', 'CC0022.2'], '_paginas': '15'},
        'MT42': {'requisitos': 'Ciclo Básico Secundaria', '_paginas': '28'},
    }
    por_codigo = {t['codigo']: t for t in trayectos}
    pozo = {}
    for cod in CORRECCIONES:
        for m in por_codigo[cod]['modulos']:
            pozo.setdefault(m['codigoPlanificacion'], []).append(m)
    for cod, corr in CORRECCIONES.items():
        t = por_codigo[cod]
        for k, v in corr.items():
            if not k.startswith('_'):
                t[k] = v
        if '_modulos' in corr:
            t['modulos'] = [pozo[c].pop(0) if pozo.get(c) else {'codigoPlanificacion': c, 'denominacion': '', 'horasCatedra': None, 'horasReloj': None} for c in corr['_modulos']]
        t['_corregido'] = corr['_paginas']
        t.pop('_leidoPorPosicion', None)

    # Texto superpuesto en el propio PDF (dos renglones impresos uno encima del otro) y nombres cortados
    RE_MEZCLA = re.compile(r'[a-záéíóúñ][A-ZÁÉÍÓÚÑ][a-záéíóúñ]')
    RE_DOBLE = re.compile(r'\b[A-ZÁÉÍÓÚÑ]{2}[a-záéíóúñ]{3,}')   # 'TPerirmmainriaad': dos textos intercalados
    CORTE = re.compile(r'\s(por|de|del|y|en|para|la|el)$', re.I)
    for t in trayectos:
        problemas = []
        unico = t['modulos'][0]['denominacion'] if len(t['modulos']) == 1 and t['modulos'][0]['denominacion'] else ''
        for clave in ('nombre', 'certificacion'):
            if RE_MEZCLA.search(t[clave]) or CORTE.search(t[clave]):
                if unico:
                    t[clave] = unico
                    problemas.append(f'{clave} tomado del nombre del módulo')
                else:
                    problemas.append(clave)
        # "Terminado" que quedó pegado del renglón del trayecto anterior
        if t['requisitos'].startswith('Terminado ') and 'Terminado' in t['requisitos'][10:]:
            t['requisitos'] = t['requisitos'][10:]
        if RE_MEZCLA.search(t['requisitos']) or RE_DOBLE.search(t['requisitos']):
            t['requisitos'] = ''
            problemas.append('requisitos ilegibles')
        if problemas:
            t['_superpuesto'] = problemas
    # Palabras pegadas en dos denominaciones de módulo
    for t in trayectos:
        for m in t['modulos']:
            m['denominacion'] = m['denominacion'].replace('SistemasNeumáticos', 'Sistemas Neumáticos').replace('ElEjercicioÉticoProfesionaldela', 'El Ejercicio Ético Profesional de la')

    # Observaciones para revisar a mano contra el PDF (se muestran en el panel)
    for t in trayectos:
        obs = []
        if t['horasReloj'] and t['modulos'] and suma(t) != t['horasReloj']:
            obs.append(f"La suma de horas de los módulos ({suma(t)} hs reloj) no coincide con el total del trayecto ({t['horasReloj']} hs reloj).")
        if any(not m['denominacion'] or m['horasReloj'] is None for m in t['modulos']):
            obs.append('Hay módulos sin denominación o sin horas.')
        if not t['modulos']:
            obs.append('No se encontraron módulos.')
        for clave, nombre in (('tipoCertificacion', 'tipo de certificación'), ('certificacion', 'certificación'), ('horasReloj', 'horas'), ('codigoDisenoCurricular', 'código de diseño curricular')):
            if not t[clave]:
                obs.append(f'Falta {nombre}.')
        if t['codigoDisenoCurricular'] and not t['codigoDisenoCurricular'].replace(' ', '').startswith(t['codigo']):
            obs.append(f"El código de diseño curricular ({t['codigoDisenoCurricular']}) no empieza con el código del trayecto, tal como figura en el catálogo.")
        if t.pop('_leidoPorPosicion', False):
            obs.append(f"Los datos generales de este trayecto se leyeron por posición en el PDF (celda partida): conviene verificarlos contra la página {t['pagina']} del catálogo.")
        if t.get('_corregido'):
            obs.append(f"Datos corregidos a mano contra el texto del catálogo (página {t.pop('_corregido')}).")
        if t.get('_superpuesto'):
            obs.append(f"En la página {t['pagina']} el PDF tiene texto impreso superpuesto o cortado ({', '.join(t.pop('_superpuesto'))}): revisar contra el catálogo.")
        t['observaciones'] = obs
    for t in trayectos:
        t.pop('_pos', None)

resultado = {
    'fuente': 'Catálogo oficial 2027 — Formación Profesional, DGCyE Provincia de Buenos Aires (PDF "CATALOGO 2027.pdf")',
    'familias': familias,
    'trayectos': trayectos
}
with open(SALIDA, 'w', encoding='utf-8') as f:
    json.dump(resultado, f, ensure_ascii=False, separators=(',', ':'))
with open(os.path.join(RAIZ, '.local', 'catalogo-anomalias.json'), 'w', encoding='utf-8') as f:
    json.dump(anomalias, f, ensure_ascii=False, indent=1)
print('familias', len(familias), '| trayectos', len(trayectos), '| módulos', sum(len(t['modulos']) for t in trayectos), '| anomalías', len(anomalias), '| rescatados', rescatados)
