export interface Direction {
  key: string;
  label: string;
  desc: string;
  radius: number;
  accent: string;
  accentSoft: string;
  grad?: string;
  btn: "solid" | "ink" | "grad" | "ghost";
  cardStyle: "below" | "overlay";
  heroStyle: "split" | "editorial" | "immersive";
  homeStyle?: "portal";
  cls?: string;
  vars?: Record<string, string>;
}

export const DIRECTIONS: Record<string, Direction> = {
  clean: {
    key: "clean",
    label: "클린 그리드",
    desc: "넉넉한 여백 · 포스터 그리드",
    radius: 18,
    accent: "#6C5CE7",
    accentSoft: "#EEEBFF",
    btn: "solid",
    cardStyle: "below",
    heroStyle: "split",
  },
  magazine: {
    key: "magazine",
    label: "매거진",
    desc: "에디토리얼 · 큰 타이포 · 랭킹",
    radius: 6,
    accent: "#5B4BDB",
    accentSoft: "#ECEAFB",
    btn: "ink",
    cardStyle: "overlay",
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
  cinema: {
    key: "cinema",
    label: "다크 시네마",
    desc: "어두운 몰입형 · 네온 액센트",
    radius: 16,
    accent: "#8B7CF0",
    accentSoft: "#241F36",
    grad: "linear-gradient(100deg,#8B7CF0,#EC4899)",
    btn: "grad",
    cardStyle: "overlay",
    heroStyle: "immersive",
    cls: "dark",
    vars: {
      "--bg": "#0c0c11",
      "--bg-2": "#0c0c11",
      "--card": "#16161f",
      "--ink": "#f4f3f8",
      "--ink-2": "#b3b1c0",
      "--ink-3": "#74727f",
      "--line": "#262531",
    },
  },
  bold: {
    key: "bold",
    label: "네오 볼드",
    desc: "두꺼운 테두리 · 하드 섀도우",
    radius: 0,
    accent: "#6C2BD9",
    accentSoft: "#ECDCFF",
    btn: "ink",
    cardStyle: "below",
    heroStyle: "editorial",
    cls: "bold",
    vars: {
      "--bg": "#FFF7EE",
      "--bg-2": "#FFF7EE",
      "--card": "#ffffff",
      "--ink": "#15120c",
      "--ink-2": "#3a352c",
      "--ink-3": "#7a7466",
      "--line": "#15120c",
    },
  },
  gallery: {
    key: "gallery",
    label: "갤러리",
    desc: "미니멀 · 헤어라인 · 여백",
    radius: 3,
    accent: "#6C5CE7",
    accentSoft: "#F0EEFC",
    btn: "ink",
    cardStyle: "below",
    heroStyle: "split",
    cls: "gallery",
    vars: {
      "--bg": "#f7f7f5",
      "--bg-2": "#f7f7f5",
      "--card": "#ffffff",
      "--ink": "#191917",
      "--ink-2": "#56554f",
      "--ink-3": "#9b9a93",
      "--line": "#e7e6e1",
    },
  },
  editorial: {
    key: "editorial",
    label: "에디토리얼",
    desc: "명조 세리프 · 큰 표지 · 갤러리 그리드",
    radius: 4,
    accent: "#2B2440",
    accentSoft: "#ECE8F4",
    btn: "ink",
    cardStyle: "below",
    heroStyle: "split",
    cls: "edito",
    vars: {
      "--bg": "#F4F1EA",
      "--bg-2": "#F4F1EA",
      "--card": "#FBFAF6",
      "--ink": "#1A1714",
      "--ink-2": "#56514A",
      "--ink-3": "#9C9588",
      "--line": "#E2DCCF",
    },
  },
  portal: {
    key: "portal",
    label: "코믹 포털",
    desc: "태그 필터 · 촘촘한 썸네일 그리드",
    radius: 14,
    accent: "#6C5CE7",
    accentSoft: "#EEEBFF",
    grad: "linear-gradient(100deg,#6C5CE7,#8B7CF0)",
    btn: "solid",
    cardStyle: "below",
    heroStyle: "split",
    homeStyle: "portal",
    cls: "portal",
    vars: {
      "--bg": "#ffffff",
      "--bg-2": "#F6F5FB",
      "--card": "#ffffff",
      "--ink": "#19181F",
      "--ink-2": "#4E4C58",
      "--ink-3": "#9A98A6",
      "--line": "#ECECF2",
      "--accent2": "#FF6B4A",
    },
  },
};

export const BASE_VARS: Record<string, string> = {
  "--bg": "#ffffff",
  "--bg-2": "#faf9fc",
  "--card": "#ffffff",
  "--ink": "#15131c",
  "--ink-2": "#4b4754",
  "--ink-3": "#8b8794",
  "--line": "#ecebf0",
};

export const DIRECTION_ORDER = ["portal", "editorial", "clean", "magazine", "vivid", "cinema", "bold", "gallery"];
