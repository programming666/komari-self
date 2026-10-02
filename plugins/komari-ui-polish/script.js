/**
 * Komari UI Polish — plugin entry.
 *
 * GENERATED FILE — do not edit. Built from src/entry.js and src/ui-polish.css
 * by scripts/build-plugin.mjs; run that script after changing either source.
 */

"use strict";

// The stylesheet, embedded so the plugin needs no filesystem or Node.js access.
var STYLESHEET = "/* ==========================================================================\n   Komari UI Polish — injected style layer\n   --------------------------------------------------------------------------\n   Loaded by the ui-polish plugin through server.injectHTML(), so it lands at\n   the end of <head> and therefore wins over the bundle stylesheet for equal\n   specificity. It touches appearance only: colour, elevation, radius, motion,\n   scrollbars. No layout logic, behaviour or API surface is changed.\n\n   The file is split into named sections marked with\n       /* @section:name *\\/\n   script.js concatenates only the enabled ones (see the plugin's config page).\n   Everything outside a marker belongs to \"core\", which is always included.\n\n   Radix paints a Card's background and its 1px ring with ::before / ::after,\n   so corner radii and tints go through the card's own custom properties\n   (--base-card-border-radius, --base-card-surface-box-shadow) instead of the\n   element's border-radius / background — otherwise the inner layers keep the\n   old geometry and the corners break.\n   ========================================================================== */\n\n/* @section:core */\n\n/* --------------------------------------------------------------------------\n   Design tokens\n   -------------------------------------------------------------------------- */\n:root {\n  /* Elevation: cool slate in light mode, pure black in dark mode. */\n  --km-shadow-rgb: 15 23 42;\n  --km-elevate-1:\n    0 1px 2px rgb(var(--km-shadow-rgb) / 0.06),\n    0 1px 3px rgb(var(--km-shadow-rgb) / 0.05);\n  --km-elevate-2:\n    0 6px 18px -8px rgb(var(--km-shadow-rgb) / 0.24),\n    0 2px 6px -3px rgb(var(--km-shadow-rgb) / 0.12);\n  --km-elevate-3:\n    0 22px 48px -20px rgb(var(--km-shadow-rgb) / 0.34),\n    0 8px 20px -10px rgb(var(--km-shadow-rgb) / 0.18);\n\n  /* Hairlines and translucent surfaces derived from the active accent scale. */\n  --km-hairline: color-mix(in oklab, var(--gray-12) 8%, transparent);\n  --km-hairline-strong: color-mix(in oklab, var(--gray-12) 15%, transparent);\n  --km-surface: var(--color-panel-solid, var(--gray-1));\n  --km-glass: color-mix(in oklab, var(--km-surface) 76%, transparent);\n\n  --km-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --km-dur: 220ms;\n}\n\n.dark {\n  --km-shadow-rgb: 0 0 0;\n  --km-hairline: color-mix(in oklab, var(--gray-12) 12%, transparent);\n  --km-hairline-strong: color-mix(in oklab, var(--gray-12) 20%, transparent);\n  --km-glass: color-mix(in oklab, var(--km-surface) 70%, transparent);\n}\n\n/* Softer container corners. --radius-factor is kept so the theme's own radius\n   setting (none / small / medium / large / full) still applies. */\n.theme-root {\n  --radius-4: var(--km-radius-4, calc(8px * var(--scaling) * var(--radius-factor, 1)));\n  --radius-5: var(--km-radius-5, calc(12px * var(--scaling) * var(--radius-factor, 1)));\n  --radius-6: var(--km-radius-6, calc(16px * var(--scaling) * var(--radius-factor, 1)));\n}\n\n/* Selection, focus ring and shared control transitions. */\n::selection {\n  background: color-mix(in oklab, var(--accent-9) 30%, transparent);\n}\n\n:focus-visible {\n  outline-color: color-mix(in oklab, var(--accent-9) 70%, transparent);\n}\n\n.rt-BaseButton,\n.rt-IconButton,\n.rt-TextFieldRoot,\n.rt-SelectTrigger,\n.rt-Badge {\n  transition:\n    background-color var(--km-dur) var(--km-ease),\n    box-shadow var(--km-dur) var(--km-ease),\n    color var(--km-dur) var(--km-ease),\n    transform var(--km-dur) var(--km-ease);\n}\n\n/* @section:numerals */\n/* Live metrics read far better with fixed-width digits. */\n.km-summary-card,\n.km-node-card,\n.km-usage-bar,\n.km-top-card,\n.km-details-item,\n.km-node-detail-row,\n.rt-TableRoot {\n  font-variant-numeric: tabular-nums;\n  font-feature-settings: \"tnum\" 1, \"cv01\" 1;\n}\n\n/* @section:ambient */\n/* --------------------------------------------------------------------------\n   Ambient page background\n   -------------------------------------------------------------------------- */\n/* The wash sits on the theme root so every layout — public and admin — gets it,\n   and it is viewport-anchored so short pages read the same. It follows whatever\n   accent colour the theme uses; the two alpha values come from the plugin\n   configuration. */\nhtml {\n  background: #fcfcfc;\n  color-scheme: light;\n}\n\nhtml.dark {\n  background: #111111;\n  color-scheme: dark;\n}\n\n.theme-root {\n  min-height: 100vh;\n  background-color: var(--gray-1);\n  background-image:\n    radial-gradient(\n      1400px 720px at 6% -16%,\n      color-mix(in oklab, var(--accent-9) var(--km-ambient-a1, 9%), transparent),\n      transparent 70%\n    ),\n    radial-gradient(\n      1100px 620px at 98% -8%,\n      color-mix(in oklab, var(--accent-9) var(--km-ambient-a2, 6%), transparent),\n      transparent 66%\n    );\n  background-attachment: fixed;\n  background-repeat: no-repeat;\n}\n\n.km-layout {\n  position: relative;\n}\n\n/* The wash is already painted by the theme root; staying transparent keeps a\n   user supplied background image on this element fully visible. */\n.km-layout.bg-accent-1 {\n  background-color: transparent;\n}\n\n.km-main {\n  padding-bottom: 1.5rem;\n}\n\n/* @section:glass */\n/* --------------------------------------------------------------------------\n   Navbar and toolbars\n   -------------------------------------------------------------------------- */\n.km-navbar {\n  position: sticky;\n  top: 0;\n  z-index: 60;\n  border-radius: 0 0 18px 18px;\n  border: 1px solid var(--km-hairline);\n  border-top: 0;\n  background: var(--km-glass);\n  backdrop-filter: blur(18px) saturate(1.6);\n  -webkit-backdrop-filter: blur(18px) saturate(1.6);\n  box-shadow: var(--km-elevate-1);\n}\n\n.km-navbar-brand > a > span {\n  background-image: linear-gradient(\n    100deg,\n    var(--accent-12),\n    var(--accent-10) 55%,\n    var(--accent-11)\n  );\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n  letter-spacing: -0.02em;\n}\n\n/* The stock navbar paints its subtitle with accent-4, a *background* step that\n   is nearly invisible on the panel. Use the readable text step instead. */\n.km-navbar-brand > div > span {\n  color: var(--accent-11) !important;\n  opacity: 0.9;\n  letter-spacing: 0.01em;\n}\n\n.km-navbar-controls > * {\n  transition: transform var(--km-dur) var(--km-ease);\n}\n\n.km-navbar-controls > *:hover {\n  transform: translateY(-1px);\n}\n\n/* Toolbar above the node grid */\n.km-node-display .control-bar {\n  border-radius: var(--km-radius-tile, 16px) !important;\n  border: 1px solid var(--km-hairline);\n  background: var(--km-glass);\n  backdrop-filter: blur(14px) saturate(1.4);\n  -webkit-backdrop-filter: blur(14px) saturate(1.4);\n  box-shadow: var(--km-elevate-1);\n}\n\n.km-footer {\n  border-top: 1px solid var(--km-hairline) !important;\n  background: color-mix(in oklab, var(--km-surface) 60%, transparent);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  opacity: 0.92;\n}\n\n.km-footer a {\n  color: var(--accent-11);\n  text-decoration: none;\n}\n\n.km-footer a:hover {\n  text-decoration: underline;\n}\n\n/* @section:elevation */\n/* --------------------------------------------------------------------------\n   Surfaces — cards, callouts, panels, overlays\n   -------------------------------------------------------------------------- */\n.rt-BaseCard {\n  --base-card-border-radius: var(--km-radius-tile, 12px);\n}\n\n.rt-BaseCard:where(.rt-variant-surface) {\n  box-shadow: var(--km-elevate-1);\n}\n\n.rt-BaseCard:where(.rt-variant-classic) {\n  box-shadow:\n    0 0 0 1px var(--km-hairline),\n    var(--km-elevate-2);\n}\n\n/* Summary strip on the home page */\n.km-summary-card {\n  --base-card-border-radius: var(--km-radius-card, 18px);\n  padding: 0.9rem !important;\n}\n\n.km-summary-card:where(.rt-variant-surface)::before {\n  background-image: linear-gradient(\n    140deg,\n    color-mix(in oklab, var(--accent-9) 9%, transparent),\n    transparent 55%\n  );\n}\n\n.km-top-card {\n  position: relative;\n  border-radius: var(--km-radius-tile, 14px);\n  padding: 0.7rem 0.9rem 0.6rem 1.05rem;\n  background: color-mix(in oklab, var(--gray-a3) 55%, transparent);\n  border: 1px solid var(--km-hairline);\n  overflow: hidden;\n  transition:\n    transform var(--km-dur) var(--km-ease),\n    border-color var(--km-dur) var(--km-ease),\n    box-shadow var(--km-dur) var(--km-ease);\n}\n\n.km-top-card::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 14%;\n  bottom: 14%;\n  width: 3px;\n  border-radius: 999px;\n  background: linear-gradient(\n    180deg,\n    var(--accent-9),\n    color-mix(in oklab, var(--accent-9) 25%, transparent)\n  );\n}\n\n.km-top-card:hover {\n  transform: translateY(-2px);\n  border-color: color-mix(in oklab, var(--accent-9) 30%, transparent);\n  box-shadow: var(--km-elevate-2);\n}\n\n.km-top-card > * > label:first-child {\n  font-size: 0.78rem;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n  opacity: 0.75;\n}\n\n.km-top-card > * > label:nth-child(2) {\n  font-size: 1.05rem;\n  font-weight: 600;\n  line-height: 1.5;\n}\n\n.km-callout {\n  border-radius: var(--km-radius-tile, 12px);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n}\n\n.km-setting-card {\n  border-radius: var(--km-radius-tile, 14px);\n}\n\n.km-details-section,\n.details-section {\n  border-radius: var(--km-radius-tile, 12px);\n  border: 1px solid var(--km-hairline);\n}\n\n.km-login-card {\n  --base-card-border-radius: var(--km-radius-card, 18px);\n  box-shadow: var(--km-elevate-3);\n}\n\n.km-login-page {\n  background-image:\n    radial-gradient(\n      900px 480px at 15% -10%,\n      color-mix(in oklab, var(--accent-9) 16%, transparent),\n      transparent 68%\n    ),\n    radial-gradient(\n      780px 440px at 92% 4%,\n      color-mix(in oklab, var(--accent-9) 10%, transparent),\n      transparent 66%\n    );\n}\n\n.rt-PopoverContent,\n.rt-SelectContent,\n.rt-DropdownMenuContent,\n.rt-HoverCardContent {\n  border-radius: var(--km-radius-tile, 14px);\n  border: 1px solid var(--km-hairline);\n  box-shadow: var(--km-elevate-3);\n}\n\n.rt-BaseDialogOverlay {\n  backdrop-filter: blur(6px) saturate(1.2);\n  -webkit-backdrop-filter: blur(6px) saturate(1.2);\n}\n\n/* Node cards */\n.km-node-card {\n  --base-card-border-radius: var(--km-radius-card, 16px);\n  --base-card-surface-box-shadow: 0 0 0 1px var(--km-hairline);\n  box-shadow: var(--km-elevate-1);\n}\n\n.km-node-card:where(.rt-variant-surface)::before {\n  background-image: linear-gradient(\n    165deg,\n    color-mix(in oklab, var(--accent-9) 7%, transparent),\n    transparent 46%\n  );\n}\n\n.km-node-card:hover {\n  transform: translateY(-3px);\n  --base-card-surface-box-shadow: 0 0 0 1px\n    color-mix(in oklab, var(--accent-9) 38%, transparent);\n  box-shadow: var(--km-elevate-3);\n}\n\n.km-node-card .km-node-name {\n  letter-spacing: -0.01em;\n}\n\n.km-node-status::before {\n  content: \"\";\n  display: inline-block;\n  width: 6px;\n  height: 6px;\n  margin-right: 5px;\n  border-radius: 999px;\n  background: currentColor;\n  vertical-align: middle;\n  opacity: 0.9;\n}\n\n.km-node-status.rt-variant-solid::before {\n  background: var(--accent-contrast);\n}\n\n/* Usage bars: the track is plain, the fill is a div with an inline\n   background-color and scaleX, so the gloss is layered over it. */\n.km-usage-bar-track {\n  background: color-mix(in oklab, var(--gray-12) 11%, transparent) !important;\n  box-shadow: inset 0 1px 2px rgb(var(--km-shadow-rgb) / 0.18);\n}\n\n.km-usage-bar-track > div {\n  position: relative;\n}\n\n.km-usage-bar-track > div::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background: linear-gradient(\n    180deg,\n    rgb(255 255 255 / 0.32),\n    rgb(255 255 255 / 0.06) 55%,\n    rgb(0 0 0 / 0.06)\n  );\n}\n\n/* @section:tables */\n/* --------------------------------------------------------------------------\n   Tables\n   -------------------------------------------------------------------------- */\n.rt-TableRoot {\n  border: 1px solid var(--km-hairline);\n  border-radius: var(--km-radius-tile, 14px);\n  background: var(--km-surface);\n  box-shadow: var(--km-elevate-1);\n}\n\n.rt-TableRootTable .rt-TableColumnHeaderCell {\n  background: color-mix(in oklab, var(--gray-a3) 80%, transparent);\n  font-weight: 600;\n  letter-spacing: 0.01em;\n}\n\n.rt-TableRootTable .rt-TableRow {\n  transition: background-color 140ms var(--km-ease);\n}\n\n/* The app's own table kit (components/ui/table.tsx). The table element and its\n   head carry inline colours, hence the !important overrides. */\n[data-slot=\"table-container\"] {\n  border: 1px solid var(--km-hairline);\n  border-radius: var(--km-radius-tile, 14px);\n  background: var(--km-surface);\n  box-shadow: var(--km-elevate-1);\n  scrollbar-color: var(--accent-7) transparent;\n}\n\n.km-ui-table {\n  background-color: transparent !important;\n}\n\n.km-ui-table [data-slot=\"table-head\"] {\n  background-color: color-mix(in oklab, var(--accent-9) 7%, transparent) !important;\n  border-bottom: 1px solid var(--km-hairline);\n}\n\n.km-ui-table-header th {\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  color: var(--gray-12);\n  white-space: nowrap;\n}\n\n.km-ui-table [data-slot=\"table-row\"] {\n  border-bottom: 1px solid var(--km-hairline);\n  transition: background-color 140ms var(--km-ease);\n}\n\n.km-ui-table [data-slot=\"table-row\"]:hover {\n  background-color: color-mix(in oklab, var(--accent-9) 6%, transparent);\n}\n\n.km-ui-table [data-slot=\"table-cell\"],\n.km-ui-table [data-slot=\"table-head\"] {\n  padding-top: 0.7rem;\n  padding-bottom: 0.7rem;\n}\n\n.expanded-row {\n  background-color: color-mix(in oklab, var(--accent-9) 7%, transparent) !important;\n}\n\n/* @section:adminShell */\n/* --------------------------------------------------------------------------\n   Admin shell\n   -------------------------------------------------------------------------- */\n/* AdminPanelBar paints opaque accent-1 / accent-3 fills on the shell and on its\n   single content child, both as inline styles — hence !important. Keeping them\n   transparent lets the shared ambient wash show through, so the admin pages\n   read like the public ones. */\n.km-admin-layout.km-admin-panel-bar {\n  background-color: transparent !important;\n}\n\n.km-admin-panel-content {\n  background-color: transparent !important;\n}\n\n.km-admin-panel-content > div {\n  background-color: transparent !important;\n}\n\n/* @section:scrollbar */\n/* --------------------------------------------------------------------------\n   Scrollbars\n   -------------------------------------------------------------------------- */\n::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n  background: transparent;\n}\n\n::-webkit-scrollbar-thumb {\n  background: color-mix(in oklab, var(--gray-12) 22%, transparent);\n  border-radius: 999px;\n  border: 3px solid transparent;\n  background-clip: padding-box;\n  transition: background-color var(--km-dur) var(--km-ease);\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: color-mix(in oklab, var(--accent-9) 60%, transparent);\n  background-clip: padding-box;\n}\n\nbody,\n* {\n  scrollbar-color: color-mix(in oklab, var(--gray-12) 22%, transparent) transparent;\n}\n\n/* @section:motion */\n/* --------------------------------------------------------------------------\n   Motion\n   -------------------------------------------------------------------------- */\n@keyframes km-rise {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n\n.km-node-list > *,\n.km-top-card {\n  animation: km-rise 320ms var(--km-ease) both;\n}\n\n.km-node-list > *:nth-child(2) {\n  animation-delay: 30ms;\n}\n\n.km-node-list > *:nth-child(3) {\n  animation-delay: 60ms;\n}\n\n.km-node-list > *:nth-child(4) {\n  animation-delay: 90ms;\n}\n\n.km-node-list > *:nth-child(5) {\n  animation-delay: 120ms;\n}\n\n.km-node-list > *:nth-child(6) {\n  animation-delay: 150ms;\n}\n\n/* @section:loader */\n/* --------------------------------------------------------------------------\n   Loading indicator\n   -------------------------------------------------------------------------- */\n/* The stock loader is a four-colour (red/blue/green/yellow) brand spinner that\n   clashes with the accent colour; this is a single-accent arc on a faint track,\n   centred in the viewport. */\n.km-loading {\n  min-height: 60vh;\n}\n\n.km-loading > p:first-of-type {\n  letter-spacing: -0.01em;\n  margin-bottom: 0.15rem;\n}\n\n.loader {\n  position: relative;\n  margin: 0 auto;\n  width: var(--loading-width, 88px);\n}\n\n.loader:before {\n  content: \"\";\n  display: block;\n  padding-top: 100%;\n}\n\n.showbox {\n  position: relative;\n  display: grid;\n  place-items: center;\n}\n\n.showbox::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: 999px;\n  border: 3px solid color-mix(in oklab, var(--gray-12) 13%, transparent);\n}\n\n.circular {\n  animation: rotate 1.8s linear infinite;\n  height: 100%;\n  transform-origin: center center;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n}\n\n.path {\n  stroke: var(--accent-9);\n  stroke-dasharray: 1, 200;\n  stroke-dashoffset: 0;\n  animation: dash 1.4s ease-in-out infinite;\n  stroke-linecap: round;\n}\n\n@keyframes rotate {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes dash {\n  0% {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0;\n  }\n  50% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -35px;\n  }\n  100% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -124px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .circular {\n    animation-duration: 4s;\n  }\n}\n\n/* --------------------------------------------------------------------------\n   Reduced motion — always on, regardless of the section switches.\n   -------------------------------------------------------------------------- */\n@media (prefers-reduced-motion: reduce) {\n  .km-node-list > *,\n  .km-top-card {\n    animation: none;\n  }\n\n  .km-node-card:hover,\n  .km-top-card:hover,\n  .km-navbar-controls > *:hover {\n    transform: none;\n  }\n}\n";

