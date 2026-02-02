# 온라인 강의 플랫폼

온라인 강의 플랫폼은 HTML, CSS, JavaScript로 구현된 웹 애플리케이션입니다. 강의 탐색, 수강 신청, 학습 진도 관리, 수강 후기 등의 기능을 제공합니다.

> **UI/UX 디자인 강의 실습용** - [docs/practice-guide/00-practice-guide-index.md](docs/practice-guide/00-practice-guide-index.md)에서 단계별 실습 가이드를 확인하세요.

## 주요 기능

### 1. 강의 탐색

- 메인 페이지: 인기 강의, 신규 강의, 카테고리별 강의 표시
- 강의 목록: 필터(카테고리, 가격, 난이도), 정렬(인기순, 최신순, 가격순, 평점순), 검색, 페이지네이션
- 강의 상세: 강의 정보, 커리큘럼, 수강 후기, 수강 신청

### 2. 강의 수강

- 비디오 플레이어: HTML5 video 요소 사용
- 학습 진도 관리: 진행률 표시, 레슨 완료 처리
- 레슨 네비게이션: 이전/다음 레슨 이동
- 재생 위치 저장: localStorage를 사용한 비디오 재생 위치 저장

### 3. 학습 대시보드

- 학습 진도 요약: 전체 진행률, 완료 강의 수, 수강 중인 강의 수, 총 학습 시간
- 수강 중인 강의 목록
- 완료한 강의 목록
- 최근 학습한 강의 목록

### 4. 사용자 인증

- 회원가입: 이름, 이메일, 비밀번호, 역할(수강생/강사)
- 로그인: 이메일, 비밀번호
- 로그아웃
- 프로필 페이지: 사용자 정보, 학습 통계, 내 강의 목록

### 5. 수강 후기

- 후기 작성: 평점(1-5점), 후기 내용
- 후기 목록: 평점, 내용, 작성자, 작성일
- 평점 통계: 평균 평점, 후기 개수

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS 변수, Grid, Flexbox, 반응형 디자인
- **JavaScript (Vanilla)**: ES6+, 모듈화, 이벤트 처리
- **localStorage**: 데이터 저장 (강의, 수강 정보, 사용자, 후기)
- **sessionStorage**: 현재 로그인 사용자 정보

## 프로젝트 구조

```
online-lecture-platform-project/
├── index.html              # 메인 페이지
├── courses.html            # 강의 목록 페이지
├── course-detail.html      # 강의 상세 페이지
├── course-player.html      # 강의 수강 페이지
├── dashboard.html          # 학습 대시보드
├── login.html              # 로그인 페이지
├── signup.html             # 회원가입 페이지
├── profile.html             # 프로필 페이지
├── css/
│   ├── style.css           # 기본 스타일
│   ├── components.css      # 컴포넌트 스타일
│   └── responsive.css      # 반응형 스타일
├── js/
│   ├── storage.js          # 데이터 레이어 (localStorage)
│   ├── utils.js            # 유틸리티 함수
│   ├── main.js             # 메인 페이지 로직
│   ├── courses.js           # 강의 목록 페이지 로직
│   ├── course-detail.js    # 강의 상세 페이지 로직
│   ├── course-player.js    # 강의 수강 페이지 로직
│   ├── dashboard.js        # 학습 대시보드 로직
│   ├── auth.js             # 인증 로직
│   └── profile.js           # 프로필 페이지 로직
└── README.md
```

## 실행 방법

### 1. 로컬 서버 실행

프로젝트를 로컬 서버에서 실행해야 합니다. (CORS 문제 방지)

#### Python 사용 시:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Node.js 사용 시:

```bash
# http-server 설치
npm install -g http-server

# 서버 실행
http-server -p 8000
```

#### VS Code Live Server 사용:

1. VS Code에서 프로젝트 폴더 열기
2. `index.html` 파일 우클릭
3. "Open with Live Server" 선택

### 2. 브라우저에서 접속

```
http://localhost:8000
```

## 초기 데이터

프로젝트를 처음 실행하면 다음 초기 데이터가 자동으로 생성됩니다:

### 강의 데이터

- JavaScript 기초부터 실전까지 (프로그래밍, ₩49,000)
- React 완벽 가이드 (프로그래밍, ₩69,000)
- UI/UX 디자인 기초 (디자인, ₩39,000)
- 디지털 마케팅 전략 (마케팅, 무료)

### 테스트 사용자

- 이메일: `hong@example.com`, 비밀번호: `1234` (강사)
- 이메일: `lee@example.com`, 비밀번호: `1234` (강사)
- 이메일: `park@example.com`, 비밀번호: `1234` (강사)

## 주요 기능 설명

### 데이터 저장

- 모든 데이터는 브라우저의 `localStorage`에 저장됩니다.
- 새로고침해도 데이터가 유지됩니다.
- 브라우저 데이터를 삭제하면 초기 상태로 돌아갑니다.

### 학습 진도 관리

- 레슨 완료 체크박스를 클릭하면 진도가 업데이트됩니다.
- 모든 레슨을 완료하면 수강 완료 처리됩니다.
- 비디오 재생 위치는 자동으로 저장됩니다.

### 반응형 디자인

- 모바일 (375px 이상)
- 태블릿 (768px 이상)
- 데스크톱 (1024px 이상)

## 브라우저 호환성

- Chrome (권장)
- Firefox
- Safari
- Edge

## 주의사항

⚠️ **보안**: 이 프로젝트는 학습용 프로젝트입니다. 실제 서비스에서는:

- 비밀번호를 평문으로 저장하지 마세요 (해시 처리 필수)
- 서버 측 인증 및 권한 관리가 필요합니다
- 실제 비디오 스트리밍 서버를 사용해야 합니다

## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.
