import { useEffect, useRef, useState } from "react";
import { Link, Outlet, ScrollRestoration } from "react-router-dom";

const BASE = import.meta.env.BASE_URL;

export default function Layout() {
  const [barVisible, setBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setBarVisible(y < 60 || y < lastScrollY.current);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app">
      <div className={`topbar${barVisible ? "" : " topbar--hidden"}`}>
        <div className="wrap topbar__in">
          <Link className="brand" to="/">
            <img className="brand__logo" src={`${BASE}logo2.png`} alt="AIToon" />
          </Link>
          <nav className="nav">
            <Link to="/">홈</Link>
          </nav>
          <div className="topbar__spacer" />
        </div>
      </div>

      <main>
        <Outlet />
      </main>

      <footer className="foot">
        <div className="wrap foot__row">
          <Link className="brand" to="/" style={{ fontSize: 17 }}>
            <img src={`${BASE}logo2.png`} alt="" style={{ height: 32 }} />
          </Link>
          <div>© 2026 AI 웹툰 포털 · 모든 회차는 자동 생성 콘텐츠입니다.</div>
        </div>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
