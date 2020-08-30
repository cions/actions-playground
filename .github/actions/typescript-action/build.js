import * as path from "node:path";
import * as url from "node:url";
import * as fs from "node:fs/promises";
import ncc from "@vercel/ncc";

const outDir = url.fileURLToPath(new URL("./dist", import.meta.url));

async function build(sourceFile) {
  const sourcePath = url.fileURLToPath(new URL(sourceFile, import.meta.url));
  const filename = path.basename(sourceFile).replace(".ts", ".mjs");

  const { code, map, assets } = await ncc(sourcePath, {
    filename,
    minify: true,
    sourceMap: true,
    target: "es2022",
  });

  return Object.assign(
    Object.fromEntries(
      Object.entries(assets).map(([name, { source }]) => {
        return [path.join(outDir, name), source];
      }),
    ),
    {
      [path.join(outDir, filename)]: code,
      [path.join(outDir, filename + ".map")]: map,
    },
  );
}

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const assets = await Promise.all([
  build("src/main.ts"),
  build("src/pre.ts"),
  build("src/post.ts"),
]).then((x) => Object.assign({}, ...x));

for (const [path, content] of Object.entries(assets)) {
  await fs.writeFile(path, content);
}
