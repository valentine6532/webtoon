import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adjacentEpisodes, episodesAscending, getEpisode, getWebtoon, koTitle } from "../lib/catalog";
import {
  getReaderSize,
  READER_SIZES,
  ReaderSize,
  recordReading,
  setReaderSize
} from "../lib/history";
import { assetUrl } from "../lib/paths";
import NotFound from "./NotFound";

const SIZE_LABEL: Record<ReaderSize, string> = {
  small: "좁게",
  normal: "보통",
  wide: "넓게"
};

export default function Reader() {
  const { toonId, episodeId } = useParams();
  const navigate = useNavigate();
  const [size, setSize] = useState<ReaderSize>(getReaderSize);
  const [barVisible, setBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const toon = toonId ? getWebtoon(toonId) : undefined;
  const episode = toon && episodeId ? getEpisode(toon, episodeId) : undefined;

  useEffect(() => {
    if (toon && episode) {
      recordReading(toon.id, episode.id);
      window.scrollTo(0, 0);
    }
  }, [toon, episode]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setBarVisible(y < 60 || y < lastScrollY.current);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!toon || !episode) return <NotFound />;

  const { prev, next } = adjacentEpisodes(toon, episode.id);

  const allEps = episodesAscending(toon);
  const currentIdx = allEps.findIndex((e) => e.id === episode.id);
  const epStrip = ([-2, -1, 0, 1, 2] as const).map((offset) => allEps[currentIdx + offset] ?? null);

  function changeSize(value: ReaderSize) {
    setSize(value);
    setReaderSize(value);
  }

  return (
    <div className="reader">
      <header className={`reader-bar${barVisible ? "" : " reader-bar--hidden"}`}>
        <div className="reader-bar__inner">
          <Link className="reader-bar__back" to={`/series/${toon.id}`} aria-label="목록으로">
            ← 목록
          </Link>
          <div className="reader-bar__title">
            <p className="reader-bar__toon">{koTitle(toon.title)}</p>
            <p className="reader-bar__ep">{episode.title}</p>
          </div>
          <div className="reader-bar__sizes" role="group" aria-label="뷰어 너비">
            {READER_SIZES.map((value) => (
              <button
                key={value}
                type="button"
                className={`size-btn${size === value ? " is-active" : ""}`}
                onClick={() => changeSize(value)}
              >
                {SIZE_LABEL[value]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={`reader-strip reader-strip--${size}`}>
        {episode.panels.map((panel, i) => (
          <img
            key={panel}
            className="reader-panel"
            src={assetUrl(panel)}
            alt={`${episode.title} ${i + 1}컷`}
            loading={i < 2 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <footer className="reader-footer">
        {/* 이전화 / 다음화 큰 버튼 */}
        <div className="reader-footer__nav">
          {prev ? (
            <button
              type="button"
              className="rf-nav rf-nav--prev"
              onClick={() => navigate(`/reader/${toon.id}/${prev.id}`)}
            >
              <span className="rf-nav__arrow">←</span>
              <span className="rf-nav__info">
                <span className="rf-nav__label">{prev.label}</span>
                <span className="rf-nav__title">{prev.title.replace(/^\d+화\s*·\s*/, "")}</span>
              </span>
            </button>
          ) : (
            <div className="rf-nav rf-nav--prev rf-nav--disabled" />
          )}
          {next ? (
            <button
              type="button"
              className="rf-nav rf-nav--next"
              onClick={() => navigate(`/reader/${toon.id}/${next.id}`)}
            >
              <span className="rf-nav__info">
                <span className="rf-nav__label">{next.label}</span>
                <span className="rf-nav__title">{next.title.replace(/^\d+화\s*·\s*/, "")}</span>
              </span>
              <span className="rf-nav__arrow">→</span>
            </button>
          ) : (
            <div className="rf-nav rf-nav--next rf-nav--disabled" />
          )}
        </div>

        {/* 에피소드 스트립 */}
        <div className="reader-footer__strip">
          <div className="rf-strip-head">
            <span className="rf-strip-head__title">다른 회차</span>
            <Link className="rf-strip-head__more" to={`/series/${toon.id}`}>목록 보기 →</Link>
          </div>
          <div className="rf-strip">
            {epStrip.map((ep, i) =>
              ep ? (
                <button
                  key={ep.id}
                  type="button"
                  className={`rf-strip__item${ep.id === episode.id ? " is-current" : ""}`}
                  onClick={() => navigate(`/reader/${toon.id}/${ep.id}`)}
                  aria-current={ep.id === episode.id ? "page" : undefined}
                >
                  <div className="rf-strip__thumb">
                    <img src={assetUrl(ep.thumbnail)} alt="" loading="lazy" />
                  </div>
                  <p className="rf-strip__label">{ep.label}</p>
                  <p className="rf-strip__title">{ep.title.replace(/^\d+화\s*·\s*/, "")}</p>
                </button>
              ) : (
                <div key={i} className="rf-strip__item rf-strip__item--empty" />
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
