# 9단계: 추가 페이지 작성

`courses.html`, `course-detail.html`, `login.html`, `signup.html`, `dashboard.html`, `cart.html`, `checkout.html`, `profile.html`, `orders.html`, `course-player.html` 등을 작성하고, 각 페이지용 JS를 `app.js`의 `data-page`에 연결합니다.

---

## 학습 목표

- 각 HTML 페이지의 공통 구조 (헤더/푸터, app-header/app-footer)
- `data-page` 속성과 `app.js`의 `detectCurrentPage()` / `initializePage()` 동작 이해
- 페이지별 init 함수 (courses, course-detail, auth, dashboard, cart, checkout, profile, orders, course-player)
- 강의 목록·상세·인증·대시보드·장바구니·결제·프로필·주문 내역·수강 재생

---

## data-page와 app.js 동작

### 1. 스크립트 태그에 data-page 지정

각 HTML 파일 하단에서 `app.js`를 로드할 때 **현재 페이지 이름**을 `data-page`로 지정합니다.

```html
<script type="module" src="js/app.js" data-page="main"></script>
```

- `index.html` → `data-page="main"`
- `courses.html` → `data-page="courses"`
- `login.html` → `data-page="login"`
- `signup.html` → `data-page="signup"`
- 그 외 페이지도 동일한 규칙 (파일명과 매핑)

### 2. app.js에서의 처리 순서

1. **initializeApp()**

   - `initializeData()` (JSON → localStorage)
   - `setupPlaceholderLinks()` (임시 링크 모달)
   - **detectCurrentPage()** → 현재 페이지 이름 반환
   - **initializePage(pageName)** → 해당 페이지 init 함수 동적 import 후 실행

2. **detectCurrentPage()**

   - `document.querySelector("script[data-page]")`로 `data-page` 값을 읽습니다.
   - 없으면 `location.pathname`에서 파일명을 추출해 `index` → `main`, 그 외는 파일명 그대로 사용합니다.

3. **initializePage(pageName)**
   - `switch (pageName)`으로 분기 후 `import("./pages/xxx.js")`로 해당 페이지 모듈을 불러와 `initXxxPage()`를 호출합니다.

### 3. 페이지–파일–init 함수 매핑

| HTML 파일          | data-page     | js/pages/        | init 함수              |
| ------------------ | ------------- | ---------------- | ---------------------- |
| index.html         | main          | main.js          | initMainPage()         |
| courses.html       | courses       | courses.js       | initCoursesPage()      |
| course-detail.html | course-detail | course-detail.js | initCourseDetailPage() |
| course-player.html | course-player | course-player.js | initCoursePlayerPage() |
| dashboard.html     | dashboard     | dashboard.js     | initDashboardPage()    |
| login.html         | login         | auth.js          | initAuthPage()         |
| signup.html        | signup        | auth.js          | initAuthPage()         |
| profile.html       | profile       | profile.js       | initProfilePage()      |
| cart.html          | cart          | cart.js          | initCartPage()         |
| checkout.html      | checkout      | checkout.js      | initCheckoutPage()     |
| orders.html        | orders        | orders.js        | initOrdersPage()       |

**참고:** `login`과 `signup`은 같은 `auth.js`의 `initAuthPage()`를 사용합니다. `initAuthPage()` 내부에서 URL 또는 폼 ID로 로그인/회원가입을 구분합니다.

---

## 모든 추가 페이지의 공통 HTML 구조

각 페이지는 아래 골격을 따릅니다.

```html
<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>페이지 제목 - 온라인 강의 플랫폼</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/responsive.css" />
 </head>
 <body>
  <!-- 헤더 (웹 컴포넌트) -->
  <app-header></app-header>

  <!-- 메인 콘텐츠: 페이지마다 다름 -->
  <section class="???-section">
   <div class="container">
    <!-- ... -->
   </div>
  </section>

  <!-- 푸터 (웹 컴포넌트) -->
  <app-footer></app-footer>

  <script type="module" src="js/app.js" data-page="???"></script>
 </body>
</html>
```

- 인증 페이지(로그인/회원가입)에서는 헤더에 `show-auth-link="login"` 또는 `show-auth-link="signup"`을 넣어 링크를 맞출 수 있습니다.

---

## app.js에 새 페이지 추가하는 방법

새 HTML 페이지를 만들었다면 `js/app.js`에서 다음 두 가지를 추가합니다.

1. **initializePage()의 switch에 case 추가**

