/**
 * Komari UI Polish — plugin entry.
 *
 * GENERATED FILE — do not edit. Built from src/entry.js and src/ui-polish.css
 * by scripts/build-plugin.mjs; run that script after changing either source.
 */

"use strict";

// The stylesheet, embedded so the plugin needs no filesystem or Node.js access.
var STYLESHEET = "/* ==========================================================================\n   Komari UI Polish — injected style layer  (v1.1 — \"aurora\")\n   --------------------------------------------------------------------------\n   Loaded by the ui-polish plugin through server.injectHTML(), so it lands at the\n   end of <head> and therefore wins over the bundle stylesheet at equal\n   specificity. It touches appearance only: colour, elevation, radius, motion,\n   scrollbars, and one backdrop. No layout logic, behaviour or API surface is\n   changed.\n\n   The file is split into named sections marked with\n       /* @section:name *\\/\n   script.js concatenates only the enabled ones (see the plugin's config page).\n   The text before the first marker is \"core\", which is always included.\n\n   Two Radix details shape the rules below:\n     * a Card paints its background and its 1px ring with ::before / ::after, so\n       corner radii and tints go through the card's own custom properties\n       (--base-card-border-radius, --base-card-surface-box-shadow) instead of the\n       element's border-radius / background — otherwise the inner layers keep the\n       old geometry and the corners break.\n     * the theme's colour variables (--accent-9, --gray-1, …) are defined *on*\n       .theme-root, so anything that paints accent colour has to live inside it.\n       That is why the backdrop is drawn on .theme-root::before / ::after and\n       .km-layout::before / ::after — pseudo-elements inherit those variables —\n       rather than on a layer appended to <body>, which would inherit nothing.\n   ========================================================================== */\n\n/* @section:core */\n\n/* --------------------------------------------------------------------------\n   Design tokens\n   -------------------------------------------------------------------------- */\n:root {\n  /* Elevation: cool slate in light mode, pure black in dark mode. */\n  --km-shadow-rgb: 15 23 42;\n  --km-elevate-1:\n    0 1px 2px rgb(var(--km-shadow-rgb) / 0.06),\n    0 1px 3px rgb(var(--km-shadow-rgb) / 0.05);\n  --km-elevate-2:\n    0 6px 18px -8px rgb(var(--km-shadow-rgb) / 0.24),\n    0 2px 6px -3px rgb(var(--km-shadow-rgb) / 0.12);\n  --km-elevate-3:\n    0 22px 48px -20px rgb(var(--km-shadow-rgb) / 0.34),\n    0 8px 20px -10px rgb(var(--km-shadow-rgb) / 0.18);\n\n  /* Hairlines, translucent surfaces, and the inner top highlight that gives flat\n     panels a little depth. */\n  --km-hairline: color-mix(in oklab, var(--gray-12) 8%, transparent);\n  --km-hairline-strong: color-mix(in oklab, var(--gray-12) 15%, transparent);\n  --km-highlight: rgb(255 255 255 / 0.55);\n  --km-glass: color-mix(in oklab, var(--color-panel-solid, var(--gray-1)) 74%, transparent);\n\n  --km-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --km-dur: 220ms;\n\n  /* Geometry, filled in from the plugin configuration. */\n  --km-radius-tile: 14px;\n  --km-radius-card: 16px;\n  --km-radius-chrome: 16px;\n  --km-pad: 0.9rem;\n  --km-gap: 1rem;\n}\n\n.dark {\n  --km-shadow-rgb: 0 0 0;\n  --km-hairline: color-mix(in oklab, var(--gray-12) 14%, transparent);\n  --km-hairline-strong: color-mix(in oklab, var(--gray-12) 22%, transparent);\n  --km-highlight: rgb(255 255 255 / 0.07);\n  --km-glass: color-mix(in oklab, var(--color-panel-solid, var(--gray-2)) 68%, transparent);\n}\n\n/* Softer container corners. --radius-factor is kept so the theme's own radius\n   setting (none / small / medium / large / full) still applies. */\n.theme-root {\n  --radius-4: var(--km-radius-4, calc(8px * var(--scaling) * var(--radius-factor, 1)));\n  --radius-5: var(--km-radius-5, calc(12px * var(--scaling) * var(--radius-factor, 1)));\n  --radius-6: calc(16px * var(--scaling) * var(--radius-factor, 1));\n}\n\n/* The canvas the backdrop is painted on, plus the colour-scheme hint browsers\n   use for form controls and native scrollbars. */\nhtml {\n  background: #fcfcfc;\n  color-scheme: light;\n}\n\nhtml.dark {\n  background: #111111;\n  color-scheme: dark;\n}\n\n/* --------------------------------------------------------------------------\n   Foundations\n   -------------------------------------------------------------------------- */\n.theme-root {\n  font-family:\n    \"Inter var\", Inter, \"SF Pro Text\", -apple-system, BlinkMacSystemFont,\n    \"Segoe UI Variable Text\", \"Segoe UI\", \"Noto Sans SC\", \"PingFang SC\",\n    \"Microsoft YaHei\", sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* Tighter headings are the single biggest lever on how modern a dense dashboard\n   reads. */\n.theme-root :is(h1, h2, h3) {\n  letter-spacing: -0.021em;\n}\n\n.km-top-card > * > label:first-child {\n  letter-spacing: 0.02em;\n}\n\n::selection {\n  background: color-mix(in oklab, var(--accent-9) 30%, transparent);\n}\n\n:focus-visible {\n  outline-color: color-mix(in oklab, var(--accent-9) 70%, transparent);\n  outline-offset: 1px;\n}\n\n.rt-BaseButton,\n.rt-IconButton,\n.rt-TextFieldRoot,\n.rt-SelectTrigger,\n.rt-Badge {\n  transition:\n    background-color var(--km-dur) var(--km-ease),\n    box-shadow var(--km-dur) var(--km-ease),\n    color var(--km-dur) var(--km-ease),\n    transform var(--km-dur) var(--km-ease);\n}\n\n/* A hairline of light on the top edge and a soft press, so buttons read as\n   physical controls without changing any of their colours. */\n.rt-BaseButton:is(.rt-variant-solid),\n.rt-BaseButton:is(.rt-variant-classic) {\n  background-image: linear-gradient(180deg, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 55%);\n  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.12);\n}\n\n.rt-BaseButton:is(.rt-variant-solid):active,\n.rt-BaseButton:is(.rt-variant-classic):active {\n  transform: translateY(1px);\n}\n\n.km-main {\n  padding-bottom: 1.5rem;\n}\n\n/* @section:numerals */\n/* Live metrics read far better with fixed-width digits. */\n.km-summary-card,\n.km-node-card,\n.km-usage-bar,\n.km-top-card,\n.km-details-item,\n.km-node-detail-row,\n.rt-TableRoot,\n[data-slot=\"table-container\"] {\n  font-variant-numeric: tabular-nums;\n  font-feature-settings: \"tnum\" 1, \"cv01\" 1;\n}\n\n/* @section:backdrop */\n/* --------------------------------------------------------------------------\n   Backdrop\n   -------------------------------------------------------------------------- */\n/* The app paints its own opaque canvas; while the plugin owns the background,\n   those fills step aside so the layer below shows through. Mode \"theme\" omits\n   this section and leaves the stock painting (including the theme's own\n   background image) untouched. */\nhtml,\nbody,\n#root,\n.theme-root {\n  background-color: transparent;\n}\n\n.km-layout,\n.km-layout.bg-accent-1 {\n  background-color: transparent;\n}\n\n/* A background image configured in the Komari theme settings paints as an inline\n   style on .km-layout, which would cover the backdrop. The plugin's own\n   background takes precedence instead, so dim, blur, grain and the light/dark\n   split all apply to it; mode \"theme\" is how you defer to the theme's image. */\n.km-layout[style*=\"background-image\"] {\n  background-image: none !important;\n}\n\n/* The artwork itself: a fixed, blurred layer sandwiched between the theme root's\n   background and its content. Grabbing z-index -1 puts it behind the cards while\n   staying above the root's own background, and inheriting the theme's accent and\n   gray variables is what makes it follow the chosen palette. */\n.theme-root::before {\n  content: \"\";\n  position: fixed;\n  inset: -6%;\n  z-index: -1;\n  pointer-events: none;\n  background-image:\n    var(--km-grain-layer, none),\n    linear-gradient(var(--km-scrim-color), var(--km-scrim-color)),\n    var(--km-artwork, none);\n  background-attachment: fixed, fixed, fixed;\n  background-position: center, center, center;\n  background-repeat: repeat, no-repeat, var(--km-bg-repeat, no-repeat);\n  background-size: 160px 160px, auto, var(--km-bg-size, cover);\n  filter: blur(var(--km-bg-blur, 0px));\n  transform: scale(1.03);\n}\n\n/* Readability scrim: light mode veils with white, dark mode with black, so text\n   keeps its contrast over any artwork. */\n.theme-root {\n  --km-scrim-color: rgb(var(--km-scrim-rgb, 255 255 255) / var(--km-bg-dim, 18%));\n}\n\n.dark {\n  --km-scrim-rgb: 0 0 0;\n}\n\n/* @section:bgReadability */\n/* The app paints card surfaces with a translucent panel colour — 70% white in\n   light mode, and in dark mode white at 3.5%, which is very nearly nothing. That\n   reads fine over a flat canvas, but over artwork the content loses its contrast\n   (dark-mode cards all but vanish into a photo). While the plugin owns the\n   background, the card surface is topped up towards the opaque panel step; the\n   `cardOpacity` setting decides how much of it comes back. */\n.rt-BaseCard:is(.rt-variant-surface)::before {\n  background-color: color-mix(\n    in oklab,\n    var(--color-panel-solid) var(--km-panel-alpha, 86%),\n    transparent\n  );\n}\n\n/* Base geometry for the drifting clouds (aurora mode). They are decorative only,\n   so they must never swallow clicks. */\n.theme-root::after,\n.km-layout::before,\n.km-layout::after {\n  content: \"\";\n  position: fixed;\n  inline-size: 68vmax;\n  block-size: 68vmax;\n  border-radius: 50%;\n  filter: blur(64px);\n  z-index: -1;\n  pointer-events: none;\n  will-change: transform;\n}\n\n/* @section:bgWash */\n/* Flat accent wash. */\n.theme-root {\n  --km-artwork:\n    radial-gradient(\n      1400px 720px at 6% -16%,\n      color-mix(in oklab, var(--accent-9) var(--km-ambient-a1, 9%), transparent),\n      transparent 70%\n    ),\n    radial-gradient(\n      1100px 620px at 98% -8%,\n      color-mix(in oklab, var(--accent-9) var(--km-ambient-a2, 6%), transparent),\n      transparent 66%\n    );\n}\n\n/* @section:bgAurora */\n/* Drifting accent clouds: a tinted base, plus three oversized blurred blobs that\n   animate transform only (see the auroraMotion section), so the artwork stays on\n   the compositor. */\n/* Light mode leans on the deeper accent steps: the mid-tone that reads well on a\n   dark canvas turns into a barely visible pastel over a near-white one. */\n.theme-root {\n  --km-aura-c1: var(--accent-9);\n  --km-aura-c2: var(--accent-10);\n  --km-aura-use1: var(--km-aura-a1, 24%);\n  --km-aura-use2: var(--km-aura-a2, 16%);\n}\n\n.dark .theme-root {\n  --km-aura-c1: var(--accent-9);\n  --km-aura-c2: var(--accent-11);\n  --km-aura-use1: var(--km-aura-a1d, 16%);\n  --km-aura-use2: var(--km-aura-a2d, 10%);\n}\n\n.theme-root {\n  --km-artwork: linear-gradient(\n    160deg,\n    color-mix(in oklab, var(--km-aura-c1, var(--accent-9)) var(--km-aura-use1, 24%), transparent),\n    transparent 62%\n  );\n}\n\n.theme-root::after {\n  top: -22vmax;\n  left: -14vmax;\n  background: radial-gradient(\n    closest-side,\n    color-mix(in oklab, var(--km-aura-c1, var(--accent-9)) var(--km-aura-use1, 24%), transparent),\n    transparent 72%\n  );\n}\n\n.km-layout::before {\n  top: -16vmax;\n  right: -20vmax;\n  background: radial-gradient(\n    closest-side,\n    color-mix(in oklab, var(--km-aura-c2, var(--accent-11)) var(--km-aura-use2, 16%), transparent),\n    transparent 72%\n  );\n  filter: blur(70px) hue-rotate(38deg);\n}\n\n.km-layout::after {\n  bottom: -26vmax;\n  left: 16vw;\n  top: auto;\n  background: radial-gradient(\n    closest-side,\n    color-mix(in oklab, var(--km-aura-c1, var(--accent-9)) var(--km-aura-use1, 24%), transparent),\n    transparent 70%\n  );\n  filter: blur(80px) hue-rotate(-46deg);\n}\n\n/* @section:bgSolid */\n/* Plain surface: a flat step of the theme's own grey scale. */\n.theme-root {\n  --km-artwork: linear-gradient(var(--gray-2), var(--gray-2));\n}\n\n/* @section:bgImage */\n/* Personal backdrop. --km-bg-image / --km-bg-image-dark are filled from the\n   plugin configuration and may hold any CSS background value, so a gradient, a\n   data: URI or an image-set() works as well as a photo URL. */\n.theme-root {\n  --km-artwork: var(--km-bg-image, none);\n}\n\n.dark .theme-root {\n  --km-artwork: var(--km-bg-image-dark, var(--km-bg-image, none));\n}\n\n/* @section:grain */\n/* Film grain: tiled fractal noise at a low alpha, so large flat gradients stop\n   looking like plastic. */\n:root {\n  --km-grain-layer: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\");\n}\n\n/* @section:auroraMotion */\n/* The clouds drift slowly and only ever animate transform, so the browser keeps\n   the work on the compositor instead of repainting the artwork every frame. */\n.theme-root::after,\n.km-layout::before,\n.km-layout::after {\n  animation-timing-function: ease-in-out;\n  animation-iteration-count: infinite;\n  animation-direction: alternate;\n}\n\n.theme-root::after {\n  animation-name: km-drift-1;\n  animation-duration: 46s;\n}\n\n.km-layout::before {\n  animation-name: km-drift-2;\n  animation-duration: 62s;\n}\n\n.km-layout::after {\n  animation-name: km-drift-3;\n  animation-duration: 37s;\n}\n\n@keyframes km-drift-1 {\n  from {\n    transform: translate3d(0, 0, 0) scale(1);\n  }\n  to {\n    transform: translate3d(9vmax, 7vmax, 0) scale(1.14);\n  }\n}\n\n@keyframes km-drift-2 {\n  from {\n    transform: translate3d(0, 0, 0) scale(1.08);\n  }\n  to {\n    transform: translate3d(-11vmax, 9vmax, 0) scale(0.94);\n  }\n}\n\n@keyframes km-drift-3 {\n  from {\n    transform: translate3d(0, 0, 0) scale(0.96);\n  }\n  to {\n    transform: translate3d(7vmax, -8vmax, 0) scale(1.12);\n  }\n}\n\n/* @section:glass */\n/* --------------------------------------------------------------------------\n   Navbar, toolbars, footer\n   -------------------------------------------------------------------------- */\n.km-navbar {\n  z-index: 60;\n  border: 1px solid var(--km-hairline);\n  background: var(--km-glass);\n  backdrop-filter: blur(20px) saturate(1.75);\n  -webkit-backdrop-filter: blur(20px) saturate(1.75);\n  box-shadow:\n    var(--km-elevate-1),\n    inset 0 1px 0 var(--km-highlight);\n}\n\n.km-navbar-brand > a > span {\n  background-image: linear-gradient(\n    100deg,\n    var(--accent-12),\n    var(--accent-10) 55%,\n    var(--accent-11)\n  );\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n  letter-spacing: -0.02em;\n}\n\n/* The stock navbar paints its subtitle with accent-4, a *background* step that is\n   nearly invisible on the panel. Use the readable text step instead. */\n.km-navbar-brand > div > span {\n  color: var(--accent-11) !important;\n  opacity: 0.92;\n  letter-spacing: 0.01em;\n}\n\n.km-navbar-controls > * {\n  transition: transform var(--km-dur) var(--km-ease);\n}\n\n.km-navbar-controls > *:hover {\n  transform: translateY(-1px);\n}\n\n.km-node-display .control-bar {\n  border: 1px solid var(--km-hairline);\n  background: var(--km-glass);\n  backdrop-filter: blur(16px) saturate(1.5);\n  -webkit-backdrop-filter: blur(16px) saturate(1.5);\n  box-shadow:\n    var(--km-elevate-1),\n    inset 0 1px 0 var(--km-highlight);\n}\n\n.km-footer {\n  border-top: 1px solid var(--km-hairline) !important;\n  background: color-mix(in oklab, var(--gray-1) 55%, transparent);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  opacity: 0.94;\n}\n\n.km-footer a {\n  color: var(--accent-11);\n  text-decoration: none;\n}\n\n.km-footer a:hover {\n  text-decoration: underline;\n}\n\n/* @section:chrome */\n/* --------------------------------------------------------------------------\n   Floating chrome\n   -------------------------------------------------------------------------- */\n/* The navbar detaches from the viewport edge and becomes a glass island — the\n   single change that most defines the new feel. */\n.km-navbar {\n  position: sticky;\n  top: 10px;\n  margin: 8px 0 16px;\n  border-radius: var(--km-radius-chrome, 16px);\n  border-top-width: 1px;\n}\n\n.km-node-display .control-bar {\n  border-radius: var(--km-radius-chrome, 16px) !important;\n  margin-bottom: calc(var(--km-gap) * 0.6);\n}\n\n/* @section:elevation */\n/* --------------------------------------------------------------------------\n   Cards, callouts, overlays\n   -------------------------------------------------------------------------- */\n.rt-BaseCard {\n  --base-card-border-radius: var(--km-radius-tile, 12px);\n}\n\n.rt-BaseCard:is(.rt-variant-surface) {\n  box-shadow: var(--km-elevate-1);\n}\n\n.rt-BaseCard:is(.rt-variant-classic) {\n  box-shadow:\n    0 0 0 1px var(--km-hairline),\n    var(--km-elevate-2);\n}\n\n.km-summary-card {\n  --base-card-border-radius: var(--km-radius-card, 18px);\n  padding: var(--km-pad) !important;\n}\n\n.km-summary-card:is(.rt-variant-surface)::before {\n  background-image: linear-gradient(\n    140deg,\n    color-mix(in oklab, var(--accent-9) 9%, transparent),\n    transparent 55%\n  );\n}\n\n.km-top-card {\n  position: relative;\n  border-radius: var(--km-radius-tile, 14px);\n  padding: 0.65rem 0.9rem 0.6rem 1.05rem;\n  background: color-mix(in oklab, var(--gray-a3) 55%, transparent);\n  border: 1px solid var(--km-hairline);\n  overflow: hidden;\n  transition:\n    transform var(--km-dur) var(--km-ease),\n    border-color var(--km-dur) var(--km-ease),\n    box-shadow var(--km-dur) var(--km-ease);\n}\n\n.km-top-card::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 14%;\n  bottom: 14%;\n  width: 3px;\n  border-radius: 999px;\n  background: linear-gradient(\n    180deg,\n    var(--accent-9),\n    color-mix(in oklab, var(--accent-9) 25%, transparent)\n  );\n}\n\n.km-top-card:hover {\n  transform: translateY(-2px);\n  border-color: color-mix(in oklab, var(--accent-9) 30%, transparent);\n  box-shadow: var(--km-elevate-2);\n}\n\n.km-top-card > * > label:first-child {\n  font-size: 0.76rem;\n  text-transform: uppercase;\n  opacity: 0.75;\n}\n\n.km-top-card > * > label:nth-child(2) {\n  font-size: 1.05rem;\n  font-weight: 600;\n  line-height: 1.5;\n}\n\n.km-node-card {\n  --base-card-border-radius: var(--km-radius-card, 16px);\n  --base-card-surface-box-shadow: 0 0 0 1px var(--km-hairline);\n  box-shadow: var(--km-elevate-1);\n}\n\n.km-node-card:is(.rt-variant-surface)::before {\n  background-image: linear-gradient(\n    165deg,\n    color-mix(in oklab, var(--accent-9) 7%, transparent),\n    transparent 46%\n  );\n}\n\n.km-node-card:hover {\n  transform: translateY(-3px);\n  --base-card-surface-box-shadow: 0 0 0 1px\n    color-mix(in oklab, var(--accent-9) 38%, transparent);\n  box-shadow: var(--km-elevate-3);\n}\n\n.km-node-card .km-node-name {\n  letter-spacing: -0.01em;\n}\n\n.km-node-status::before {\n  content: \"\";\n  display: inline-block;\n  width: 6px;\n  height: 6px;\n  margin-right: 5px;\n  border-radius: 999px;\n  background: currentColor;\n  vertical-align: middle;\n  opacity: 0.9;\n}\n\n.km-node-status.rt-variant-solid::before {\n  background: var(--accent-contrast);\n}\n\n.km-callout {\n  border-radius: var(--km-radius-tile, 12px);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n}\n\n.km-setting-card {\n  border-radius: var(--km-radius-tile, 14px);\n}\n\n.km-details-section,\n.details-section {\n  border-radius: var(--km-radius-tile, 12px);\n  border: 1px solid var(--km-hairline);\n}\n\n.km-login-card {\n  --base-card-border-radius: var(--km-radius-card, 18px);\n  box-shadow: var(--km-elevate-3);\n}\n\n.km-login-page {\n  background-image:\n    radial-gradient(\n      900px 480px at 15% -10%,\n      color-mix(in oklab, var(--accent-9) 16%, transparent),\n      transparent 68%\n    ),\n    radial-gradient(\n      780px 440px at 92% 4%,\n      color-mix(in oklab, var(--accent-9) 10%, transparent),\n      transparent 66%\n    );\n}\n\n.rt-PopoverContent,\n.rt-SelectContent,\n.rt-DropdownMenuContent,\n.rt-HoverCardContent {\n  border-radius: var(--km-radius-tile, 14px);\n  border: 1px solid var(--km-hairline);\n  box-shadow: var(--km-elevate-3);\n}\n\n.rt-BaseDialogOverlay {\n  backdrop-filter: blur(6px) saturate(1.2);\n  -webkit-backdrop-filter: blur(6px) saturate(1.2);\n}\n\n/* Usage bars: the track is plain, the fill is a div carrying an inline\n   background-color and scaleX, so the gloss is layered over it. */\n.km-usage-bar-track {\n  background: color-mix(in oklab, var(--gray-12) 11%, transparent) !important;\n  box-shadow: inset 0 1px 2px rgb(var(--km-shadow-rgb) / 0.18);\n}\n\n.km-usage-bar-track > div {\n  position: relative;\n}\n\n.km-usage-bar-track > div::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background: linear-gradient(\n    180deg,\n    rgb(255 255 255 / 0.32),\n    rgb(255 255 255 / 0.06) 55%,\n    rgb(0 0 0 / 0.06)\n  );\n}\n\n/* @section:depth */\n/* --------------------------------------------------------------------------\n   Depth\n   -------------------------------------------------------------------------- */\n/* An inner top highlight on every panel, so cards read as lit from above rather\n   than as flat rectangles. */\n.rt-BaseCard:is(.rt-variant-surface) {\n  box-shadow:\n    var(--km-elevate-1),\n    inset 0 1px 0 var(--km-highlight);\n}\n\n.km-top-card,\n.km-setting-card,\n.km-callout {\n  box-shadow: inset 0 1px 0 var(--km-highlight);\n}\n\n.km-node-list {\n  gap: var(--km-gap);\n}\n\n/* @section:tables */\n/* --------------------------------------------------------------------------\n   Tables\n   -------------------------------------------------------------------------- */\n.rt-TableRoot {\n  border: 1px solid var(--km-hairline);\n  border-radius: var(--km-radius-tile, 14px);\n  background: var(--color-panel-solid, var(--gray-1));\n  box-shadow: var(--km-elevate-1);\n}\n\n.rt-TableRootTable .rt-TableColumnHeaderCell {\n  background: color-mix(in oklab, var(--gray-a3) 80%, transparent);\n  font-weight: 600;\n  letter-spacing: 0.01em;\n}\n\n.rt-TableRootTable .rt-TableRow {\n  transition: background-color 140ms var(--km-ease);\n}\n\n/* The app's own table kit (components/ui/table.tsx). The table element and its\n   head carry inline colours, hence the !important overrides. */\n[data-slot=\"table-container\"] {\n  border: 1px solid var(--km-hairline);\n  border-radius: var(--km-radius-tile, 14px);\n  background: color-mix(in oklab, var(--color-panel-solid, var(--gray-1)) 88%, transparent);\n  box-shadow: var(--km-elevate-1);\n  scrollbar-color: var(--accent-7) transparent;\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n}\n\n.km-ui-table {\n  background-color: transparent !important;\n}\n\n.km-ui-table [data-slot=\"table-head\"] {\n  position: sticky;\n  top: 0;\n  z-index: 2;\n  background-color: color-mix(in oklab, var(--accent-9) 8%, var(--color-panel-solid, var(--gray-1))) !important;\n  border-bottom: 1px solid var(--km-hairline);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n}\n\n.km-ui-table-header th {\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  color: var(--gray-12);\n  white-space: nowrap;\n}\n\n.km-ui-table [data-slot=\"table-row\"] {\n  border-bottom: 1px solid var(--km-hairline);\n  transition: background-color 140ms var(--km-ease);\n}\n\n.km-ui-table [data-slot=\"table-row\"]:hover {\n  background-color: color-mix(in oklab, var(--accent-9) 6%, transparent);\n}\n\n.km-ui-table [data-slot=\"table-cell\"],\n.km-ui-table [data-slot=\"table-head\"] {\n  padding-top: calc(var(--km-pad) * 0.8);\n  padding-bottom: calc(var(--km-pad) * 0.8);\n}\n\n.expanded-row {\n  background-color: color-mix(in oklab, var(--accent-9) 7%, transparent) !important;\n}\n\n/* @section:adminShell */\n/* --------------------------------------------------------------------------\n   Admin shell\n   -------------------------------------------------------------------------- */\n/* AdminPanelBar paints opaque accent-1 / accent-3 fills on the shell and on its\n   single content child, both as inline styles — hence !important. Keeping them\n   transparent lets the shared backdrop show through, so the admin pages read like\n   the public ones. */\n.km-admin-layout.km-admin-panel-bar {\n  background-color: transparent !important;\n}\n\n.km-admin-panel-content {\n  background-color: transparent !important;\n}\n\n.km-admin-panel-content > div {\n  background-color: transparent !important;\n}\n\n/* @section:scrollbar */\n/* --------------------------------------------------------------------------\n   Scrollbars\n   -------------------------------------------------------------------------- */\n::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n  background: transparent;\n}\n\n::-webkit-scrollbar-thumb {\n  background: color-mix(in oklab, var(--gray-12) 22%, transparent);\n  border-radius: 999px;\n  border: 3px solid transparent;\n  background-clip: padding-box;\n  transition: background-color var(--km-dur) var(--km-ease);\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: color-mix(in oklab, var(--accent-9) 60%, transparent);\n  background-clip: padding-box;\n}\n\nbody,\n* {\n  scrollbar-color: color-mix(in oklab, var(--gray-12) 22%, transparent) transparent;\n}\n\n/* @section:motion */\n/* --------------------------------------------------------------------------\n   Motion\n   -------------------------------------------------------------------------- */\n@keyframes km-rise {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n\n/* No fill mode on purpose: the dashboard re-renders on every metrics push, and\n   `both` would hold a freshly mounted card at the 0-opacity keyframe — the grid\n   visibly blinks out on updates. Without it a card animates in but is never stuck\n   invisible. */\n.km-node-list > *,\n.km-top-card {\n  animation: km-rise 320ms var(--km-ease);\n}\n\n.km-node-list > *:nth-child(2) {\n  animation-delay: 30ms;\n}\n\n.km-node-list > *:nth-child(3) {\n  animation-delay: 60ms;\n}\n\n.km-node-list > *:nth-child(4) {\n  animation-delay: 90ms;\n}\n\n.km-node-list > *:nth-child(5) {\n  animation-delay: 120ms;\n}\n\n.km-node-list > *:nth-child(6) {\n  animation-delay: 150ms;\n}\n\n/* @section:loader */\n/* --------------------------------------------------------------------------\n   Loading indicator\n   -------------------------------------------------------------------------- */\n/* The stock loader is a four-colour (red/blue/green/yellow) brand spinner that\n   clashes with the accent colour; this is a single-accent arc on a faint track,\n   centred in the viewport. */\n.km-loading {\n  min-height: 60vh;\n}\n\n.km-loading > p:first-of-type {\n  letter-spacing: -0.01em;\n  margin-bottom: 0.15rem;\n}\n\n.loader {\n  position: relative;\n  margin: 0 auto;\n  width: var(--loading-width, 88px);\n}\n\n.loader:before {\n  content: \"\";\n  display: block;\n  padding-top: 100%;\n}\n\n.showbox {\n  position: relative;\n  display: grid;\n  place-items: center;\n}\n\n.showbox::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: 999px;\n  border: 3px solid color-mix(in oklab, var(--gray-12) 13%, transparent);\n}\n\n.circular {\n  animation: rotate 1.8s linear infinite;\n  height: 100%;\n  transform-origin: center center;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n}\n\n.path {\n  stroke: var(--accent-9);\n  stroke-dasharray: 1, 200;\n  stroke-dashoffset: 0;\n  animation: dash 1.4s ease-in-out infinite;\n  stroke-linecap: round;\n}\n\n@keyframes rotate {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes dash {\n  0% {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0;\n  }\n  50% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -35px;\n  }\n  100% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -124px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .circular {\n    animation-duration: 4s;\n  }\n}\n\n/* --------------------------------------------------------------------------\n   Reduced motion — always on, whatever the section switches say.\n   -------------------------------------------------------------------------- */\n@media (prefers-reduced-motion: reduce) {\n  .km-node-list > *,\n  .km-top-card {\n    animation: none;\n  }\n\n  .km-node-card:hover,\n  .km-top-card:hover,\n  .km-navbar-controls > *:hover {\n    transform: none;\n  }\n\n  .theme-root::after,\n  .km-layout::before,\n  .km-layout::after {\n    animation: none;\n  }\n}\n";

