# 06a 이미지 아티팩트 검수 보고서
**작품:** 거짓의 왕관 2화 「죽은 왕녀를 살려라」
**검수일:** 2026-06-06
**render_mode:** drama_painterly
**총 패널:** 46컷

---

## 검수 기준 (적용)
- 한국어 텍스트: 04 JSON visible_text 대조, 깨짐·가짜문자·오탈자 확인
- 말풍선·SFX: 형태, 꼬리 방향, 마진 침범, 빈 말풍선
- 손·얼굴·소품 붕괴: 특히 손가락 인서트(42·43), 손 인서트(3·22·37), 귀 뒤 점 클로즈업(34·35)
- 도식화 붕괴: crude polygon / scribble
- 여백 비트: breath_panel(38) 흰 여백 오염 여부
- render_mode 위반: drama_painterly이므로 회화 음영 자체는 정상; forbidden_style_changes 위반만 검출

---

## 컷별 판정

| 패널 | 판정 | 사유 |
|------|------|------|
| panel_001 | PASS | 의도된 암전. 말풍선 "이제, 죽은 왕녀를 살려야 한다." 정상. 꼬리 어둠 방향 OK. |
| panel_002 | REDO | SFX "또각"이 이미지에서 확인 불가 — 말풍선/SFX 전혀 없음. 하단부 서명(낙관 같은 흰 글씨) 렌더 오염. |
| panel_003 | REDO | 손 형태 이상: 검지 방향이 뒤틀려 손가락 구조 붕괴(중지·약지·소지가 뭉개진 평면). 반지 금속 반짝 스페큘러(forbidden "scattered specular sparkle on metal"). 의도상 무음 패널로 텍스트 없음 OK, 그러나 손 아티팩트. |
| panel_004 | PASS | 세라 옆얼굴, 무음 패널. 눈·머리카락 자연스러움. 배경 단순 OK. |
| panel_005 | PASS | 말풍선 "…살린다니, 무슨 소리예요." 정확. 꼬리 방향 위로 세라. 뒤 카밀라 실루엣 의도. |
| panel_006 | PASS | "에델리아 왕국의 왕녀, 아리아드네 전하." 정확. 꼬리 로드릭 아래. 초상화·손 OK. |
| panel_007 | PASS | "보름 뒤, 적국 아르장의 황태자비가 되실 분이었다." 정확. 꼬리 off-panel 방향 OK. |
| panel_008 | PASS | "한 달 전, 사고로 돌아가셨다." 정확. 초상화 얼굴 클로즈업. |
| panel_009 | PASS | "아직 아무도 모른다. …알아서도 안 되고." 정확. 꼬리 아래 로드릭. |
| panel_010 | PASS | 내레이션 "죽은 신부. 새지 않은 죽음. 그리고 — 내 얼굴." 정확. 눈 클로즈업 자연스러움. |
| panel_011 | PASS | 두 말풍선 "그러니 — 네가 왕녀가 되어 주어야겠다." / "보름 뒤, 적국의 심장으로." 정확. 상하 순서 OK. |
| panel_012 | PASS | "사람 잘못 봤어요. 나는 빈민가에서 나고 자랐어요." 정확. 세라 손 warding 동작 OK. |
| panel_013 | PASS | "글도 떼다 말았어요. 닮은 거 하나로 적국에 들어가서, 들키면 그날로 끝이잖아요." 정확. |
| panel_014 | PASS | "들키면 너 하나 죽는다고 생각하나." 정확. 꼬리 상단 로드릭. |
| panel_015 | PASS | "왕녀가 죽었다는 게 제국에 알려지는 순간, 에델리아는 약속을 어긴 나라가 된다." 정확. |
| panel_016 | PASS | "너 하나의 목숨이 아니라 — 나라 하나가 걸린 일이다." 정확. |
| panel_017 | PASS | 내레이션 "거절이 곧 전쟁이라는 셈을, 나도 못 따라가는 게 아니었다." 정확. |
| panel_018 | PASS | 무음 패널. 세라 눈 클로즈업. 텍스트 없음 정상. |
| panel_019 | PASS | "…나만 입 다물면 되잖아요. 나 말고 닮은 사람을 찾으면." 정확. 꼬리 방향 OK. |
| panel_020 | REDO | 말풍선 텍스트 완전 누락 — 말풍선 껍데기만 존재, 내부 텍스트 "아니면 그냥, 나를 못 본 걸로 하고 보내 주시든가요." 가 렌더되지 않음. |
| panel_021 | PASS | "…영리하군. 그 머리가 쓸모 있겠군." 정확. 입가 미소 표현 OK. |
| panel_022 | REDO | 칼자루 위 손 형태 이상 — 검지·중지·약지 위치 관계가 부자연스럽고 손가락이 과도하게 길게 뻗음. 칼자루 금속 스페큘러/반짝 표면(forbidden). 무음 패널이나 소품 아티팩트. |
| panel_023 | PASS | "너는 이미 봤다. 죽은 왕녀의 얼굴을, 나라의 비밀을." 정확. |
| panel_024 | PASS | 두 말풍선 "본 사람은 두 갈래밖에 없어." / "한패가 되거나 — 입을 막히거나." 정확. 반면 어둠 flat OK. |
| panel_025 | PASS | 무음 패널. 세라 목/옆얼굴 클로즈업. 자연스러움. |
| panel_026 | PASS | "그리고 — 네 동생들 말이다." 정확. 로드릭 손+장갑+검은 소품(카드?) OK. |
| panel_027 | PASS | 무음 패널. 세라 얼굴 굳음 표현. 눈 동공 표현 OK. |
| panel_028 | PASS | 두 말풍선 "네 동생들이 빈민가에서 겨울을 나길 바란다면, 너는 그 궁에서 살아남으면 된다." / "간단한 거래지." 정확. |
| panel_029 | PASS | SFX "스르" 정확. 꼬리 방향 OK. 귀 뒤 점 노출 의도 — 귀 영역 머리카락 모션 OK. |
| panel_030 | PASS | 무음 패널. 카밀라 눈 클로즈업. grey-green 눈 표현 OK. |
| panel_031 | PASS | "…재상님." 정확. 꼬리 카밀라 방향 OK. |
| panel_032 | PASS | 무음 패널. 세라 손 귀 가리는 모션, 모션 라인 OK. 배경 초상화 액자 빈 것 정상(패널 32에서 초상화 그림 없는 것 자체는 의도 가능). |
| panel_033 | PASS | "닮았다고 했나." 정확. 로드릭 손가락 초상화 가리킴 OK. |
| panel_034 | PASS | 초상화 귀 뒤 붉은 점 클로즈업. 귀 형태 자연스러움. 점 위치 오른쪽 귀 뒤 확인. 왕관 일부 보임. |
| panel_035 | PASS | 세라 귀 뒤 붉은 점. "세상에 얼굴이 같은 사람은 더러 있다." 정확. 꼬리 off-panel OK. 점 위치 34와 매칭. |
| panel_036 | PASS | "그런데 — 귀 뒤의 점까지 같은 사람은, 없다." 정확. 꼬리 아래 로드릭. |
| panel_037 | PASS | "…말도 안 돼." 정확. 세라 손이 귀 뒤 점에 닿는 인서트. 손가락 구조 OK (4~5개 손가락 자연스러운 곡선). |
| panel_038 | PASS | 내레이션 "들키면 처형. 안 들켜도 적국 한복판." 정확. 상단 ~60% 흰 여백 유지 — flat_white 조건 충족. 세라 하단 슬라이버 OK. 여백 오염 없음. |
| panel_039 | PASS | 내레이션 "그런데 — 막내가 굴뚝에 안 들어가도 될 돈이었다." 정확. 동생 작은 손 스커트 잡는 장면 의도. flat white 마진 OK. |
| panel_040 | PASS | 두 내레이션 "왜 같은 얼굴이지. 왜 같은 점이지." / "…거절할 수 있는 길은, 처음부터 없었다." 정확. 초상화 소프트 배경 flat OK. |
| panel_041 | PASS | "…받아들이죠." 정확. 세라 정면 돌아서는 반신. |
| panel_042 | PASS | 두 말풍선 "대신, 조건이 있어요." / "하나. 동생들은 떠나기 전에, 안전한 곳으로 먼저. 선금으로요." 정확. 손가락 인서트 — 검지 하나 펼친 구도, 손 형태 OK (손가락 5개 선명, 단순 포즈라 붕괴 없음). |
| panel_043 | PASS | 두 말풍선 "둘. 약속한 돈은 내가 성공하든 실패하든, 그 아이들 몫으로." / "셋. 내가 거기서 죽어도 — 동생들한테는, 칼이 닿지 않게." 정확. 세라 얼굴 클로즈업 OK. |
| panel_044 | PASS | "…영리하군. 그 조건, 내가 보증하지." 정확. 꼬리 아래 로드릭. |
| panel_045 | PASS | 무음 패널. 카밀라 눈 클로즈업 — grey-green, 흉터 미세하게 확인됨. |
| panel_046 | PASS | 두 내레이션 "나는 누구지?" / "…이들은, 그걸 알고 온 걸까." 정확. half-and-half 거울 구도 OK. 세라+초상화 캡션 박스 중앙 배치. |

