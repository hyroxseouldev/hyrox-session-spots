# HyroxBox Management System - Setup Guide

## 완성된 기능 목록

### ✅ 메인 페이지 (/)
- **SSR (Server-Side Rendering)** - 모든 데이터는 서버에서 렌더링
- **지역별 필터링** - 드롭다운 선택으로 지역별 박스 필터링
- **실시간 검색** - 300ms debounce로 이름, 주소, 특징 검색
- **스켈레톤 로딩** - 데이터 로딩 중 UI 표시
- **반응형 디자인** - 모바일/태블릿/데스크톱 완벽 지원
- **사이드바 레이아웃** - 왼쪽 필터, 오른쪽 컨텐츠
- **URL 상태 관리** - 필터 상태가 URL에 저장되어 공유 가능

### ✅ 어드민 페이지 (/admin)
- **대시보드** - 전체 통계 및 지역별 분포 현황
- **사이드바 네비게이션** - 3:7 비율 레이아웃
- **모바일 반응형** - 사이드바 드로어 메뉴

### ✅ HyroxBox 관리 (/admin/hyroxbox)
- **전체 CRUD 작업**
  - ✅ Create - 새 박스 추가
  - ✅ Read - 목록 조회 및 검색
  - ✅ Update - 박스 정보 수정 (모달)
  - ✅ Delete - 삭제 확인 후 제거
- **실시간 검색** - 이름, 주소, 지역 검색
- **데이터 테이블** - 정렬 가능한 테이블 UI
- **폼 검증** - 필수 필드 검증

### ✅ Region 관리 (/admin/region)
- **전체 CRUD 작업**
  - ✅ Create - 새 지역 추가
  - ✅ Read - 목록 조회
  - ✅ Update - 지역 정보 수정 (모달)
  - ✅ Delete - 연관 박스 확인 후 삭제
- **코드 중복 검증** - 지역 코드 유일성 보장
- **연관 관계 확인** - 박스가 있는 지역 삭제 방지

### ✅ 데이터베이스
- **Drizzle ORM** 완벽 구성
- **PostgreSQL** 스키마 정의
- **Many-to-One 관계** - Region ← HyroxBox
- **Server Actions** - 모든 CRUD 작업 구현
- **타입 안정성** - TypeScript 완벽 지원

### ✅ UI 컴포넌트
- **HyroxBoxCard** - 박스 정보 카드
- **HyroxBoxSkeleton** - 로딩 스켈레톤
- **DataTable** - 재사용 가능한 테이블
- **Modal** - 범용 모달 컴포넌트
- **ConfirmDialog** - 삭제 확인 다이얼로그

## 빠른 시작

### 1. 환경 변수 설정
`.env.local` 파일을 생성하고 데이터베이스 URL을 설정하세요:

\`\`\`bash
DATABASE_URL="postgresql://user:password@host:port/database"
\`\`\`

### 2. 데이터베이스 마이그레이션

\`\`\`bash
# 스키마 변경사항 생성
pnpm drizzle-kit generate

# 데이터베이스에 적용
pnpm drizzle-kit push
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
pnpm dev
\`\`\`

서버가 시작되면:
- 메인 페이지: http://localhost:3000
- 어드민 페이지: http://localhost:3000/admin

### 4. 초기 데이터 입력

1. `/admin/region`에서 지역을 먼저 추가하세요
2. `/admin/hyroxbox`에서 박스를 추가하세요

## 프로젝트 구조

\`\`\`
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx              # 어드민 레이아웃 (사이드바)
│   │   └── admin/
│   │       ├── page.tsx            # 대시보드
│   │       ├── hyroxbox/page.tsx   # HyroxBox 관리
│   │       └── region/page.tsx     # Region 관리
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── page.tsx                    # 메인 페이지 (SSR)
│   └── main-page-client.tsx        # 클라이언트 필터링
├── components/
│   ├── hyroxbox-card.tsx           # 박스 카드 컴포넌트
│   ├── hyroxbox-skeleton.tsx       # 스켈레톤 로더
│   └── ui/
│       ├── data-table.tsx          # 데이터 테이블
│       ├── modal.tsx               # 모달
│       └── confirm-dialog.tsx      # 확인 다이얼로그
└── db/
    ├── index.ts                    # DB 클라이언트
    ├── schema.ts                   # Drizzle 스키마
    └── actions/
        ├── hyroxbox.ts             # HyroxBox CRUD
        └── region.ts               # Region CRUD
\`\`\`

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **렌더링**: SSR (메인), CSR (어드민)
- **스타일링**: Tailwind CSS v4
- **데이터베이스**: PostgreSQL + Drizzle ORM
- **UI 라이브러리**: Radix UI, Lucide Icons
- **타입**: TypeScript (Strict mode)
- **패키지 매니저**: pnpm

## 다음 단계 (Phase 2-4)

현재 Phase 1 완료. 다음 단계는:

1. **Phase 2**: 성능 최적화
   - 가상 스크롤링 (50개 이상)
   - 이미지 최적화
   - 페이지네이션

2. **Phase 3**: 추가 기능
   - 인증/권한 관리
   - 이미지 업로드
   - 데이터 내보내기

3. **Phase 4**: 배포
   - Vercel 배포
   - 프로덕션 최적화
   - 모니터링 설정

## 버그 없는 개발 체크리스트

✅ 린트 에러 없음 (`pnpm lint`)
✅ TypeScript 에러 없음
✅ 모든 CRUD 작업 구현
✅ 에러 핸들링 완료
✅ 반응형 디자인 적용
✅ 접근성 고려 (키보드 네비게이션, aria-label)
✅ 로딩 상태 처리
✅ 빈 상태 UI
✅ 삭제 확인 다이얼로그
✅ URL 상태 관리

## 알려진 제한사항

- 인증 기능 없음 (Phase 3에서 추가 예정)
- 페이지네이션 미구현 (데이터 50개 이하 권장)
- 이미지 업로드 미지원