```javascript
case "새페이지이름": {
  const { init새페이지이름Page } = await import("./pages/새페이지이름.js");
  init새페이지이름Page();
  break;
}
```

2. **detectCurrentPage()의 pageMap에 매핑 추가** (data-page를 쓰지 않을 때 대비)

```javascript
const pageMap = {
 // ...
 새파일명: "새페이지이름",
};
```

---

## 실습 단계

### 1단계: 우선순위와 순서

추가 페이지는 아래 순서로 구현하는 것을 권장합니다.

1. **courses.html + courses.js** — 강의 목록, 필터, 정렬, 페이지네이션
2. **course-detail.html + course-detail.js** — 상세 정보, 장바구니 담기
3. **login.html, signup.html + auth.js** — 로그인/회원가입
4. **dashboard.html + dashboard.js** — 수강 중/완료/최근 강의
5. **cart.html + cart.js**, **checkout.html + checkout.js** — 장바구니·결제
6. **profile.html + profile.js**, **orders.html + orders.js** — 프로필·주문 내역
7. **course-player.html + course-player.js** — 수강 재생

---

### 2단계: 강의 목록 페이지 (courses.html)

**역할:** 필터(카테고리, 가격, 난이도), 정렬, 페이지네이션, 강의 카드 그리드.

**HTML 구조 요약:**

- `section.courses-section` > `container`
  - `h1.section-title` — "전체 강의"
  - `div.courses-layout`
    - `aside.filter-sidebar` — 라디오 필터(카테고리, 가격, 난이도), "필터 초기화" 버튼
    - `div.courses-main`
      - 정렬 선택(`#sortSelect`), 결과 개수(`#resultsCount`)
      - `div.courses-grid#coursesGrid` — 강의 카드가 동적으로 채워짐
      - `div.pagination#pagination` — 페이지네이션 버튼

**스크립트:** `data-page="courses"`

**courses.js 요약:**

- `initCoursesPage()`: `getFilteredCourses`, `sortCourses`(api.js), `renderCourseCards`(CourseCard.js) 사용
- 필터/정렬 변경 시 목록 다시 그리기, URL 쿼리와 동기화(선택)
- 페이지네이션 버튼 클릭 시 `data-page`(페이지 번호)로 이동

실제 마크업은 프로젝트의 `courses.html` 전체를 참고하여 작성합니다.

---

### 3단계: 강의 상세 페이지 (course-detail.html)

**역할:** URL 쿼리 `?id=1` 등으로 강의 ID를 받아 한 건만 표시, "장바구니 담기" 등 버튼, **강의 목록으로 이동** 링크.

**HTML 구조 요약:**

- `section.course-detail-section` > `container`
  - `div#courseDetailContent` — 상세 정보를 동적으로 채움
    - `nav.breadcrumb` > `a.breadcrumb-link[href="courses.html"]` — "← 강의 목록" 링크 (상단 네비게이션)
    - 제목, 강사, 가격, 소개, 커리큘럼 등
  - 로딩 중에는 `div.loading-spinner` 표시

**스크립트:** `data-page="course-detail"`

**course-detail.js 요약:**

- `initCourseDetailPage()`: `getQueryParam("id")`로 ID 획득 → api에서 강의 조회 → DOM에 렌더링
- `renderCourseDetail()`: 상단에 브레드크럼(`<nav class="breadcrumb">` + `courses.html` 링크) 렌더링
- "장바구니 담기" 클릭 시 storage의 장바구니에 추가 후 토스트/이동 처리

---

### 4단계: 로그인 / 회원가입 (login.html, signup.html, auth.js)

**역할:** 로그인 폼 검증 및 로그인 처리, 회원가입 폼 검증 및 사용자 추가.

**login.html 구조 요약:**

- `section.auth-section` > `container` > `div.auth-container`
  - `h1` — "로그인"
  - `form#loginForm.auth-form`
    - 이메일 `input#email` + `#emailError`
    - 비밀번호 `input#password` + `#passwordError`
    - `button[type=submit].btn.btn-primary.btn-block` — "로그인"
  - `div.auth-footer` — "계정이 없으신가요? <a href="signup.html">회원가입</a>"

**signup.html:** 이름, 이메일, 비밀번호 등 필드 + "회원가입" 버튼, 로그인 링크.

**스크립트:**

- login.html → `data-page="login"`
- signup.html → `data-page="signup"`

**auth.js 요약:**

