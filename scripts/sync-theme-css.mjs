#!/usr/bin/env node
/**
 * Keep the fork's bundled stylesheet in step with the plugin's.
 *
 * plugins/komari-ui-polish/src/ui-polish.css is the canonical copy: it is what the
 * plugin injects, and it is the file that gets tuned and verified against a stock
 * frontend. The fork embeds the same CSS at build time (frontend/src/theme-polish.css,
 * imported by main.tsx), so this script copies it across instead of leaving two
 * copies to drift apart.
 *
 * Usage:
 *   node scripts/sync-theme-css.mjs [--check]
 *
 * --check compares without writing and exits non-zero when they differ.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(repoRoot, "plugins", "komari-ui-polish", "src", "ui-polish.css");
const target = join(repoRoot, "frontend", "src", "theme-polish.css");
const check = process.argv.includes("--check");

const banner = `/* GENERATED — do not edit here.
   Canonical copy: plugins/komari-ui-polish/src/ui-polish.css
   Regenerate with: node scripts/sync-theme-css.mjs
   The plugin's @section markers are inert comments once bundled. */\n`;

const lf = (text) => text.replace(/\r\n/g, "\n");
const expected = banner + "\n" + lf(readFileSync(source, "utf8"));
const current = lf(readFileSync(target, "utf8"));

if (check) {
  const same = current === expected;
  console.log(`${relative(repoRoot, target)} ${same ? "is in sync" : "DIFFERS from"} ${relative(repoRoot, source)}`);
  process.exit(same ? 0 : 1);
}

if (current === expected) {
  console.log(`${relative(repoRoot, target)} already in sync`);
} else {
  writeFileSync(target, expected);
  console.log(`copied ${relative(repoRoot, source)} -> ${relative(repoRoot, target)}`);
}