/**
 * Komari UI Polish — plugin entry script.
 *
 * The plugin owns one stylesheet, src/ui-polish.css, split into named sections.
 * On load, this script drops the sections the admin switched off, adds a small
 * token block derived from the remaining settings, and registers the result as
 * a <style> fragment that Komari injects at the end of <head> on every HTML
 * response.
 *
 * Because the fragment lands after the bundle stylesheet, the polish rules win
 * over the stock ones at equal specificity — no frontend build required.
 *
 * The stylesheet is embedded in this file as the STYLESHEET constant, which is
 * why the plugin needs no permissions beyond allowHTMLInject (no Node.js
 * runtime, no routes).
 *
 * === GENERATED FILE ===  Built from src/entry.js + src/ui-polish.css by
 * scripts/build-plugin.mjs — edit those two files and rebuild.
 */

// Strictness is declared by the generated wrapper's leading "use strict";

var server = require("server");
/**
 * The stylesheet to assemble: the STYLESHEET constant that the build step prepends
 * to this file from src/ui-polish.css.
 */

/** id of the injected <style>, so it is recognisable in devtools. */
var STYLE_ID = "komari-ui-polish";

/**
 * Sections that map 1:1 to an on/off setting on the plugin configuration page.
 * Anything not listed here (the "core" tokens) is always injected, because the
 * other sections build on it.
 */
