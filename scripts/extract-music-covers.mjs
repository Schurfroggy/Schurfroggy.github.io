/**
 * Build/dev: read ID3 (APIC) from `src/assets/music/*.mp3`, write to
 * `public/music-covers-extracted/` and `src/data/musicCoverByMp3Path.json`.
 * Keys match Vite's glob from `src/data/musicPlaylist.ts` (../assets/music/...).
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFile } from "music-metadata";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const musicDir = join(ROOT, "src/assets/music");
const outDir = join(ROOT, "public/music-covers-extracted");
const manifestPath = join(ROOT, "src/data/musicCoverByMp3Path.json");
const dataDir = join(ROOT, "src/data");

const extForPicture = format => {
  const f = (format ?? "").toLowerCase();
  if (f.includes("png")) return "png";
  if (f.includes("webp")) return "webp";
  if (f.includes("gif")) return "gif";
  return "jpg";
};

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(dataDir, { recursive: true });

  let files;
  try {
    files = (await readdir(musicDir)).filter(f => f.toLowerCase().endsWith(".mp3"));
  } catch {
    await writeFile(manifestPath, "{}\n", "utf8");
    console.log("extract-music-covers: no music dir, wrote empty manifest");
    return;
  }

  const manifest = {};

  for (const name of files) {
    const abs = join(musicDir, name);
    const key = `../assets/music/${name}`.split(/[/\\]+/).join("/");

    try {
      const meta = await parseFile(abs, { duration: false });
      const pic = meta.common.picture?.[0];
      if (!pic?.data?.length) continue;

      const ext = extForPicture(pic.format);
      const hash = createHash("sha1").update(key, "utf8").digest("hex").slice(0, 20);
      const outName = `${hash}.${ext}`;
      const outPath = join(outDir, outName);
      await writeFile(outPath, pic.data);
      manifest[key] = `/music-covers-extracted/${outName}`;
    } catch (e) {
      console.warn(`extract-music-covers: skip ${name}:`, e?.message ?? e);
    }
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const n = Object.keys(manifest).length;
  console.log(
    `extract-music-covers: wrote ${n} cover(s) from id3 → public/music-covers-extracted/`
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
