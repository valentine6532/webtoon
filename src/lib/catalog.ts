import data from "../data/catalog.json";
import type { Catalog, Episode, Webtoon } from "./types";

export const catalog = data as Catalog;
export const webtoons: Webtoon[] = catalog.webtoons;

export function getWebtoon(id: string): Webtoon | undefined {
  return webtoons.find((w) => w.id === id);
}

export function getEpisode(toon: Webtoon, episodeId: string): Episode | undefined {
  return toon.episodes.find((e) => e.id === episodeId);
}

/** Episodes in reading order (1화 → 2화 → …). The catalog stores them newest-first. */
export function episodesAscending(toon: Webtoon): Episode[] {
  return [...toon.episodes].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}

export function adjacentEpisodes(
  toon: Webtoon,
  episodeId: string
): { prev?: Episode; next?: Episode } {
  const ordered = episodesAscending(toon);
  const idx = ordered.findIndex((e) => e.id === episodeId);
  if (idx < 0) return {};
  return { prev: ordered[idx - 1], next: ordered[idx + 1] };
}

export const allTags: string[] = [
  ...new Set(webtoons.flatMap((w) => w.tags))
].sort((a, b) => a.localeCompare(b, "ko"));

/** Newest episodes across all series, resolved to concrete objects. */
export function latestEpisodes(limit = 12): { toon: Webtoon; episode: Episode }[] {
  return catalog.latestEpisodes
    .map((ref) => {
      const toon = getWebtoon(ref.webtoonId);
      const episode = toon && getEpisode(toon, ref.episodeId);
      return toon && episode ? { toon, episode } : null;
    })
    .filter((x): x is { toon: Webtoon; episode: Episode } => x !== null)
    .slice(0, limit);
}
