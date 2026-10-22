/* ===========================================================================
   CFP N° 401 AVELLANEDA — DIBUJO RÁPIDO DE ÍCONOS (sitio y panel)
   ---------------------------------------------------------------------------
   lucide.createIcons() (versión 0.460) vuelve a dibujar TODOS los íconos de la
   página cada vez que se la llama, incluso los ya dibujados, porque el <svg>
   resultante conserva el atributo data-lucide. El sitio la llama una vez por
   cada ícono que aparece y el panel después de cada render (cada tecla), así
   que el trabajo crecía con el cuadrado de la cantidad de íconos.

   Esta versión hace exactamente lo mismo que la original (mismos atributos y
   clases), pero solo con los elementos que todavía no son <svg>.
   Se carga justo después de lucide.min.js.
   =========================================================================== */
(function () {
  'use strict';
  var lucide = window.lucide;
  if (!lucide || !lucide.icons || typeof lucide.createElement !== 'function' || lucide.soloPendientes) return;

  var aPascal = function (texto) {
    return texto.replace(/(\w)(\w*)(_|-|\s*)/g, function (todo, primera, resto) { return primera.toUpperCase() + resto.toLowerCase(); });
  };
  // Igual que combineClassNames de lucide: une, recorta y quita repetidas
  var clasesDe = function (valor) {
    if (typeof valor === 'string') return [valor];
    if (!valor || !valor.class) return [];
    return Array.isArray(valor.class) ? valor.class : String(valor.class).split(' ');
  };
  var unirClases = function (lista) {
    var vistas = [];
    lista.forEach(function (item) {
      clasesDe(item).forEach(function (c) { c = c.trim(); if (c && vistas.indexOf(c) < 0) vistas.push(c); });
    });
    return vistas.join(' ');
  };

  function dibujar(elemento, nameAttr, icons, attrs) {
    var nombre = elemento.getAttribute(nameAttr);
    if (nombre == null) return;
    var nodo = icons[aPascal(nombre)];
    if (!nodo) { console.warn(elemento.outerHTML + ' icon name was not found in the provided icons object.'); return; }
    var propios = {};
    for (var i = 0; i < elemento.attributes.length; i++) propios[elemento.attributes[i].name] = elemento.attributes[i].value;
    var atributos = Object.assign({}, nodo[1], { 'data-lucide': nombre }, attrs, propios);
    var clases = unirClases(['lucide', 'lucide-' + nombre, propios, attrs]);
    if (clases) atributos['class'] = clases;
    var svg = lucide.createElement([nodo[0], atributos, nodo[2]]);
    if (elemento.parentNode) elemento.parentNode.replaceChild(svg, elemento);
  }

  lucide.createIcons = function (opciones) {
    opciones = opciones || {};
    var icons = opciones.icons || lucide.icons;
    var nameAttr = opciones.nameAttr || 'data-lucide';
    var attrs = opciones.attrs || {};
    var pendientes = document.querySelectorAll('[' + nameAttr + ']:not(svg)');
    for (var i = 0; i < pendientes.length; i++) dibujar(pendientes[i], nameAttr, icons, attrs);
  };
  lucide.soloPendientes = true;
})();