var SWITCHES = [
  "numerals",
  "ambient",
  "glass",
  "elevation",
  "tables",
  "adminShell",
  "scrollbar",
  "motion",
  "loader",
];

/**
 * Radius per setting, in px at scaling 1 and radius-factor 1.
 *
 * `scale` is the override for the theme's own --radius-4/5/6 steps (absent for
 * "stock", which leaves the theme's values alone, so the theme's radius setting
 * keeps deciding). `tile` and `card` are the radii the polish layer gives its own
 * containers; for "stock" they are the theme's medium/large steps, so nothing is
 * exaggerated. Every emitted value still multiplies by --scaling and
 * --radius-factor, so the theme's radius and scaling settings keep working.
 */
var RADIUS = {
  soft: { scale: [10, 14, 19], tile: 14, card: 18 },
  round: { scale: [14, 20, 26], tile: 20, card: 24 },
  stock: { tile: 12, card: 16 },
};
/** Accent-wash alpha percentages (top-left blob, top-right blob). */
var AMBIENT = {
  subtle: [5, 3],
  standard: [9, 6],
  strong: [14, 9],
};

/** Matches the section markers in ui-polish.css. */
function sectionPattern() {
  return /\/\* @section:([a-zA-Z-]+) \*\//g;
}

/** Split the stylesheet into { sectionName: css }. The leading part is "core". */
function splitSections(css) {
  var re = sectionPattern();
  var sections = {};
  var current = "core";
  var cursor = 0;
  var match;

  sections.core = "";
  while ((match = re.exec(css)) !== null) {
    // Every section except "core" starts out undefined, so the accumulator has
    // to be defaulted here as well — otherwise the first rule of the section
    // would be prefixed with the string "undefined" and dropped by the parser.
    sections[current] = (sections[current] || "") + css.slice(cursor, match.index);
    current = match[1];
    cursor = match.index + match[0].length;
  }
  sections[current] = (sections[current] || "") + css.slice(cursor);

  return sections;
}

