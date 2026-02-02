# 5단계: 컴포넌트 스타일

`css/components.css`에 버튼, 강의 카드, 폼, Swiper 네비게이션 등 컴포넌트 스타일을 작성합니다.

---

## 학습 목표

- 버튼(.btn, .btn-primary, .btn-outline) 스타일
- 강의 카드(.course-card) 스타일
- 폼(.form-group, input, select) 스타일
- Swiper 네비게이션 버튼(.swiper-nav-btn) 스타일
- 브레드크럼(.breadcrumb, .breadcrumb-link) 스타일

---

## 실습 단계

### 1단계: components.css 파일 열기

`css/components.css` 파일을 열고 아래 내용을 **순서대로** 추가합니다. (파일이 비어 있으면 처음부터, 일부 있으면 해당 섹션만 추가)

---

### 2단계: 버튼 스타일

```css
/**
 * components.css
 * - 재사용 컴포넌트 스타일
 */

/* ============================================================================
   Buttons
   ============================================================================ */

.btn {
 display: inline-flex;
 align-items: center;
 justify-content: center;
 gap: var(--spacing-sm);
 padding: 0.5rem 1rem;
 font-size: var(--font-size-sm);
 font-weight: 500;
 text-align: center;
 text-decoration: none;
 border: none;
 border-radius: var(--radius-md);
 cursor: pointer;
 transition: all var(--transition-fast);
 min-height: 40px;
 line-height: 1.5;
 white-space: nowrap;
}

.btn:disabled {
 pointer-events: none;
 opacity: 0.5;
}

.btn:focus-visible {
 outline: 2px solid var(--color-primary);
 outline-offset: 2px;
}

.btn-primary {
 background-color: var(--color-primary);
 color: white;
}

.btn-primary:hover {
 background-color: var(--color-primary-hover);
}

.btn-outline {
 background-color: transparent;
 color: var(--color-primary);
 border: 1px solid var(--color-border);
}

.btn-outline:hover {
 background-color: var(--color-muted);
 border-color: var(--color-primary);
}
```

**저장 후 브라우저 확인:** 메인 페이지의 "강의 둘러보기", "무료로 시작하기" 버튼이 스타일이 적용된 모양으로 보여야 합니다.

---

### 3단계: 강의 카드 스타일

인기/신규 강의 섹션에 JavaScript로 채워질 카드용 스타일입니다.

```css
/* ============================================================================
   Course Cards
   ============================================================================ */

.course-card {
 background-color: var(--color-card);
 border: 1px solid var(--color-border);
 border-radius: var(--radius-lg);
 overflow: hidden;
 transition: all var(--transition-base);
 cursor: pointer;
 text-decoration: none;
 color: inherit;
 display: block;
}

.course-card:hover {
 box-shadow: var(--shadow-md);
 border-color: var(--color-primary);
}

.course-card-thumbnail {
 width: 100%;
 height: 180px;
 object-fit: cover;
 background-color: var(--color-muted);
}

.course-card-content {
 padding: var(--spacing-md);
}

.course-card-title {
 font-size: var(--font-size-base);
 font-weight: 600;
 margin-bottom: var(--spacing-xs);
 display: -webkit-box;
 -webkit-line-clamp: 2;
 -webkit-box-orient: vertical;
 overflow: hidden;
 line-height: 1.4;
}

.course-card-instructor {
 font-size: var(--font-size-sm);
 color: var(--color-muted-foreground);
 margin-bottom: var(--spacing-sm);
}

.course-card-meta {
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-bottom: var(--spacing-sm);
 font-size: var(--font-size-sm);
}

.course-card-price {
 font-size: var(--font-size-base);
 font-weight: 700;
 color: var(--color-foreground);
}

.course-card-students {
 color: var(--color-muted-foreground);
 font-size: var(--font-size-xs);
}
```

---

### 4단계: Swiper 내부 강의 카드 레이아웃

인기/신규 섹션의 Swiper 슬라이드 안에서 카드가 균일한 높이로 보이도록 합니다.

