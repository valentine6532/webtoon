---
name: backend-feature
description: "Express REST API 엔드포인트, 미들웨어, 서비스 로직 구현 절차."
---

# Backend Feature

Express + Prisma + TypeScript 백엔드에 새 기능을 구현하는 절차.

## Step 1: 기존 구조 파악
```
backend/src/
├── routes/      — 라우터 등록 패턴 확인
├── controllers/ — 요청 처리 패턴 확인
├── middleware/  — auth, error, upload 미들웨어 확인
├── services/    — 비즈니스 로직 패턴 확인
└── app.ts       — 라우터 마운트 위치 확인
```

## Step 2: 라우터 작성
`backend/src/routes/feature.ts`:
```typescript
import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as ctrl from '../controllers/feature';

const router = Router();
router.get('/', ctrl.list);
router.post('/', auth, ctrl.create);    // 인증 필요
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
export default router;
```

`backend/src/app.ts`에 마운트:
```typescript
app.use('/api/v1/features', featureRouter);
```

## Step 3: 컨트롤러 작성
`backend/src/controllers/feature.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/feature';
import { CreateFeatureSchema } from '../lib/schemas';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = CreateFeatureSchema.parse(req.body);   // Zod 검증
    const result = await service.createFeature(body, req.user!.id);
    res.status(201).json({ data: result });
  } catch (e) { next(e); }
}
```

## Step 4: 서비스 작성
`backend/src/services/feature.ts`:
- Prisma 쿼리는 서비스 레이어에만 위치
- 권한 체크는 서비스에서 수행
- 에러는 throw, 컨트롤러가 next(e)로 에러 미들웨어에 전달

## Step 5: Zod 스키마
`backend/src/lib/schemas.ts`에 추가:
```typescript
export const CreateFeatureSchema = z.object({
  title: z.string().min(1).max(200),
  // ...
});
```

## Step 6: 인증 미들웨어
보호 엔드포인트에 `auth` 미들웨어 적용.  
`req.user.id`, `req.user.role`로 인증된 사용자 정보 접근.

## Step 7: 이미지 업로드 (필요한 경우)
```typescript
import multer from 'multer';
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10_000_000 } });
router.post('/upload', auth, upload.single('image'), ctrl.upload);
```
- 허용 MIME 타입: `image/jpeg`, `image/png`, `image/webp`
- 파일명: UUID로 재명명
- 경로 순회 공격 방어: `path.basename()` 사용

## Step 8: 에러 핸들러
`backend/src/middleware/error.ts`에 중앙화된 에러 핸들러.  
Zod 에러 → 400, 인증 에러 → 401, 권한 에러 → 403, Not Found → 404, 기타 → 500.

## Step 9: 검증
```bash
npm run build --prefix backend    # TypeScript 컴파일
npm run dev --prefix backend      # 서버 기동 (포트 4000)
# 엔드포인트 테스트 (curl 또는 HTTP 클라이언트)
curl -X POST http://localhost:4000/api/v1/features \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'
```

## 환경 변수 (.env)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/webtoon"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=4000
UPLOAD_DIR="uploads"
```
절대 경로 사용 금지. `UPLOAD_DIR`은 `backend/` 기준 상대 경로.
