import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allTags, getWebtoon, latestEpisodes, webtoons } from "../lib/catalog";
import { readHistory } from "../lib/history";
import { assetUrl } from "../lib/paths";
import ToonCard from "../components/ToonCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const continueItems = useMemo(() => {
    const history = readHistory();
    return Object.entries(history)
      .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
      .map(([toonId, entry]) => {
        const toon = getWebtoon(toonId);
        const episode = toon?.episodes.find((e) => e.id === entry.episodeId);
        return toon && episode ? { toon, episode } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .slice(0, 6);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ko-KR");
    return webtoons.filter((toon) => {
      const matchesQuery =
        !q ||
        toon.title.toLocaleLowerCase("ko-KR").includes(q) ||
        toon.tags.some((tag) => tag.toLocaleLowerCase("ko-KR").includes(q));
      const matchesTags =
        activeTags.size === 0 || toon.tags.some((tag) => activeTags.has(tag));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const latest = useMemo(() => latestEpisodes(8), []);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">AI가 그린 웹툰, 한자리에</h1>
        <p className="hero__sub">기획부터 작화까지 AI로 완성한 오리지널 웹툰 포털</p>
      </section>

      {continueItems.length > 0 && (
        <section className="section">
          <h2 className="section__title">이어보기</h2>
          <div className="rail">
            {continueItems.map(({ toon, episode }) => (
              <Link
                key={toon.id}
                className="rail-card"
                to={`/reader/${toon.id}/${episode.id}`}
              >
                <div className="rail-card__thumb">
                  <img src={assetUrl(episode.thumbnail)} alt={episode.title} loading="lazy" />
                </div>
                <div className="rail-card__body">
                  <p className="rail-card__toon">{toon.title}</p>
                  <p className="rail-card__ep">{episode.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="section">
          <h2 className="section__title">최신 업데이트</h2>
          <div className="rail">
            {latest.map(({ toon, episode }) => (
              <Link
                key={`${toon.id}-${episode.id}`}
                className="rail-card"
                to={`/reader/${toon.id}/${episode.id}`}
              >
                <div className="rail-card__thumb">
                  <img src={assetUrl(episode.thumbnail)} alt={episode.title} loading="lazy" />
                  <span className="rail-card__new">NEW</span>
                </div>
                <div className="rail-card__body">
                  <p className="rail-card__toon">{toon.title}</p>
                  <p className="rail-card__ep">{episode.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">전체 작품</h2>
          <div className="search">
            <input
              type="search"
              placeholder="작품·태그 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="작품 검색"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="tag-filter">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-chip${activeTags.has(tag) ? " is-active" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="toon-grid">
            {filtered.map((toon) => (
              <ToonCard key={toon.id} toon={toon} />
            ))}
          </div>
        ) : (
          <p className="empty">검색 결과가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
