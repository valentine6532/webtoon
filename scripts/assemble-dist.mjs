import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputSrc = path.join(root, "output");
const distOutput = path.join(root, "dist", "output");

/**
 * Copy the static `output/` image tree into `dist/output` so the built site
 * can serve panels at `<base>/output/...`. Kept out of Vite's bundle on purpose
 * (≈350MB of images that should pass through untouched).
 */
async function main() {
  if (!(await fs.access(path.join(root, "dist")).then(() => true).catch(() => false))) {
    throw new Error("dist/ not found — run `vite build` first.");
  }
  await fs.rm(distOutput, { recursive: true, force: true });
  await fs.cp(outputSrc, distOutput, { recursive: true });

  // GitHub Pages: keep Jekyll from ignoring files/dirs that start with "_".
  await fs.writeFile(path.join(root, "dist", ".nojekyll"), "");

  console.log(`Copied output/ → dist/output and wrote dist/.nojekyll`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
