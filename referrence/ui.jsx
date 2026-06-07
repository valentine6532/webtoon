// ============ AIToon — shared UI: Cover, Icons, theme directions ============
const { useState, useEffect, useRef } = React;

// ---- subtle grain (procedural, not illustration) ----
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")";

// ---- Cover: a designed gradient poster placeholder for one work ----
// size presets keep type readable without container queries (screenshot-safe)
const COVER_SIZES = {
  poster: { t: 21, a: 12.5, g: 150, plate: true },
  posterArt: { t: 0, a: 0, g: 210, plate: false },
  posterLg: { t: 34, a: 16, g: 240, plate: true },
  heroArt: { t: 0, a: 0, g: 460, plate: false },
  thumb: { t: 0, a: 0, g: 0, plate: false },
};
function Cover({ work, radius = 16, overlay = false, size = "poster", className = "", style = {} }) {
  const [a, b] = work.cover;
  const s = COVER_SIZES[size] || COVER_SIZES.poster;
  return (
    <div
      className={"cover " + className}
      style={{
        background: `linear-gradient(155deg, ${a} 0%, ${b} 100%)`,
        borderRadius: radius,
        ...style,
      }}
    >
      {/* light bloom */}
      <div
        className="cover__bloom"
        style={{
          background: `radial-gradient(120% 80% at 78% 12%, ${work.mono}55 0%, transparent 55%)`,
        }}
      />
      {/* grain (screenshot-safe soft texture via repeating gradient) */}
      <div className="cover__grain" />
      {/* big ghost initial */}
      {s.g > 0 && (
        <div className="cover__ghost" style={{ color: work.mono, fontSize: s.g }}>
          {work.title.slice(0, 1)}
        </div>
      )}
      {/* title plate */}
      {s.plate && (
        <div className="cover__plate">
          <div className="cover__title" style={{ color: "#fff", fontSize: s.t }}>
            {work.title}
          </div>
          <div className="cover__author" style={{ color: work.mono, fontSize: s.a }}>
            {work.author}
          </div>
        </div>
      )}
      {overlay && <div className="cover__scrim" />}
    </div>
  );
}

// ---- tiny inline icons (geometric only) ----
const Icon = {
  search: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path
        d="M12 3.5l2.6 5.3 5.9.86-4.3 4.18 1 5.86L12 17.9l-5.2 2.76 1-5.86-4.3-4.18 5.9-.86z"
        fill="currentColor"
      />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path
        d="M12 20s-7-4.3-9.2-8.4C1.3 8.7 2.6 5.5 5.6 5.1 7.6 4.8 9 6 12 8.5 15 6 16.4 4.8 18.4 5.1c3 .4 4.3 3.6 2.8 6.5C19 15.7 12 20 12 20z"
        fill="currentColor"
      />
    </svg>
  ),
  back: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
    </svg>
  ),
  lock: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" {...p}>
      <rect x="5" y="10" width="14" height="9" rx="2" fill="currentColor" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  list: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  setting: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ---- the three design directions (shared purple family) ----
const DIRECTIONS = {
  clean: {
    key: "clean",
    label: "클린 그리드",
    desc: "넉넉한 여백 · 정직한 포스터 그리드",
    radius: 18,
    accent: "#6C5CE7",
    accentSoft: "#EEEBFF",
    btn: "solid", // solid purple
    cardStyle: "below", // title under poster
    heroStyle: "split",
  },
  magazine: {
    key: "magazine",
    label: "매거진",
    desc: "에디토리얼 · 큰 타이포 · 랭킹",
    radius: 6,
    accent: "#5B4BDB",
    accentSoft: "#ECEAFB",
    btn: "ink", // near-black w/ purple underline
    cardStyle: "overlay", // title on cover
    heroStyle: "editorial",
  },
  vivid: {
    key: "vivid",
    label: "비비드",
    desc: "그라데이션 · 둥근 카드 · 컬러 칩",
    radius: 26,
    accent: "#7C3AED",
    accentSoft: "#F4ECFF",
    grad: "linear-gradient(100deg,#7C3AED,#EC4899)",
    btn: "grad",
    cardStyle: "overlay",
    heroStyle: "immersive",
  },
};

Object.assign(window, { Cover, Icon, DIRECTIONS, GRAIN });
