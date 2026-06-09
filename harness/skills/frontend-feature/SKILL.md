---
name: frontend-feature
description: "React 컴포넌트, 라우트, API 클라이언트, 상태 관리 등 프론트엔드 기능 구현 절차."
---

# Frontend Feature

React + Vite + TypeScript 프론트엔드에 새 기능을 구현하는 절차.

## Step 1: 기존 코드 파악
```
- src/routes/  — 기존 페이지 구조 확인
- src/components/ — 재사용 가능한 컴포넌트 확인
- src/styles/global.css — CSS 변수, 클래스 패턴 파악
- src/api/ — 기존 API 클라이언트 패턴 (없으면 새로 생성)
```

## Step 2: API 클라이언트 작성
`src/api/` 에 엔드포인트별 함수를 작성한다.

```typescript
// src/api/client.ts — 공통 fetch 래퍼
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}
```

## Step 3: 컴포넌트/라우트 구현
- 새 페이지 → `src/routes/FeatureName.tsx`
- 공유 컴포넌트 → `src/components/ComponentName.tsx`
- React Router에 라우트 등록 (`src/main.tsx` 또는 라우터 파일)
- 인증 필요 페이지: 로그인 상태 확인 후 미로그인 시 `/login` 리다이렉트

## Step 4: 스타일 작성
- 기존 CSS 변수 시스템 준수:
  - 색상: `--accent`, `--bg`, `--bg-2`, `--ink`, `--ink-2`, `--ink-3`, `--line`
  - 타이포: Noto Serif KR (제목), Pretendard (본문)
- 새 클래스는 BEM-like 명명: `.feature__element--modifier`
- `src/styles/global.css` 하단에 추가

## Step 5: 환경 변수
`VITE_API_URL` — 백엔드 API 주소. `.env.local`(로컬)에서 설정.  
빌드 시 누락되면 기본값(`http://localhost:4000/api/v1`)으로 동작.

## Step 6: 검증
```bash
npm run build          # TypeScript 오류 없음 확인
npm run dev            # http://localhost:5173/webtoon/ 에서 동작 확인
```
- 반응형 확인: 480px, 768px, 1280px
- 네트워크 탭에서 API 요청/응답 확인
- 인증 토큰 만료 시 동작 확인

## 자주 쓰는 패턴

### 로딩/에러 상태
```typescript
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  apiFetch<T>('/endpoint')
    .then(setData)
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
}, []);
```

### 인증 체크
```typescript
const token = localStorage.getItem('access_token');
if (!token) { navigate('/login'); return null; }
```
