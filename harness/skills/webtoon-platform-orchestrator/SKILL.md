---
name: webtoon-platform-orchestrator
description: "웹툰 게시 플랫폼의 신규 기능 개발, 버그 수정, 스키마 변경 등 전반적인 개발 작업 요청 시 사용한다."
---

# Webtoon Platform Orchestrator

웹툰 게시 플랫폼(프론트엔드 + 백엔드 + DB) 개발의 전반을 조율한다.

## 프로젝트 구조
```
/                        # repository root
├── src/                 # 프론트엔드 (React + Vite + TypeScript)
├── backend/             # 백엔드 (Express + Prisma + TypeScript)
├── harness/             # 하네스 본체
├── .claude/             # Claude 런타임 adapter
├── .codex/              # Codex 런타임 adapter
├── _workspace/          # 실행 중 임시 산출물
└── output/              # 기존 AI 생성 웹툰 에셋
```

## 기술 스택
| 레이어 | 기술 |
|--------|------|
| 프론트엔드 | React 18 + Vite + TypeScript |
| 백엔드 | Node.js + Express + TypeScript |
| ORM | Prisma |
| DB | PostgreSQL |
| 인증 | JWT (access 15분 + refresh 7일) |
| 이미지 | Multer → `backend/uploads/` |
| 배포 | GitHub Pages (프론트) + 별도 서버 (백엔드) |

## 실행 패턴: Supervisor

parent(오케스트레이터)가 작업을 분석해 적합한 agent를 spawn하고 결과를 통합한다.

### Agent 구성표
| Agent | 역할 | 사용 스킬 | 출력 위치 |
|-------|------|-----------|----------|
| db-designer | 스키마 설계/변경 | db-migration | `backend/prisma/schema.prisma` |
| backend-dev | REST API 구현 | backend-feature | `backend/src/` |
| frontend-dev | UI/UX 구현 | frontend-feature | `src/` |
| reviewer | 코드 리뷰 | autonomous-bugfix | 판정 반환 |
| bug-fixer | 버그 수정 | autonomous-bugfix | `harness/bugfix/` |
| qa-inspector | E2E 검증 | autonomous-bugfix | 판정 반환 |

## _workspace/ 파일 규칙
| 파일 | 작성자 | 내용 |
|------|--------|------|
| `_workspace/01_task_spec.md` | orchestrator | 기능 요구사항, 범위, 완료 조건 |
| `_workspace/02_db_changes.md` | db-designer | 스키마 변경 사항, 마이그레이션 메모 |
| `_workspace/03_api_spec.md` | backend-dev | 구현된 엔드포인트 목록, 요청/응답 타입 |
| `_workspace/04_frontend_log.md` | frontend-dev | 구현된 컴포넌트/라우트, 연동 엔드포인트 |
| `_workspace/05_review_result.md` | reviewer | 검토 판정, 발견 사항 |

## 실행 흐름

### 신규 기능 요청
```
1. orchestrator: 요구사항을 _workspace/01_task_spec.md에 작성
2. 필요 여부 판단 후 병렬 spawn:
   a. DB 변경 필요 → db-designer (db-migration 스킬 사용)
   b. (db-designer 완료 후) backend-dev (backend-feature 스킬 사용)
   c. (backend-dev 완료 후) frontend-dev (frontend-feature 스킬 사용)
3. reviewer spawn → _workspace/05_review_result.md에 결과 저장
4. FIX/REDO → 자율 버그 수정 루틴 실행
5. PASS → qa-inspector spawn
6. QA PASS → 완료 보고
```

### 버그 수정 요청
```
1. orchestrator: 증상을 harness/bugfix/00_failure.md에 기록
2. bug-fixer spawn (autonomous-bugfix 스킬 사용)
3. bug-fixer 수정 완료 후 reviewer spawn
4. PASS → 완료 / FIX → 2회 루프 / REDO → 사용자 보고
```

### DB 스키마 변경만 필요한 경우
```
1. db-designer spawn
2. reviewer spawn (스키마 검토)
3. PASS 후 backend-dev에게 Prisma generate + 영향 받는 서비스 수정 위임
```

## Clone 이식성 Preflight
모든 실행 전 다음을 확인한다:
```
- backend/package.json 존재 여부
- backend/prisma/schema.prisma 존재 여부
- .env 또는 .env.example 존재 여부 (DATABASE_URL, JWT_SECRET)
- src/package.json 존재 여부
```
파일이 없으면 관련 agent에게 초기 설정을 먼저 요청한다.
절대 경로, 드라이브 문자, 사용자 홈 경로를 산출물에 포함하지 않는다.

## 자율 버그 수정 루틴
```
1. 실패 증상 → harness/bugfix/00_failure.md
2. bug-fixer → harness/bugfix/01_diagnosis.md (원인)
3. bug-fixer → 코드 수정 + harness/bugfix/02_patch_summary.md
4. 재검증 → harness/bugfix/03_verification.md
5. reviewer 판정:
   - PASS → 종료
   - FIX  → 1회 더 반복 (최대 2회)
   - REDO 또는 2회 실패 → 중단, 사용자 보고
6. 데이터 삭제/보안/운영 배포 → 자율 수정 불가, 사용자 확인
```

## 테스트 시나리오

### 정상 흐름: 댓글 기능 추가
```
입력: "회차 페이지에 댓글 기능을 추가해줘"
1. _workspace/01_task_spec.md 작성 (댓글 CRUD, 로그인 필요)
2. db-designer → Comment 모델 추가
3. backend-dev → /episodes/:id/comments 엔드포인트 구현
4. frontend-dev → Reader.tsx에 댓글 UI 추가, src/api/comments.ts 생성
5. reviewer → PASS
6. qa-inspector → 시나리오 4(댓글) 통과 → PASS
```

### 에러 흐름: 빌드 실패
```
입력: backend-dev가 TypeScript 에러 반환
1. harness/bugfix/00_failure.md에 에러 기록
2. bug-fixer spawn → 원인 분석
3. 수정 적용 → 재빌드 확인
4. reviewer PASS → 원래 흐름 재개
```

## 트리거 예시
트리거 O: "좋아요 기능 만들어줘", "로그인 구현해줘", "작품 업로드 페이지 만들어", "DB 스키마 바꿔줘", "에러가 났어", "리뷰 해줘"  
트리거 X: "CSS 색상 바꿔줘" (디자인만), "catalog.json 수정해줘" (정적 데이터), "README 업데이트해줘"
