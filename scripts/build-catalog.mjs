import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "output");
const dataDir = path.join(root, "src", "data");
const catalogPath = path.join(dataDir, "catalog.json");
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const imagePreference = new Map([
  [".jpg", 0],
  [".jpeg", 1],
  [".webp", 2],
  [".png", 3],
  [".gif", 4]
]);

function toWebPath(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function naturalCompare(a, b) {
  return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
}

function episodeNumber(name) {
  const match = name.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function episodeLabel(name) {
  const number = episodeNumber(name);
  return number ? `${number}화` : name;
}

function humanizeSlug(slug) {
  return slug.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeTags(meta) {
  const raw = [meta.tags, meta.labels, meta.genres].flatMap((value) =>
    Array.isArray(value) ? value : value ? [value] : []
  );
  return [...new Set(raw.map((value) => String(value).trim()).filter(Boolean))];
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return {};
  }
}

async function readText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function listDirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort(naturalCompare);
  } catch {
    return [];
  }
}

async function listImages(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const images = entries
      .filter((e) => e.isFile() && imageExtensions.has(path.extname(e.name).toLowerCase()))
      .map((e) => path.join(dir, e.name))
      .sort((a, b) => naturalCompare(path.basename(a), path.basename(b)));

    const byStem = new Map();
    for (const file of images) {
      const ext = path.extname(file).toLowerCase();
      const stem = path.join(path.dirname(file), path.basename(file, ext));
      const current = byStem.get(stem);
      if (!current || (imagePreference.get(ext) ?? 99) < (imagePreference.get(path.extname(current).toLowerCase()) ?? 99)) {
        byStem.set(stem, file);
      }
    }

    return [...byStem.values()].sort((a, b) => naturalCompare(path.basename(a), path.basename(b)));
  } catch {
    return [];
  }
}

async function collectPanels(episodeDir) {
  const preferredDirs = [
    path.join(episodeDir, "assets"),
    path.join(episodeDir, "images"),
    episodeDir
  ];

  for (const dir of preferredDirs) {
    const images = await listImages(dir);
    const panels = images.filter((file) => /panel|컷|image|ep/i.test(path.basename(file)));
    if (panels.length) return panels.map(toWebPath);
    if (images.length) return images.map(toWebPath);
  }
  return [];
}

async function pickEpisodeThumbnail(toonDir, episodeName, panels) {
  const thumbnailDir = path.join(toonDir, "thumbnail");
  const number = String(episodeNumber(episodeName)).padStart(2, "0");
  const candidates = [`episode${number}`, `episode_${number}`, `ep${number}`, episodeName];

  const thumbnails = await listImages(thumbnailDir);
  const matched = thumbnails.find((file) => {
    const lower = path.basename(file, path.extname(file)).toLowerCase();
    return candidates.some((candidate) => lower === candidate.toLowerCase());
  });

  return matched ? toWebPath(matched) : panels[0] || "";
}

async function collectMainThumbnails(toonDir, fallbackPanels) {
  const thumbnailDir = path.join(toonDir, "thumbnail");
  const thumbnails = await listImages(thumbnailDir);
  const main = thumbnails.filter((file) =>
    /^main[_-]?\d*|cover|poster/i.test(path.basename(file, path.extname(file)))
  );
  if (main.length) return main.map(toWebPath);

  const styleRefs = await listImages(path.join(toonDir, "assets"));
  if (styleRefs.length) return styleRefs.map(toWebPath);

  return fallbackPanels.slice(0, 3);
}

