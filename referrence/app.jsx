// ============ AIToon — app shell, routing, direction switching ============
function applyDirection(dir) {
  const r = document.documentElement;
  r.style.setProperty("--accent", dir.accent);
  r.style.setProperty("--accent-soft", dir.accentSoft);
  r.style.setProperty("--radius", dir.radius + "px");
  r.style.setProperty("--grad", dir.grad || `linear-gradient(100deg, ${dir.accent}, ${dir.accent})`);
}

function TopBar({ view, dirKey, setDirKey, query, setQuery, goHome }) {
  return (
    <div className="topbar">
      <div className="wrap topbar__in">
        <div className="brand" onClick={goHome}>
          <span className="brand__mark">A</span>
          <span><span className="brand__ai">AI</span>Toon</span>
        </div>
        <nav className="nav">
          <a className={view === "home" ? "on" : ""} onClick={goHome}>홈</a>
          <a>신작</a>
          <a>랭킹</a>
        </nav>
        <div className="topbar__spacer" />
        <div className="search">
          {Icon.search({})}
          <input
            placeholder="작품·작가·태그 검색"
            value={query}
            onChange={(e) => { setQuery(e.target.value); }}
          />
        </div>
      </div>
    </div>
  );
}

function Switcher({ dirKey, setDirKey }) {
  return (
    <div className="wrap">
      <div className="switcher">
        <span className="switcher__label">디자인 방향</span>
        <div className="seg">
          {Object.values(DIRECTIONS).map((d) => (
            <button key={d.key} className={dirKey === d.key ? "on" : ""} onClick={() => setDirKey(d.key)}>
              <span className="t">{d.label}</span>
              <span className="d">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [dirKey, setDirKey] = useState("clean");
  const [view, setView] = useState("home"); // home | detail | viewer
  const [work, setWork] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [query, setQuery] = useState("");
  const dir = DIRECTIONS[dirKey];

  useEffect(() => { applyDirection(dir); }, [dirKey]);

  const goHome = () => { setView("home"); setWork(null); window.scrollTo(0, 0); };
  const openWork = (w) => { setWork(w); setView("detail"); window.scrollTo(0, 0); };
  const readEp = (w, ep) => { setWork(w); setEpisode(ep); setView("viewer"); };
  const backToDetail = () => { setView("detail"); window.scrollTo(0, 0); };

  // viewer takes over the whole screen (its own dark chrome)
  if (view === "viewer") {
    return <Viewer work={work} episode={episode} dir={dir} onBack={backToDetail} onChangeEp={(ep) => readEp(work, ep)} />;
  }

  return (
    <div className="app">
      <TopBar view={view} dirKey={dirKey} setDirKey={setDirKey} query={query} setQuery={setQuery} goHome={goHome} />
      {view === "home" && <Switcher dirKey={dirKey} setDirKey={setDirKey} />}

      {view === "home" && <Home dir={dir} query={query} setQuery={setQuery} onOpen={openWork} />}
      {view === "detail" && (
        <>
          <div className="wrap" style={{ paddingTop: 18 }}>
            <button className="btn btn--ghost" style={{ height: 40, fontSize: 14 }} onClick={goHome}>
              {Icon.back({})} 작품 목록
            </button>
          </div>
          <Detail work={work} dir={dir} onBack={goHome} onRead={readEp} />
        </>
      )}

      <footer className="foot">
        <div className="wrap foot__row">
          <div className="brand" style={{ fontSize: 17 }}>
            <span className="brand__mark" style={{ width: 24, height: 24, fontSize: 13 }}>A</span>
            <span><span className="brand__ai">AI</span>Toon</span>
          </div>
          <div>© 2026 AIToon · AI가 그리는 새로운 이야기</div>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
