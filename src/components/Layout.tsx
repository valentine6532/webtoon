import { useEffect, useRef, useState } from "react";
import { Link, Outlet, ScrollRestoration } from "react-router-dom";

const BASE = import.meta.env.BASE_URL;

export default function Layout() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHeaderVisible(y < 60 || y < lastScrollY.current);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="layout">
      <header className={`site-header${headerVisible ? "" : " site-header--hidden"}`}>
        <div className="site-header__inner">
          <Link className="brand" to="/">
            <img
              className="brand__logo"
              src={`${BASE}logo-out.png`}
              alt="AI 웹툰"
              height={48}
            />
          </Link>
          <nav className="top-nav" aria-label="주요 메뉴">
            <Link to="/">홈</Link>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>AI로 만든 웹툰 포털 · 모든 회차는 자동 생성 콘텐츠입니다.</p>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
