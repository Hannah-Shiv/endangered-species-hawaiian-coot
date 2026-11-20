import { lstat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const canonical = "VoteCash";
const output = process.argv[2];
if (!output) throw new Error("Usage: node scripts/generate-votecash-aliases.mjs <Pages output directory>");

const root = resolve(output);
if (!(await lstat(join(root, canonical, "index.html"))).isFile()) {
  throw new Error("Place the canonical /VoteCash/ site in the output directory first.");
}

const redirect = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CASH Party</title>
  <link rel="canonical" href="/${canonical}/">
  <script>location.replace("/${canonical}/" + location.search + location.hash);</script>
</head>
<body><p>Continue to the <a href="/${canonical}/">CASH Party website</a>.</p></body>
</html>
`;

const aliases = Array.from({ length: 2 ** canonical.length }, (_, mask) =>
  [...canonical].map((letter, index) => mask & (1 << index) ? letter.toUpperCase() : letter.toLowerCase()).join(""),
).filter((name) => name !== canonical);

// Fail rather than shadow or overwrite an existing top-level route.
for (const alias of aliases) {
  const existing = await lstat(join(root, alias)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  if (existing) throw new Error(`Cannot generate /${alias}/: already exists in the Pages output.`);
}
for (const alias of aliases) {
  const dir = join(root, alias);
  await mkdir(dir);
  await writeFile(join(dir, "index.html"), redirect, { flag: "wx" });
}
console.log(`Generated ${aliases.length} static aliases for /${canonical}/.`);
