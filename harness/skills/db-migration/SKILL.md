---
name: db-migration
description: "Prisma 스키마 설계, 모델 추가/변경, 마이그레이션 생성 절차."
---

# DB Migration

Prisma + PostgreSQL 스키마 변경 절차.

## Step 1: 현재 스키마 파악
`backend/prisma/schema.prisma`를 읽고 기존 모델, 관계, 인덱스를 파악한다.

## Step 2: 스키마 변경
`backend/prisma/schema.prisma` 수정.

### 기본 모델 템플릿
```prisma
model ModelName {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?   // soft delete

  // 비즈니스 필드
  title     String   @db.VarChar(200)

  // 관계
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([createdAt])
}
```

### 관계 패턴
```prisma
// 1:N
model Webtoon {
  episodes Episode[]
}
model Episode {
  webtoonId String
  webtoon   Webtoon  @relation(fields: [webtoonId], references: [id], onDelete: Cascade)
}

// M:N (좋아요 등 복합 유니크)
model Like {
  userId    String
  webtoonId String
  user      User    @relation(fields: [userId], references: [id])
  webtoon   Webtoon @relation(fields: [webtoonId], references: [id])
  @@unique([userId, webtoonId])
}
```

## Step 3: 검증
```bash
npx prisma validate          # 스키마 문법 검증
npx prisma format            # 포맷 정리
```

## Step 4: 마이그레이션 생성
```bash
# 개발 환경 (마이그레이션 파일 생성 + DB 적용)
npx prisma migrate dev --name "add_comment_model"

# 프로덕션 환경 (파일만 생성, 적용은 별도)
npx prisma migrate deploy
```

## Step 5: Prisma Client 재생성
```bash
npx prisma generate
```
스키마 변경 후 반드시 실행. backend-dev에게 영향 받는 서비스 수정 요청.

## Step 6: 변경 기록
`_workspace/02_db_changes.md`에 기록:
- 추가/변경된 모델/컬럼
- 파괴적 변경 여부 (컬럼 삭제, 타입 변경, NOT NULL 추가)
- 데이터 마이그레이션 필요 여부
- 롤백 방법

## 파괴적 변경 주의
다음 변경은 기존 데이터에 영향을 준다. 반드시 사용자에게 확인 후 진행:
- 컬럼/테이블 삭제
- NOT NULL 컬럼 추가 (기본값 없는 경우)
- 컬럼 타입 변경
- 유니크 제약 추가

## 초기 스키마 (플랫폼 기본)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role { READER CREATOR }

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  nickname     String    @db.VarChar(50)
  role         Role      @default(READER)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  webtoons     Webtoon[]
  comments     Comment[]
  likes        Like[]
}

model Webtoon {
  id          String    @id @default(cuid())
  title       String    @db.VarChar(200)
  description String    @db.Text
  coverImage  String?
  tags        String[]
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  episodes    Episode[]
  likes       Like[]
  @@index([authorId])
  @@index([isPublished, createdAt])
}

model Episode {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(200)
  order       Int
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  webtoonId   String
  webtoon     Webtoon  @relation(fields: [webtoonId], references: [id], onDelete: Cascade)
  panels      Panel[]
  comments    Comment[]
  @@unique([webtoonId, order])
  @@index([webtoonId])
}

model Panel {
  id        String   @id @default(cuid())
  imageUrl  String
  order     Int
  episodeId String
  episode   Episode  @relation(fields: [episodeId], references: [id], onDelete: Cascade)
  @@unique([episodeId, order])
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.VarChar(1000)
  createdAt DateTime @default(now())
  userId    String
  episodeId String
  user      User     @relation(fields: [userId], references: [id])
  episode   Episode  @relation(fields: [episodeId], references: [id], onDelete: Cascade)
  @@index([episodeId, createdAt])
}

model Like {
  userId    String
  webtoonId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  webtoon   Webtoon  @relation(fields: [webtoonId], references: [id])
  @@id([userId, webtoonId])
}
```
