import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { koTitle, latestEpisodes, webtoons } from "../lib/catalog";
import type { Webtoon } from "../lib/types";
import { assetUrl } from "../lib/paths";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>;
}

function WorkCard({ toon }: { toon: Webtoon }) {
  return (
    <Link className="card" to={`/series/${toon.id}`}>
      <div className="card__poster">
        <img src={assetUrl(toon.mainThumbnail)} alt={koTitle(toon.title)} loading="lazy" />
      </div>
      <div className="card__meta">
        <div className="card__name">{koTitle(toon.title)}</div>
        <div className="card__sub">{toon.author}</div>
        {toon.tags.length > 0 && (
          <div className="card__genres">
            {toon.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="chip chip--ghost">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");

  const featured = useMemo(() => latestEpisodes(1)[0]?.toon ?? webtoons[0] ?? null, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ko-KR");
    if (!q) return webtoons;
    return webtoons.filter(
      (w) =>
        w.title.toLocaleLowerCase("ko-KR").includes(q) ||
        w.tags.some((tag) => tag.toLocaleLowerCase("ko-KR").includes(q))
    );
  }, [query]);

  return (
    <div className="fade-enter">
      <div className="wrap">
        {featured && (
          <div className="hero hero--split">
            <div className="hero__text">
              <div className="hero__eyebrow">최신 업데이트</div>
              <h1 className="hero__title">{koTitle(featured.title)}</h1>
              {featured.summary && <p className="hero__tag">{featured.summary}</p>}
              <div className="hero__cta">
                <Link className="btn btn--solid" to={`/series/${featured.id}`}>
                  <PlayIcon /> 첫 화 보기
                </Link>
                <Link className="btn btn--ghost" to={`/series/${featured.id}`}>
                  {featured.episodeCount}화 연재중
                </Link>
              </div>
            </div>
            <div className="hero__art">
              <img src={assetUrl(featured.mainThumbnail)} alt={koTitle(featured.title)} />
            </div>
          </div>
        )}

        <section className="sec">
          <div className="sec__head">
            <div className="sec__title">
              {query ? `'${query}' 검색 결과` : "전체 작품"}
            </div>
            <div className="sec-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="작품·태그 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="작품 검색"
              />
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid">
              {filtered.map((toon) => (
                <WorkCard key={toon.id} toon={toon} />
              ))}
            </div>
          ) : (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-3)", fontWeight: 600 }}>
              해당하는 작품이 없어요.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
