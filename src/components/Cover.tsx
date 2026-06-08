import type { CSSProperties } from "react";

type CoverSize = "poster" | "posterArt" | "posterLg" | "heroArt" | "thumb";

const SIZES: Record<CoverSize, { t: number; a: number; g: number; plate: boolean }> = {
  poster:    { t: 21, a: 12.5, g: 150, plate: true },
  posterArt: { t: 0,  a: 0,    g: 210, plate: false },
  posterLg:  { t: 34, a: 16,   g: 240, plate: true },
  heroArt:   { t: 0,  a: 0,    g: 460, plate: false },
  thumb:     { t: 0,  a: 0,    g: 0,   plate: false },
};

interface CoverProps {
  src?: string;
  colors?: [string, string, string];
  title?: string;
  author?: string;
  radius?: number;
  overlay?: boolean;
  size?: CoverSize;
  className?: string;
  style?: CSSProperties;
}

export function Cover({
  src,
  colors = ["#6C5CE7", "#3B2BA0", "#A5B4FC"],
  title = "",
  author = "",
  radius = 16,
  overlay = false,
  size = "poster",
  className = "",
  style = {},
}: CoverProps) {
  const [a, b, mono] = colors;
  const s = SIZES[size];

  return (
    <div
      className={"cover " + className}
      style={{
        background: `linear-gradient(158deg, ${a} 0%, ${b} 100%)`,
        borderRadius: radius,
        ...style,
      }}
    >
      {src ? (
        <>
          <img src={src} alt="" aria-hidden="true" />
          {overlay && <div className="cover__scrim" />}
        </>
      ) : (
        <>
          <div className="cover__bloom" style={{ background: `radial-gradient(86% 62% at 76% 14%, ${mono}66 0%, transparent 58%)` }} />
          <div className="cover__blob" style={{ background: `radial-gradient(70% 55% at 18% 88%, ${a}cc 0%, transparent 60%)` }} />
          <div className="cover__deep" />
          <div className="cover__sheen" />
          <div className="cover__grain" />
          {s.g > 0 && (
            <div className="cover__ghost" style={{ color: mono, fontSize: s.g }}>
              {title.slice(0, 1)}
            </div>
          )}
          {s.plate && title && (
            <div className="cover__plate">
              <div className="cover__title" style={{ color: "#fff", fontSize: s.t }}>{title}</div>
              <div className="cover__author" style={{ color: mono, fontSize: s.a }}>{author}</div>
            </div>
          )}
          {overlay && <div className="cover__scrim" />}
        </>
      )}
    </div>
  );
}
