import { Link, useParams } from "react-router-dom";
import { episodesAscending, getWebtoon, koTitle } from "../lib/catalog";
import { getContinue } from "../lib/history";
import { assetUrl } from "../lib/paths";
import NotFound from "./NotFound";

function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>;
}

export default function Series() {
  const { toonId } = useParams();
  const toon = toonId ? getWebtoon(toonId) : undefined;
  if (!toon) return <NotFound />;

  const episodes = episodesAscending(toon);
  const continueId = getContinue(toon.id);
  const firstEp = episodes[0];
  const latestEp = episodes[episodes.length - 1];
  const resumeEp = (continueId && toon.episodes.find((e) => e.id === continueId)) || firstEp;

  return (
    <div className="fade-enter">
      <div className="detail__hero">
        <div className="detail__bg">
          <img src={assetUrl(toon.mainThumbnail)} alt="" aria-hidden="true" />
        </div>
        <div className="detail__scrim" />
        <div className="wrap">
          <div style={{ paddingTop: 18, position: "relative", zIndex: 2 }}>
            <Link className="btn btn--ghost btn--sm" to="/">← 작품 목록</Link>
          </div>
          <div className="detail__top">
            <div className="detail__poster">
              <img src={assetUrl(toon.mainThumbnail)} alt={koTitle(toon.title)} />
            </div>
            <div className="detail__info">
              {toon.tags.length > 0 && (
                <div className="detail__genres">
                  {toon.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                </div>
              )}
              <h1 className="detail__title">{koTitle(toon.title)}</h1>
              <div className="detail__author">{toon.author}</div>
              <div className="detail__stat-row">
                <div className="detail__stat">
                  <div className="v">{toon.episodeCount}화</div>
                  <div className="l">연재</div>
                </div>
              </div>
              {toon.summary && <p className="detail__syn">{toon.summary}</p>}
              <div className="detail__cta">
                {resumeEp && (
                  <Link className="btn btn--solid" to={`/reader/${toon.id}/${resumeEp.id}`}>
                    <PlayIcon /> {continueId ? "이어보기" : "첫화 보기"}
                  </Link>
                )}
                {latestEp && latestEp.id !== resumeEp?.id && (
                  <Link className="btn btn--ghost" to={`/reader/${toon.id}/${latestEp.id}`}>
                    최신화 보기
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <section className="sec" style={{ paddingTop: 8 }}>
          <div className="eplist__head">
            <div className="eplist__count">전체 <b>{episodes.length}화</b></div>
          </div>
          <div>
            {[...episodes].reverse().map((ep) => (
              <Link key={ep.id} className="ep" to={`/reader/${toon.id}/${ep.id}`}>
                <div className="ep__thumb">
                  <img src={assetUrl(ep.thumbnail)} alt="" loading="lazy" />
                </div>
                <div className="ep__main">
                  <div className="ep__name">{ep.title}</div>
                  <div className="ep__date">
                    <span>{ep.label}</span>
                    <span>{ep.panelCount}컷</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
