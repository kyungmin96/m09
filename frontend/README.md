# 작업 현장 동행 차량

## 환경 설정

### 패키지 매니저

이 프로젝트는 pnpm을 사용합니다. pnpm은 디스크 공간을 효율적으로 사용하고 더 나은 의존성 관리를 제공합니다.

- pnpm 버전 : 9.15.4

#### pnpm 사용 명령어

```bash
npm install -g pnpm   # pnpm 전역 설치
pnpm add [패키지명]    # 새로운 패키지 설치
pnpm add -D [패키지명] # 개발 의존성 패키지 설치
pnpm remove [패키지명] # 패키지 제거
pnpm up [패키지명]     # 패키지 업데이트
pnpm store prune      # pnpm 저장소 정리
pnpm prune            # 미사용용 패키지 제거
pnpm why [패키지명]    # 의존성 상태 확인
```

#### script 목록

```bash
pnpm install          # 패키지 설치
pnpm dev              # 개발 서버 실행
pnpm build            # 빌드
pnpm lint             # 린트 검사
pnpm lint:fix         # 린트 검사
pnpm format           # 포매터
pnpm check            # 린트 & 포매터터
pnpm type-check       # 타입 검사
```

### Feture-Sliced Design (FSD)

: 프로젝트는 FSD 아키텍처를 기반으로 구성되어 있습니다.

```text
src/
├── app/                        # 글로벌 설정
│   ├── router.tsx
│   ├── providers/              # 전역 프로바이더
│   ├── stores/
│   └── styles/                 # 전역 스타일
│           ├── _variables.scss      # CSS 변수 정의
│           ├── _globals.scss        # 전역 스타일
│           └── _mixins.scss         # SCSS 믹스인     
│
├── pages/                      # 페이지 컴포넌트
│   └── *Page/
│           ├──index.tsx
│           └──components/
├── widgets/                    # 독립적인 페이지 블록
│   ├── Header.tsx
│   └── ...
│
├── features/                   # 비즈니스 로직 단위
│
└── shared/                     # 공유 로직
    ├── constants/
    │   └── colors.ts
    └── ui/                     # 공통 UI 컴포넌트
        ├── ActionButton.tsx
        ├── Badge.tsx
        ├── ModalButton.tsx
        ├── Modal.tsx
        └── TabMenu.tsx
```

## 스타일 가이드

### reset css 

### Tailwind CSS 설정

* 커스텀 색깔

* 공통 스타일

### 타이포그래피

## 상태 관리

## API 통신

## 개발 가이드라인

### 새로운 기능 추가

### 컴포넌트 개발