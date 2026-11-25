import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ADVICE =
  "My dad said: never trust anyone who claps when the plane lands \u2014 and never be the one clapping.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`advice must be 1-200 chars, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("advice must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("advice must be exactly one line");
  }
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("advice must not contain control characters");
    }
  }
}

function main(): void {
  validate(ADVICE);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ADVICE + "\n", "utf8");
  // Read-back guard: verify what landed on disk matches exactly.
  const written = readFileSync(outPath, "utf8");
  if (written !== ADVICE + "\n") {
    throw new Error("read-back mismatch: entry.txt does not match the advice line");
  }
  validate(written.trimEnd());
}

main();
