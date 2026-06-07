// ============ AIToon — Viewer (vertical scroll reader) ============
function Panel({ work, idx }) {
  const [a, b] = work.cover;
  // vary tone per panel so the strip feels composed
  const heights = [560, 820, 420, 900, 640, 760, 480, 720];
  const h = heights[idx % heights.length];
  const t = idx / 8;
  const mix = `color-mix(in srgb, ${a} ${Math.round(70 - t * 35)}%, ${b})`;
  const labels = ["장면", "SCENE", "컷", "PANEL"];
  return (
    <div className="panel" style={{ height: h, background: `linear-gradient(${160 + idx * 8}deg, ${mix}, ${b})` }}>
      <div className="panel__grain" />
      <div className="panel__label">{labels[idx % labels.length]} {String(idx + 1).padStart(2, "0")} — 작화 영역</div>
    </div>
  );
}

function Viewer({ work, episode, dir, onBack, onChangeEp }) {
  const [progress, setProgress] = useState(0);
  const [hideBar, setHideBar] = useState(false);
  const lastY = useRef(0);
  const eps = window.AITOON_makeEpisodes(work);
  const idx = eps.findIndex((e) => e.no === episode.no);
  const prevEp = eps[idx + 1]; // older
  const nextEp = eps[idx - 1]; // newer

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
      setHideBar(y > lastY.current && y > 120);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [episode.no, work.id]);

  const panels = Array.from({ length: 8 });

  return (
    <div className="viewer">
      <div className="viewer__progress" style={{ width: progress + "%" }} />
      <div className={"viewer__bar" + (hideBar ? " hide" : "")}>
        <button onClick={onBack} aria-label="뒤로">{Icon.back({})}</button>
        <div style={{ minWidth: 0 }}>
          <div className="t" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{work.title}</div>
          <div className="s">{episode.title} · {episode.no}화</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button aria-label="설정">{Icon.setting({})}</button>
        </div>
      </div>

      <div className="viewer__strip">
        {panels.map((_, i) => <Panel key={i} work={work} idx={i} />)}
      </div>

      <div className="viewer__end">
        <h3>{episode.no}화 끝</h3>
        <p>다음 화에서 계속됩니다.</p>
        <div className="viewer__nav">
          <button className="btn btn--ghost" disabled={!prevEp} style={{ opacity: prevEp ? 1 : 0.4 }} onClick={() => prevEp && onChangeEp(prevEp)}>
            {Icon.back({})} 이전화
          </button>
          {nextEp ? (
            <button className={"btn btn--" + dir.btn} onClick={() => onChangeEp(nextEp)}>
              다음화 {Icon.chevron({})}
            </button>
          ) : (
            <button className={"btn btn--" + dir.btn} onClick={onBack}>목록으로</button>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Viewer });