---

## REDO 컷 상세

### panel_002 — REDO
**문제:**
1. visible_text SFX "또각"이 이미지에 렌더되지 않음 (텍스트 완전 누락).
2. 하단 우측에 낙관 스타일 흰 글씨 서명 형태 오염물이 존재.

**재롤 지시:**
- prompt 그대로 재생성. `small flat-ink SFX '또각' near his foot at the lower panel edge` 명시적 강조.
- 서명/낙관/워터마크 금지 재명시. (`no watermark` 강조)
- 재시도 파일: `assets/redo/panel_002_attempt_01.png`

---

### panel_003 — REDO
**문제:**
1. 손가락 구조 붕괴 — 중지/약지/소지가 서로 뭉개져 개별 형태가 불분명.
2. 반지와 커프 금속 트림에 scattered specular shimmer 확인 (forbidden_style_changes 위반: "scattered specular sparkle, glinting speckle highlights").

**재롤 지시:**
- prompt에 `hand anatomy clean — each finger individually articulated, NO specular sparkle on the ring or metal trim, flat tonal cel-shading on metal` 추가.
- 재시도 파일: `assets/redo/panel_003_attempt_01.png`

---

### panel_020 — REDO
**문제:**
- 말풍선 외형(타원 윤곽)은 렌더됐으나 내부 텍스트 "아니면 그냥, 나를 못 본 걸로 하고 보내 주시든가요."가 완전히 누락됨.

