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
