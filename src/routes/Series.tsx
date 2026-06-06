import { Link, useParams } from "react-router-dom";
import { episodesAscending, getWebtoon } from "../lib/catalog";
import { getContinue } from "../lib/history";
import { assetUrl } from "../lib/paths";
import NotFound from "./NotFound";

export default function Series() {
  const { toonId } = useParams();
  const toon = toonId ? getWebtoon(toonId) : undefined;
  if (!toon) return <NotFound />;

  const episodes = episodesAscending(toon);
  const continueId = getContinue(toon.id);
  const firstEp = episodes[0];
  const resumeEp = (continueId && toon.episodes.find((e) => e.id === continueId)) || firstEp;

  return (
    <div className="series">
      <section className="series-hero">
        <div className="series-hero__cover">
          <img src={assetUrl(toon.mainThumbnail)} alt={toon.title} />
        </div>
        <div className="series-hero__meta">
          <h1 className="series-hero__title">{toon.title}</h1>
          <p className="series-hero__author">{toon.author}</p>
          {toon.summary && <p className="series-hero__summary">{toon.summary}</p>}
          {toon.tags.length > 0 && (
            <ul className="series-hero__tags">
              {toon.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
          {resumeEp && (
            <Link className="btn btn--primary" to={`/reader/${toon.id}/${resumeEp.id}`}>
              {continueId ? "이어보기" : "첫화 보기"} · {resumeEp.label}
            </Link>
          )}
        </div>
      </section>

      {toon.characters.length > 0 && (
        <section className="section">
          <h2 className="section__title">등장인물</h2>
          <div className="character-rail">
            {toon.characters.map((char) => (
              <figure key={char.id} className="character-card">
                <div className="character-card__thumb">
                  <img src={assetUrl(char.thumbnail)} alt={char.name} loading="lazy" />
                </div>
                <figcaption>
                  <p className="character-card__name">{char.name}</p>
                  {char.description && (
                    <p className="character-card__desc">{char.description}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section__title">회차 ({toon.episodeCount})</h2>
        <ul className="episode-list">
          {[...episodes].reverse().map((ep) => (
            <li key={ep.id}>
              <Link className="episode-row" to={`/reader/${toon.id}/${ep.id}`}>
                <div className="episode-row__thumb">
                  <img src={assetUrl(ep.thumbnail)} alt={ep.title} loading="lazy" />
                </div>
                <div className="episode-row__body">
                  <p className="episode-row__title">{ep.title}</p>
                  <p className="episode-row__meta">{ep.panelCount}컷</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