/**
 * Komari UI Polish — plugin entry script.
 *
 * The plugin owns one stylesheet, src/ui-polish.css, split into named sections.
 * On load this script drops the sections the admin switched off, emits a small
 * token block derived from the settings, and registers the assembled CSS with
 * Komari's HTML injection point, so it lands at the end of <head> — after the
 * bundle stylesheet, which means the polish rules win at equal specificity. No
 * frontend build required, and no DOM is injected: the backdrop is painted by
 * pseudo-elements of the theme root, which is what lets it inherit the theme's
 * accent and grey variables.
 *
 * The stylesheet is embedded in this file as the STYLESHEET constant, which is why
 * the plugin needs no permissions beyond allowHTMLInject (no Node.js runtime).
 *
 * === GENERATED FILE ===  Built from src/entry.js + src/ui-polish.css by
 * scripts/build-plugin.mjs — edit those two files and rebuild.
 */

"use strict";

var server = require("server");

/** id of the injected <style>, so it is recognisable in devtools. */
var STYLE_ID = "komari-ui-polish";

/**
 * Sections that map 1:1 to an enabled/disabled setting. Anything not listed here
 * is either picked by the background mode or always injected ("core").
 */
var SWITCHES = [
  "numerals",
  "glass",
  "elevation",
  "depth",
  "tables",
  "adminShell",
  "scrollbar",
  "motion",
  "loader",
];

