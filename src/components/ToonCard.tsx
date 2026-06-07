import { Link } from "react-router-dom";
import { koTitle } from "../lib/catalog";
import type { Webtoon } from "../lib/types";
import { assetUrl } from "../lib/paths";

export default function ToonCard({ toon }: { toon: Webtoon }) {
  return (
    <Link className="toon-card" to={`/series/${toon.id}`}>
      <div className="toon-card__thumb">
        <img src={assetUrl(toon.mainThumbnail)} alt={koTitle(toon.title)} loading="lazy" />
      </div>
      <div className="toon-card__body">
        <h3 className="toon-card__title">{koTitle(toon.title)}</h3>
        <p className="toon-card__latest">{toon.latestTitle}</p>
        {toon.tags.length > 0 && (
          <ul className="toon-card__tags">
            {toon.tags.slice(0, 3).map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
