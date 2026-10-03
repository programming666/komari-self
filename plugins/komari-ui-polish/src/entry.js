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
