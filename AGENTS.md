# 웹툰 제작 하네스

**목표:** 사용자의 아이디어를 받아 스토리 기획 → 스크립트 → 콘티 → 이미지 → HTML 웹툰까지 자동으로 완성

**트리거:** 웹툰 제작/수정/재실행 요청 시 `webtoon-orchestrator` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**실행 방법 (중요):** 이 프로젝트는 **Vite + React + TypeScript** 앱이다. 진입점이 `src/main.tsx`이므로 `python -m http.server` 같은 정적 파일 서버로는 절대 동작하지 않는다(빈 화면). 반드시:
```
npm install   # 최초 1회 (node_modules 없을 때)
npm run dev
```
접속 주소는 **http://localhost:5173/webtoon/** (vite.config.ts의 `base: '/webtoon/'` 때문에 끝의 `/webtoon/` 경로 필수).

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-05-29 | 초기 구성 | 전체 | - |