/** Parse a character name + one-line description from definition.md. */
function parseCharacterDefinition(markdown, slug) {
  const lines = markdown.split(/\r?\n/);
  let name = humanizeSlug(slug);
  let description = "";

  const heading = lines.find((l) => /^#\s+/.test(l));
  if (heading) {
    name = heading
      .replace(/^#\s+/, "")
      .split(/\s+[—–-]\s+/)[0] // drop " — 캐릭터 정의서" suffix
      .trim();
  }

  const oneLineIdx = lines.findIndex((l) => /^##\s+한\s*줄/.test(l));
  if (oneLineIdx >= 0) {
    for (let i = oneLineIdx + 1; i < lines.length; i++) {
      const text = lines[i].trim();
      if (!text) continue;
      if (text.startsWith("#")) break;
      description = text.replace(/^>\s*/, "");
      break;
    }
  }

  return { name, description };
}

async function collectCharacters(toonDir) {
  const characterDir = path.join(toonDir, "character");
  const slugs = await listDirs(characterDir);
  const characters = [];

  for (const slug of slugs) {
    const dir = path.join(characterDir, slug);
    const sheets = await listImages(dir);
    const thumbnail = sheets.find((f) => /sheet/i.test(path.basename(f))) || sheets[0];
    if (!thumbnail) continue;

    const markdown = await readText(path.join(dir, "definition.md"));
    const { name, description } = parseCharacterDefinition(markdown, slug);

    characters.push({ id: slug, name, thumbnail: toWebPath(thumbnail), description });
  }

  return characters;
}

async function buildCatalog() {
  await fs.mkdir(dataDir, { recursive: true });

  if (!(await exists(outputDir))) {
    throw new Error("output directory not found");
  }

  const toonDirs = await listDirs(outputDir);
  const webtoons = [];

  for (const toonName of toonDirs) {
    const toonDir = path.join(outputDir, toonName);
    const meta = await readJson(path.join(toonDir, "meta.json"));
    const episodeNames = (await listDirs(toonDir)).filter((name) => /^episode/i.test(name));
    const episodes = [];

    for (const episodeName of episodeNames) {
      const episodeDir = path.join(toonDir, episodeName);
      const panels = await collectPanels(episodeDir);
      if (!panels.length) continue;

      const title = meta.episodes?.[episodeName] || `${episodeLabel(episodeName)}`;
      episodes.push({
        id: episodeName,
        label: episodeLabel(episodeName),
        title,
        sortKey: String(episodeNumber(episodeName)).padStart(4, "0"),
        panelCount: panels.length,
        thumbnail: await pickEpisodeThumbnail(toonDir, episodeName, panels),
        panels
      });
    }

    episodes.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
    if (!episodes.length) continue;

    const fallbackPanels = episodes.flatMap((episode) => episode.panels);
    const mainThumbnails = await collectMainThumbnails(toonDir, fallbackPanels);
    const characters = await collectCharacters(toonDir);
    const latest = episodes[0];

    webtoons.push({
      id: toonName,
      title: meta.title || humanizeSlug(toonName),
      subtitle: meta.subtitle || "",
      summary: meta.summary || meta.description || meta.subtitle || "",
      tagline: meta.tagline || meta.subtitle || "",
      author: meta.author || "AI Studio",
      mainThumbnail: mainThumbnails[0] || latest.thumbnail,
      mainThumbnails: mainThumbnails.length ? mainThumbnails : [latest.thumbnail],
      tags: normalizeTags(meta),
      day: meta.day || "",
      isNew: meta.isNew ?? false,
      isUp: meta.isUp ?? false,
      rating: meta.rating ?? null,
      views: meta.views || "",
      cover: meta.cover || [],
      mono: meta.mono || "",
      episodeCount: episodes.length,
      latestTitle: latest.title,
      latestSortKey: `${String(episodeNumber(latest.id)).padStart(4, "0")}-${toonName}`,
      episodes,
      characters
    });
  }

  webtoons.sort((a, b) => (b.latestSortKey || "").localeCompare(a.latestSortKey || ""));

  const latestEpisodes = webtoons
    .flatMap((toon) =>
      toon.episodes.map((episode) => ({
        webtoonId: toon.id,
        episodeId: episode.id,
        sortKey: `${episode.sortKey}-${toon.id}`
      }))
    )
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const catalog = {
    generatedAt: new Date().toISOString(),
    webtoons,
    latestEpisodes
  };

  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(
    `Generated ${toWebPath(catalogPath)} with ${webtoons.length} webtoons and ${latestEpisodes.length} episodes.`
  );
}

buildCatalog().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
