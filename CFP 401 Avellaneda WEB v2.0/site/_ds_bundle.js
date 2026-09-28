/* @ds-bundle: {"format":4,"namespace":"CFP401AvellanedaDesignSystem_6c39ff","components":[{"name":"Callout","sourcePath":"components/content/Callout.jsx"},{"name":"CourseCard","sourcePath":"components/content/CourseCard.jsx"},{"name":"CourseTable","sourcePath":"components/content/CourseTable.jsx"},{"name":"Hero","sourcePath":"components/content/Hero.jsx"},{"name":"InfoList","sourcePath":"components/content/InfoList.jsx"},{"name":"StatBlock","sourcePath":"components/content/StatBlock.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"SideNav","sourcePath":"components/navigation/SideNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/content/Callout.jsx":"f9bd4568b07f","components/content/CourseCard.jsx":"b83ac9b339fe","components/content/CourseTable.jsx":"9f06bdfe4f31","components/content/Hero.jsx":"5153a0b85b93","components/content/InfoList.jsx":"3e61ca3278dd","components/content/StatBlock.jsx":"651bbbb40d47","components/core/Badge.jsx":"56f1988d3d9d","components/core/Button.jsx":"318a87fce89f","components/core/Card.jsx":"29dc41daccda","components/core/Icon.jsx":"e60d15d0d1c5","components/core/Logo.jsx":"9f63a6d925ab","components/core/SectionHeading.jsx":"4d785e9ef55b","components/feedback/Alert.jsx":"a838a9e1592e","components/feedback/Modal.jsx":"285476f2d50c","components/feedback/ProgressBar.jsx":"5f1f7f32cf5e","components/forms/Checkbox.jsx":"6415e087ea48","components/forms/Field.jsx":"b91da41e44cc","components/forms/Input.jsx":"6bf52c5624f9","components/forms/Radio.jsx":"b01d738da6bb","components/forms/Select.jsx":"a90cd1903400","components/navigation/Footer.jsx":"384337105b3f","components/navigation/NavBar.jsx":"0ddbb4f7a676","components/navigation/SideNav.jsx":"4f91479d6ce6","components/navigation/Tabs.jsx":"c4249e355f7b","ui_kits/campus_virtual/CampusShell.jsx":"7bae8f1d63d7","ui_kits/campus_virtual/CourseScreen.jsx":"29c09fd2ffad","ui_kits/campus_virtual/DashboardScreen.jsx":"01b404f5bee9","ui_kits/campus_virtual/LoginScreen.jsx":"863c078bd6bd","ui_kits/piezas_sociales/FlyerCurso.jsx":"409bfe245de0","ui_kits/piezas_sociales/PlacaAviso.jsx":"8f73929fc3d7","ui_kits/piezas_sociales/PostInfo.jsx":"c2b276502956","ui_kits/sitio_institucional/ContactScreen.jsx":"a2c940f92b59","ui_kits/sitio_institucional/CoursesScreen.jsx":"ec5332e3774f","ui_kits/sitio_institucional/EnrollScreen.jsx":"c06954dcdc45","ui_kits/sitio_institucional/HomeScreen.jsx":"33ed63fb48d1","ui_kits/sitio_institucional/NosotrosScreen.jsx":"972acb226a7a","ui_kits/sitio_institucional/data.js":"f06917dc7c48"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CFP401AvellanedaDesignSystem_6c39ff = window.CFP401AvellanedaDesignSystem_6c39ff || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Callout.jsx
try { (() => {
const tones = {
  info: {
    bg: 'var(--surface-brand-soft)',
    bar: 'var(--brand-primary)',
    fg: 'var(--blue-900)'
  },
  accent: {
    bg: 'var(--surface-accent-soft)',
    bar: 'var(--brand-accent)',
    fg: 'var(--blue-900)'
  },
  success: {
    bg: 'var(--state-success-bg)',
    bar: 'var(--state-success-fg)',
    fg: 'var(--state-success-fg)'
  },
  danger: {
    bg: 'var(--state-danger-bg)',
    bar: 'var(--state-danger-fg)',
    fg: 'var(--state-danger-fg)'
  }
};
function Callout({
  tone = 'info',
  title,
  children,
  style
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.bg,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4) var(--space-5)',
      display: 'flex',
      gap: 'var(--space-4)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 4px',
      width: 4,
      borderRadius: 2,
      background: t.bar
    }
  }), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: t.fg,
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, children)));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Callout.jsx", error: String((e && e.message) || e) }); }

// components/content/CourseTable.jsx
try { (() => {
function CourseTable({
  rows = [],
  columns = ['Cursos', 'Días y horarios', 'Lugar de dictado', 'Requisitos']
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      border: 'var(--border-width) solid var(--border-brand)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      background: 'var(--blue-100)',
      color: 'var(--blue-900)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textAlign: 'center',
      padding: '10px 12px',
      border: '1px solid var(--blue-300)',
      textTransform: 'uppercase',
      fontSize: 12,
      letterSpacing: '.06em'
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 12px',
      border: '1px solid var(--blue-200)',
      fontStyle: 'italic',
      fontWeight: 600,
      color: 'var(--blue-900)'
    }
  }, r.curso), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 12px',
      border: '1px solid var(--blue-200)'
    }
  }, r.horarios), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 12px',
      border: '1px solid var(--blue-200)'
    }
  }, r.sede), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 12px',
      border: '1px solid var(--blue-200)',
      textAlign: 'center'
    }
  }, r.requisitos))))));
}
Object.assign(__ds_scope, { CourseTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CourseTable.jsx", error: String((e && e.message) || e) }); }

// components/content/InfoList.jsx
try { (() => {
function InfoList({
  items = [],
  dense = false,
  invert = false,
  style
}) {
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: dense ? 8 : 14,
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 8px',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--brand-accent)',
      marginTop: 8
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1.55,
      color: invert ? 'var(--blue-100)' : 'var(--text-body)'
    }
  }, it.label ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: invert ? '#fff' : 'var(--text-title)'
    }
  }, it.label), " ", it.value) : it))));
}
Object.assign(__ds_scope, { InfoList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/InfoList.jsx", error: String((e && e.message) || e) }); }

// components/content/StatBlock.jsx
try { (() => {
function StatBlock({
  value,
  label,
  invert = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 44,
      lineHeight: 1,
      color: invert ? 'var(--brand-accent)' : 'var(--brand-primary)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 14,
      color: invert ? 'var(--blue-100)' : 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const tones = {
  brand: {
    background: 'var(--surface-brand-soft)',
    color: 'var(--blue-900)'
  },
  accent: {
    background: 'var(--surface-accent)',
    color: 'var(--text-on-accent)'
  },
  solid: {
    background: 'var(--brand-primary)',
    color: 'var(--text-on-brand)'
  },
  success: {
    background: 'var(--state-success-bg)',
    color: 'var(--state-success-fg)'
  },
  warning: {
    background: 'var(--state-warning-bg)',
    color: 'var(--state-warning-fg)'
  },
  danger: {
    background: 'var(--state-danger-bg)',
    color: 'var(--state-danger-fg)'
  },
  neutral: {
    background: 'var(--surface-subtle)',
    color: 'var(--neutral-700)'
  }
};
function Badge({
  tone = 'brand',
  uppercase = true,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: uppercase ? '.08em' : 0,
      textTransform: uppercase ? 'uppercase' : 'none',
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  borderWidth: 'var(--border-width-strong)',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background var(--duration-base) var(--ease-standard),color var(--duration-base) var(--ease-standard),transform var(--duration-fast) var(--ease-standard)',
  lineHeight: 1
};
const sizes = {
  sm: {
    fontSize: 14,
    padding: '8px 16px'
  },
  md: {
    fontSize: 16,
    padding: '11px 22px'
  },
  lg: {
    fontSize: 18,
    padding: '14px 30px'
  }
};
const variants = {
  primary: {
    background: 'var(--brand-primary)',
    color: 'var(--text-on-brand)',
    borderColor: 'var(--brand-primary)'
  },
  accent: {
    background: 'var(--brand-accent)',
    color: 'var(--text-on-accent)',
    borderColor: 'var(--brand-accent)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--brand-primary)',
    borderColor: 'var(--brand-primary)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--brand-primary)',
    borderColor: 'transparent'
  }
};
const hovers = {
  primary: {
    background: 'var(--blue-900)',
    borderColor: 'var(--blue-900)'
  },
  accent: {
    background: 'var(--yellow-600)',
    borderColor: 'var(--yellow-600)'
  },
  secondary: {
    background: 'var(--surface-brand-soft)'
  },
  ghost: {
    background: 'var(--surface-brand-soft)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  href,
  onClick,
  children,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const Tag = href ? 'a' : 'button';
  const s = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(h && !disabled ? hovers[variant] : null),
    ...(disabled ? {
      opacity: .45,
      cursor: 'not-allowed'
    } : null),
    ...(fullWidth ? {
      width: '100%'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    style: s,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/Hero.jsx
try { (() => {
const TRAIL_W = 1200,
  TRAIL_H = 420;
const TRAIL_D = 'M-80,332 C 120,302 180,150 330,192 C 470,230 520,92 680,122 C 830,150 900,58 1000,68 C 1100,78 1180,38 1300,-32';
const CYCLE = 26,
  SLOT = 5.2;
const DEFAULT_SHOTS = ['hero-soldadura.jpg', 'hero-energias.jpg', 'hero-electricidad.jpg', 'hero-domotica.jpg', 'hero-egresados.jpg'];
const HERO_MOTION_CSS = `
@keyframes cfpWipeOuter{from{transform:translate3d(38%,0,0) skewX(-9deg)}to{transform:translate3d(0,0,0) skewX(0deg)}}
@keyframes cfpWipeInner{from{transform:translate3d(-38%,0,0) skewX(9deg)}to{transform:translate3d(0,0,0) skewX(0deg)}}
@keyframes cfpArcSettle{0%{opacity:0;transform:translate3d(0,46px,0) scale(1.1)}70%{opacity:1;transform:translate3d(0,-6px,0) scale(.995)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}}
@keyframes cfpBreathe{0%{transform:translate3d(0,0,0) scale(1) rotate(0deg)}50%{transform:translate3d(-12px,10px,0) scale(1.022) rotate(.9deg)}100%{transform:translate3d(0,0,0) scale(1) rotate(0deg)}}
@keyframes cfpSheen{0%{transform:translateX(-70%) skewX(-14deg);opacity:0}6%{opacity:0}16%{opacity:.16}26%{opacity:.34}34%{opacity:.4}44%{opacity:.34}54%{opacity:.18}64%{opacity:.06}72%{transform:translateX(170%) skewX(-14deg);opacity:0}100%{transform:translateX(170%) skewX(-14deg);opacity:0}}
@keyframes cfpLineIn{from{transform:translate3d(0,112%,0)}to{transform:translate3d(0,0,0)}}
@keyframes cfpFadeUp{from{opacity:0;transform:translate3d(0,16px,0)}to{opacity:1;transform:none}}
@keyframes cfpRuleIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes cfpFly{0%{offset-distance:0%;opacity:0}2%{opacity:1}27%{opacity:1}31%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
@keyframes cfpTrail{0%{stroke-dashoffset:100}31%{stroke-dashoffset:0}50%{stroke-dashoffset:-100}100%{stroke-dashoffset:-100}}
@keyframes cfpShot{0%{opacity:0;transform:scale(1.16);clip-path:inset(0 0 0 100%)}2%{opacity:1}6.5%{clip-path:inset(0 0 0 0%)}13%{opacity:1;transform:scale(1.03);clip-path:inset(0 0 0 0%)}16.5%{opacity:0;transform:scale(1.005);clip-path:inset(0 0 0 0%)}100%{opacity:0;transform:scale(1.16);clip-path:inset(0 0 0 100%)}}
@keyframes cfpLensIn{0%{opacity:0;transform:translateY(-50%) scale(.82)}100%{opacity:1;transform:translateY(-50%) scale(1)}}
@keyframes cfpRingDrift{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(6deg) scale(1.04)}100%{transform:rotate(0deg) scale(1)}}
@keyframes cfpHalo{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.cfp-arc-stage{will-change:transform;transition:transform .9s cubic-bezier(.22,.7,.28,1)}
.cfp-arc-settle{animation:cfpArcSettle 1.15s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-arc-breathe{animation:cfpBreathe 24s ease-in-out 1.5s infinite}
.cfp-arc-wipe{animation:cfpWipeOuter 1.25s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-arc-wipe-in{animation:cfpWipeInner 1.25s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-hero-sheen{opacity:0;animation:cfpSheen 13s linear 2.2s infinite backwards}
.cfp-line-mask{display:block;overflow:hidden;padding-bottom:.16em;margin-bottom:-.16em}
.cfp-line-in{display:block;animation:cfpLineIn .82s cubic-bezier(.18,.86,.24,1) both}
.cfp-fade-up{animation:cfpFadeUp .66s cubic-bezier(.2,.7,.3,1) both}
.cfp-rule{transform-origin:left center;animation:cfpRuleIn .7s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-plane{offset-path:path('${TRAIL_D}');offset-rotate:auto;offset-distance:0%;opacity:0;will-change:offset-distance,opacity;animation:cfpFly 26s linear 6s infinite}
.cfp-trail-mask{animation:cfpTrail 26s linear 6s infinite}
.cfp-lens{animation:cfpLensIn 1.3s cubic-bezier(.16,.9,.28,1) .15s both}
.cfp-shot{animation:cfpShot ${CYCLE}s cubic-bezier(.3,.1,.2,1) infinite backwards;will-change:opacity,transform,clip-path}
.cfp-rings{animation:cfpRingDrift 38s ease-in-out infinite}
.cfp-halo{animation:cfpHalo 54s linear infinite}
@media (max-width:980px){.cfp-lens{opacity:.32!important}}
@media (prefers-reduced-motion:reduce){.cfp-arc-stage,.cfp-arc-settle,.cfp-arc-breathe,.cfp-arc-wipe,.cfp-arc-wipe-in,.cfp-hero-sheen,.cfp-line-in,.cfp-fade-up,.cfp-rule,.cfp-lens,.cfp-rings,.cfp-halo{animation:none!important;transition:none!important;transform:none!important;opacity:1!important}.cfp-lens{transform:translateY(-50%)!important}.cfp-hero-sheen{opacity:0!important}.cfp-flight{display:none!important}.cfp-shot{animation:none!important;opacity:0}.cfp-shot:first-of-type{opacity:1}}
`;
function useArcParallax(enabled) {
  const stage = React.useRef(null);
  React.useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (!fine || still) return;
    const el = stage.current;
    if (!el) return;
    const host = el.closest('section');
    if (!host) return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0,
      idle = true;
    const tick = () => {
      cx += (tx - cx) * .08;
      cy += (ty - cy) * .08;
      el.style.transform = `translate3d(${cx.toFixed(2)}px,${cy.toFixed(2)}px,0)`;
      if (Math.abs(tx - cx) > .1 || Math.abs(ty - cy) > .1) {
        raf = requestAnimationFrame(tick);
      } else {
        idle = true;
      }
    };
    const wake = () => {
      el.style.transition = 'none';
      if (idle) {
        idle = false;
        raf = requestAnimationFrame(tick);
      }
    };
    const move = e => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * -56;
      ty = ((e.clientY - r.top) / r.height - .5) * -28;
      wake();
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      el.style.transition = '';
      el.style.transform = '';
      cx = 0;
      cy = 0;
      cancelAnimationFrame(raf);
      idle = true;
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return stage;
}
function useFlightScale(enabled) {
  const layer = React.useRef(null);
  React.useEffect(() => {
    if (!enabled) return;
    const el = layer.current;
    if (!el) return;
    const host = el.parentElement;
    const fit = () => {
      const r = host.getBoundingClientRect();
      if (!r.width) return;
      const s = r.width / TRAIL_W;
      el.style.transform = `translate3d(0,${((r.height - TRAIL_H * s) / 2).toFixed(1)}px,0) scale(${s.toFixed(4)})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [enabled]);
  return layer;
}
function Hero({
  overline,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  shots,
  assetBase = 'assets',
  animate = true,
  plane = true,
  style
}) {
  const stage = useArcParallax(animate);
  const flight = useFlightScale(animate && plane);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const cls = n => animate ? n : undefined;
  const arc = `${assetBase}/isotipo-arco-blanco.png`;
  const pics = (shots && shots.length ? shots : DEFAULT_SHOTS).map(s => /[\/:]/.test(s) ? s : `${assetBase}/${s}`).slice(0, 5);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--gradient-hero-rich,var(--gradient-hero))',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }
  }, animate && /*#__PURE__*/React.createElement("style", null, HERO_MOTION_CSS), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: cls('cfp-rings'),
    viewBox: "0 0 1200 600",
    preserveAspectRatio: "xMaxYMid slice",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      transformOrigin: '78% 50%'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "#fff",
    strokeOpacity: ".07"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "880",
    cy: "300",
    rx: "300",
    ry: "360"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "880",
    cy: "300",
    rx: "420",
    ry: "480"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "880",
    cy: "300",
    rx: "560",
    ry: "620",
    strokeOpacity: ".045"
  }))), pics.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: cls('cfp-lens'),
    style: {
      position: 'absolute',
      right: '-8%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'min(48vw,660px)',
      aspectRatio: '1',
      borderRadius: '50%',
      background: 'linear-gradient(200deg,rgba(0,80,176,.55),rgba(0,40,120,.9))',
      boxShadow: '0 46px 110px rgba(0,14,52,.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      overflow: 'hidden'
    }
  }, pics.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: src,
    src: src,
    alt: "",
    className: cls('cfp-shot'),
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: animate ? 0 : i === 0 ? 1 : 0,
      animationDelay: animate ? `${(i * SLOT).toFixed(2)}s` : undefined
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(120% 120% at 20% 50%,rgba(0,40,120,.72),rgba(0,40,120,.12) 58%,transparent 78%)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18),inset 0 0 90px rgba(0,26,88,.55)'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    className: cls('cfp-halo'),
    viewBox: "0 0 200 200",
    style: {
      position: 'absolute',
      inset: -6
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "97",
    fill: "none",
    stroke: "var(--brand-accent)",
    strokeOpacity: ".55",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    pathLength: "100",
    strokeDasharray: "17 83"
  }))), /*#__PURE__*/React.createElement("div", {
    ref: stage,
    className: cls('cfp-arc-stage'),
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('cfp-arc-settle'),
    style: {
      position: 'absolute',
      right: -90,
      top: -34,
      height: '124%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('cfp-arc-breathe'),
    style: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('cfp-arc-wipe'),
    style: {
      height: '100%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('cfp-arc-wipe-in'),
    style: {
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: arc,
    alt: "",
    style: {
      height: '100%',
      display: 'block',
      opacity: .11,
      mixBlendMode: 'soft-light'
    }
  }), animate && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      maskImage: `url(${arc})`,
      WebkitMaskImage: `url(${arc})`,
      maskSize: '100% 100%',
      WebkitMaskSize: '100% 100%',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cfp-hero-sheen",
    style: {
      position: 'absolute',
      inset: '-10% -45%',
      opacity: 0,
      transform: 'translateX(-70%) skewX(-14deg)',
      background: 'linear-gradient(100deg,transparent 40%,rgba(255,255,255,.5) 50%,transparent 60%)'
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(100deg,rgba(0,40,120,.93) 0%,rgba(0,40,120,.74) 24%,rgba(0,40,120,.32) 46%,transparent 64%)'
    }
  }), animate && plane && /*#__PURE__*/React.createElement("div", {
    ref: flight,
    className: "cfp-flight",
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: TRAIL_W,
      height: TRAIL_H,
      transformOrigin: 'top left'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: TRAIL_W,
    height: TRAIL_H,
    viewBox: `0 0 ${TRAIL_W} ${TRAIL_H}`,
    fill: "none",
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'visible'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("mask", {
    id: `t${uid}`,
    maskUnits: "userSpaceOnUse",
    x: "-120",
    y: "-80",
    width: TRAIL_W + 260,
    height: TRAIL_H + 160
  }, /*#__PURE__*/React.createElement("path", {
    className: "cfp-trail-mask",
    d: TRAIL_D,
    stroke: "#fff",
    strokeWidth: "14",
    strokeLinecap: "round",
    pathLength: "100",
    strokeDasharray: "100 100",
    strokeDashoffset: "100"
  }))), /*#__PURE__*/React.createElement("path", {
    d: TRAIL_D,
    mask: `url(#t${uid})`,
    stroke: "rgba(255,255,255,.42)",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeDasharray: "0.1 11"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cfp-plane",
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 54,
      height: 54,
      marginLeft: -27,
      marginTop: -27
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${assetBase}/avioncito-papel.png`,
    alt: "",
    style: {
      width: '100%',
      display: 'block',
      transform: 'rotate(43deg)',
      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.28))'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-20) var(--gutter)',
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: image ? '1.1fr .9fr' : '1fr',
      gap: 'var(--space-12)',
      alignItems: 'center',
      minHeight: 'clamp(360px,54vh,560px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620
    }
  }, overline && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: cls('cfp-rule'),
    style: {
      width: 28,
      height: 3,
      borderRadius: 2,
      background: 'var(--brand-accent)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: cls('cfp-line-mask')
  }, /*#__PURE__*/React.createElement("span", {
    className: cls('cfp-line-in'),
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-accent)',
      animationDelay: animate ? '.18s' : undefined
    }
  }, overline))), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-display-size)',
      lineHeight: 'var(--text-display-line)',
      fontWeight: 800,
      letterSpacing: '-.02em',
      color: '#fff',
      textShadow: '0 2px 24px rgba(0,20,70,.45)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: cls('cfp-line-mask')
  }, /*#__PURE__*/React.createElement("span", {
    className: cls('cfp-line-in'),
    style: {
      animationDelay: animate ? '.3s' : undefined
    }
  }, title))), subtitle && /*#__PURE__*/React.createElement("p", {
    className: cls('cfp-fade-up'),
    style: {
      marginTop: 'var(--space-5)',
      fontSize: 19,
      lineHeight: 1.55,
      color: 'var(--blue-100)',
      animationDelay: animate ? '.52s' : undefined
    }
  }, subtitle), /*#__PURE__*/React.createElement("div", {
    className: cls('cfp-fade-up'),
    style: {
      marginTop: 'var(--space-8)',
      display: 'flex',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      animationDelay: animate ? '.62s' : undefined
    }
  }, primaryCta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    size: "lg",
    onClick: primaryCta.onClick
  }, primaryCta.label), secondaryCta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "lg",
    onClick: secondaryCta.onClick,
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,.5)'
    }
  }, secondaryCta.label))), image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)'
    }
  })));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Hero.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  accentBar = false,
  hoverable = false,
  padding = 'var(--space-6)',
  children,
  style,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-width) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: h && hoverable ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transform: h && hoverable ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--duration-base) var(--ease-standard),transform var(--duration-base) var(--ease-standard)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, accentBar && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--rule-height)',
      background: 'var(--brand-accent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/CourseCard.jsx
try { (() => {
function CourseCard({
  title,
  schedule,
  location = 'Sede Juan Pablo Angulo 1272, Dock Sud',
  duration,
  requirements,
  status = 'Inscripción abierta',
  onAction,
  actionLabel = 'Ver curso'
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    hoverable: true,
    accentBar: true,
    padding: "var(--space-5)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      lineHeight: 1.2,
      fontWeight: 700,
      flex: '1 1 100%'
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "accent"
  }, status)), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0,
      display: 'grid',
      gridTemplateColumns: '110px 1fr',
      rowGap: 6,
      columnGap: 12,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Horarios"), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      color: 'var(--text-body)'
    }
  }, schedule), duration && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Duraci\xF3n"), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0
    }
  }, duration)), /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Sede"), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0
    }
  }, location), requirements && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Requisitos"), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0
    }
  }, requirements))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "secondary",
    onClick: onAction
  }, actionLabel)));
}
Object.assign(__ds_scope, { CourseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CourseCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/* Lucide via CDN sprite-less inline <i data-lucide>. The brand ships no icon set of its own;
   Lucide (2px stroke, rounded caps) is the flagged substitution — see readme ICONOGRAPHY. */
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        }
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      color,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
const SRC = {
  institucional: 'logo-cfp401-horizontal.png',
  'institucional-blanco': 'logo-cfp401-horizontal-blanco.png',
  vertical: 'logo-cfp401-vertical.png',
  'vertical-blanco': 'logo-cfp401-vertical-blanco.png',
  sello: 'logo-cfp401-sello.png',
  arco: 'isotipo-arco.png',
  'arco-blanco': 'isotipo-arco-blanco.png',
  campus: 'logo-campus-horizontal.png',
  'fundacion-uocra': 'logo-fundacion-uocra.png'
};
function Logo({
  variant = 'institucional',
  height = 48,
  assetBase = 'assets',
  alt = 'CFP N° 401 Avellaneda',
  style
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: `${assetBase}/${SRC[variant]}`,
    alt: alt,
    style: {
      height,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function SectionHeading({
  overline,
  title,
  subtitle,
  align = 'left',
  invert = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: align === 'center' ? 720 : undefined,
      margin: align === 'center' ? '0 auto' : undefined,
      ...style
    }
  }, overline && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--text-overline-weight)',
      fontSize: 'var(--text-overline-size)',
      letterSpacing: 'var(--text-overline-tracking)',
      textTransform: 'uppercase',
      color: invert ? 'var(--brand-accent)' : 'var(--brand-primary-bright)',
      marginBottom: 'var(--space-3)'
    }
  }, overline), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-h2-size)',
      lineHeight: 'var(--text-h2-line)',
      fontWeight: 'var(--text-h2-weight)',
      letterSpacing: 'var(--text-h2-tracking)',
      color: invert ? 'var(--neutral-0)' : 'var(--text-title)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--rule-height)',
      width: 64,
      background: 'var(--brand-accent)',
      borderRadius: 2,
      margin: align === 'center' ? 'var(--space-4) auto 0' : 'var(--space-4) 0 0'
    }
  }), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--text-body-lg-size)',
      lineHeight: 'var(--text-body-lg-line)',
      color: invert ? 'var(--blue-100)' : 'var(--text-muted)'
    }
  }, subtitle));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const tones = {
  info: {
    bg: 'var(--surface-brand-soft)',
    fg: 'var(--blue-900)'
  },
  success: {
    bg: 'var(--state-success-bg)',
    fg: 'var(--state-success-fg)'
  },
  warning: {
    bg: 'var(--state-warning-bg)',
    fg: 'var(--state-warning-fg)'
  },
  danger: {
    bg: 'var(--state-danger-bg)',
    fg: 'var(--state-danger-fg)'
  }
};
function Alert({
  tone = 'info',
  children,
  onDismiss,
  style
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      background: t.bg,
      color: t.fg,
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: 15,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'inherit',
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  width = 520
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,40,120,.45)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      width,
      maxWidth: '100%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--rule-height)',
      background: 'var(--brand-accent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6)'
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 'var(--space-3)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-3)'
    }
  }, footer))));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  label,
  showValue = true,
  style
}) {
  const v = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--brand-primary)'
    }
  }, v, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--neutral-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: v + '%',
      height: '100%',
      background: 'var(--brand-accent)',
      transition: 'width var(--duration-slow) var(--ease-standard)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 20,
      height: 20,
      flex: '0 0 20px',
      borderRadius: 'var(--radius-xs)',
      border: 'var(--border-width-strong) solid ' + (checked ? 'var(--brand-primary)' : 'var(--border-strong)'),
      background: checked ? 'var(--brand-primary)' : 'var(--surface-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--duration-fast) var(--ease-standard)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6.5l2.5 2.5L10 3.5",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function Field({
  label,
  children,
  hint,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-title)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4)'
    }
  }, children), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  required,
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-title)',
      marginBottom: 'var(--space-2)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--state-danger-fg)'
    }
  }, " *")), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-body)',
      background: disabled ? 'var(--surface-subtle)' : 'var(--surface-card)',
      padding: '11px 14px',
      borderRadius: 'var(--radius-md)',
      border: 'var(--border-width) solid ' + (error ? 'var(--state-danger-fg)' : f ? 'var(--brand-primary)' : 'var(--border-strong)'),
      boxShadow: f ? 'var(--ring-focus)' : 'none',
      outline: 'none',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 13,
      color: error ? 'var(--state-danger-fg)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked = false,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(true),
    style: {
      width: 20,
      height: 20,
      flex: '0 0 20px',
      borderRadius: '50%',
      border: 'var(--border-width-strong) solid ' + (checked ? 'var(--brand-primary)' : 'var(--border-strong)'),
      background: 'var(--surface-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--brand-primary)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  disabled,
  hint,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-title)',
      marginBottom: 'var(--space-2)'
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    disabled: disabled,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      appearance: 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-body)',
      background: 'var(--surface-card) url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%23003890\' stroke-width=\'2\'><path d=\'M3 6l5 5 5-5\'/></svg>") no-repeat right 14px center',
      padding: '11px 40px 11px 14px',
      borderRadius: 'var(--radius-md)',
      border: 'var(--border-width) solid var(--border-strong)'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function Footer({
  assetBase = 'assets',
  columns = [],
  address,
  children
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--blue-100)',
      paddingTop: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--gutter) var(--space-12)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "institucional-blanco",
    height: 40,
    assetBase: assetBase,
    style: {
      maxWidth: '100%',
      height: 'auto'
    }
  }), address && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--blue-200)'
    }
  }, address), children), columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--brand-accent)',
      marginBottom: 'var(--space-4)'
    }
  }, c.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.links.map(l => {
    const o = typeof l === 'string' ? {
      label: l
    } : l;
    return /*#__PURE__*/React.createElement("li", {
      key: o.label
    }, /*#__PURE__*/React.createElement("a", {
      href: o.href,
      onClick: o.onClick,
      style: {
        fontSize: 14,
        color: 'var(--blue-100)',
        textDecoration: 'none',
        cursor: o.onClick || o.href ? 'pointer' : 'default'
      }
    }, o.label));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.14)',
      padding: 'var(--space-5) var(--gutter)',
      textAlign: 'center',
      fontSize: 13,
      color: 'var(--blue-200)'
    }
  }, "C.F.P. N\xB0 401 Avellaneda \u2014 Gran Buenos Aires \xB7 Juan Pablo Angulo 1272, Dock Sud"));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  items = [],
  active,
  onNavigate,
  assetBase = 'assets',
  logo = 'institucional',
  cta,
  sticky = true
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: sticky ? 'sticky' : 'static',
      top: 0,
      zIndex: 20,
      background: 'var(--surface-card)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--rule-height)',
      background: 'var(--brand-accent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '14px var(--gutter)',
      display: 'flex',
      alignItems: 'center',
      rowGap: 'var(--space-3)',
      columnGap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: logo,
    height: 38,
    assetBase: assetBase,
    style: {
      flex: '0 1 auto',
      minWidth: 0,
      maxWidth: '100%',
      height: 'auto',
      maxHeight: 38
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      rowGap: 'var(--space-2)',
      columnGap: 'clamp(14px,2.2vw,var(--space-6))',
      marginLeft: 'auto'
    }
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    onClick: () => onNavigate && onNavigate(it),
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      color: active === it ? 'var(--brand-primary)' : 'var(--neutral-600)',
      paddingBottom: 4,
      borderBottom: '3px solid ' + (active === it ? 'var(--brand-accent)' : 'transparent'),
      textDecoration: 'none'
    }
  }, it))), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    size: "sm",
    onClick: cta.onClick,
    style: {
      flex: 'none',
      whiteSpace: 'nowrap'
    }
  }, cta.label)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideNav.jsx
try { (() => {
function SideNav({
  items = [],
  active,
  onNavigate,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flex: '0 0 248px',
      background: 'var(--surface-inverse)',
      color: 'var(--blue-100)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6) var(--space-4)',
      gap: 'var(--space-1)',
      ...style
    }
  }, items.map(it => {
    const on = active === it.label;
    return /*#__PURE__*/React.createElement("a", {
      key: it.label,
      onClick: () => onNavigate && onNavigate(it.label),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 15,
        textDecoration: 'none',
        color: on ? 'var(--blue-900)' : 'var(--blue-100)',
        background: on ? 'var(--brand-accent)' : 'transparent'
      }
    }, it.icon, /*#__PURE__*/React.createElement("span", null, it.label), it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 12,
        opacity: .8
      }
    }, it.count));
  }), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 'var(--space-6)',
      fontSize: 13,
      color: 'var(--blue-200)'
    }
  }, footer));
}
Object.assign(__ds_scope, { SideNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      ...style
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it,
    onClick: () => onChange && onChange(it),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0 0 10px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      color: active === it ? 'var(--brand-primary)' : 'var(--neutral-500)',
      borderBottom: '3px solid ' + (active === it ? 'var(--brand-primary)' : 'transparent'),
      marginBottom: -1
    }
  }, it)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/campus_virtual/CampusShell.jsx
try { (() => {
const {
  SideNav,
  Logo,
  Icon,
  Badge,
  Button
} = window.CFP401AvellanedaDesignSystem_6c39ff;
function CampusShell({
  page,
  onNavigate,
  onLogout,
  children
}) {
  const items = [{
    label: 'Inicio',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "home",
      size: 18
    })
  }, {
    label: 'Mis cursos',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "book-open",
      size: 18
    }),
    count: 3
  }, {
    label: 'Curso',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "graduation-cap",
      size: 18
    })
  }, {
    label: 'Calificaciones',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "clipboard-check",
      size: 18
    })
  }, {
    label: 'Mensajes',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 18
    }),
    count: 2
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-6) var(--space-4) var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-campus-horizontal.png",
    alt: "Campus Virtual",
    style: {
      width: 200,
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: 8
    }
  })), /*#__PURE__*/React.createElement(SideNav, {
    items: items,
    active: page,
    onNavigate: onNavigate,
    style: {
      flex: 1
    },
    footer: /*#__PURE__*/React.createElement("a", {
      onClick: onLogout,
      style: {
        color: 'var(--blue-200)',
        cursor: 'pointer',
        fontSize: 13
      }
    }, "Cerrar sesi\xF3n")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '14px var(--space-8)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20
    }
  }, page), /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    style: {
      marginLeft: 'var(--space-2)'
    }
  }, "Ciclo en curso"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 20,
    color: "var(--neutral-500)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--brand-primary)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14
    }
  }, "MR"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-title)'
    }
  }, "Micaela R\xEDos"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Estudiante"))))), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: 'var(--space-8)'
    }
  }, children)));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/campus_virtual/CampusShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/campus_virtual/CourseScreen.jsx
try { (() => {
const {
  Card,
  Tabs,
  Badge,
  Button,
  Icon,
  ProgressBar,
  Callout,
  Alert,
  Modal,
  Input,
  InfoList
} = window.CFP401AvellanedaDesignSystem_6c39ff;
function CourseScreen() {
  const [tab, setTab] = React.useState('Contenidos');
  const [open, setOpen] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const units = [{
    n: 'Módulo 1',
    t: 'Seguridad e higiene en soldadura',
    done: true,
    items: ['Apunte: EPP en taller (PDF)', 'Video: preparación del puesto', 'Cuestionario 1']
  }, {
    n: 'Módulo 2',
    t: 'Soldadura MIG: parámetros',
    done: true,
    items: ['Apunte: gases y caudales (PDF)', 'Práctica guiada 2']
  }, {
    n: 'Módulo 3',
    t: 'Cordón horizontal y vertical',
    done: false,
    items: ['Consigna de entrega', 'Foro de dudas']
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--gradient-hero)',
      color: '#fff',
      padding: 'var(--space-8)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-isotipo.png",
    alt: "",
    style: {
      position: 'absolute',
      right: -30,
      top: -30,
      height: '160%',
      opacity: .09
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "Metalmec\xE1nica"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontSize: 34,
      marginTop: 'var(--space-4)'
    }
  }, "Soldador MIG-TIG"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-3) 0 0',
      color: 'var(--blue-100)',
      fontSize: 16
    }
  }, "Prof. R. Gim\xE9nez \xB7 Lunes, mi\xE9rcoles y viernes de 17:50 a 21:50 hs \xB7 Sede Juan Pablo Angulo 1272"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 62,
    label: "Tu avance",
    style: {
      marginTop: 'var(--space-6)',
      maxWidth: 420
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: ['Contenidos', 'Entregas', 'Calificaciones', 'Foro'],
    active: tab,
    onChange: setTab,
    style: {
      marginTop: 'var(--space-6)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-8)'
    }
  }, tab === 'Contenidos' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, units.map(u => /*#__PURE__*/React.createElement("div", {
    key: u.n,
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: u.done ? 'check-circle-2' : 'circle-dashed',
    size: 20,
    color: u.done ? 'var(--state-success-fg)' : 'var(--neutral-400)'
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      color: 'var(--text-title)'
    }
  }, u.n, " \xB7 ", u.t), u.done && /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    style: {
      marginLeft: 'auto'
    }
  }, "Completado")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 'var(--space-4) var(--space-5)',
      display: 'grid',
      gap: 10
    }
  }, u.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 16,
    color: "var(--brand-primary)"
  }), /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, i))))))), tab === 'Entregas' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      maxWidth: 640
    }
  }, sent && /*#__PURE__*/React.createElement(Alert, {
    tone: "success"
  }, "Tu entrega fue subida y est\xE1 pendiente de correcci\xF3n."), /*#__PURE__*/React.createElement(Callout, {
    tone: "accent",
    title: "Pr\xE1ctica de cord\xF3n horizontal"
  }, "Entreg\xE1 3 fotos del cord\xF3n y el registro de par\xE1metros. Vence el viernes 19/09 a las 23:59."), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    onClick: () => setOpen(true),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 18
    })
  }, "Subir entrega"), /*#__PURE__*/React.createElement(InfoList, {
    dense: true,
    items: [{
      label: 'Entrega 1:',
      value: 'Cuestionario de seguridad — 9 (corregido)'
    }, {
      label: 'Entrega 2:',
      value: 'Práctica guiada MIG — 8 (corregido)'
    }]
  })), tab === 'Calificaciones' && /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Instancia', 'Fecha', 'Nota'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: 'left',
      padding: '10px 12px',
      borderBottom: '2px solid var(--border-brand)',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--blue-900)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, [['Cuestionario de seguridad', '12/04', '9'], ['Práctica guiada MIG', '30/05', '8'], ['Cordón horizontal', 'pendiente', '—']].map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, r.map((c, i) => /*#__PURE__*/React.createElement("td", {
    key: i,
    style: {
      padding: '10px 12px',
      borderBottom: '1px solid var(--border-subtle)',
      fontWeight: i === 2 ? 700 : 400,
      color: i === 2 ? 'var(--brand-primary)' : 'var(--text-body)'
    }
  }, c)))))), tab === 'Foro' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      maxWidth: 680
    }
  }, [['Prof. R. Giménez', 'Revisen el caudal de gas antes de la práctica del viernes.'], ['Micaela R.', '¿Se puede entregar el registro de parámetros en papel?']].map(([a, m]) => /*#__PURE__*/React.createElement(Card, {
    key: a,
    padding: "var(--space-5)"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      color: 'var(--text-title)'
    }
  }, a), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, m))), /*#__PURE__*/React.createElement(Input, {
    label: "Escribir en el foro",
    placeholder: "Tu mensaje\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    style: {
      justifySelf: 'start'
    }
  }, "Publicar")))), /*#__PURE__*/React.createElement(Modal, {
    open: open,
    title: "Subir entrega",
    onClose: () => setOpen(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      onClick: () => {
        setSent(true);
        setOpen(false);
        setTab('Entregas');
      }
    }, "Confirmar entrega"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '2px dashed var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-8)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, "Arrastr\xE1 tus archivos o hac\xE9 clic para elegirlos"), /*#__PURE__*/React.createElement(Input, {
    label: "Comentario para el docente",
    placeholder: "Opcional"
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/campus_virtual/CourseScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/campus_virtual/DashboardScreen.jsx
try { (() => {
const {
  Card,
  Button,
  Badge,
  ProgressBar,
  Alert,
  InfoList,
  SectionHeading,
  Icon,
  StatBlock
} = window.CFP401AvellanedaDesignSystem_6c39ff;
const CAMPUS_COURSES = [{
  t: 'Soldador MIG-TIG',
  doc: 'Prof. R. Giménez',
  p: 62,
  next: 'Entrega: práctica de cordón horizontal · vie 19/09'
}, {
  t: 'Instalador de Sistemas Domóticos',
  doc: 'Prof. L. Sosa',
  p: 38,
  next: 'Clase sincrónica · mié 17/09 19:00 hs'
}, {
  t: 'Creador de contenido audiovisual',
  doc: 'Prof. A. Duarte',
  p: 81,
  next: 'Corrección de guion publicada'
}];
function DashboardScreen({
  onOpenCourse
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    onDismiss: () => {}
  }, "Record\xE1 que la inscripci\xF3n a los m\xF3dulos del segundo cuatrimestre cierra el 30/09."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Tus cursos",
    title: "Continu\xE1 donde quedaste"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)'
    }
  }, CAMPUS_COURSES.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.t,
    hoverable: true,
    accentBar: true,
    padding: "var(--space-5)",
    onClick: onOpenCourse
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19
    }
  }, c.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, c.doc)), /*#__PURE__*/React.createElement(Badge, {
    tone: c.p > 75 ? 'success' : 'brand'
  }, c.p > 75 ? 'Al día' : 'En curso')), /*#__PURE__*/React.createElement(ProgressBar, {
    value: c.p,
    label: "Avance",
    style: {
      marginTop: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-clock",
    size: 16,
    color: "var(--brand-primary)"
  }), c.next, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    style: {
      marginLeft: 'auto'
    },
    onClick: onOpenCourse
  }, "Entrar")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-6)"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17,
      marginBottom: 'var(--space-4)'
    }
  }, "Pr\xF3ximas fechas"), /*#__PURE__*/React.createElement(InfoList, {
    dense: true,
    items: [{
      label: '17/09',
      value: 'Clase sincrónica de Domótica'
    }, {
      label: '19/09',
      value: 'Entrega práctica MIG-TIG'
    }, {
      label: '30/09',
      value: 'Cierre de inscripción a módulos'
    }]
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-6)",
    style: {
      display: 'flex',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "3",
    label: "Cursos activos"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "8,4",
    label: "Promedio"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-6)"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17,
      marginBottom: 'var(--space-3)'
    }
  }, "Ayuda"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "Escribinos por WhatsApp al 11 6105-6018 o acercate a la sede de 10 a 19 hs.")))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/campus_virtual/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/campus_virtual/LoginScreen.jsx
try { (() => {
const {
  Button,
  Input,
  Checkbox,
  Card,
  Callout,
  Icon
} = window.CFP401AvellanedaDesignSystem_6c39ff;
function LoginScreen({
  onLogin
}) {
  const [u, setU] = React.useState('39482116');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--gradient-hero)',
      color: '#fff',
      padding: 'var(--space-16) var(--space-12)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-isotipo.png",
    alt: "",
    style: {
      position: 'absolute',
      right: -80,
      bottom: -60,
      height: '80%',
      opacity: .08
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-campus-horizontal.png",
    alt: "Campus Virtual",
    style: {
      width: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontSize: 44,
      lineHeight: 1.05,
      letterSpacing: '-.02em',
      marginTop: 'var(--space-8)',
      maxWidth: 520
    }
  }, "Tu aula, tus materiales y tus entregas en un solo lugar"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--blue-100)',
      maxWidth: 480,
      marginTop: 'var(--space-5)'
    }
  }, "Ingres\xE1 con tu DNI y la clave que te dio tu docente. Si es tu primera vez, consult\xE1 en la sede.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-8)",
    style: {
      width: 420
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26,
      marginBottom: 'var(--space-2)'
    }
  }, "Ingresar"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 0,
      fontSize: 15,
      color: 'var(--text-muted)'
    }
  }, "Campus Virtual \xB7 CFP N\xB0 401 Avellaneda"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "DNI",
    value: u,
    onChange: e => setU(e.target.value),
    hint: "Sin puntos ni espacios"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Contrase\xF1a",
    type: "password",
    value: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Mantener mi sesi\xF3n iniciada",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    fullWidth: true,
    onClick: onLogin
  }, "Entrar al campus"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 14,
      textAlign: 'center'
    }
  }, "\xBFOlvidaste tu contrase\xF1a?")), /*#__PURE__*/React.createElement(Callout, {
    tone: "info",
    style: {
      marginTop: 'var(--space-6)'
    }
  }, "Consultas por WhatsApp al 11 6105-6018 (solo mensajes)."))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/campus_virtual/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/piezas_sociales/FlyerCurso.jsx
try { (() => {
function FlyerCurso({
  titulo = 'INSTALADOR Y REPARADOR DE AIRE ACONDICIONADO',
  dias = 'Lunes, miércoles y viernes',
  horario = 'de 9:30 a 12:40 hs',
  duracion = '1 AÑO',
  cinta = 'CURSOS'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080,
      height: 1350,
      transform: 'scale(.37)',
      transformOrigin: 'top left',
      background: '#fff',
      backgroundImage: 'linear-gradient(var(--blue-100) 1px,transparent 1px),linear-gradient(90deg,var(--blue-100) 1px,transparent 1px)',
      backgroundSize: '46px 46px',
      position: 'relative',
      fontFamily: 'var(--font-display)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--blue-900)',
      color: '#fff',
      fontWeight: 800,
      fontSize: 34,
      letterSpacing: '.02em',
      padding: '16px 32px'
    }
  }, "ES TU TIEMPO DE APRENDER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '20px 32px',
      borderBottom: '6px solid var(--brand-accent)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/isotipo-arco.png",
    style: {
      height: 76
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 40,
      color: 'var(--brand-primary)'
    }
  }, "Estudi\xE1 con Nosotros"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 22,
      color: 'var(--text-muted)'
    }
  }, "www.cfp401avellaneda.com.ar")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      background: 'var(--brand-accent)',
      color: 'var(--blue-900)',
      fontWeight: 800,
      fontSize: 28,
      padding: '14px 26px',
      transform: 'skewX(-8deg)',
      textAlign: 'center',
      lineHeight: 1.1
    }
  }, "INSCRIBITE", /*#__PURE__*/React.createElement("br", null), "AHORA!")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 56px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      background: 'var(--brand-primary)',
      color: '#fff',
      fontWeight: 800,
      fontSize: 56,
      padding: '16px 64px',
      borderRadius: 8,
      boxShadow: '0 10px 0 var(--blue-900)'
    }
  }, cinta), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: 'var(--brand-primary)',
      fontSize: 74,
      lineHeight: 1.02,
      letterSpacing: '-.02em',
      margin: '48px 0 0',
      textWrap: 'balance'
    }
  }, titulo), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      background: 'var(--brand-primary)',
      color: '#fff',
      fontWeight: 700,
      fontSize: 40,
      padding: '18px 28px',
      borderRadius: 8
    }
  }, dias), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 34,
      color: 'var(--text-body)',
      marginTop: 22
    }
  }, horario), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 30,
      color: 'var(--text-muted)',
      marginTop: 16
    }
  }, "Sede: Juan Pablo Angulo 1272, Dock Sud"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      justifyContent: 'center',
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      border: '5px solid var(--brand-accent)',
      borderRadius: 10,
      padding: '20px 10px',
      fontWeight: 800,
      fontSize: 30,
      color: 'var(--brand-primary)',
      lineHeight: 1.15
    }
  }, "GRATUITO Y CON", /*#__PURE__*/React.createElement("br", null), "CERTIFICACI\xD3N OFICIAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 320px',
      border: '5px solid var(--brand-accent)',
      borderRadius: 10,
      padding: '20px 10px',
      fontWeight: 800,
      fontSize: 30,
      color: 'var(--brand-primary)',
      lineHeight: 1.15
    }
  }, duracion, /*#__PURE__*/React.createElement("br", null), "DE DURACI\xD3N")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 52,
      fontWeight: 800,
      fontSize: 34,
      color: 'var(--brand-primary)',
      lineHeight: 1.2
    }
  }, "PARA M\xC1S CONSULTAS ENVIANOS UN", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 52
    }
  }, "WHATSAPP AL")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'inline-block',
      background: 'var(--brand-primary)',
      color: '#fff',
      fontWeight: 800,
      fontSize: 52,
      padding: '14px 52px',
      borderRadius: 999
    }
  }, "11 6105-6018")));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/piezas_sociales/FlyerCurso.jsx", error: String((e && e.message) || e) }); }

// ui_kits/piezas_sociales/PlacaAviso.jsx
try { (() => {
function PlacaAviso({
  titulo = ['ÚLTIMOS', 'CUPOS', 'DISPONIBLES'],
  bajada = 'Todavía estás a tiempo de sumarte a nuestros cursos'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080,
      height: 1350,
      transform: 'scale(.37)',
      transformOrigin: 'top left',
      background: '#fff',
      backgroundImage: 'linear-gradient(var(--blue-100) 1px,transparent 1px),linear-gradient(90deg,var(--blue-100) 1px,transparent 1px)',
      backgroundSize: '46px 46px',
      position: 'relative',
      fontFamily: 'var(--font-display)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--blue-900)',
      color: '#fff',
      fontWeight: 800,
      fontSize: 34,
      padding: '16px 32px'
    }
  }, "ES TU TIEMPO DE APRENDER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '20px 32px',
      borderBottom: '6px solid var(--brand-accent)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/isotipo-arco.png",
    style: {
      height: 76
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 40,
      color: 'var(--brand-primary)'
    }
  }, "Estudi\xE1 con Nosotros")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 60,
      top: 200,
      width: 190,
      height: 190,
      background: 'var(--brand-accent)',
      clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '150px 70px 0',
      textAlign: 'center'
    }
  }, titulo.map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      fontWeight: 800,
      fontSize: 112,
      lineHeight: 1.02,
      letterSpacing: '-.02em',
      color: 'var(--brand-primary)'
    }
  }, t)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontWeight: 600,
      fontSize: 44,
      color: 'var(--brand-primary)',
      marginTop: 56,
      lineHeight: 1.3
    }
  }, bajada), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 70,
      fontFamily: 'var(--font-body)',
      fontSize: 34,
      color: 'var(--blue-900)',
      textDecoration: 'underline'
    }
  }, "Sede: Juan Pablo Angulo 1272, Dock Sud"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 56,
      marginTop: 56,
      fontFamily: 'var(--font-body)',
      fontSize: 26,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "11 6105-6018"), /*#__PURE__*/React.createElement("span", null, "J.P. Angulo 1272"), /*#__PURE__*/React.createElement("span", null, "www.cfp401avellaneda.com.ar")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 26,
      background: 'var(--brand-accent)'
    }
  })));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/piezas_sociales/PlacaAviso.jsx", error: String((e && e.message) || e) }); }

// ui_kits/piezas_sociales/PostInfo.jsx
try { (() => {
const {
  InfoList
} = window.CFP401AvellanedaDesignSystem_6c39ff;
function PostInfo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080,
      height: 1080,
      transform: 'scale(.37)',
      transformOrigin: 'top left',
      background: 'var(--gradient-hero)',
      color: '#fff',
      padding: '72px 80px',
      fontFamily: 'var(--font-display)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/isotipo-arco-blanco.png",
    style: {
      position: 'absolute',
      right: -60,
      bottom: -80,
      height: 700,
      opacity: .09
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-cfp401-horizontal-blanco.png",
    style: {
      height: 120
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontSize: 78,
      lineHeight: 1.05,
      letterSpacing: '-.02em',
      marginTop: 56,
      maxWidth: 820
    }
  }, "\xBFQuer\xE9s aprender un oficio de manera gratuita?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      fontFamily: 'var(--font-body)',
      fontSize: 36,
      lineHeight: 1.6,
      color: 'var(--blue-100)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-accent)'
    }
  }, "\u2014"), "Cursos con t\xEDtulos oficiales"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-accent)'
    }
  }, "\u2014"), "Formaci\xF3n 100% gratuita"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-accent)'
    }
  }, "\u2014"), "Inscripciones en Juan Pablo Angulo 1272"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-accent)'
    }
  }, "\u2014"), "Lunes a viernes de 10 a 19 hs")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 80,
      bottom: 80,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--brand-accent)',
      color: 'var(--blue-900)',
      fontWeight: 800,
      fontSize: 40,
      padding: '18px 44px',
      borderRadius: 999
    }
  }, "Inscribite ahora"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 30,
      color: 'var(--blue-100)'
    }
  }, "WhatsApp 11 6105-6018")));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/piezas_sociales/PostInfo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio_institucional/ContactScreen.jsx
try { (() => {
const {
  Card,
  SectionHeading,
  InfoList,
  Button,
  Icon,
  Callout,
  Input
} = window.CFP401AvellanedaDesignSystem_6c39ff;
const WHATSAPP_URL_CONTACTO = 'https://wa.me/541161056018?text=Hola!%20Estoy%20interesad@%20en%20los%20cursos%20de%20Formaci%C3%B3n%20Profesional.';
const MAPS_URL_CONTACTO = 'https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';
function ContactScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Contacto",
    title: "Estamos en Dock Sud, Avellaneda",
    subtitle: "Pod\xE9s escribirnos por WhatsApp o acercarte directamente a la sede en el horario de atenci\xF3n."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-8)"
  }, /*#__PURE__*/React.createElement(InfoList, {
    items: [{
      label: 'Sede:',
      value: /*#__PURE__*/React.createElement("a", {
        href: MAPS_URL_CONTACTO,
        target: "_blank",
        rel: "noopener"
      }, "Juan Pablo Angulo 1272, Dock Sud, Avellaneda")
    }, {
      label: 'Anexo:',
      value: 'Polideportivo Plaza Renunciamiento — Irala y Argentino Valle'
    }, {
      label: 'Atención:',
      value: 'lunes a viernes de 10 a 19 hs'
    }, {
      label: 'WhatsApp:',
      value: '11 6105-6018 (solo mensajes)'
    }, {
      label: 'Web:',
      value: 'www.cfp401avellaneda.com.ar'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    href: WHATSAPP_URL_CONTACTO,
    target: "_blank",
    rel: "noopener",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 18
    })
  }, "Escribir por WhatsApp"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    href: MAPS_URL_CONTACTO,
    target: "_blank",
    rel: "noopener",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 18
    })
  }, "Ver en el mapa"))), /*#__PURE__*/React.createElement("a", {
    href: MAPS_URL_CONTACTO,
    target: "_blank",
    rel: "noopener",
    style: {
      display: 'block',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mapa-cfp401.png",
    alt: "Mapa de ubicaci\xF3n del CFP N\xB0 401 en Dock Sud, Avellaneda",
    style: {
      width: '100%',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--surface-card)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--brand-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "external-link",
    size: 16
  }), "Abrir en Google Maps"))), /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 'var(--space-10) 0 0'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/fachada-cfp401.jpg",
    alt: "Fachada de la sede de J. P. Angulo 1272, Dock Sud",
    style: {
      width: '100%',
      aspectRatio: '2048/480',
      objectFit: 'cover',
      display: 'block',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)'
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "La sede de Juan Pablo Angulo 1272, Dock Sud, Avellaneda.")));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio_institucional/ContactScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio_institucional/CoursesScreen.jsx
try { (() => {
const {
  Button,
  Badge,
  Card,
  SectionHeading,
  Icon,
  Select,
  Input,
  CourseTable,
  Tabs,
  Callout
} = window.CFP401AvellanedaDesignSystem_6c39ff;
const MAPS_URL_CURSOS = 'https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';
function CoursesScreen({
  onNavigate,
  onInscripcion
}) {
  const all = window.CFP_DATA.courses;
  const familias = ['Todas', ...Array.from(new Set(all.map(c => c.familia)))];
  const [fam, setFam] = React.useState('Todas');
  const [q, setQ] = React.useState('');
  const [view, setView] = React.useState('Tarjetas');
  const rows = all.filter(c => (fam === 'Todas' || c.familia === fam) && c.curso.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Oferta formativa",
    title: "Cursos gratuitos con certificaci\xF3n oficial",
    subtitle: "Todos los cursos se dictan en la sede de Juan Pablo Angulo 1272, Dock Sud, salvo donde se indique un anexo."
  }), /*#__PURE__*/React.createElement(Callout, {
    tone: "info",
    title: "Inscripciones cerradas por el momento",
    style: {
      marginTop: 'var(--space-8)'
    }
  }, "Las cursadas est\xE1n en marcha. Hay dos per\xEDodos de inscripci\xF3n por a\xF1o: de diciembre a febrero para los cursos que comienzan en marzo, y durante junio y julio para los que comienzan en agosto. ", /*#__PURE__*/React.createElement("a", {
    onClick: onInscripcion,
    style: {
      cursor: 'pointer',
      fontWeight: 600
    }
  }, "Ver c\xF3mo inscribirte"), "."), /*#__PURE__*/React.createElement(Callout, {
    tone: "accent",
    title: "Requisito general",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "Presentar 4 fotocopias del DNI y la constancia de estudios requerida por el curso."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-end',
      marginTop: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Buscar curso",
    placeholder: "Soldador, inform\xE1tica\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      flex: '1 1 280px'
    }
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Familia profesional",
    options: familias,
    value: fam,
    onChange: e => setFam(e.target.value),
    style: {
      flex: '0 0 260px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: ['Tarjetas', 'Tabla'],
    active: view,
    onChange: setView
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, view === 'Tabla' ? /*#__PURE__*/React.createElement(CourseTable, {
    rows: rows.map(c => ({
      curso: c.curso,
      horarios: c.horarios,
      sede: c.sede,
      requisitos: c.requisitos
    }))
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 'var(--space-6)'
    }
  }, rows.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.curso,
    accentBar: true,
    hoverable: true,
    padding: "var(--space-6)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 21,
      flex: 1,
      lineHeight: 1.2
    }
  }, c.curso), /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, c.familia)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-4)',
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16,
    color: "var(--brand-primary)"
  }), c.horarios)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-2)',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 16,
    color: "var(--brand-primary)"
  }), c.sede), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-check",
    size: 16,
    color: "var(--brand-primary)"
  }), c.requisitos)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Cursada en marcha"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, c.duracion), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    style: {
      marginLeft: 'auto'
    },
    onClick: onInscripcion
  }, "C\xF3mo inscribirme")))))), rows.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-8)',
      color: 'var(--text-muted)'
    }
  }, "No encontramos cursos con ese filtro. Prob\xE1 con otra familia profesional."));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio_institucional/CoursesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio_institucional/EnrollScreen.jsx
try { (() => {
/* DESHABILITADO — las inscripciones están cerradas. Esta pantalla no tiene ruta en index.html.
   Reactivar agregando <script type="text/babel" src="EnrollScreen.jsx"></script> y la ruta
   {page==='Inscripción'&&<EnrollScreen .../>} cuando abra el próximo período. */
const {
  Button,
  Card,
  SectionHeading,
  Input,
  Select,
  Checkbox,
  Radio,
  Field,
  Callout,
  InfoList,
  Alert,
  Modal,
  Icon
} = window.CFP401AvellanedaDesignSystem_6c39ff;
function EnrollScreen({
  onNavigate
}) {
  const all = window.CFP_DATA.courses;
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    nombre: '',
    dni: '',
    tel: '',
    curso: all[0].curso,
    turno: 'Tarde',
    dniOk: false,
    constancia: false
  });
  const [modal, setModal] = React.useState(false);
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const steps = ['Tus datos', 'Curso y turno', 'Documentación'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Preinscripci\xF3n",
    title: "Reserv\xE1 tu lugar en 3 pasos",
    subtitle: "La preinscripci\xF3n no reemplaza el tr\xE1mite presencial: te esperamos en la sede con tu documentaci\xF3n."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      margin: 'var(--space-8) 0'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: i < step ? 'var(--brand-accent)' : 'var(--neutral-100)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      color: i < step ? 'var(--brand-primary)' : 'var(--text-muted)'
    }
  }, i + 1, ". ", s)))), /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-8)"
  }, step === 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre y apellido",
    required: true,
    value: form.nombre,
    onChange: e => set('nombre', e.target.value),
    placeholder: "Como figura en el DNI"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "DNI",
    required: true,
    value: form.dni,
    onChange: e => set('dni', e.target.value),
    hint: "Sin puntos"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Tel\xE9fono / WhatsApp",
    value: form.tel,
    onChange: e => set('tel', e.target.value),
    placeholder: "11 6105-6018"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Correo electr\xF3nico",
    type: "email",
    placeholder: "nombre@correo.com"
  })), step === 2 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Curso",
    options: all.map(c => c.curso),
    value: form.curso,
    onChange: e => set('curso', e.target.value),
    hint: all.find(c => c.curso === form.curso).horarios
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Turno de preferencia",
    hint: "Los horarios definitivos se confirman en la sede."
  }, /*#__PURE__*/React.createElement(Radio, {
    label: "Ma\xF1ana",
    checked: form.turno === 'Mañana',
    onChange: () => set('turno', 'Mañana')
  }), /*#__PURE__*/React.createElement(Radio, {
    label: "Tarde",
    checked: form.turno === 'Tarde',
    onChange: () => set('turno', 'Tarde')
  }), /*#__PURE__*/React.createElement(Radio, {
    label: "Noche",
    checked: form.turno === 'Noche',
    onChange: () => set('turno', 'Noche')
  })), /*#__PURE__*/React.createElement(Callout, {
    tone: "info",
    title: "Requisitos del curso"
  }, all.find(c => c.curso === form.curso).requisitos)), step === 3 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Confirm\xE1 que vas a presentar:"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "4 fotocopias del DNI",
    checked: form.dniOk,
    onChange: v => set('dniOk', v)
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Constancia de estudios requerida",
    checked: form.constancia,
    onChange: v => set('constancia', v)
  })), !(form.dniOk && form.constancia) && /*#__PURE__*/React.createElement(Alert, {
    tone: "warning"
  }, "Necesit\xE1s confirmar ambos requisitos para enviar la preinscripci\xF3n."), /*#__PURE__*/React.createElement(InfoList, {
    items: [{
      label: 'Sede:',
      value: 'Juan Pablo Angulo 1272, Dock Sud'
    }, {
      label: 'Horario de inscripción:',
      value: 'lunes a viernes de 10 a 19 hs'
    }, {
      label: 'Consultas:',
      value: 'WhatsApp 11 6105-6018 (solo mensajes)'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-8)'
    }
  }, step > 1 && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setStep(step - 1),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 18
    })
  }, "Atr\xE1s"), step < 3 ? /*#__PURE__*/React.createElement(Button, {
    style: {
      marginLeft: 'auto'
    },
    onClick: () => setStep(step + 1),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Continuar") : /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    style: {
      marginLeft: 'auto'
    },
    disabled: !(form.dniOk && form.constancia),
    onClick: () => setModal(true)
  }, "Enviar preinscripci\xF3n"))), /*#__PURE__*/React.createElement(Modal, {
    open: modal,
    title: "\xA1Listo! Tu preinscripci\xF3n fue registrada",
    onClose: () => setModal(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setModal(false)
    }, "Cerrar"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      onClick: () => {
        setModal(false);
        onNavigate('Campus');
      }
    }, "Ir al Campus Virtual"))
  }, "Guardamos tu lugar en ", /*#__PURE__*/React.createElement("strong", null, form.curso), " (", form.turno, "). Acercate a la sede con tu documentaci\xF3n de lunes a viernes de 10 a 19 hs."));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio_institucional/EnrollScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio_institucional/HomeScreen.jsx
try { (() => {
const {
  Button,
  Badge,
  Card,
  SectionHeading,
  Logo,
  Icon,
  InfoList,
  Callout,
  StatBlock,
  Hero,
  CourseCard
} = window.CFP401AvellanedaDesignSystem_6c39ff;
const WHATSAPP_URL = 'https://wa.me/541161056018?text=Hola!%20Estoy%20interesad@%20en%20los%20cursos%20de%20Formaci%C3%B3n%20Profesional.';
const MAPS_URL = 'https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';
function HomeScreen({
  onNavigate,
  onInscripcion
}) {
  const courses = window.CFP_DATA.courses;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    overline: "Es tu tiempo de aprender",
    title: "Estudi\xE1 con nosotros",
    subtitle: "Cursos presenciales sin costo de inscripci\xF3n ni de cursada, con certificado de la Direcci\xF3n General de Cultura y Educaci\xF3n de la Provincia de Buenos Aires.",
    primaryCta: {
      label: 'Ver los cursos',
      onClick: () => onNavigate('Cursos')
    },
    secondaryCta: {
      label: 'Cómo inscribirme',
      onClick: onInscripcion
    },
    assetBase: "../../assets"
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-accent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '18px var(--gutter)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 18,
      color: 'var(--text-on-accent)'
    }
  }, "Nuevas inscripciones A PARTIR DE NOVIEMBRE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      color: 'var(--blue-900)'
    }
  }, "Lunes a viernes de 10 a 19 hs \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: MAPS_URL,
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'var(--blue-900)',
      textDecoration: 'underline'
    }
  }, "Juan Pablo Angulo 1272, Dock Sud")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    style: {
      marginLeft: 'auto'
    },
    onClick: onInscripcion
  }, "Quiero inscribirme"))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Nuestra propuesta",
    title: "Aprendizajes que transforman",
    subtitle: "Porque aprender tambi\xE9n es construir futuro. Nuestros talleres funcionan con equipamiento real y docentes de oficio.",
    align: "center"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-10)'
    }
  }, [['graduation-cap', 'Títulos oficiales', 'Certificación oficial de la Provincia de Buenos Aires.'], ['wallet', '100% gratuito', 'Sin costo de inscripción ni de cursada: solo necesitás la documentación pedida.'], ['wrench', 'Talleres equipados', 'Prácticas en herrería, soldadura, electricidad, sanitarios y gas.']].map(([ic, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    accentBar: true
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 28,
    color: "var(--brand-primary)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      margin: 'var(--space-4) 0 var(--space-2)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-muted)'
    }
  }, d))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Oferta formativa",
    title: "Nuestros cursos"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNavigate('Cursos'),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, `Ver los ${courses.length} cursos`)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-8)'
    }
  }, courses.slice(0, 6).map(c => /*#__PURE__*/React.createElement(CourseCard, {
    key: c.curso,
    title: c.curso,
    schedule: c.horarios,
    duration: c.duracion,
    requirements: c.requisitos,
    location: c.sede,
    status: "Cursada en marcha",
    onAction: () => onNavigate('Cursos')
  }))))), /*#__PURE__*/React.createElement("section", {
    id: "como-inscribirte",
    style: {
      background: 'var(--surface-inverse)',
      color: '#fff',
      scrollMarginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-y) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    invert: true,
    overline: "C\xF3mo inscribirte",
    title: "Acercate a la sede con tu documentaci\xF3n"
  }), /*#__PURE__*/React.createElement(InfoList, {
    invert: true,
    style: {
      marginTop: 'var(--space-6)'
    },
    items: [{
      label: '4 fotocopias del DNI',
      value: ''
    }, {
      label: 'Constancia de estudios',
      value: 'según el curso elegido'
    }, {
      label: 'Lunes a viernes',
      value: 'de 10 a 19 hs'
    }, {
      label: 'Consultas por WhatsApp',
      value: '11 6105-6018 (solo mensajes)'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)',
      paddingTop: 'var(--space-6)',
      borderTop: '1px solid rgba(255,255,255,.18)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--brand-accent)',
      margin: 0
    }
  }, "Cu\xE1ndo abren las inscripciones"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-3) 0 0',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--blue-100)',
      maxWidth: 520
    }
  }, "Hay dos per\xEDodos por a\xF1o: de diciembre a febrero para los cursos que comienzan en marzo, y durante junio y julio para los que comienzan en agosto.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)',
      display: 'flex',
      gap: 'var(--space-4)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    href: WHATSAPP_URL,
    target: "_blank",
    rel: "noopener",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 20
    })
  }, "Pre-Inscripci\xF3n"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,.5)'
    },
    onClick: () => onNavigate('Campus')
  }, "Ir al Campus"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-8)',
      alignContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    invert: true,
    value: courses.length,
    label: "Cursos gratuitos con certificaci\xF3n oficial"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    invert: true,
    value: "+45",
    label: "A\xF1os formando oficios en Dock Sud"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    invert: true,
    value: "1979",
    label: "A\xF1o de creaci\xF3n del Centro"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    invert: true,
    value: "6",
    label: "Familias profesionales"
  })))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio_institucional/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio_institucional/NosotrosScreen.jsx
try { (() => {
const {
  Card,
  SectionHeading,
  StatBlock,
  Callout,
  Icon,
  Button
} = window.CFP401AvellanedaDesignSystem_6c39ff;
const P_NOSOTROS = {
  margin: '0 0 var(--space-5)',
  fontSize: 17,
  lineHeight: 1.7,
  color: 'var(--text-body)',
  textWrap: 'pretty'
};
function Foto({
  src,
  caption,
  ratio,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      background: 'var(--neutral-100)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: caption,
    style: {
      width: '100%',
      aspectRatio: ratio,
      objectFit: 'cover',
      display: 'block'
    }
  })), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)',
      fontSize: 13,
      lineHeight: 1.5,
      color: 'var(--text-muted)'
    }
  }, caption));
}
function NosotrosScreen({
  onInscripcion
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--brand-primary)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/fachada-cfp401.jpg",
    alt: "Fachada del CFP N\xB0 401 en Juan Pablo Angulo 1272, Dock Sud",
    style: {
      width: '100%',
      height: 'clamp(220px,32vw,380px)',
      objectFit: 'cover',
      display: 'block',
      opacity: .92
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg,rgba(0,45,98,.92) 0%,rgba(0,45,98,.72) 42%,rgba(0,45,98,0) 78%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      width: '100%',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-accent)',
      marginBottom: 'var(--space-3)'
    }
  }, "Nosotros"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'clamp(28px,3.4vw,46px)',
      lineHeight: 1.1,
      fontWeight: 800,
      letterSpacing: '-.02em',
      color: '#fff'
    }
  }, "M\xE1s de cuatro d\xE9cadas formando trabajadores"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: 'var(--space-6)',
      marginBottom: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "1979",
    label: "A\xF1o de creaci\xF3n"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "+2.300",
    label: "Cursos dictados"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "+24.000",
    label: "Egresados con certificado"
  })), /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Historia institucional",
    title: "De la Unidad de Formaci\xF3n Profesional N\xB0 13 al CFP N\xB0 401",
    subtitle: "El Establecimiento fue creado como Unidad de Formaci\xF3n Profesional N\xBA 13 el 10 de agosto de 1979. Su radicaci\xF3n en el distrito de Avellaneda se produjo por disposici\xF3n de la Direcci\xF3n de Educaci\xF3n Media, T\xE9cnica y Formaci\xF3n Profesional el 22 de agosto de 1979."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 'var(--space-10)',
      marginTop: 'var(--space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: P_NOSOTROS
  }, "En abril de 1985 cambi\xF3 su denominaci\xF3n a Centro de Formaci\xF3n Profesional N\xBA 13."), /*#__PURE__*/React.createElement("p", {
    style: P_NOSOTROS
  }, "Luego de estar dictando cursos en la Escuela Primaria N\xBA 11 en la Av. Roca y Manuel Est\xE9vez, y de intensas gestiones efectuadas por parte de los directivos, se le otorga en el a\xF1o 1986 el espacio que ocupa actualmente, ya estando a cargo del servicio educativo el Prof. Tranquillo Roberto como Director."), /*#__PURE__*/React.createElement("p", {
    style: P_NOSOTROS
  }, "Cabe consignar que este nuevo edificio est\xE1 ubicado en la calle J. P. Angulo 1272 de la localidad de Dock Sud, siendo propiedad de la D.G.C. y E. En \xE9l funcion\xF3 un servicio de Escuela Primaria hasta el a\xF1o 1979, a partir del cual fue dado de baja al ser considerado inhabitable por el estado de deterioro total de su infraestructura.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: P_NOSOTROS
  }, "Convencidos de nuestra labor y de la importancia que la misma tiene al servicio de la comunidad, inmediatamente se iniciaron las tareas de reacondicionamiento, colaborando en dicha empresa todo el personal del establecimiento. As\xED, en poco tiempo se pudieron habilitar los servicios sanitarios y las aulas existentes, a los que se les sum\xF3 la reconstrucci\xF3n de aulas. Con enorme trabajo y esfuerzo se consigui\xF3 este cometido ya en julio de 1987."), /*#__PURE__*/React.createElement("p", {
    style: P_NOSOTROS
  }, "En 1994 la Provincia de Buenos Aires reenumer\xF3 los servicios educativos por distrito y el Centro pas\xF3 a denominarse C.F.P. N\xBA 401 de Avellaneda."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...P_NOSOTROS,
      marginBottom: 0
    }
  }, "Desde su creaci\xF3n y hasta la fecha se aprecia que, con el esfuerzo realizado, los logros obtenidos en los \xE1mbitos educativos, sociales y edilicios fueron determinantes. Se destaca que desde su creaci\xF3n hasta el a\xF1o pr\xF3ximo pasado se han dictado m\xE1s de 2.300 cursos, que han logrado una cantidad de certificados en m\xE1s de 24.000 egresados, cursando una extensa lista de especialidades."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Foto, {
    src: "../../assets/historia-obra-1.jpg",
    ratio: "1280/320",
    caption: "El edificio de J. P. Angulo 1272 al momento de recibirlo, antes de las tareas de reacondicionamiento encaradas por el personal del establecimiento."
  }), /*#__PURE__*/React.createElement(Foto, {
    src: "../../assets/historia-obra-2.jpg",
    ratio: "1280/260",
    caption: "Patio y aulas en reconstrucci\xF3n: los trabajos se completaron en julio de 1987."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: 'var(--space-16) 0'
    }
  }), /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Objetivos generales del Centro",
    title: "Formaci\xF3n con t\xEDtulo oficial, al servicio del trabajo"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 'var(--space-10)',
      marginTop: 'var(--space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: P_NOSOTROS
  }, "El Centro de Formaci\xF3n Profesional 401 tiene entre sus objetivos impulsar y colaborar en la reinserci\xF3n laboral, la reconversi\xF3n de mano de obra y la capacitaci\xF3n continua, para un mejor desarrollo profesional y personal de quienes enfrentan el desaf\xEDo del competitivo mercado laboral."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...P_NOSOTROS,
      marginBottom: 0
    }
  }, "Siendo una Escuela de Formaci\xF3n de Adultos de la Provincia de Buenos Aires, nuestros cursos cuentan con el aval que brindan los Dise\xF1os Curriculares del Consejo Federal de Educaci\xF3n para cada curso, y el otorgamiento de T\xEDtulos Oficiales de la Direcci\xF3n de Cultura y Educaci\xF3n de la Provincia de Buenos Aires.")), /*#__PURE__*/React.createElement(Card, {
    accentBar: true,
    padding: "var(--space-8)"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "handshake",
    size: 26,
    style: {
      color: 'var(--brand-primary)'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 'var(--space-4) 0 var(--space-3)',
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      lineHeight: 1.25,
      fontWeight: 700,
      color: 'var(--text-title)'
    }
  }, "Red de CFP de Trabajadores de la Construcci\xF3n"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...P_NOSOTROS,
      fontSize: 16,
      marginBottom: 0
    }
  }, "El CFP 401 de Avellaneda forma parte de la Red de Centros de Formaci\xF3n Profesional de Trabajadores de la Construcci\xF3n, con convenio con la Fundaci\xF3n de Educaci\xF3n y Capacitaci\xF3n de Trabajadores de la Construcci\xF3n \u2014 Centro de Formaci\xF3n Continua, que asiste con los adelantos tecnol\xF3gicos en equipamiento y actualizaci\xF3n docente en forma activa."))), /*#__PURE__*/React.createElement(Callout, {
    tone: "accent",
    title: "Cursos abiertos a la comunidad",
    style: {
      marginTop: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-5)',
      fontSize: 16,
      lineHeight: 1.6
    }
  }, "Todos nuestros cursos son gratuitos y otorgan t\xEDtulo oficial de la Provincia de Buenos Aires."), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    onClick: onInscripcion,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "clipboard-list",
      size: 18
    })
  }, "C\xF3mo inscribirme"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio_institucional/NosotrosScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sitio_institucional/data.js
try { (() => {
window.CFP_DATA = {
  courses: [{
    curso: 'Sueldos y Jornales',
    horarios: 'Lunes a viernes de 9:10 a 12:30 hs · de 18:00 a 21:30 hs',
    sede: 'Anexo Polideportivo Plaza Renunciamiento / Sede Juan Pablo Angulo 1272',
    requisitos: 'Estudios secundarios o superiores',
    duracion: '1 año',
    familia: 'Administración'
  }, {
    curso: 'Operador de Informática de Oficina (Operador de PC)',
    horarios: 'Martes y jueves de 13:50 a 16:50 hs · Martes y viernes de 18:00 a 21:10 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios, secundarios o superiores',
    duracion: '1 año',
    familia: 'Informática'
  }, {
    curso: 'Instalador y Soportes de Sistemas Informáticos (Reparador de PC)',
    horarios: 'Lunes, miércoles y viernes de 13:50 a 16:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios, secundarios o superiores',
    duracion: '1 año',
    familia: 'Informática'
  }, {
    curso: 'Diseño Gráfico II / Diseño de Página Web',
    horarios: 'Lunes y miércoles de 9:50 a 12:30 hs · de 13:10 a 17:10 hs · de 18:00 a 21:10 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios y/o Operador de PC',
    duracion: '1 año',
    familia: 'Informática'
  }, {
    curso: 'Creador de contenido audiovisual para redes sociales',
    horarios: 'Martes a viernes de 9:10 a 12:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '4 meses',
    familia: 'Informática'
  }, {
    curso: 'Montador electricista',
    horarios: 'Lunes, martes, jueves y viernes de 13:30 a 17:00 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Electricidad'
  }, {
    curso: 'Instalador de Sistemas Domóticos y Robótica y Automatización',
    horarios: 'Lunes, miércoles y viernes de 18:00 a 21:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Electricista en inmuebles · 1 fotocopia de estudios',
    duracion: '1 año',
    familia: 'Electricidad'
  }, {
    curso: 'Montador de Instalaciones Sanitarias y de Gas',
    horarios: 'Lunes, martes, miércoles y viernes de 13:30 a 17:00 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Construcción'
  }, {
    curso: 'Reparador de Aire Acondicionado (acreditación de módulos)',
    horarios: 'Lunes, martes, miércoles y viernes de 18:00 a 21:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: '3° año del secundario o EGB',
    duracion: '1 año',
    familia: 'Construcción'
  }, {
    curso: 'Mantenimiento de Edificio',
    horarios: 'Lunes, martes y jueves de 9 a 13 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Construcción'
  }, {
    curso: 'Herrería y Carpintería Metálica',
    horarios: 'Lunes a viernes de 18:00 a 21:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Metalmecánica'
  }, {
    curso: 'Soldador Básico',
    horarios: 'Martes y jueves de 17:50 a 21:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Metalmecánica'
  }, {
    curso: 'Soldador MIG-TIG',
    horarios: 'Lunes, miércoles y viernes de 17:50 a 21:50 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Metalmecánica'
  }, {
    curso: 'Colocador de Paneles y Placas de Yeso',
    horarios: 'Lunes y miércoles de 13:15 a 17:15 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Construcción'
  }, {
    curso: 'Instalador y Reparador de Aire Acondicionado',
    horarios: 'Lunes, miércoles y viernes de 9:30 a 12:40 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios primarios o superiores',
    duracion: '1 año',
    familia: 'Construcción'
  }, {
    curso: 'Auxiliar Contable y Liquidación de Sueldos',
    horarios: 'Lunes, miércoles y viernes de 9:10 a 12:30 hs',
    sede: 'Sede Juan Pablo Angulo 1272, Dock Sud',
    requisitos: 'Estudios secundarios o superiores',
    duracion: '1 año',
    familia: 'Administración'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sitio_institucional/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.CourseCard = __ds_scope.CourseCard;

__ds_ns.CourseTable = __ds_scope.CourseTable;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.InfoList = __ds_scope.InfoList;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SideNav = __ds_scope.SideNav;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
