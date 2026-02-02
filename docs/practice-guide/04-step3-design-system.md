# 3단계: 디자인 시스템 구축

`css/variables.css`에 디자인 토큰(색상, 타이포그래피, 간격 등)을 정의합니다.

---

## 학습 목표

- 디자인 토큰의 개념과 중요성 이해
- CSS 변수 (Custom Properties) 사용법 학습
- 일관된 디자인 시스템 구축

---

## 디자인 토큰이란?

**디자인 토큰**은 색상, 간격, 타이포 등 디자인의 원자 단위 값을 변수로 정의한 것입니다.

**장점:**
- 한 곳만 수정해도 전체 UI에 반영
- 일관성 유지
- 다크 모드 등 테마 전환 용이

---

## 실습 단계

### 1단계: variables.css 파일 열기

`css/variables.css` 파일을 열고 다음 내용을 작성합니다.

```css
/**
 * variables.css
 * - 디자인 토큰 (Design Tokens)
 * - 색상, 간격, 타이포그래피, 그림자 등 전역 변수
 */

:root {
  /* =========================================================================
     색상 (Colors)
     ========================================================================= */
  
  /* 기본 색상 (shadcn/ui Neutral Slate 기반) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  
  /* Primary (주요 액션) */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  /* Secondary (보조) */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  /* Muted (덜 강조) */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  /* 테두리 및 입력 */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  
  /* Destructive (삭제, 위험) */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  
  /* 상태 색상 */
  --success: 142.1 76.2% 36.3%;
  --warning: 47.9 95.8% 53.1%;
  
  /* 호환용 직접 HSL 값 */
  --color-primary: hsl(222.2, 47.4%, 11.2%);
  --color-primary-hover: hsl(222.2, 47.4%, 20%);
  --color-background: hsl(0, 0%, 100%);
  --color-foreground: hsl(222.2, 84%, 4.9%);
  --color-muted: hsl(210, 40%, 96.1%);
  --color-muted-foreground: hsl(215.4, 16.3%, 46.9%);
  --color-border: hsl(214.3, 31.8%, 91.4%);
  --color-destructive: hsl(0, 84.2%, 60.2%);
  --color-success: hsl(142.1, 76.2%, 36.3%);
  
  /* =========================================================================
     간격 (Spacing)
     ========================================================================= */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  
  /* =========================================================================
     타이포그래피 (Typography)
     ========================================================================= */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                 "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */
  --font-size-4xl: 2.5rem;    /* 40px */
  
  /* =========================================================================
     Border Radius (모서리 둥글기)
     ========================================================================= */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-full: 9999px;  /* 완전 둥근 원 */
  
  /* =========================================================================
     그림자 (Shadows)
     ========================================================================= */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* =========================================================================
     전환 효과 (Transitions)
     ========================================================================= */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* =========================================================================
     브레이크포인트 (참고용 - 실제 미디어쿼리는 responsive.css에서)
     ========================================================================= */
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1024px;
  --breakpoint-2xl: 1200px;
}
```

**저장 후** 파일 닫기

---

## 변수 사용 방법

다른 CSS 파일에서 이렇게 사용합니다:

```css
/* 예시 */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}
```

---

## 체크리스트

- [ ] `variables.css` 파일 열기
- [ ] 색상 변수 정의 완료
- [ ] 간격 변수 정의 완료
- [ ] 타이포그래피 변수 정의 완료
- [ ] Border Radius 변수 정의 완료
- [ ] 그림자 변수 정의 완료
- [ ] 전환 효과 변수 정의 완료
- [ ] 파일 저장

---

## 확인

브라우저에서는 아직 변화가 없습니다. (정상!)  
변수는 정의만 했고, 실제 스타일에 적용하는 것은 다음 단계에서 진행합니다.

---

**다음**: [05-step4-common-styles.md](./05-step4-common-styles.md) - 공통 스타일 작성 (레이아웃, 헤더, 푸터)
