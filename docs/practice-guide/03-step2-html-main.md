# 2단계: 메인 페이지 HTML 구조

`index.html`에 완전한 메인 페이지 HTML 구조를 작성합니다.

---

## 학습 목표

- 시맨틱 HTML 태그 사용법 학습
- 섹션 기반 페이지 구조 설계
- 접근성을 고려한 마크업 작성

---

## 실습 단계

### 1단계: 기본 링크 추가

`index.html`의 `<head>` 부분을 수정하여 CSS 파일을 연결합니다.

```html
<head>
 <meta charset="UTF-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <title>온라인 강의 플랫폼 - 메인</title>

 <!-- Swiper CSS (캐러셀용) -->
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

 <!-- 우리가 만들 CSS 파일들 -->
 <link rel="stylesheet" href="css/variables.css" />
 <link rel="stylesheet" href="css/style.css" />
 <link rel="stylesheet" href="css/components.css" />
 <link rel="stylesheet" href="css/responsive.css" />
</head>
```

### 2단계: 헤더 작성

`<body>` 안의 내용을 다음으로 교체합니다.

> **참고**: 실제 완성 프로젝트는 헤더/푸터를 웹 컴포넌트(`<app-header>`, `<app-footer>`)로 사용합니다. 실습에서는 먼저 일반 HTML로 작성하고, 9~10단계에서 컴포넌트로 교체할 수 있습니다.

```html
<body>
 <!-- 헤더 -->
 <header class="header">
  <div class="container">
   <div class="header-content">
    <!-- 로고 -->
    <a href="index.html" class="logo">
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
     >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
     </svg>
     <span>온라인 강의</span>
    </a>

    <!-- 네비게이션 -->
    <nav class="nav-menu">
     <a href="index.html" class="nav-link active">홈</a>
     <a href="courses.html" class="nav-link">강의</a>
     <a href="dashboard.html" class="nav-link">대시보드</a>
    </nav>

    <!-- 검색 -->
    <div class="search-box">
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
     >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
     </svg>
     <input type="search" placeholder="강의 검색..." />
    </div>

    <!-- 사용자 메뉴 -->
    <div class="user-menu">
     <a href="cart.html" class="icon-btn" aria-label="장바구니">
      <svg
       xmlns="http://www.w3.org/2000/svg"
       width="20"
       height="20"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       stroke-width="2"
      >
       <circle cx="8" cy="21" r="1" />
       <circle cx="19" cy="21" r="1" />
       <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      <span class="cart-badge">0</span>
     </a>
     <a href="login.html" class="btn btn-primary">로그인</a>
    </div>
   </div>
  </div>
 </header>

 <!-- 여기에 메인 콘텐츠가 들어갑니다 -->
</body>
```

**저장 후 브라우저 확인:** 헤더가 보이지만 아직 스타일이 없어 세로로 나열됩니다. (정상!)

### 3단계: 히어로 섹션 작성

헤더 다음에 히어로 섹션을 추가합니다.

