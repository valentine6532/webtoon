import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adjacentEpisodes, getEpisode, getWebtoon, koTitle } from "../lib/catalog";
import { recordReading } from "../lib/history";
import { assetUrl } from "../lib/paths";
import NotFound from "./NotFound";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Reader() {
  const { toonId, episodeId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [hideBar, setHideBar] = useState(false);
  const lastY = useRef(0);

  const toon = toonId ? getWebtoon(toonId) : undefined;
  const episode = toon && episodeId ? getEpisode(toon, episodeId) : undefined;

  useEffect(() => {
    if (toon && episode) {
      recordReading(toon.id, episode.id);
      window.scrollTo(0, 0);
    }
  }, [toon?.id, episode?.id]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
      setHideBar(y > lastY.current && y > 120);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [episode?.id]);

  if (!toon || !episode) return <NotFound />;

  const { prev, next } = adjacentEpisodes(toon, episode.id);

  return (
    <div className="viewer">
      <div className="viewer__progress" style={{ width: `${progress}%` }} />

      <div className={`viewer__bar${hideBar ? " hide" : ""}`}>
        <button onClick={() => navigate(`/series/${toon.id}`)} aria-label="목록으로">
          <BackIcon />
        </button>
        <div className="viewer__bar__info">
          <div className="t">{koTitle(toon.title)}</div>
          <div className="s">{episode.title}</div>
        </div>
      </div>

      <div className="viewer__strip">
        {episode.panels.map((panel, i) => (
          <img
            key={panel}
            className="viewer__panel"
            src={assetUrl(panel)}
            alt={`${i + 1}컷`}
            loading={i < 2 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <div className="viewer__end">
        <h3>{episode.label} 끝</h3>
        <p>다음 화에서 계속됩니다.</p>
        <div className="viewer__nav">
          <button
            className="btn btn--ghost"
            style={{ opacity: prev ? 1 : 0.4 }}
            disabled={!prev}
            onClick={() => prev && navigate(`/reader/${toon.id}/${prev.id}`)}
          >
            <BackIcon /> 이전화
          </button>
          {next ? (
            <button
              className="btn btn--solid"
              onClick={() => navigate(`/reader/${toon.id}/${next.id}`)}
            >
              다음화 <ChevronIcon />
            </button>
          ) : (
            <button className="btn btn--solid" onClick={() => navigate(`/series/${toon.id}`)}>
              목록으로
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
