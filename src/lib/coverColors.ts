import type { Webtoon } from "./types";

const KNOWN: Record<string, [string, string, string]> = {
  fake_princess_1: ["#7C3AED", "#3B1C66", "#FBBF24"],
  mudang_king_1: ["#0E7490", "#0B2E33", "#2DD4BF"],
};

const PALETTES: Array<[string, string, string]> = [
  ["#6366F1", "#1E1B4B", "#A5B4FC"],
  ["#EC4899", "#4C0519", "#F9A8D4"],
  ["#10B981", "#064E3B", "#6EE7B7"],
  ["#F59E0B", "#78350F", "#FDE68A"],
  ["#EF4444", "#450A0A", "#FCA5A5"],
  ["#3B82F6", "#1E3A5F", "#BAE6FD"],
  ["#8B5CF6", "#2E1065", "#C4B5FD"],
  ["#14B8A6", "#134E4A", "#99F6E4"],
];

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function toonColors(toon: Webtoon): [string, string, string] {
  if (toon.cover.length >= 2 && toon.mono) {
    return [toon.cover[0], toon.cover[1], toon.mono];
  }
  if (KNOWN[toon.id]) return KNOWN[toon.id];
  return PALETTES[hash(toon.id) % PALETTES.length];
}
