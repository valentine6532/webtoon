// ============ AIToon — Detail screen ============
function Detail({ work, dir, onBack, onRead }) {
  const eps = window.AITOON_makeEpisodes(work);
  const first = eps[eps.length - 1];
  const latest = eps[0];

  return (
    <div className="fade-enter">
      <div className="detail__hero">
        <div className="detail__bg"><Cover work={work} radius={0} size="thumb" /></div>
        <div className="detail__scrim" />
        <div className="wrap">
          <div className="detail__top">
            <div className="detail__poster"><Cover work={work} radius={dir.radius} size="posterLg" /></div>
            <div className="detail__info">
              <div className="detail__genres">
                {work.genres.map((g) => <span key={g} className="chip">{g}</span>)}
                {work.isNew && <span className="badge badge--new">NEW</span>}
              </div>
              <h1 className="detail__title">{work.title}</h1>
              <div className="detail__author">{work.author}</div>
              <div className="detail__stats">
                <div className="detail__stat">
                  <div className="v" style={{ color: "#f5a623" }}>★ {work.rating}</div>
                  <div className="l">평점</div>
                </div>
                <div className="detail__stat">
                  <div className="v">{work.views}</div>
                  <div className="l">조회</div>
                </div>
                <div className="detail__stat">
                  <div className="v">{work.episodes}화</div>
                  <div className="l">연재</div>
                </div>
              </div>
              <p className="detail__syn">{work.synopsis}</p>
              <div className="detail__cta">
                <button className={"btn btn--" + dir.btn} onClick={() => onRead(work, first)}>
                  {Icon.play({})} 처음부터 보기
                </button>
                <button className="btn btn--ghost" onClick={() => onRead(work, latest)}>
                  최신화 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <section className="sec" style={{ paddingTop: 8 }}>
          <div className="eplist__head" style={{ marginBottom: 14 }}>
            <div className="eplist__count">전체 <b>{eps.length}화</b></div>
            <button className="btn btn--ghost" style={{ height: 38, fontSize: 14 }}>
              {Icon.list({})} 정렬
            </button>
          </div>
          <div>
            {eps.map((ep) => (
              <div className="ep" key={ep.no} onClick={() => onRead(work, ep)}>
                <div className="ep__thumb">
                  <Cover work={work} radius={9} size="thumb" />
                  {!ep.free && <div className="ep__lock">{Icon.lock({})}</div>}
                </div>
                <div className="ep__main">
                  <div className="ep__name">
                    {ep.title}
                    {ep.isLatest && <span className="ep__latest">최신</span>}
                    {!ep.free && <span style={{ color: "var(--ink-3)", fontSize: 12, fontWeight: 700 }}>· 대여</span>}
                  </div>
                  <div className="ep__date">
                    <span>{ep.no}화</span>
                    <span>{ep.date}</span>
                  </div>
                </div>
                <div className="ep__right">{Icon.heart({})} {ep.likes.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { Detail });