- `initAuthPage()`: 현재 경로나 폼 ID로 로그인/회원가입 구분
  - 로그인: `#loginForm` 제출 → 이메일/비밀번호 검증 → `getUsers()`에서 일치 사용자 찾기 → `setCurrentUser(user)` → `showToast("로그인 성공!")` → `redirect` 쿼리 있으면 해당 URL, 없으면 `index.html`로 이동
  - 회원가입: `#signupForm` 제출 → 유효성 검사 → `getUsers()`/`saveUsers()`로 사용자 추가 → 로그인 페이지로 이동 또는 자동 로그인

---

### 5단계: 대시보드 (dashboard.html, dashboard.js)

**역할:** 로그인 사용자의 수강 중/완료/최근 강의 표시.

**HTML 구조 요약:**

- `section.dashboard-section` > `container`
  - `div.dashboard-header` — "학습 대시보드", "새 강의 둘러보기" 버튼
  - `div#dashboardSummary` — 학습 진도 요약(동적)
  - 수강 중인 강의 `div#enrolledCourses.courses-grid`
  - 완료한 강의 `div#completedCourses.courses-grid`
  - 최근 학습한 강의 `div#recentCourses.courses-grid`

**스크립트:** `data-page="dashboard"`

**dashboard.js 요약:**

- `initDashboardPage()`: `getCurrentUser()` 확인 후, 수강/완료/최근 목록을 storage 또는 api에서 가져와 `renderCourseCards` 등으로 그리드에 채움. 비로그인 시 로그인 페이지로 리다이렉트할 수 있음.

---

### 6단계: 장바구니·결제 (cart.html, checkout.html)

**cart.html 요약:**

- `section.cart-section` > `container`
  - `h1.section-title` — "장바구니"
  - `div.cart-layout`
    - `div#cartItems.cart-items` — 장바구니 아이템 목록(동적)
    - `aside#cartSummary.cart-summary` — 주문 요약(동적)

**cart.js:** `getCart()` 등으로 목록 렌더링, 수량 변경/삭제, 합계 갱신.

**checkout.html / checkout.js:** 결제 정보 폼, 주문 완료 시 장바구니 비우기·주문 내역 저장 등.

**스크립트:** `data-page="cart"`, `data-page="checkout"`

---

### 7단계: 프로필·주문 내역 (profile.html, orders.html)

- **profile.html:** `section.profile-section`, 사용자 정보 표시/수정 폼. `data-page="profile"`, `profile.js` → `initProfilePage()`
- **orders.html:** 주문 목록 테이블/카드. `data-page="orders"`, `orders.js` → `initOrdersPage()`

---

### 8단계: 수강 재생 (course-player.html, course-player.js)

**역할:** 수강 중인 강의의 영상/컨텐츠 재생.

- `section` 내 비디오 또는 iframe/재생 UI
- URL에서 강의 ID·챕터 등 받아 해당 강의 재생
- **스크립트:** `data-page="course-player"`, `initCoursePlayerPage()`

---

## 체크리스트

- [ ] app.js의 `detectCurrentPage()`, `initializePage()` 동작 이해
- [ ] 각 HTML에 `<app-header>`, `<app-footer>`, `data-page` 지정
- [ ] courses.html + courses.js: 강의 목록, 필터, 정렬, 페이지네이션
- [ ] course-detail.html + course-detail.js: 상세 표시, 강의 목록 링크, 장바구니 담기
- [ ] login.html, signup.html + auth.js: 로그인/회원가입 후 리다이렉트
- [ ] dashboard.html + dashboard.js: 수강 중/완료/최근 강의
- [ ] cart.html, checkout.html + cart.js, checkout.js
- [ ] profile.html, orders.html + profile.js, orders.js
- [ ] course-player.html + course-player.js (선택)
- [ ] 새 페이지 추가 시 app.js의 switch와 pageMap에 항목 추가

---

## 확인 사항

- 메인 → "강의 둘러보기" → courses.html에서 필터/정렬 시 목록이 바뀝니다.
- 강의 카드 클릭 → course-detail.html?id=1 → 상단 "강의 목록" 링크로 courses.html 이동, "장바구니 담기" 동작합니다.
- 로그인/회원가입 후 index 또는 redirect URL로 이동합니다.
- 로그인 후 "학습 대시보드"에서 수강 중인 강의가 보입니다.
- app.js는 `data-page`에 따라 해당 페이지만 init 하므로, 각 페이지 JS는 자신의 DOM만 다루면 됩니다.

---

**다음**: [11-step10-final.md](./11-step10-final.md) - 최종 완성 및 테스트