/** The --km-* values the enabled sections read. */
function tokenBlock(config) {
  var lines = [".theme-root {"];

  // "stock" is unknown here on purpose: it must not override --radius-4/5/6.
  var radius = RADIUS[String(config.radius)] || RADIUS.soft;
  var scale = radius.scale;
  if (scale) {
    lines.push(
      px("  --km-radius-4: ", scale[0]),
      px("  --km-radius-5: ", scale[1]),
      px("  --km-radius-6: ", scale[2]),
    );
  }
  lines.push(px("  --km-radius-tile: ", radius.tile), px("  --km-radius-card: ", radius.card));

  var ambient = AMBIENT[String(config.ambientIntensity)] || AMBIENT.standard;
  lines.push(
    "  --km-ambient-a1: " + ambient[0] + "%;",
    "  --km-ambient-a2: " + ambient[1] + "%;",
    "}",
  );

  return lines.join("\n");
}

/** One custom-property line: a px value scaled by the theme's scaling/factor. */
function px(prefix, value) {
  return prefix + "calc(" + value + "px * var(--scaling, 1) * var(--radius-factor, 1));";
}

/** Stylesheet for the current configuration. */
function buildCss(config) {
  var sections = splitSections(STYLESHEET);
  var parts = [tokenBlock(config), sections.core || ""];
  var enabled = [];

  for (var i = 0; i < SWITCHES.length; i++) {
    var name = SWITCHES[i];
    if (config[name] === false) continue;
    if (!sections[name]) continue;
    enabled.push(name);
    parts.push("/* section: " + name + " */\n" + sections[name]);
  }

  return { css: parts.join("\n"), enabled: enabled };
}

