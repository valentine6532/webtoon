import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allTags, koTitle, latestEpisodes, webtoons } from "../lib/catalog";
import { assetUrl } from "../lib/paths";
import ToonCard from "../components/ToonCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

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

  const spotlight = useMemo(() => latestEpisodes(1)[0] ?? null, []);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  return (
    <div className="home">
      {spotlight && (
        <section className="spotlight">
          <div className="spotlight__bg">
            <img
              className="spotlight__bg-img"
              src={assetUrl(spotlight.toon.mainThumbnail)}
              alt=""
              aria-hidden="true"
            />
            <div className="spotlight__bg-overlay" />
          </div>
          <div className="spotlight__content">
            <p className="spotlight__eyebrow">최신 업데이트</p>
            <h1 className="spotlight__title">{koTitle(spotlight.toon.title)}</h1>
            <p className="spotlight__author">{spotlight.toon.author}</p>
            {spotlight.toon.summary && (
              <p className="spotlight__summary">{spotlight.toon.summary}</p>
            )}
            {spotlight.toon.tags.length > 0 && (
              <ul className="spotlight__tags">
                {spotlight.toon.tags.slice(0, 4).map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            )}
            <div className="spotlight__actions">
              <Link className="btn btn--accent" to={`/series/${spotlight.toon.id}`}>
                작품 보기
              </Link>
              <Link
                className="btn btn--ghost"
                to={`/reader/${spotlight.toon.id}/${spotlight.episode.id}`}
              >
                최신화 · {spotlight.episode.label}
              </Link>
            </div>
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
