import { Link, Outlet, ScrollRestoration } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/">
            <span className="brand__mark" aria-hidden="true">AI</span>
            <span className="brand__name">AI 웹툰</span>
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