**재롤 지시:**
- prompt에 `speech bubble MUST contain legible Korean text: '아니면 그냥, 나를 못 본 걸로 하고 보내 주시든가요.' — render Korean text correctly, do not leave bubble empty` 강조 추가.
- 재시도 파일: `assets/redo/panel_020_attempt_01.png`

---

### panel_022 — REDO
**문제:**
1. 손가락이 과도하게 길고 손바닥 기준 비율이 붕괴됨 (특히 소지 방향).
2. 칼자루 금속 표면에 specular shine 집중 (forbidden).

**재롤 지시:**
- `hand anatomy clean — fingers proportionate to palm, NO metallic specular sparkle on the sword hilt or guard, keep hilt as flat controlled dark tonal shape` 추가.
- 재시도 파일: `assets/redo/panel_022_attempt_01.png`

---

## 요약 통계

| 판정 | 컷 수 |
|------|-------|
| PASS | 42 |
| FIX  | 0 |
| REDO | 4 (panel_002, panel_003, panel_020, panel_022) |

---

## 비고

- panel_001 암전: 의도된 검정 배경 + 말풍선 구성. 정상.
- panel_034/035 귀 뒤 점: 34(초상화)·35(세라) 모두 오른쪽 귀 뒤 같은 자리에 소형 붉은 점 확인됨. 연속성 SSOT 충족.
- panel_038 breath_panel: 상단 ~60% 순백 여백 유지, 오염 없음.
- 렌더 모드(drama_painterly): 전체적으로 회화 음영 일관. 일부 컷(14·28)에서 배경이 다소 진한 3D감이 있으나 photorealism 기준에 미달하지 않아 PASS 유지.
- panel_004 세라 눈색: 실제 이미지에서 amber 대신 green-grey 계열로 보이나 — **눈 색상은 캐릭터 동일성 항목으로 본 검수 범위 외(화풍·캐릭터 일관성 담당 검수관 판정)**.
