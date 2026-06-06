import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adjacentEpisodes, getEpisode, getWebtoon } from "../lib/catalog";
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

  const toon = toonId ? getWebtoon(toonId) : undefined;
  const episode = toon && episodeId ? getEpisode(toon, episodeId) : undefined;

  useEffect(() => {
    if (toon && episode) {
      recordReading(toon.id, episode.id);
      window.scrollTo(0, 0);
    }
  }, [toon, episode]);

  if (!toon || !episode) return <NotFound />;

  const { prev, next } = adjacentEpisodes(toon, episode.id);

  function changeSize(value: ReaderSize) {
    setSize(value);
    setReaderSize(value);
  }

  return (
    <div className="reader">
      <header className="reader-bar">
        <div className="reader-bar__inner">
          <Link className="reader-bar__back" to={`/series/${toon.id}`} aria-label="목록으로">
            ←
          </Link>
          <div className="reader-bar__title">
            <p className="reader-bar__toon">{toon.title}</p>
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

      <nav className="reader-nav">
        {prev ? (
          <button
            type="button"
            className="reader-nav__btn"
            onClick={() => navigate(`/reader/${toon.id}/${prev.id}`)}
          >
            ← 이전화
          </button>
        ) : (
          <span className="reader-nav__btn is-disabled">← 이전화</span>
        )}
        <Link className="reader-nav__btn reader-nav__btn--list" to={`/series/${toon.id}`}>
          목록
        </Link>
        {next ? (
          <button
            type="button"
            className="reader-nav__btn"
            onClick={() => navigate(`/reader/${toon.id}/${next.id}`)}
          >
            다음화 →
          </button>
        ) : (
          <span className="reader-nav__btn is-disabled">다음화 →</span>
        )}
      </nav>
    </div>
  );
}
