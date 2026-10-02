#!/usr/bin/env node
/**
 * Build the UI Polish Komari plugin.
 *
 * Two steps, both driven from the plugin's `src/` sources:
 *
 *   1. generate script.js — the plugin entry, with src/ui-polish.css embedded as
 *      a STYLESHEET string constant, so the installed plugin needs no filesystem
 *      or Node.js access and can ask for allowHTMLInject only;
 *   2. package it into the ZIP the admin panel (and the plugin market) accepts,
 *      with komari-plugin.json at the archive root.
 *
 * The ZIP writer is plain Node (zlib), so no zip CLI is required.
 *
 * Usage:
 *   node scripts/build-plugin.mjs [pluginDir] [--out file.zip]
 *                                 [--market file.json] [--download URL]
 *
 * Defaults: pluginDir = plugins/komari-ui-polish
 *           --out     = <pluginDir>/dist/<short>-<version>.zip
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// Minimal ZIP writer (deflate + CRC-32, UTF-8 entry names)
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
  return (c ^ -1) >>> 0;
}

/**
 * Fixed DOS timestamp used for every entry, so the same sources always pack into
 * the same bytes. A plugin published to a market catalog is referenced by its
 * sha256, which only means anything if the archive is reproducible. Set
 * SOURCE_DATE_EPOCH to override the default (2020-01-01 00:00:00).
 */
const DOS_TIMESTAMP = (() => {
  const epoch = Number(process.env.SOURCE_DATE_EPOCH);
  const date = Number.isFinite(epoch) && epoch > 0 ? new Date(epoch * 1000) : new Date(Date.UTC(2020, 0, 1));
  const time = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | (date.getUTCSeconds() >> 1);
  const day =
    ((date.getUTCFullYear() - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate();
  return { time: time & 0xffff, day: day & 0xffff };
})();

/**
 * Line endings must not leak into the archive: the sha256 published in a market
 * catalog is verified by the server at install time, so packing the same sources
 * on a machine with core.autocrlf=true has to yield the same bytes as anywhere
 * else. Text entries are therefore normalised to LF here, which makes the build
 * independent of how git checked the tree out.
 */
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".md", ".svg", ".txt", ".yml", ".yaml"]);

function packData(name, data) {
  if (!TEXT_EXTENSIONS.has(extname(name).toLowerCase())) return data;
  // Normalise CRLF to LF so the archive does not depend on how git checked the
  // tree out (core.autocrlf would otherwise change the archive hash per machine).
  return Buffer.from(data.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
}

/** Every file under dir (skipping `skip`), as { name, path } with / separators. */
function collectFiles(dir, skip) {
  const out = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (skip.has(entry.name)) continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push({ name: relative(dir, full).split(sep).join("/"), path: full });
    }
  };
  walk(dir);
  return out;
}

function buildZip(files) {
  const local = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const data = packData(file.name, readFileSync(file.path));
    const packed = deflateRawSync(data, { level: 9 });
    const sum = crc32(data);
    const { time, day } = DOS_TIMESTAMP;

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0); // local file header
    header.writeUInt16LE(20, 4); // version needed
    header.writeUInt16LE(0x0800, 6); // UTF-8 entry name
    header.writeUInt16LE(8, 8); // deflate
    header.writeUInt16LE(time, 10);
    header.writeUInt16LE(day, 12);
    header.writeUInt32LE(sum, 14);
    header.writeUInt32LE(packed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(0, 28); // extra field length
    local.push(header, name, packed);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0); // central directory header
    entry.writeUInt16LE(20, 4); // version made by
    entry.writeUInt16LE(20, 6); // version needed
    entry.writeUInt16LE(0x0800, 8);
    entry.writeUInt16LE(8, 10);
    entry.writeUInt16LE(time, 12);
    entry.writeUInt16LE(day, 14);
    entry.writeUInt32LE(sum, 16);
    entry.writeUInt32LE(packed.length, 20);
    entry.writeUInt32LE(data.length, 24);
    entry.writeUInt16LE(name.length, 28);
    entry.writeUInt16LE(0, 30); // extra
    entry.writeUInt16LE(0, 32); // comment
    entry.writeUInt16LE(0, 34); // disk number
    entry.writeUInt16LE(0, 36); // internal attributes
    entry.writeUInt32LE(0, 38); // external attributes
    entry.writeUInt32LE(offset, 42); // offset of the local header
    central.push(entry, name);

    offset += header.length + name.length + packed.length;
  }

  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // end of central directory
  end.writeUInt16LE(0, 4); // this disk
  end.writeUInt16LE(0, 6); // disk with central directory
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([Buffer.concat(local), directory, end]);
}

// ---------------------------------------------------------------------------
// Step 1 — generate the plugin entry
// ---------------------------------------------------------------------------

/**
 * Cheap structural gate for the stylesheet. CSS error recovery is silent, so a
 * stray declaration (a replacement edit that ate the opening `.selector {` line)
 * or an unbalanced brace would ship as an archive that installs cleanly and just
 * renders nothing. Both are caught here instead.
 */
function validateCss(css, label) {
  const problems = [];
  let depth = 0;

  css.split("\n").forEach((line, index) => {
    const text = line.trim();
    if (/^--[\w-]+\s*:/.test(text) && depth === 0) {
      problems.push(`line ${index + 1}: declaration outside any rule — ${text.slice(0, 60)}`);
    }
    depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
    if (depth < 0) {
      problems.push(`line ${index + 1}: unbalanced closing brace`);
      depth = 0;
    }
  });

  if (depth !== 0) problems.push(`unbalanced braces at end of file (depth ${depth})`);

  if (problems.length) {
    console.error(`${label} is not well formed:`);
    for (const problem of problems) console.error(`  ! ${problem}`);
    process.exit(1);
  }
}

