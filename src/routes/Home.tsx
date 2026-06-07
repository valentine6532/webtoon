import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allTags, koTitle, latestEpisodes, webtoons } from "../lib/catalog";
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M12 3.5l2.6 5.3 5.9.86-4.3 4.18 1 5.86L12 17.9l-5.2 2.76 1-5.86-4.3-4.18 5.9-.86z" fill="currentColor" />
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
        <div className="card__badges">
          {toon.isNew && <span className="badge badge--new">NEW</span>}
          {toon.isUp && !toon.isNew && <span className="badge badge--up">UP</span>}
        </div>
      </div>
      <div className="card__meta">
        <div className="card__name">{koTitle(toon.title)}</div>
        <div className="card__sub">
          {toon.rating != null && (
            <span className="rating"><StarIcon />{toon.rating}</span>
          )}
          {toon.rating != null && toon.author && <span>· </span>}
          <span>{toon.author}</span>
        </div>
        {toon.tags.length > 0 && (
          <div className="card__genres">
            {toon.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="chip chip--ghost">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function RankItem({ toon, rank }: { toon: Webtoon; rank: number }) {
  return (
    <Link className="rank__item" to={`/series/${toon.id}`}>
      <div className="rank__num">{rank}</div>
      <div className="rank__thumb">
        <img src={assetUrl(toon.mainThumbnail)} alt={koTitle(toon.title)} loading="lazy" />
      </div>
      <div className="rank__body">
        <div className="rank__name">{koTitle(toon.title)}</div>
        <div className="rank__sub">
          {toon.tags.join(" · ")}
          {toon.views ? ` · 조회 ${toon.views}` : ""}
        </div>
      </div>
      {toon.rating != null && (
        <span className="rating"><StarIcon />{toon.rating}</span>
      )}
    </Link>
  );
}

export default function Home() {
  const [activeTag, setActiveTag] = useState("전체");
  const [query, setQuery] = useState("");

  const featured = useMemo(() => latestEpisodes(1)[0]?.toon ?? webtoons[0] ?? null, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ko-KR");
    return webtoons.filter((w) => {
      const matchQuery =
        !q ||
        w.title.toLocaleLowerCase("ko-KR").includes(q) ||
        w.tags.some((t) => t.toLocaleLowerCase("ko-KR").includes(q));
      const matchTag = activeTag === "전체" || w.tags.includes(activeTag);
      return matchQuery && matchTag;
    });
  }, [query, activeTag]);

  const ranked = useMemo(
    () => [...webtoons].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    []
  );

  return (
    <div className="fade-enter">
      <div className="wrap">
        {/* Hero */}
        {featured && (
          <div className="hero hero--split">
            <div className="hero__text">
              <div className="hero__eyebrow">최신 업데이트</div>
              <h1 className="hero__title">{koTitle(featured.title)}</h1>
              <p className="hero__tag">{featured.tagline || featured.summary}</p>
              <div className="hero__cta">
                <Link className="btn btn--solid" to={`/series/${featured.id}`}>
                  <PlayIcon /> 첫 화 보기
                </Link>
                <Link className="btn btn--ghost" to={`/series/${featured.id}`}>
                  최신화 · {featured.episodeCount}화
                </Link>
              </div>
            </div>
            <div className="hero__art">
              <img src={assetUrl(featured.mainThumbnail)} alt={koTitle(featured.title)} />
            </div>
          </div>
        )}

        {/* Ranking */}
        {ranked.length > 0 && (
          <section className="sec">
            <div className="sec__head">
              <div className="sec__title">랭킹</div>
            </div>
            <div className="rank">
              {ranked.map((toon, i) => (
                <RankItem key={toon.id} toon={toon} rank={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* All works */}
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
                onChange={(e) => { setQuery(e.target.value); setActiveTag("전체"); }}
                aria-label="작품 검색"
              />
            </div>
          </div>

          {/* Tag tabs */}
          {!query && (
            <div className="days">
              {["전체", ...allTags].map((tag) => (
                <button
                  key={tag}
                  className={activeTag === tag ? "on" : ""}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

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