```css
/* ============================================================================
   Swiper + Course Cards
   ============================================================================ */

.swiper-container {
 position: relative;
}

.swiper-nav-btn {
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 z-index: 10;
 display: flex;
 align-items: center;
 justify-content: center;
 width: 44px;
 height: 44px;
 border: 1px solid rgba(0, 0, 0, 0.1);
 border-radius: var(--radius-full);
 background: rgba(255, 255, 255, 0.85);
 color: var(--color-foreground);
 cursor: pointer;
 transition: all var(--transition-fast);
 box-shadow: var(--shadow-md);
}

.swiper-nav-btn:hover:not(:disabled) {
 background: rgba(255, 255, 255, 0.95);
 border-color: rgba(0, 0, 0, 0.15);
}

.swiper-nav-btn:focus-visible {
 outline: 2px solid var(--color-primary);
 outline-offset: 2px;
}

.swiper-nav-prev {
 left: -22px;
}

.swiper-nav-next {
 right: -22px;
}

@media (max-width: 768px) {
 .swiper-nav-btn {
  display: none;
 }
}

.courses-swiper {
 overflow: hidden;
}

.courses-swiper .swiper-slide {
 height: auto;
}

.courses-swiper .course-card {
 height: 100%;
 display: flex;
 flex-direction: column;
}

.courses-swiper .course-card-content {
 flex: 1;
 display: flex;
 flex-direction: column;
}

.courses-swiper .course-card-price {
 margin-top: auto;
}
```

**저장 후 확인:** 인기/신규 섹션 양쪽에 이전/다음 버튼이 보이고, 8단계에서 강의 카드를 채우면 카드가 균일한 높이로 표시됩니다.

---

### 5단계: 폼 스타일

로그인/회원가입 등에서 사용할 입력 필드 스타일입니다.

```css
/* ============================================================================
   Forms
   ============================================================================ */

.form-group {
 margin-bottom: var(--spacing-md);
}

.form-group label {
 display: block;
 margin-bottom: var(--spacing-xs);
 font-weight: 500;
 font-size: var(--font-size-sm);
}

.form-group input,
.form-group textarea,
.form-group select {
 width: 100%;
 padding: var(--spacing-sm) var(--spacing-md);
 border: 1px solid var(--color-border);
 border-radius: var(--radius-md);
 font-size: var(--font-size-sm);
 font-family: inherit;
 background-color: var(--color-background);
 transition: all var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
 outline: none;
 border-color: var(--color-primary);
 box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
}

.form-group input:focus-visible,
.form-group textarea:focus-visible,
.form-group select:focus-visible {
 outline: none;
}

.form-group textarea {
 resize: vertical;
 min-height: 100px;
}
```

---

### 6단계: 브레드크럼 스타일

강의 상세 페이지 등에서 "강의 목록"으로 돌아가는 네비게이션 링크용 스타일입니다.

```css
/* ============================================================================
   Breadcrumb
   ============================================================================ */

.breadcrumb {
 margin-bottom: var(--spacing-lg);
}

.breadcrumb-link {
 display: inline-flex;
 align-items: center;
 gap: var(--spacing-xs);
 color: var(--color-muted-foreground);
 text-decoration: none;
 font-size: var(--font-size-sm);
 font-weight: 500;
 padding: var(--spacing-xs) var(--spacing-sm);
 border-radius: var(--radius-md);
 transition: all var(--transition-fast);
}

.breadcrumb-link:hover {
 color: var(--color-primary);
 background-color: var(--color-muted);
}

.breadcrumb-link:focus-visible {
 outline: 2px solid var(--color-primary);
 outline-offset: 2px;
}

.breadcrumb-link svg {
 flex-shrink: 0;
}
```

**저장 후 확인:** 9단계에서 강의 상세 페이지를 추가하면, 상단 "← 강의 목록" 링크가 이 스타일로 표시됩니다.

---

## 체크리스트

- [ ] 버튼(.btn, .btn-primary, .btn-outline) 스타일 작성
- [ ] 강의 카드(.course-card, thumbnail, content, title, instructor, meta, price) 스타일 작성
- [ ] Swiper 네비(.swiper-nav-btn, .swiper-nav-prev/next) 스타일 작성
- [ ] 폼(.form-group, input, textarea, select) 스타일 작성
- [ ] 브레드크럼(.breadcrumb, .breadcrumb-link) 스타일 작성
- [ ] 저장 후 메인 페이지에서 버튼·인기/신규 영역·이전/다음 버튼 확인

---

## 확인 사항

- 메인 페이지 "강의 둘러보기", "무료로 시작하기" 버튼이 primary/outline 스타일로 보입니다.
- 인기 강의·신규 강의 섹션 양쪽에 둥근 이전/다음 버튼이 보입니다. (8단계에서 카드가 채워지면 슬라이드 동작)
- 로그인/회원가입 페이지(9단계에서 추가)에서 입력 필드에 포커스 시 테두리 색이 primary로 바뀝니다.
- 강의 상세 페이지(9단계에서 추가) 상단에 "강의 목록" 브레드크럼 링크가 보입니다.

---

**다음**: [07-step6-responsive.md](./07-step6-responsive.md) - 반응형 디자인