/** The <head> fragment handed to Komari. */
function buildHead(css) {
  return [
    '<style id="' + STYLE_ID + '" data-plugin="ui-polish">',
    css,
    "</style>",
    // Keep the mobile browser chrome in step with the painted background. A
    // theme that already set its own theme-color keeps winning, since the first
    // matching tag wins and ours is appended last.
    '<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)">',
  ].join("\n");
}

var registered = false;

/** Register the injection exactly once per load, config or defaults. */
function register(config) {
  if (registered) return;
  registered = true;

  try {
    var built = buildCss(config);
    server.injectHTML(buildHead(built.css), "");
    console.log(
      "[ui-polish] injected " + Math.round(built.css.length / 1024) + " KiB of CSS; sections: " +
        built.enabled.join(", "),
    );
  } catch (err) {
    // Never break the site over a stylesheet: log it and serve pages as-is.
    console.error("[ui-polish] failed to inject CSS:", err && err.message ? err.message : String(err));
  }
}

// The stored configuration arrives asynchronously; the injection is registered
// as soon as it lands (milliseconds after load). If reading it fails, the
// defaults from the manifest are used instead.
server.getConfig().then(register, function (err) {
  console.error("[ui-polish] could not read configuration, using defaults:",
    err && err.message ? err.message : String(err));
  register({});
});

function unload() {
  console.log("[ui-polish] unloaded");
}