/** Container radii per setting, in px at scaling 1 and radius-factor 1. */
var RADIUS = {
  soft: { scale: [10, 14, 19], tile: 14, card: 17, chrome: 16 },
  round: { scale: [14, 20, 26], tile: 20, card: 24, chrome: 22 },
  stock: { tile: 12, card: 16, chrome: 12 },
};

/** Breathing room per density setting. */
var DENSITY = {
  comfortable: { pad: "0.9rem", gap: "1rem" },
  compact: { pad: "0.6rem", gap: "0.65rem" },
};

/** Accent strength (alpha %) for the first and second artwork layer. */
var INTENSITY = {
  subtle: [5, 3],
  standard: [9, 6],
  strong: [15, 10],
};

/**
 * The aurora clouds need more colour than the flat wash to read as clouds at all:
 * each blob fades out from its centre, so an alpha that looks bold in a single
 * flat gradient ends up barely visible once spread over 60vmax and blurred.
 */
var AURA = {
  subtle: { light: [12, 8], dark: [8, 5] },
  standard: { light: [24, 16], dark: [16, 10] },
  strong: { light: [34, 24], dark: [24, 16] },
};

/** Background modes, each painted by its own stylesheet section. */
var MODES = {
  aurora: "bgAurora",
  wash: "bgWash",
  image: "bgImage",
  solid: "bgSolid",
};

