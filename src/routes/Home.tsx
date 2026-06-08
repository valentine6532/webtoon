import { useEffect, useMemo, useState } from "react";
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

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      {direction === "prev" ? (
        <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
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

function EmptyWorkCard() {
  return (
    <div className="card card--empty" aria-hidden="true">
      <div className="card__poster card__poster--empty" />
      <div className="card__meta">
        <div className="card__name">준비 중</div>
        <div className="card__sub">새 작품</div>
      </div>
    </div>
  );
}

function RankItem({ toon, rank }: { toon: Webtoon; rank: number }) {
  return (
    <Link className="rank__item" to={`/series/${toon.id}`}>
      <div className="rank__thumb">
        <img src={assetUrl(toon.mainThumbnail)} alt={koTitle(toon.title)} loading="lazy" />
        <div className="rank__num">{rank}</div>
      </div>
      <div className="rank__body">
        <div className="rank__name">{koTitle(toon.title)}</div>
        <div className="rank__sub">
          {toon.rating != null && (
            <span className="rating"><StarIcon />{toon.rating}</span>
          )}
          {toon.rating != null && toon.author && <span>· </span>}
          <span>{toon.author}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyRankItem({ rank }: { rank: number }) {
  return (
    <div className="rank__item rank__item--empty" aria-hidden="true">
      <div className="rank__thumb rank__thumb--empty">
        <div className="rank__num">{rank}</div>
      </div>
      <div className="rank__body">
        <div className="rank__name">준비 중</div>
        <div className="rank__sub">새 작품</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTag, setActiveTag] = useState("전체");
  const [query, setQuery] = useState("");
  const [trendingPage, setTrendingPage] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroResetting, setIsHeroResetting] = useState(false);

  const heroSlides = useMemo(() => {
    const latestToons = latestEpisodes(8).map(({ toon }) => toon);
    const unique = [...new Map(latestToons.map((toon) => [toon.id, toon])).values()];
    return unique.length > 0 ? unique : webtoons;
  }, []);
  const activeHeroIndex = heroSlides.length > 0 ? heroIndex % heroSlides.length : 0;
  const featured = heroSlides[activeHeroIndex] ?? heroSlides[0] ?? null;
  const heroTrackSlides = heroSlides.length > 1 ? [...heroSlides, ...heroSlides] : heroSlides;

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => index + 1);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  function goToHero(index: number) {
    if (heroSlides.length <= 1) return;
    const current = heroIndex % heroSlides.length;
    const distance = (index - current + heroSlides.length) % heroSlides.length;
    if (distance === 0) return;
    setHeroIndex((value) => value + distance);
  }

  function handleHeroTransitionEnd() {
    if (heroSlides.length <= 1 || heroIndex < heroSlides.length) return;
    const normalized = heroIndex % heroSlides.length;
    setIsHeroResetting(true);
    setHeroIndex(normalized);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsHeroResetting(false));
    });
  }

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
  const visibleTrendingSlots = 7;
  const trendingPlaceholders = Math.max(0, visibleTrendingSlots - ranked.length);
  const mobileTrendingSlots = 3;
  const mobileTrendingPageCount = Math.ceil(visibleTrendingSlots / mobileTrendingSlots);
  const mobileTrendingStart = trendingPage * mobileTrendingSlots;
  const mobileTrendingItems = ranked.slice(mobileTrendingStart, mobileTrendingStart + mobileTrendingSlots);
  const mobileTrendingPlaceholders = Math.max(
    0,
    Math.min(mobileTrendingSlots, visibleTrendingSlots - mobileTrendingStart) - mobileTrendingItems.length
  );
  const workPlaceholders = Math.max(0, 10 - filtered.length);

  return (
    <div className="fade-enter">
      <div className="wrap">
        {/* Hero */}
        {featured && (
          <div className="hero hero--split">
            <div className="hero__art">
              <div
                className={`hero__track${isHeroResetting ? " hero__track--resetting" : ""}`}
                style={{ transform: `translateX(-${heroIndex * 100}%)` }}
                onTransitionEnd={handleHeroTransitionEnd}
              >
                {heroTrackSlides.map((toon, index) => (
                  <div className="hero__slide" key={`${toon.id}-${index}`}>
                    <img src={assetUrl(toon.mainThumbnail)} alt={koTitle(toon.title)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="hero__text">
              <div className="hero__eyebrow">최신 업데이트</div>
              <h1 className="hero__title">{koTitle(featured.title)}</h1>
              <p className="hero__tag">{featured.tagline || featured.summary}</p>
              <div className="hero__meta">
                {featured.rating != null && <span>평점 {featured.rating}</span>}
              </div>
              <div className="hero__cta">
                <Link className="btn btn--solid" to={`/series/${featured.id}`}>
                  <PlayIcon /> 첫 화 보기
                </Link>
                <Link className="btn btn--ghost" to={`/series/${featured.id}`}>
                  최신화 보기
                </Link>
              </div>
            </div>
            {heroSlides.length > 1 && (
              <div className="hero__dots" aria-label="히어로 작품 선택">
                {heroSlides.map((toon, index) => (
                  <button
                    key={toon.id}
                    type="button"
                    className={index === activeHeroIndex ? "is-active" : ""}
                    aria-label={`${koTitle(toon.title)} 보기`}
                    aria-current={index === activeHeroIndex ? "true" : undefined}
                    onClick={() => goToHero(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending */}
        {ranked.length > 0 && (
          <section className="sec">
            <div className="sec__head">
              <div className="sec__title">지금 뜨는 작품</div>
              <div className="rank-nav" aria-label="지금 뜨는 작품 페이지 이동">
                <button
                  type="button"
                  aria-label="이전 지금 뜨는 작품"
                  onClick={() => setTrendingPage((page) => Math.max(0, page - 1))}
                  disabled={trendingPage === 0}
                >
                  <ChevronIcon direction="prev" />
                </button>
                <button
                  type="button"
                  aria-label="다음 지금 뜨는 작품"
                  onClick={() => setTrendingPage((page) => Math.min(mobileTrendingPageCount - 1, page + 1))}
                  disabled={trendingPage >= mobileTrendingPageCount - 1}
                >
                  <ChevronIcon direction="next" />
                </button>
              </div>
            </div>
            <div className="rank rank--desktop">
              {ranked.slice(0, visibleTrendingSlots).map((toon, i) => (
                <RankItem key={toon.id} toon={toon} rank={i + 1} />
              ))}
              {Array.from({ length: trendingPlaceholders }, (_, i) => (
                <EmptyRankItem key={`empty-rank-${i}`} rank={ranked.length + i + 1} />
              ))}
            </div>
            <div className="rank rank--mobile">
              {mobileTrendingItems.map((toon, i) => (
                <RankItem key={toon.id} toon={toon} rank={mobileTrendingStart + i + 1} />
              ))}
              {Array.from({ length: mobileTrendingPlaceholders }, (_, i) => (
                <EmptyRankItem key={`empty-mobile-rank-${trendingPage}-${i}`} rank={mobileTrendingStart + mobileTrendingItems.length + i + 1} />
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
              {!query && activeTag === "전체" &&
                Array.from({ length: workPlaceholders }, (_, i) => (
                  <EmptyWorkCard key={`empty-work-${i}`} />
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
