// ============ AIToon — webtoon dataset (fictional) ============
// Covers are designed gradient placeholders (no real art). Each work
// carries a 2-stop gradient + accent so the grid feels art-directed.

const WORKS = [
  {
    id: "crown",
    title: "거짓의 왕관",
    author: "AI Studio",
    genres: ["로맨스", "궁중"],
    episodes: 4,
    rating: 9.7,
    views: "128.4만",
    day: "월",
    isNew: true,
    isUp: true,
    tagline: "왕좌를 향한 가장 우아한 거짓말",
    synopsis:
      "몰락한 가문의 영애 '레아'는 죽은 황녀를 대신해 황궁에 들어선다. 모두를 속여야만 살아남는 거짓의 왕관 아래, 그녀는 진짜 권력의 맛을 알게 된다.",
    cover: ["#7C3AED", "#3B1C66"],
    mono: "#FBBF24",
  },
  {
    id: "shaman",
    title: "무당들의 왕",
    author: "달밤 스튜디오",
    genres: ["액션", "오컬트"],
    episodes: 2,
    rating: 9.4,
    views: "61.2만",
    day: "월",
    isNew: true,
    isUp: true,
    tagline: "신병을 앓던 소년, 귀신을 베다",
    synopsis:
      "신병을 앓던 소년 '서진'은 도시의 어둠 속 떠도는 원혼들을 마주한다. 산 자와 죽은 자 사이, 그가 짊어진 운명의 무게.",
    cover: ["#0EA5A0", "#0B2E33"],
    mono: "#5EEAD4",
  },
  {
    id: "station",
    title: "별빛 정거장",
    author: "노을 컴퍼니",
    genres: ["SF", "감성"],
    episodes: 12,
    rating: 9.8,
    views: "342.0만",
    day: "화",
    isNew: false,
    isUp: true,
    tagline: "우주의 끝, 마지막 정거장에서",
    synopsis:
      "은하의 끝자락 정거장 '에코'에서 일하는 정비공 '하루'. 매일 떠나는 이들을 배웅하던 그녀 앞에, 떠나지 못하는 한 사람이 나타난다.",
    cover: ["#6366F1", "#1E1B4B"],
    mono: "#A5B4FC",
  },
  {
    id: "bakery",
    title: "한밤의 베이커리",
    author: "버터핑거",
    genres: ["일상", "힐링"],
    episodes: 28,
    rating: 9.5,
    views: "210.7만",
    day: "수",
    isNew: false,
    isUp: false,
    tagline: "자정에만 문을 여는 빵집",
    synopsis:
      "자정에만 문을 여는 작은 베이커리. 잠 못 드는 손님들의 사연을 따뜻한 빵 한 조각으로 어루만지는 다정한 이야기.",
    cover: ["#FB923C", "#7C2D12"],
    mono: "#FED7AA",
  },
  {
    id: "forest",
    title: "검은 숲의 계약",
    author: "이끼와 안개",
    genres: ["판타지", "스릴러"],
    episodes: 16,
    rating: 9.6,
    views: "98.3만",
    day: "목",
    isNew: false,
    isUp: true,
    tagline: "숲은 모든 약속을 기억한다",
    synopsis:
      "마을을 지키기 위해 숲의 정령과 계약을 맺은 '엔'. 대가는 기억 한 조각. 계약이 거듭될수록 그녀는 자신이 누구였는지 잊어간다.",
    cover: ["#10B981", "#064E3B"],
    mono: "#6EE7B7",
  },
  {
    id: "wind",
    title: "너의 이름은 바람",
    author: "민트초코",
    genres: ["로맨스", "청춘"],
    episodes: 34,
    rating: 9.3,
    views: "187.5만",
    day: "금",
    isNew: false,
    isUp: false,
    tagline: "불러도 닿지 않는 첫사랑",
    synopsis:
      "바람이 불 때마다 떠오르는 이름. 전학생 '유리'와 방송부 '하랑'의 서툴고 눈부신 열일곱의 계절.",
    cover: ["#38BDF8", "#0C4A6E"],
    mono: "#BAE6FD",
  },
  {
    id: "ruins",
    title: "폐허의 검사",
    author: "강철나비",
    genres: ["무협", "액션"],
    episodes: 52,
    rating: 9.7,
    views: "401.9만",
    day: "토",
    isNew: false,
    isUp: true,
    tagline: "잿더미 위에서 검을 다시 든다",
    synopsis:
      "멸문한 가문의 마지막 검사 '진하'. 복수가 아닌 재건을 위해, 그는 무너진 강호에 다시 검을 겨눈다.",
    cover: ["#EF4444", "#450A0A"],
    mono: "#FCA5A5",
  },
  {
    id: "nabi",
    title: "고양이 탐정 나비",
    author: "츄르공장",
    genres: ["코미디", "추리"],
    episodes: 41,
    rating: 9.2,
    views: "153.1만",
    day: "일",
    isNew: false,
    isUp: false,
    tagline: "사건 해결률 100%, 단 간식이 있을 때",
    synopsis:
      "동네에서 일어나는 작은 사건들을 해결하는 고양이 탐정 '나비'. 단서는 냄새로, 추리는 낮잠 후에.",
    cover: ["#F59E0B", "#78350F"],
    mono: "#FDE68A",
  },
];

// Episode lists are generated so the detail page always has content.
function makeEpisodes(work) {
  const titles = {
    crown: ["프롤로그 — 죽은 황녀", "황궁의 문", "첫 번째 거짓말", "의심의 눈"],
    shaman: ["신병", "첫 번째 원혼"],
  };
  const n = work.episodes;
  const list = [];
  for (let i = n; i >= 1; i--) {
    const custom = titles[work.id] && titles[work.id][i - 1];
    list.push({
      no: i,
      title: custom || `${i}화`,
      date: `25.${String(((i * 3) % 12) + 1).padStart(2, "0")}.${String(((i * 7) % 27) + 1).padStart(2, "0")}`,
      likes: Math.round((work.rating * 1000 - i * 37) % 9000) + 800,
      free: i <= 3 || i > n - 1,
      isLatest: i === n,
    });
  }
  return list;
}

window.AITOON_WORKS = WORKS;
window.AITOON_makeEpisodes = makeEpisodes;
window.AITOON_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
