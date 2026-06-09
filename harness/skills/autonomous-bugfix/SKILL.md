---
name: autonomous-bugfix
description: "빌드 실패, 런타임 에러, 테스트 실패, reviewer FIX 판정 발생 시 최소 범위 수정을 적용하는 절차."
---

# Autonomous Bugfix

결함을 재현하고 최소 범위로 수정한 뒤 재검증하는 절차.

## Step 1: 실패 기록 확인
`harness/bugfix/00_failure.md`를 읽는다. 없으면 직접 작성:
```markdown
## 실패 유형
[빌드 오류 / 런타임 에러 / 테스트 실패 / reviewer FIX]

## 증상
[에러 메시지, 스택 트레이스 전체]

## 재현 방법
[재현에 필요한 명령 또는 조건]

## 발견 일시
[YYYY-MM-DD HH:MM]
```

## Step 2: 재현
실패를 직접 재현한다. 재현되지 않으면 환경 차이를 조사하고 `01_diagnosis.md`에 기록한다.

## Step 3: 원인 분석 → harness/bugfix/01_diagnosis.md
```markdown
## 근본 원인
[1~3줄 요약]

## 관련 파일/라인
- `path/to/file.ts:42` — [설명]

## 원인 범위
[단일 파일 / 여러 파일 / 구조 문제]

## 수정 접근 방식
[최소 수정 방법 설명]
```

## Step 4: 수정 적용
- 수정 범위를 실패 원인으로 제한한다
- 관련 없는 리팩터링/개선을 끼워넣지 않는다
- 다음 항목은 **자율 수정하지 않고 중단 후 사용자 확인**:
  - 데이터 삭제/초기화
  - 인증/보안 구조 변경
  - 배포 환경 설정 변경
  - 10개 파일 이상 영향

## Step 5: 패치 기록 → harness/bugfix/02_patch_summary.md
```markdown
## 변경 파일
- `path/to/file.ts` — [변경 내용 한 줄]

## 변경 의도
[왜 이렇게 수정했는지]

## 잠재적 리스크
[이 수정이 다른 부분에 미칠 수 있는 영향]

## 롤백 방법
[문제 발생 시 되돌리는 방법]
```

## Step 6: 재검증 → harness/bugfix/03_verification.md
원래 실패를 재현했던 명령으로 다시 검증한다:
```bash
# 예시
npm run build          # 프론트엔드 빌드
npm run build --prefix backend  # 백엔드 빌드
npx prisma validate    # 스키마 검증
```

```markdown
## 검증 명령
[실행한 명령]

## 결과
[PASS / FAIL + 출력]

## 잔여 이슈
[해결되지 않은 항목이 있으면 기록]
```

## Step 7: Reviewer Handoff
재검증 결과를 reviewer에게 전달한다. reviewer가 `PASS` 판정 시 완료.

## 반복 한도
- 최대 2회 수정 루프
- 2회 후 `FAIL` 지속 시: 중단, `harness/bugfix/03_verification.md`에 남은 리스크 기록, 사용자에게 보고