```html
<!-- 히어로 섹션 -->
<section class="hero">
 <div class="container">
  <div class="hero-layout">
   <!-- 좌측: 텍스트 -->
   <div class="hero-content">
    <h1>
     <span class="hero-title-line1">내일을 위한 배움,</span>
     <span class="hero-title-line2">오늘 시작하세요!</span>
    </h1>
    <p class="hero-description">
     최고의 강사진이 제공하는 실무 중심 커리큘럼으로 지금 바로 수강하고 커리어를 성장시키세요!
    </p>
    <div class="hero-buttons">
     <a href="courses.html" class="btn btn-primary">강의 둘러보기</a>
     <a href="signup.html" class="btn btn-outline">무료로 시작하기</a>
    </div>
   </div>

   <!-- 우측: 이미지 캐러셀 (나중에 Swiper로 동작) -->
   <div class="hero-carousel">
    <div class="swiper hero-swiper">
     <div class="swiper-wrapper">
      <div class="swiper-slide">
       <img src="https://picsum.photos/800/600?random=10" alt="강의 이미지" />
       <div class="carousel-overlay">
        <h3>체계적인 로드맵</h3>
        <p>목표 달성을 위한 확실한 길잡이</p>
       </div>
      </div>
      <div class="swiper-slide">
       <img src="https://picsum.photos/800/600?random=11" alt="강의 이미지" />
       <div class="carousel-overlay">
        <h3>실무 중심 커리큘럼</h3>
        <p>현장에서 바로 쓸 수 있는 실전 지식</p>
       </div>
      </div>
      <div class="swiper-slide">
       <img src="https://picsum.photos/800/600?random=12" alt="강의 이미지" />
       <div class="carousel-overlay">
        <h3>전문가 강의</h3>
        <p>업계 최고의 강사진과 함께하는 학습</p>
       </div>
      </div>
     </div>
     <!-- 캐러셀 컨트롤: 이전/다음/일시정지 (8단계에서 JS로 동작 연결) -->
     <div class="carousel-controls">
      <span class="carousel-counter">
       <span class="swiper-counter-current">1</span>/<span class="swiper-counter-total">3</span>
      </span>
      <button
       type="button"
       class="carousel-btn swiper-button-prev-custom"
       aria-label="이전 슬라이드"
      >
       ‹
      </button>
      <button
       type="button"
       class="carousel-btn swiper-button-play-pause"
       aria-label="캐러셀 일시정지"
      >
       <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
       >
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
       </svg>
      </button>
      <button
       type="button"
       class="carousel-btn swiper-button-next-custom"
       aria-label="다음 슬라이드"
      >
       ›
      </button>
     </div>
    </div>
   </div>
  </div>
 </div>
</section>
```

### 4단계: 인기 강의 섹션

인기/신규 강의는 **Swiper**로 슬라이드되므로, 그리드 대신 Swiper 구조를 사용합니다. (8단계에서 JavaScript로 카드를 채웁니다.)

```html
<!-- 인기 강의 섹션 -->
<section class="popular-courses">
 <div class="container">
  <div class="section-header">
   <h2 class="section-title">인기 강의</h2>
   <a href="courses.html?sort=students" class="section-link">
    더 보기
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width="16"
     height="16"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
    >
     <path d="m9 18 6-6-6-6" />
    </svg>
   </a>
  </div>

  <div class="swiper-container">
   <div class="swiper courses-swiper" id="popularCoursesSwiper">
    <div class="swiper-wrapper" id="popularCourses">
     <!-- 강의 카드가 8단계에서 동적으로 추가됩니다 -->
    </div>
   </div>
   <button type="button" class="swiper-nav-btn swiper-nav-prev popular-prev" aria-label="이전">
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
    >
     <path d="m15 18-6-6 6-6" />
    </svg>
   </button>
   <button type="button" class="swiper-nav-btn swiper-nav-next popular-next" aria-label="다음">
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
    >
     <path d="m9 18 6-6-6-6" />
    </svg>
   </button>
  </div>
 </div>
</section>
```

### 5단계: 신규 강의 섹션

```html
<!-- 신규 강의 섹션 -->
<section class="new-courses">
 <div class="container">
  <div class="section-header">
   <h2 class="section-title">신규 강의</h2>
   <a href="courses.html?sort=newest" class="section-link">
    더 보기
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width="16"
     height="16"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
    >
     <path d="m9 18 6-6-6-6" />
    </svg>
   </a>
  </div>

  <div class="swiper-container">
   <div class="swiper courses-swiper" id="newCoursesSwiper">
    <div class="swiper-wrapper" id="newCourses">
     <!-- 강의 카드가 8단계에서 동적으로 추가됩니다 -->
    </div>
   </div>
   <button type="button" class="swiper-nav-btn swiper-nav-prev new-prev" aria-label="이전">
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
    >
     <path d="m15 18-6-6 6-6" />
    </svg>
   </button>
   <button type="button" class="swiper-nav-btn swiper-nav-next new-next" aria-label="다음">
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
    >
     <path d="m9 18 6-6-6-6" />
    </svg>
   </button>
  </div>
 </div>
</section>
```

