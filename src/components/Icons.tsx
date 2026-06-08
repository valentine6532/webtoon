import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function SearchIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path d="M12 3.5l2.6 5.3 5.9.86-4.3 4.18 1 5.86L12 17.9l-5.2 2.76 1-5.86-4.3-4.18 5.9-.86z" fill="currentColor" />
    </svg>
  );
}

export function HeartIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path d="M12 20s-7-4.3-9.2-8.4C1.3 8.7 2.6 5.5 5.6 5.1 7.6 4.8 9 6 12 8.5 15 6 16.4 4.8 18.4 5.1c3 .4 4.3 3.6 2.8 6.5C19 15.7 12 20 12 20z" fill="currentColor" />
    </svg>
  );
}

export function BackIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
    </svg>
  );
}

export function ListIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SettingIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
