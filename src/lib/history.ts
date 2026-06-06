export type ReaderSize = "small" | "normal" | "wide";
export const READER_SIZES: ReaderSize[] = ["small", "normal", "wide"];

const HISTORY_KEY = "webtoon-reading-history";
const SIZE_KEY = "webtoon-reader-size";

export interface HistoryEntry {
  episodeId: string;
  updatedAt: number;
}
export type ReadingHistory = Record<string, HistoryEntry>;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readHistory(): ReadingHistory {
  try {
    return safeParse<ReadingHistory>(localStorage.getItem(HISTORY_KEY), {});
  } catch {
    return {};
  }
}

export function recordReading(toonId: string, episodeId: string): void {
  try {
    const history = readHistory();
    history[toonId] = { episodeId, updatedAt: Date.now() };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // localStorage may be unavailable (private mode / static preview)
  }
}

export function getContinue(toonId: string): string | undefined {
  return readHistory()[toonId]?.episodeId;
}

export function getReaderSize(): ReaderSize {
  try {
    const size = localStorage.getItem(SIZE_KEY) as ReaderSize | null;
    return size && READER_SIZES.includes(size) ? size : "normal";
  } catch {
    return "normal";
  }
}

export function setReaderSize(size: ReaderSize): void {
  try {
    localStorage.setItem(SIZE_KEY, size);
  } catch {
    // ignore
  }
}