function generateEntry(pluginDir, write) {
  const srcDir = join(pluginDir, "src");
  const entryFile = join(srcDir, "entry.js");
  const cssFile = join(srcDir, "ui-polish.css");

  for (const file of [entryFile, cssFile]) {
    if (!statSync(file, { throwIfNoEntry: false })) {
      console.error(`Missing source file ${file}`);
      process.exit(1);
    }
  }

  // Sources are normalised before they are embedded: a CRLF checkout would otherwise
  // bake \r into the generated script.js (inside the JSON-encoded stylesheet), and the
  // published archive hash would depend on the machine that built it.
  const lf = (text) => text.replace(/\r\n/g, "\n");
  const css = lf(readFileSync(cssFile, "utf8"));
  const entry = lf(readFileSync(entryFile, "utf8"));

  // The stylesheet ends up inside a <style> element, so it must not be able to
  // close that element early.
  if (css.includes("</style")) {
    console.error("src/ui-polish.css contains a literal </style>, which would break the injected fragment.");
    process.exit(1);
  }

  validateCss(css, "src/ui-polish.css")

  const out = [
    "/**",
    " * Komari UI Polish — plugin entry.",
    " *",
    " * GENERATED FILE — do not edit. Built from src/entry.js and src/ui-polish.css",
    " * by scripts/build-plugin.mjs; run that script after changing either source.",
    " */",
    "",
    '"use strict";',
    "",
    "// The stylesheet, embedded so the plugin needs no filesystem or Node.js access.",
    `var STYLESHEET = ${JSON.stringify(css)};`,
    "",
    entry.trimStart(),
    "",
  ].join("\n");

  const outFile = join(pluginDir, "script.js");
  if (!write) return { outFile, cssLength: css.length, entryLength: out.length };
  writeFileSync(outFile, out);

  // Cheap syntax gate: a broken entry would only surface at plugin load time.
  execFileSync(process.execPath, ["--check", outFile], { stdio: "inherit" });

  return { outFile, cssLength: css.length, entryLength: out.length };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? undefined : argv[i + 1];
};
const positional = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const check = argv.includes("--check");

const pluginDir = resolve(positional[0] ?? join(repoRoot, "plugins", "komari-ui-polish"));
const manifest = JSON.parse(readFileSync(join(pluginDir, "komari-plugin.json"), "utf8"));

const short = manifest.short;
const version = manifest.version;
if (!short || !version) {
  console.error(`${pluginDir}/komari-plugin.json needs both "short" and "version".`);
  process.exit(1);
}

const generated = generateEntry(pluginDir, !check);

const outFile = resolve(flag("--out") ?? join(pluginDir, "dist", `${short}-${version}.zip`));
const kb = (n) => `${(n / 1024).toFixed(1)} KiB`;

// `dist` holds this script's own output and `src` is a build input, not part of
// what runs on a server: the installed plugin is manifest + script.js + icon.
const files = collectFiles(pluginDir, new Set(["dist", "src", "node_modules", ".git"]));
const zip = buildZip(files);

const sha256 = createHash("sha256").update(zip).digest("hex");

// --check: rebuild in memory and compare against what is committed, instead of
// writing anything. Catches the silent drift that bit us once already — editing
// a file that ships inside the archive (the README) after packing it.
if (check) {
  const catalogFile = resolve(flag("--market") ?? join(repoRoot, "plugins", "market", "v1.json"));
  const problems = [];
  const committed = statSync(outFile, { throwIfNoEntry: false })
    ? createHash("sha256").update(readFileSync(outFile)).digest("hex")
    : null;
  const catalog = statSync(catalogFile, { throwIfNoEntry: false })
    ? (JSON.parse(readFileSync(catalogFile, "utf8")).plugins ?? []).find((p) => p.short === short)
    : null;

  console.log(`${short} ${version} — consistency check`);
  console.log(`  rebuilt  ${sha256}`);
  console.log(`  dist     ${committed ?? "(missing)"}  ${committed === sha256 ? "ok" : "STALE"}`);
  console.log(`  catalog  ${catalog?.sha256 ?? "(no entry)"}  ${catalog?.sha256 === sha256 ? "ok" : "MISMATCH"}`);
  console.log(`  release  ${sha256}  (compare with the asset at the catalog's download URL)`);

  if (committed !== sha256) {
    problems.push(`the archive in dist/ is stale — rerun without --check and commit it`);
  }
  if (catalog?.sha256 !== sha256) {
    problems.push(`${relative(repoRoot, catalogFile)} does not carry this archive's sha256 — regenerate it with --market, and re-upload the release asset`);
  }

  for (const problem of problems) console.error(`  ! ${problem}`);
  process.exit(problems.length ? 1 : 0);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, zip);
console.log(`${short} ${version}`);
console.log(`  entry    ${relative(pluginDir, generated.outFile)} (${kb(generated.entryLength)}, css ${kb(generated.cssLength)})`);
console.log(`  archive  ${outFile} (${kb(zip.length)})`);
console.log(`  files    ${files.map((f) => f.name).join(", ")}`);
console.log(`  sha256   ${sha256}`);

const marketFile = flag("--market");
const download = flag("--download");
if (marketFile) {
  if (!download) {
    console.error("--market needs --download <zip url> as well.");
    process.exit(1);
  }
  const catalog = {
    schema: 1,
    plugins: [
      {
        name: manifest.name,
        short,
        description: manifest.description,
        version,
        author: manifest.author,
        url: manifest.url,
        download,
        sha256,
        komari: manifest.komari,
      },
    ],
  };
  mkdirSync(dirname(resolve(marketFile)), { recursive: true });
  writeFileSync(resolve(marketFile), `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`  market   ${resolve(marketFile)} -> ${download}`);
}