var DEFAULTS = {
  radius: "soft",
  density: "comfortable",
  numerals: true,
  glass: true,
  chrome: "floating",
  elevation: true,
  depth: true,
  tables: true,
  adminShell: true,
  scrollbar: true,
  motion: true,
  loader: true,
  ambient: true,
  background: "aurora",
  backgroundImage: "",
  backgroundImageDark: "",
  backgroundCss: "",
  backgroundCssDark: "",
  backgroundFit: "cover",
  backgroundBlur: 0,
  backgroundDim: 18,
  ambientIntensity: "standard",
  auroraMotion: true,
  grain: true,
  cardOpacity: 86,
};

/**
 * Split the stylesheet on its section markers. A marker is only honoured when it
 * is the entire content of a line, so prose in the file header that mentions the
 * marker syntax cannot start a phantom section. The text before the first marker
 * is "core".
 */
function splitSections(css) {
  var lines = css.split("\n");
  var sections = { core: "" };
  var current = "core";
  var marker = /^\/\* @section:([a-zA-Z-]+) \*\/$/;

  for (var i = 0; i < lines.length; i++) {
    var found = lines[i].trim().match(marker);
    if (found) current = found[1];
    sections[current] = (sections[current] === undefined ? "" : sections[current]) + lines[i] + "\n";
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function number(value, fallback) {
  var n = typeof value === "number" ? value : parseFloat(value);
  return isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Settings with defaults filled in and every value brought into range. */
function resolve(raw) {
  var config = {};

  for (var key in DEFAULTS) {
    config[key] = DEFAULTS[key];
    if (!raw) continue;
    var value = raw[key];
    if (value === undefined || value === null || value === "") continue;
    config[key] = value;
  }

  if (!MODES[config.background]) config.background = "theme";
  if (!RADIUS[config.radius]) config.radius = "soft";
  if (!DENSITY[config.density]) config.density = "comfortable";
  if (!INTENSITY[config.ambientIntensity]) config.ambientIntensity = "standard";
  config.backgroundBlur = clamp(number(config.backgroundBlur, 0), 0, 60);
  config.backgroundDim = clamp(number(config.backgroundDim, 18), 0, 85);
  // 100 = the opaque panel step, 40 = clearly glassy. Below that the text starts
  // to lose to whatever artwork is behind it, so it is clamped rather than trusted.
  config.cardOpacity = clamp(number(config.cardOpacity, 86), 40, 100);

  return config;
}

/**
 * Turn a configured string into a CSS background value. Anything that already
 * looks like CSS (a gradient, url(), image-set(), a colour) is passed through; a
 * bare path or URL is wrapped in url(). `</` and braces are stripped, so a value
 * can never terminate the injected <style> element or close the declaration early.
 * Semicolons are kept: data: URIs and image-set() descriptors need them, and
 * inside a url("…") they cannot end the declaration anyway.
 */
function backgroundValue(value) {
  if (typeof value !== "string") return "";

  var css = value.replace(/<\/[a-zA-Z]*/g, "").replace(/[{}]/g, "").trim();
  if (!css) return "";
  if (/^(url|image-set|linear-gradient|radial-gradient|conic-gradient|repeating-|none$)/i.test(css)) {
    return css;
  }
  if (/^(#|rgb|hsl|oklch|color\()/i.test(css)) return css;

  return 'url("' + css.replace(/["\\]/g, "") + '")';
}

/** Whether the plugin paints the backdrop for this configuration. */
function ownsBackground(config) {
  return config.ambient !== false && config.background !== "theme";
}

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

/** The --km-* values the enabled sections read. */
function tokenBlock(config) {
  var radius = RADIUS[config.radius];
  var density = DENSITY[config.density];
  var intensity = INTENSITY[config.ambientIntensity];
  var aura = AURA[config.ambientIntensity] || AURA.standard;
  // These land on .theme-root, not :root: the core section declares fallbacks for
  // the same names on .theme-root, and a value declared on the element itself beats
  // one inherited from html. buildCss() also appends the block after the sections,
  // so the configured values win over those fallbacks.
  var lines = [".theme-root {"];

  function px(prefix, value) {
    lines.push(prefix + "calc(" + value + "px * var(--scaling, 1) * var(--radius-factor, 1));");
  }

  if (radius.scale) {
    px("  --km-radius-4: ", radius.scale[0]);
    px("  --km-radius-5: ", radius.scale[1]);
    px("  --km-radius-6: ", radius.scale[2]);
  }
  px("  --km-radius-tile: ", radius.tile);
  px("  --km-radius-card: ", radius.card);
  px("  --km-radius-chrome: ", radius.chrome);

  lines.push(
    "  --km-pad: " + density.pad + ";",
    "  --km-gap: " + density.gap + ";",
    // Light and dark alphas differ: the same alpha reads far weaker over a near-white
    // canvas than over a dark one, and the aurora section picks the pair per mode.
    "  --km-aura-a1: " + aura.light[0] + "%;",
    "  --km-aura-a2: " + aura.light[1] + "%;",
    "  --km-aura-a1d: " + aura.dark[0] + "%;",
    "  --km-aura-a2d: " + aura.dark[1] + "%;",
    "  --km-ambient-a1: " + intensity[0] + "%;",
    "  --km-ambient-a2: " + intensity[1] + "%;",
    "  --km-bg-dim: " + config.backgroundDim + "%;",
    "  --km-panel-alpha: " + config.cardOpacity + "%;",
    "  --km-bg-blur: " + config.backgroundBlur + "px;",
  );

  if (config.backgroundFit === "contain") {
    lines.push("  --km-bg-size: contain;", "  --km-bg-repeat: no-repeat;");
  } else if (config.backgroundFit === "repeat") {
    lines.push("  --km-bg-size: auto;", "  --km-bg-repeat: repeat;");
  } else {
    lines.push("  --km-bg-size: cover;", "  --km-bg-repeat: no-repeat;");
  }

  var light = backgroundValue(config.backgroundCss || config.backgroundImage);
  var dark = backgroundValue(config.backgroundCssDark || config.backgroundImageDark) || light;
  if (light) lines.push("  --km-bg-image: " + light + ";");
  if (dark) lines.push("  --km-bg-image-dark: " + dark + ";");

  lines.push("}");
  return lines.join("\n");
}

/** The sections to inject, in stylesheet order. */
function pickSections(sections, config) {
  var wanted = [];

  if (ownsBackground(config)) {
    wanted.push("backdrop");
    wanted.push(MODES[config.background]);
    if (config.grain !== false) wanted.push("grain");
    // Solid mode is a flat surface: the app's own translucent panels read fine
    // there, so the card top-up only ships with real artwork behind it.
    if (config.background !== "solid") wanted.push("bgReadability");
    if (config.background === "aurora" && config.auroraMotion !== false) {
      wanted.push("auroraMotion");
    }
  }
  if (config.chrome === "floating") wanted.push("chrome");

  for (var i = 0; i < SWITCHES.length; i++) {
    if (config[SWITCHES[i]] !== false) wanted.push(SWITCHES[i]);
  }

  var enabled = [];
  for (var name in sections) {
    if (name === "core") continue;
    if (wanted.indexOf(name) !== -1) enabled.push(name);
  }
  return enabled;
}

/** Stylesheet for the current configuration. */
function buildCss(config) {
  var sections = splitSections(STYLESHEET);
  var enabled = pickSections(sections, config);
  var parts = [sections.core || ""];

  for (var i = 0; i < enabled.length; i++) {
    parts.push("/* section: " + enabled[i] + " */\n" + sections[enabled[i]]);
  }

  // The configured tokens go last so they override the fallbacks declared by the
  // sections above: same specificity, later wins.
  parts.push("/* configured tokens */\n" + tokenBlock(config));
  return { css: parts.join("\n"), sections: enabled };
}

/** The <head> fragment handed to Komari. */
function buildHead(css) {
  return [
    '<style id="' + STYLE_ID + '" data-plugin="ui-polish">',
    css,
    "</style>",
    // Keep the mobile browser chrome in step with the painted background. A theme
    // that already set its own theme-color keeps winning, since the first matching
    // tag wins and ours is appended last.
    '<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)">',
  ].join("\n");
}

var registered = false;

/** Register the injection exactly once per load, with config or with defaults. */
function register(raw) {
  if (registered) return;
  registered = true;

  try {
    var config = resolve(raw);
    var built = buildCss(config);
    // Nothing is injected into <body>: the backdrop lives on pseudo-elements of
    // the theme root, so it inherits the theme's own colour variables.
    server.injectHTML(buildHead(built.css), "");
    console.log(
      "[ui-polish] injected " + Math.round(built.css.length / 1024) + " KiB of CSS; background: " +
        (ownsBackground(config) ? config.background : "theme") +
        "; sections: " + built.sections.join(", "),
    );
  } catch (err) {
    // Never break the site over a stylesheet: log it and serve pages as-is.
    console.error("[ui-polish] failed to inject CSS:", err && err.message ? err.message : String(err));
  }
}

// The stored configuration arrives asynchronously; the injection is registered as
// soon as it lands (milliseconds after load). If reading it fails, the defaults
// from the manifest are used instead.
server.getConfig().then(register, function (err) {
  console.error("[ui-polish] could not read configuration, using defaults:",
    err && err.message ? err.message : String(err));
  register({});
});

function unload() {
  console.log("[ui-polish] unloaded");
}

