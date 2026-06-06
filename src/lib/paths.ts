const BASE = import.meta.env.BASE_URL;

/** Resolve a catalog-relative asset path (e.g. "output/foo/panel_001.png")
 *  to a URL that respects the GitHub Pages base ("/webtoon/"). */
export function assetUrl(p: string): string {
  if (!p) return "";
  if (/^(https?:)?\/\//.test(p) || p.startsWith("data:")) return p;
  return BASE.replace(/\/$/, "") + "/" + p.replace(/^\//, "");
}
