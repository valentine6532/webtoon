export interface Character {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface Episode {
  id: string;
  label: string;
  title: string;
  sortKey: string;
  panelCount: number;
  thumbnail: string;
  panels: string[];
}

export interface Webtoon {
  id: string;
  title: string;
  summary: string;
  author: string;
  mainThumbnail: string;
  mainThumbnails: string[];
  tags: string[];
  episodeCount: number;
  latestTitle: string;
  latestSortKey: string;
  episodes: Episode[];
  characters: Character[];
}

export interface LatestEpisodeRef {
  webtoonId: string;
  episodeId: string;
  sortKey: string;
}

export interface Catalog {
  generatedAt: string;
  webtoons: Webtoon[];
  latestEpisodes: LatestEpisodeRef[];
}
