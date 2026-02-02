# 6단계: 반응형 디자인

`css/responsive.css`에 미디어 쿼리를 작성하여 모바일·태블릿·데스크톱에 맞게 레이아웃을 조정합니다.

---

## 학습 목표

- 브레이크포인트 이해 (767px, 768px, 1024px)
- 모바일: 1열, 히어로 버튼 세로 배치, 네비 숨김
- 태블릿: 2열 그리드
- 데스크톱: 3열 그리드

---

## 실습 단계

### 1단계: responsive.css 파일 열기

`css/responsive.css` 파일을 열고 아래 내용을 **전체** 작성합니다. (기존 내용이 있으면 교체)

---

### 2단계: 전체 반응형 스타일 작성

```css
/**
 * responsive.css
 * - 반응형 디자인
 * - Breakpoints: 모바일 ~767px, 태블릿 768~1023px, 데스크톱 1024px+
 */

/* ============================================================================
   Mobile (max 767px)
   ============================================================================ */
@media (max-width: 767px) {
 .container {
  padding: 0 var(--spacing-md);
 }

 .header-content {
  flex-wrap: wrap;
 }

 .nav-menu {
  order: 3;
  width: 100%;
  flex-direction: column;
  gap: var(--spacing-sm);
  display: none;
 }

 .nav-menu.active {
  display: flex;
 }

 .search-box {
  flex: 1;
  min-width: 0;
 }

 .search-box input {
  min-width: 0;
  flex: 1;
 }

 .hero-layout {
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
 }

 .hero-title-line2 {
  font-size: var(--font-size-2xl);
 }

 .hero-buttons {
  flex-direction: column;
 }

 .hero-carousel {
  order: -1;
 }

 .courses-grid {
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
 }

 .categories-grid {
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
 }
}

/* ============================================================================
   Tablet (768px - 1023px)
   ============================================================================ */
@media (min-width: 768px) and (max-width: 1023px) {
 .courses-grid {
  grid-template-columns: repeat(2, 1fr);
 }

 .categories-grid {
  grid-template-columns: repeat(2, 1fr);
 }
}

/* ============================================================================
   Desktop (1024px+)
   ============================================================================ */
@media (min-width: 1024px) {
 .courses-grid {
  grid-template-columns: repeat(3, 1fr);
 }

 .categories-grid {
  grid-template-columns: repeat(4, 1fr);
 }
}
```

**참고:** `courses-grid`는 강의 목록 페이지(courses.html)에서 사용합니다. 메인 페이지는 Swiper로 슬라이드하므로 그리드 열 수는 강의 목록·대시보드 등 다른 페이지에 적용됩니다.

---

### 3단계: 브라우저에서 반응형 확인

1. Chrome에서 F12 → 디바이스 툴바 아이콘(또는 Ctrl+Shift+M) 클릭
2. 상단에서 "iPhone 12 Pro", "iPad", "Responsive" 등 선택
3. **모바일(375px)**: 히어로가 세로 배치, 버튼이 세로로 쌓이고, 카테고리가 1열로 보이는지 확인
4. **태블릿(768px)**: 카테고리 그리드가 2열로 보이는지 확인
5. **데스크톱(1024px)**: 카테고리 그리드가 4열로 보이는지 확인

---

## 체크리스트

- [ ] responsive.css에 모바일 미디어 쿼리(@media (max-width: 767px)) 작성
- [ ] 태블릿 미디어 쿼리(768px~1023px) 작성
- [ ] 데스크톱 미디어 쿼리(1024px+) 작성
- [ ] 개발자 도구로 375px, 768px, 1024px에서 레이아웃 확인

---

## 확인 사항

- **모바일**: 컨테이너 패딩이 줄어들고, 히어로 레이아웃이 1열, 버튼이 세로로 배치됩니다.
- **태블릿/데스크톱**: 카테고리 그리드가 2열 → 4열로 바뀝니다.
- 네비게이션 메뉴는 모바일에서 기본 숨김(.nav-menu { display: none }). 나중에 햄버거 메뉴를 추가하면 .nav-menu.active로 보이게 할 수 있습니다.

---

**다음**: [08-step7-js-basics.md](./08-step7-js-basics.md) - JavaScript 기초 (데이터, storage, utils)
