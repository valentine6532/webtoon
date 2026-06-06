# 웹툰 포털 재구축 — React + Vite (GitHub Pages)

## 목표
기존 vanilla 정적 SPA를 버리고, **네이버웹툰 스타일 멀티 작품 포털**을 React + Vite로 재구축한다.
데이터 계층(`output/` + `scripts/build-catalog.mjs`)은 검증된 자산이므로 **계승**한다.

## 확정 사항
- 기술: **React + Vite** (JSX, TypeScript 미사용 — 단순성 우선; 필요시 TS 전환 가능)
- 디자인: **네이버웹툰 스타일** — 밝은 그리드 포털 + 세로 스크롤 뷰어
- 배포: GitHub Pages, base 경로 `/webtoon/`, URL `https://valentine6532.github.io/webtoon/`
- 라우팅: **HashRouter** (GH Pages에서 새로고침 404 없이 안전)
- 데이터: `build-catalog.mjs` 계승·개조 → React가 import하는 JSON 생성

## 핵심 아키텍처 결정
1. **이미지는 번들 금지.** `output/`(352MB)는 Vite가 건드리지 않는다.
   - catalog의 이미지 경로는 상대(`output/...`) 유지, 렌더 시 `import.meta.env.BASE_URL` 접두.
   - 개발 서버: Vite 플러그인으로 `/output` 정적 서빙.
   - 배포: 빌드 후 `output/`를 `dist/output`으로 복사하여 함께 게시.
2. **catalog 생성기 개조:** `assets/catalog.js`(전역변수) → `src/data/catalog.json`(순수 JSON, 동일 스키마).
   캐릭터 정보(`output/<toon>/character/*/sheet.png`, `definition.md`)도 catalog에 추가 → 시리즈 페이지에 캐릭터 섹션.
3. **배포 파이프라인:** GitHub Actions — build-catalog → vite build → output 복사 → Pages 아티팩트 게시.
   (기존 gh-pages 브랜치 배포 방식 먼저 확인 후 계승/교체 결정)

---

## 단계별 작업

### Phase 0 — 스캐폴드 & 안전장치
- [ ] 작업 브랜치 `redesign/react-portal` 생성
- [ ] 현재 gh-pages 배포 메커니즘 확인 (브랜치 내용 / Pages 설정)
- [ ] `npm create vite@latest` (react), 의존성 설치 (react-router-dom)
- [ ] `vite.config`에 `base: '/webtoon/'` + output 개발 서빙 플러그인
- [ ] 기존 `index.html` / `assets/{site.js,site.css,catalog.js}`는 `_legacy/`로 이동(삭제 아님)

### Phase 1 — 데이터 계층
- [ ] `build-catalog.mjs` 개조: `src/data/catalog.json` 출력 + 캐릭터 수집
- [ ] `src/lib/catalog.js` — 타입드 접근자(작품/회차/캐릭터 조회)
- [ ] `src/lib/paths.js` — `assetUrl(p)` = BASE_URL + 경로
- [ ] `src/lib/history.js` — localStorage 읽기기록/이어보기 (기존 로직 이식)

### Phase 2 — UI (네이버웹툰 스타일, 밝은 테마)
- [ ] `Header` / `Footer` / 레이아웃 셸
- [ ] `Home` — 작품 그리드 + 검색 + 태그 필터 + 최신 회차 + 이어보기 섹션
- [ ] `Series` — 표지/요약 + 회차 리스트(썸네일) + 캐릭터 섹션
- [ ] `Reader` — 세로 스크롤 뷰어 + 뷰어 크기(small/normal/wide) + 이전/다음화 + 읽기기록 저장
- [ ] 반응형 (모바일 우선) + 키보드/접근성

### Phase 3 — 빌드 & 배포
- [ ] `npm run build` 성공 확인, `vite preview`로 base 경로 동작 검증
- [ ] output → dist 복사 스크립트 (`scripts/assemble-dist.mjs` 또는 Action 단계)
- [ ] `.github/workflows/deploy.yml` 작성 (Pages 아티팩트 흐름)
- [ ] `.nojekyll` 유지

### Phase 4 — 검증 (완료 처리 전 필수)
- [ ] 로컬 preview에서: 그리드 탐색 / 시리즈 / 뷰어 세로스크롤 / 검색·태그 / 이어보기 / 새로고침 안전 / 이미지 로드 확인
- [ ] 브라우저(Chrome MCP)로 실제 렌더 스크린샷 확인
- [ ] base 경로(`/webtoon/`)에서 모든 에셋 200 응답 확인
- [ ] 배포 후 실제 GH Pages URL 확인

---

## 리뷰 (2026-06-07 구현 완료)

### 완료된 작업
- **Phase 0:** `redesign/react-portal` 브랜치 생성. gh-pages 배포(force_orphan) 방식 확정. Vite+React+TS 수동 스캐폴드. 기존 파일 `_legacy/`로 이동(삭제 안 함).
- **Phase 1:** `build-catalog.mjs` 개조 → `src/data/catalog.json` 출력 + 캐릭터 수집(definition.md 파싱). `lib/{catalog,paths,history}.ts` 작성.
- **Phase 2:** Naver웹툰 스타일 UI — Layout/Header/Footer, Home(그리드+검색+태그+최신+이어보기), Series(표지+캐릭터+회차), Reader(세로스크롤+크기토글+이전/다음+읽기기록), NotFound. `styles/global.css`(녹색 #00dc64 액센트, 반응형).
- **Phase 3:** `vite.config.ts` base `/webtoon/` + output 개발 서빙 미들웨어. `assemble-dist.mjs`(output→dist 복사). `.github/workflows/deploy.yml`(GH Actions → gh-pages).

### 검증 결과 (브라우저 실측)
- ✅ 프로덕션 빌드: tsc 타입체크 통과 + vite 번들 232KB(gzip 72KB)
- ✅ 홈 렌더링: 히어로/최신/그리드 정상
- ✅ 이미지 로드: output 미들웨어로 `/webtoon/output/...` 실제 해상도 로드(887×1774 등)
- ✅ Series: 캐릭터 7명, 회차 2개, 이어보기 버튼
- ✅ Reader: 64패널 세로스크롤, 크기토글(좁게/보통/넓게), 이전/다음, 읽기기록 localStorage 저장
- ✅ 검색 필터(2→1), 태그칩, 이어보기 섹션 동적 등장
- ✅ HashRouter — 새로고침 안전

### 남은 일 (사용자 결정/액션 필요)
- [ ] 커밋 & main 머지 (요청 시) → push 시 GH Actions 자동 배포
- [ ] GitHub Settings → Pages → Source가 `gh-pages` 브랜치인지 확인
- [ ] 배포 후 https://valentine6532.github.io/webtoon/ 실측
- [ ] (선택) meta.json에 summary/author/tags 추가하면 그리드·시리즈에 자동 반영
- [ ] (선택) webtoon-orchestrator가 새 회차 생성 시 이 구조(output/)에 맞춰 출력하는지 점검
