# 4단계: 공통 스타일 작성

`css/style.css`에 전체 레이아웃, 헤더, 푸터 등 공통 스타일을 작성합니다.

---

## 학습 목표

- CSS Reset과 기본 스타일 이해
- Flexbox를 사용한 레이아웃 구성
- 반응형 컨테이너 설정

---

## 실습 단계

### 1단계: style.css 기본 구조

`css/style.css` 파일을 열고 다음 내용을 작성합니다.

```css
/**
 * style.css
 * - 기본 스타일 및 공통 레이아웃
 */

/* ============================================================================
   Reset & Base
   ============================================================================ */
* {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
}

body {
 font-family: var(--font-family);
 font-size: var(--font-size-base);
 color: var(--color-foreground);
 background-color: var(--color-background);
 line-height: 1.6;
}

a {
 text-decoration: none;
 color: inherit;
}

img {
 max-width: 100%;
 display: block;
}

ul,
ol {
 list-style: none;
}

/* ============================================================================
   Layout
   ============================================================================ */
.container {
 max-width: 1200px;
 margin: 0 auto;
 padding: 0 var(--spacing-lg);
}

/* ============================================================================
   Header
   ============================================================================ */
.header {
 border-bottom: 1px solid var(--color-border);
 background-color: var(--color-background);
 position: sticky;
 top: 0;
 z-index: 100;
}

.header-content {
 display: flex;
 align-items: center;
 gap: var(--spacing-lg);
 padding: var(--spacing-md) 0;
}

/* 로고 */
.logo {
 display: flex;
 align-items: center;
 gap: var(--spacing-sm);
 font-size: var(--font-size-lg);
 font-weight: 700;
 color: var(--color-primary);
}

.logo svg {
 color: var(--color-primary);
}

/* 네비게이션 */
.nav-menu {
 display: flex;
 gap: var(--spacing-md);
 margin-right: auto;
}

.nav-link {
 padding: var(--spacing-sm) var(--spacing-md);
 border-radius: var(--radius-md);
 transition: all var(--transition-base);
 color: var(--color-muted-foreground);
}

.nav-link:hover,
.nav-link.active {
 background-color: var(--color-secondary);
 color: var(--color-foreground);
}

/* 검색창 */
.search-box {
 display: flex;
 align-items: center;
 gap: var(--spacing-sm);
 background-color: var(--color-secondary);
 padding: var(--spacing-sm) var(--spacing-md);
 border-radius: var(--radius-md);
 width: 300px;
}

.search-box svg {
 color: var(--color-muted-foreground);
}

.search-box input {
 border: none;
 background: transparent;
 outline: none;
 flex: 1;
 font-size: var(--font-size-sm);
}

/* 사용자 메뉴 */
.user-menu {
 display: flex;
 align-items: center;
 gap: var(--spacing-md);
}

.icon-btn {
 position: relative;
 padding: var(--spacing-sm);
 border-radius: var(--radius-md);
 transition: all var(--transition-base);
}

.icon-btn:hover {
 background-color: var(--color-secondary);
}

.cart-badge {
 position: absolute;
 top: -4px;
 right: -4px;
 background-color: var(--color-destructive);
 color: white;
 font-size: 10px;
 padding: 2px 6px;
 border-radius: var(--radius-full);
 min-width: 18px;
 text-align: center;
}

/* ============================================================================
   Hero Section
   ============================================================================ */
.hero {
 padding: var(--spacing-3xl) 0;
 background: linear-gradient(to bottom, var(--color-secondary), var(--color-background));
}

.hero-layout {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: var(--spacing-3xl);
 align-items: center;
}

.hero-content h1 {
 font-size: var(--font-size-4xl);
 font-weight: 700;
 line-height: 1.2;
 margin-bottom: var(--spacing-lg);
}

.hero-title-line1 {
 display: block;
 color: var(--color-muted-foreground);
 font-size: var(--font-size-2xl);
}

.hero-title-line2 {
 display: block;
 color: var(--color-primary);
}

.hero-description {
 font-size: var(--font-size-lg);
 color: var(--color-muted-foreground);
 margin-bottom: var(--spacing-xl);
}

.hero-buttons {
 display: flex;
 gap: var(--spacing-md);
}

/* 히어로 캐러셀 */
.hero-carousel {
 position: relative;
}

.hero-swiper {
 border-radius: var(--radius-lg);
 overflow: hidden;
 box-shadow: var(--shadow-xl);
}

.carousel-overlay {
 position: absolute;
 bottom: 0;
 left: 0;
 right: 0;
 background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
 padding: var(--spacing-xl);
 color: white;
}

.carousel-overlay h3 {
 font-size: var(--font-size-xl);
 margin-bottom: var(--spacing-sm);
}

/* 캐러셀 컨트롤 (이전/다음/일시정지) */
.carousel-controls {
 position: absolute;
 bottom: var(--spacing-md);
 right: var(--spacing-md);
 display: flex;
 align-items: center;
 gap: var(--spacing-xs);
 background: rgba(0, 0, 0, 0.6);
 padding: var(--spacing-xs) var(--spacing-sm);
 border-radius: var(--radius-full);
 z-index: 10;
}

.carousel-counter {
 color: white;
 font-size: var(--font-size-xs);
 margin-right: var(--spacing-xs);
}

.carousel-btn {
 width: 28px;
 height: 28px;
 border: none;
 background: rgba(255, 255, 255, 0.2);
 color: white;
 border-radius: var(--radius-full);
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: var(--font-size-sm);
 transition: background-color var(--transition-fast);
}

.carousel-btn:hover {
 background: rgba(255, 255, 255, 0.3);
}

/* ============================================================================
   Sections
   ============================================================================ */
section {
 padding: var(--spacing-3xl) 0;
}

.section-header {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: var(--spacing-xl);
}

.section-title {
 font-size: var(--font-size-3xl);
 font-weight: 700;
 color: var(--color-primary);
}

.section-link {
 display: flex;
 align-items: center;
 gap: var(--spacing-sm);
 color: var(--color-primary);
 font-size: var(--font-size-sm);
 transition: all var(--transition-base);
}

.section-link:hover {
 gap: var(--spacing-md);
}

/* 강의 Swiper 영역 (인기/신규) */
.swiper-container {
 position: relative;
}

/* 카테고리 그리드 */
.categories-grid {
 display: grid;
 grid-template-columns: repeat(4, 1fr);
 gap: var(--spacing-lg);
}

.category-card {
 border-radius: var(--radius-lg);
 overflow: hidden;
 box-shadow: var(--shadow-md);
 cursor: pointer;
 transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.category-card:hover {
 transform: translateY(-4px);
 box-shadow: var(--shadow-lg);
}

.category-card img {
 width: 100%;
 height: 140px;
 object-fit: cover;
}

.category-card h3 {
 padding: var(--spacing-md);
 font-size: var(--font-size-lg);
 text-align: center;
 background: var(--color-card);
 color: var(--color-foreground);
}

/* ============================================================================
   Footer
   ============================================================================ */
.footer {
 background-color: var(--color-primary);
 color: var(--color-primary-foreground);
 padding: var(--spacing-3xl) 0 var(--spacing-xl);
 margin-top: var(--spacing-3xl);
}

.footer-content {
 display: grid;
 grid-template-columns: repeat(3, 1fr);
 gap: var(--spacing-2xl);
 margin-bottom: var(--spacing-xl);
}

.footer-section h3,
.footer-section h4 {
 margin-bottom: var(--spacing-md);
 color: white;
}

.footer-section p {
 color: rgba(255, 255, 255, 0.8);
 margin-bottom: var(--spacing-sm);
}

.footer-section ul li {
 margin-bottom: var(--spacing-sm);
}

.footer-section a {
 color: rgba(255, 255, 255, 0.8);
 transition: color var(--transition-base);
}

.footer-section a:hover {
 color: white;
}

.footer-bottom {
 border-top: 1px solid rgba(255, 255, 255, 0.2);
 padding-top: var(--spacing-lg);
 text-align: center;
 color: rgba(255, 255, 255, 0.6);
}
```

**저장 후 브라우저 새로고침!**

---

## 체크리스트

- [ ] Reset 및 Base 스타일 작성
- [ ] Container 레이아웃 작성
- [ ] Header 스타일 (로고, 네비, 검색, 사용자 메뉴)
- [ ] Hero 섹션 스타일 (그리드 레이아웃, 타이포)
- [ ] Sections 공통 스타일
- [ ] Footer 스타일 (3열 그리드)
- [ ] 저장 후 브라우저 확인

---

## 확인 사항

브라우저를 새로고침하면:

- ✅ 헤더가 가로로 정렬됨
- ✅ 로고, 네비게이션, 검색창이 한 줄에 표시
- ✅ 히어로 섹션이 좌우 2열로 나뉘어짐
- ✅ 제목이 크고 굵게 표시
- ✅ 푸터가 어두운 배경에 흰 글씨로 표시

---

**다음**: [06-step5-components.md](./06-step5-components.md) - 컴포넌트 스타일 (버튼, 카드)
