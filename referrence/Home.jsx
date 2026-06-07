// ============ AIToon — Home screen ============
function WorkCard({ work, dir, onOpen }) {
  const overlay = dir.cardStyle === "overlay";
  return (
    <div className={"card" + (overlay ? " is-overlay" : "")} onClick={() => onOpen(work)}>
      <div className="card__poster">
        <Cover work={work} radius={dir.radius} overlay={overlay} size="posterArt" />
        <div className="card__badges">
          {work.isNew && <span className="badge badge--new">NEW</span>}
          {work.isUp && !work.isNew && <span className="badge badge--up">UP</span>}
        </div>
        {overlay && (
          <div className="card__overlay">
            <div className="n">{work.title}</div>
            <div className="s">
              <span className="rating">{Icon.star({})}{work.rating}</span>
              <span>· {work.genres[0]}</span>
            </div>
          </div>
        )}
      </div>
      {!overlay && (
        <div className="card__meta">
          <div className="card__name">{work.title}</div>
          <div className="card__sub">
            <span className="rating">{Icon.star({})}{work.rating}</span>
            <span>· {work.author}</span>
          </div>
          <div className="card__genres">
            {work.genres.map((g) => (
              <span key={g} className="chip chip--ghost">{g}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Hero({ work, dir, onOpen }) {
  const cta = (
    <div className={dir.heroStyle === "split" ? "hero__cta" : "hero__cta"}>
      <button className={"btn btn--" + dir.btn} onClick={() => onOpen(work)}>
        {Icon.play({})} 첫 화 보기
      </button>
      <button className="btn btn--ghost" onClick={() => onOpen(work)}>
        최신화 · {work.episodes}화
      </button>
    </div>
  );

  if (dir.heroStyle === "editorial") {
    return (
      <div className="hero hero--editorial">
        <Cover work={work} radius={0} overlay size="heroArt" />
        <div className="hero__scrim" style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.78) 6%, rgba(0,0,0,0.25) 55%, transparent 80%)" }} />
        <div className="hero__text">
          <div className="hero__eyebrow">이주의 추천작</div>
          <h1 className="hero__title">{work.title}</h1>
          <p className="hero__tag">{work.tagline}</p>
          {cta}
        </div>
      </div>
    );
  }

  if (dir.heroStyle === "immersive") {
    const [a, b] = work.cover;
    return (
      <div className="hero hero--immersive">
        <div className="hero__bg" style={{ background: `linear-gradient(115deg, ${a}, ${b})` }} />
        <div className="hero__bg" style={{ background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)", opacity: 0.6 }} />
        <div className="hero__text">
          <div className="hero__eyebrow">오늘의 픽 · AI Studio</div>
          <h1 className="hero__title">{work.title}</h1>
          <p className="hero__tag">{work.tagline}</p>
          {cta}
        </div>
        <div className="hero__float">
          <Cover work={work} radius={0} size="posterLg" />
        </div>
      </div>
    );
  }

  // split (clean)
  return (
    <div className="hero hero--split">
      <div className="hero__text">
        <div className="hero__eyebrow">최신 업데이트</div>
        <h1 className="hero__title">{work.title}</h1>
        <p className="hero__tag">{work.tagline}</p>
        {cta}
      </div>
      <div className="hero__art">
        <Cover work={work} radius={0} size="heroArt" />
      </div>
    </div>
  );
}

function Ranking({ works, dir, onOpen }) {
  return (
    <div className="rank">
      {works.slice(0, 8).map((w, i) => (
        <div className="rank__item" key={w.id} onClick={() => onOpen(w)}>
          <div className="rank__num">{i + 1}</div>
          <div className="rank__thumb"><Cover work={w} radius={8} size="thumb" /></div>
          <div className="rank__body">
            <div className="rank__name">{w.title}</div>
            <div className="rank__sub">{w.genres.join(" · ")} · 조회 {w.views}</div>
          </div>
          <span className="rating" style={{ marginLeft: "auto" }}>{Icon.star({})}{w.rating}</span>
        </div>
      ))}
    </div>
  );
}

function Home({ dir, query, setQuery, onOpen }) {
  const works = window.AITOON_WORKS;
  const [day, setDay] = useState("전체");
  const featured = works[0];

  const q = query.trim();
  let list = works;
  if (q) {
    list = works.filter(
      (w) => w.title.includes(q) || w.author.includes(q) || w.genres.some((g) => g.includes(q))
    );
  }

  const isMag = dir.key === "magazine";

  return (
    <div className="fade-enter">
      <div className="wrap">
        {!q && <Hero work={featured} dir={dir} onOpen={onOpen} />}

        {/* magazine direction leads with a ranking block */}
        {!q && isMag && (
          <section className="sec">
            <div className="sec__head">
              <div className="sec__title">실시간 랭킹</div>
              <div className="sec__sub">방금 전 업데이트</div>
            </div>
            <Ranking works={works} dir={dir} onOpen={onOpen} />
          </section>
        )}

        <section className="sec">
          <div className="sec__head">
            <div className="sec__title">{q ? `'${q}' 검색 결과` : "전체 작품"}</div>
            {!q && <div className="sec__sub">{works.length}개의 작품</div>}
          </div>
          {!q && (
            <div className="days" style={{ marginBottom: 22 }}>
              {["전체", ...window.AITOON_DAYS].map((d) => (
                <button key={d} className={day === d ? "on" : ""} onClick={() => setDay(d)}>
                  {d === "전체" ? d : d + "요일"}
                </button>
              ))}
            </div>
          )}
          <div className="grid">
            {(day === "전체" || q ? list : list.filter((w) => w.day === day)).map((w) => (
              <WorkCard key={w.id} work={w} dir={dir} onOpen={onOpen} />
            ))}
          </div>
          {(day === "전체" || q ? list : list.filter((w) => w.day === day)).length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-3)", fontWeight: 600 }}>
              해당하는 작품이 없어요.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { Home, WorkCard });