### 5-1단계: 카테고리 섹션

메인 페이지에 카테고리 섹션을 추가합니다. (8단계에서 클릭 시 `courses.html?category=값`으로 이동하도록 연결합니다.)

```html
<!-- 카테고리 섹션 -->
<section class="categories">
 <div class="container">
  <h2 class="section-title">카테고리</h2>
  <div class="categories-grid">
   <div class="category-card" data-category="programming">
    <img src="https://picsum.photos/400/200?random=1" alt="프로그래밍" />
    <h3>프로그래밍</h3>
   </div>
   <div class="category-card" data-category="design">
    <img src="https://picsum.photos/400/200?random=2" alt="디자인" />
    <h3>디자인</h3>
   </div>
   <div class="category-card" data-category="marketing">
    <img src="https://picsum.photos/400/200?random=3" alt="마케팅" />
    <h3>마케팅</h3>
   </div>
   <div class="category-card" data-category="others">
    <img src="https://picsum.photos/400/200?random=4" alt="기타" />
    <h3>기타</h3>
   </div>
  </div>
 </div>
</section>
```

### 6단계: 푸터 작성

```html
  <!-- 푸터 -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>온라인 강의 플랫폼</h3>
          <p>최고의 교육 플랫폼으로<br>당신의 성장을 함께합니다.</p>
        </div>

        <div class="footer-section">
          <h4>고객센터</h4>
          <p>이메일: support@example.com</p>
          <p>전화: 02-1234-5678</p>
          <p>운영시간: 평일 09:00-18:00</p>
        </div>

        <div class="footer-section">
          <h4>바로가기</h4>
          <ul>
            <li><a href="courses.html">전체 강의</a></li>
            <li><a href="dashboard.html">대시보드</a></li>
            <li><a href="profile.html">마이페이지</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 온라인 강의 플랫폼. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <!-- Swiper JS -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

  <!-- 우리가 만들 JS 파일 -->
  <script type="module" src="js/app.js" data-page="main"></script>
</body>
</html>
```

---

## 체크리스트

- [ ] CSS 링크 추가 (`<head>`)
- [ ] 헤더 작성 (로고, 네비, 검색, 로그인)
- [ ] 히어로 섹션 작성 (제목, 설명, 버튼, **3개 슬라이드**, **캐러셀 컨트롤 버튼/카운터**)
- [ ] 인기 강의 섹션 작성 (**swiper-container**, swiper-wrapper, 이전/다음 버튼)
- [ ] 신규 강의 섹션 작성 (동일 구조, `sort=newest` 링크)
- [ ] 카테고리 섹션 작성 (4개 카드, data-category)
- [ ] 푸터 작성
- [ ] Swiper, app.js 스크립트 추가
- [ ] 브라우저에서 모든 섹션이 보이는지 확인

---

## 확인 사항

브라우저를 새로고침하면 다음이 보여야 합니다 (스타일은 아직 없음):

- 로고 "온라인 강의"
- 네비게이션 (홈, 강의, 대시보드)
- 검색창
- 히어로 섹션 제목 "내일을 위한 배움, 오늘 시작하세요!" 및 캐러셀 이미지 3장, 이전/다음/일시정지 버튼
- "인기 강의", "신규 강의" 섹션 (Swiper 영역 + 이전/다음 버튼)
- "카테고리" 섹션 (프로그래밍, 디자인, 마케팅, 기타)
- 푸터 정보

**다음**: [04-step3-design-system.md](./04-step3-design-system.md) - 디자인 시스템 구축 (색상, 타이포, 간격)
