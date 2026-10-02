#!/usr/bin/env node
/**
 * Pack a built frontend `dist/` directory into the archive the backend embeds
 * (web/public/defaultTheme/dist.tar.zst).
 *
 * Upstream's readme documents `tar + zstd -19`; this script exists so the
 * archive can be produced on machines without the `zstd` CLI (Node >= 22.15
 * ships zstd in its bundled zlib).
 *
 * Usage:
 *   node scripts/build-default-theme.mjs [distDir] [outFile]
 */

import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const zlib = require("node:zlib");

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(process.argv[2] ?? join(repoRoot, "frontend", "dist"));
const outFile = resolve(
  process.argv[3] ?? join(repoRoot, "web", "public", "defaultTheme", "dist.tar.zst"),
);

if (typeof zlib.zstdCompressSync !== "function") {
  console.error("This Node runtime has no zstd support (need Node >= 22.15).");
  process.exit(1);
}

if (!statSync(join(distDir, "index.html"), { throwIfNoEntry: false })) {
  console.error(`No index.html in ${distDir} — build the frontend first.`);
  process.exit(1);
}

// Run tar from the parent directory and stream to stdout, so no absolute path
// (with its drive-letter colon) ever reaches tar — GNU tar would read `C:\...` as
// a remote host spec.
const tar = execFileSync("tar", ["-cf", "-", "-C", basename(distDir), "."], {
  cwd: dirname(distDir),
  maxBuffer: 1 << 30,
  stdio: ["ignore", "pipe", "inherit"],
});

const packed = zlib.zstdCompressSync(tar, {
  params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 },
});

writeFileSync(outFile, packed);

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MiB`;
console.log(`${distDir} (${mb(tar.length)}) -> ${outFile} (${mb(packed.length)})`);
