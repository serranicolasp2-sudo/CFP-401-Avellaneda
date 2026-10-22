# Auditoría del catálogo extraído: campos vacíos, módulos y suma de horas por trayecto
import json, sys, collections
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'catalogo-2027.json', encoding='utf-8'))
T = d['trayectos']
print('familias', len(d['familias']), '| trayectos', len(T), '| módulos', sum(len(t['modulos']) for t in T))
for k in ['nombre', 'tipoCertificacion', 'certificacion', 'horasReloj', 'codigoDisenoCurricular']:
    v = [t['codigo'] for t in T if not t[k]]
    print(f'vacío {k}:', v)
print('sin módulos:', [t['codigo'] for t in T if not t['modulos']])
print('códigos repetidos:', [k for k, v in collections.Counter(t['codigo'] for t in T).items() if v > 1])
print('CDC que no empieza con el código:', [(t['codigo'], t['codigoDisenoCurricular']) for t in T if t['codigoDisenoCurricular'] and not t['codigoDisenoCurricular'].replace(' ', '').startswith(t['codigo'])])
desc = []
for t in T:
    s = sum(m['horasReloj'] or 0 for m in t['modulos'])
    if t['horasReloj'] and t['modulos'] and s != t['horasReloj']:
        desc.append((t['codigo'], t['horasReloj'], s, len(t['modulos'])))
print(f'horas del trayecto ≠ suma de módulos ({len(desc)}):', desc)
