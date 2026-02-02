# 10단계: 최종 완성 및 테스트

전체 기능을 점검하고, 필요 시 헤더/푸터를 웹 컴포넌트로 통일하며, 접근성·반응형·로컬 환경을 최종 확인합니다.

---

## 학습 목표

- (선택) AppHeader.js, AppFooter.js 웹 컴포넌트 사용: 각 HTML에서 `<app-header>`, `<app-footer>` 사용
- 로컬 서버에서 전체 플로우 테스트 (메인 → 강의 → 상세 → 장바구니 → 결제, 로그인 → 대시보드 → 수강 재생)
- 접근성·반응형 최종 확인 (키보드 포커스, alt, role, 미디어 쿼리)
- CORS 없이 JSON/모듈 로드 확인

---

## 1. 전체 플로우 테스트

로컬 서버를 띄운 뒤 아래 순서로 동작을 확인합니다.

### 1-1. 메인 → 강의 목록 → 상세 → 장바구니 → 결제

1. **메인 페이지 (index.html)**

   - 히어로, 인기 강의·신규 강의 Swiper, 카테고리 그리드가 보이는지
   - "강의 둘러보기" 버튼 클릭 → `courses.html` 이동
   - "무료로 시작하기" 등 버튼 링크 동작

2. **강의 목록 (courses.html)**

   - 필터(카테고리, 가격, 난이도) 변경 시 목록 갱신
   - 정렬 변경 시 목록 갱신
   - 페이지네이션 클릭 시 페이지 변경
   - 강의 카드 클릭 → `course-detail.html?id=1` 등으로 이동

3. **강의 상세 (course-detail.html)**

   - URL의 `id`에 맞는 강의 정보 표시
   - 상단 "강의 목록" 링크 클릭 → `courses.html` 이동
   - "장바구니 담기" 클릭 시 장바구니에 추가·토스트(또는 메시지)
   - "장바구니로 이동" 등 링크 → `cart.html`

4. **장바구니 (cart.html)**

   - 담은 강의 목록·가격 합계 표시
   - 수량 변경/삭제 시 합계 갱신
   - "결제하기" → `checkout.html`

5. **결제 (checkout.html)**
   - 주문 요약·결제 정보 입력
   - "주문 완료" 시 장바구니 비우기·주문 내역 저장·완료 페이지/메시지

### 1-2. 로그인 → 대시보드 → 수강 재생

1. **로그인 (login.html)**

   - 이메일/비밀번호 입력 후 로그인
   - 성공 시 `index.html` 또는 `redirect` 쿼리 URL로 이동
   - 실패 시 에러 메시지 표시

2. **대시보드 (dashboard.html)**

   - 로그인 상태에서 "학습 대시보드" 접근
   - 수강 중/완료/최근 강의 영역에 데이터 표시
   - "수강하기" 등 클릭 → `course-player.html?id=1` 등

3. **수강 재생 (course-player.html)**
   - 강의 ID에 맞는 영상/컨텐츠 재생
   - (구현한 경우) 챕터 목록·진도 저장

### 1-3. 회원가입 → 로그인

1. **회원가입 (signup.html)**

   - 이름, 이메일, 비밀번호 등 입력 후 제출
   - 성공 시 사용자 저장·로그인 페이지로 이동 또는 자동 로그인

2. **로그인 (login.html)**
   - 방금 가입한 계정으로 로그인
   - 대시보드·장바구니 등 로그인 필요 페이지 접근 가능

---

## 2. 기능별 체크리스트

아래 항목을 하나씩 확인합니다.

| 구분        | 확인 항목                                                                    |
| ----------- | ---------------------------------------------------------------------------- |
| 메인        | 히어로 캐러셀, 인기/신규 Swiper, 카테고리 클릭, 강의 둘러보기/무료 시작 버튼 |
| 강의 목록   | 필터·정렬·페이지네이션, 카드 클릭 시 상세 이동                               |
| 강의 상세   | id 파라미터로 상세 표시, 강의 목록 링크(courses.html), 장바구니 담기         |
| 장바구니    | 목록 표시, 수량/삭제, 합계, 결제하기 이동                                    |
| 결제        | 주문 요약, 결제 처리, 완료 후 장바구니/주문 반영                             |
| 로그인      | 유효/무효 입력 시 성공/에러, 리다이렉트                                      |
| 회원가입    | 유효성 검사, 가입 후 로그인 가능                                             |
| 대시보드    | 수강 중/완료/최근 강의 표시, 수강하기 이동                                   |
| 수강 재생   | 강의 재생, (선택) 진도 저장                                                  |
| 프로필/주문 | 프로필 정보 표시·수정, 주문 내역 목록                                        |

---

## 3. 로컬 서버 및 CORS 확인

- **로컬 서버 필수**  
  `file://`로 열면 ES 모듈·fetch로 JSON 로드 시 CORS/경로 문제가 납니다.  
  반드시 로컬 서버를 사용하세요.

  - 예: `npx serve .` 또는 `python -m http.server`
  - 브라우저 주소창에 `http://localhost:포트번호/` 로 접속

- **확인 사항**
  - [ ] 모든 페이지가 `http://localhost:...` 로 열림
  - [ ] 콘솔에 CORS 또는 모듈 로드 에러 없음
  - [ ] `data/courses.json`, `data/users.json` 등 fetch 정상 동작
  - [ ] `js/app.js` 및 `js/pages/*.js` 모듈 로드 정상

---

## 4. 접근성 최종 확인

- **키보드**

  - [ ] Tab으로 버튼·링크·입력 필드 순서대로 이동 가능
  - [ ] 포커스 시 `outline` 또는 `focus-visible` 스타일로 시각적 표시
  - [ ] 모달·드롭다운이 열렸을 때 Esc 또는 포커스 트랩 등 (구현한 경우)

- **이미지**

  - [ ] 의미 있는 이미지에 `alt` 텍스트 지정
  - [ ] 장식용 이미지는 `alt=""` 또는 `role="presentation"`

- **폼**

  - [ ] `label`과 `input`이 `for`/`id`로 연결
  - [ ] 에러 메시지를 해당 필드와 연결(`aria-describedby` 등, 선택)

- **로딩/동적 영역**
  - [ ] 로딩 스피너에 `role="status"` 또는 `aria-label="로딩 중"`
  - [ ] 동적으로 추가되는 콘텐츠가 스크린 리더에 알려질 수 있도록 구조화

---

## 5. 반응형 최종 확인

- **브레이크포인트**

  - [ ] 767px 이하: 모바일 (1열, 히어로 버튼 세로, 네비 숨김 등)
  - [ ] 768px~1023px: 태블릿 (2열 그리드 등)
  - [ ] 1024px 이상: 데스크톱 (3~4열 그리드)

- **실제 확인**
  - Chrome DevTools → 디바이스 툴바(또는 Ctrl+Shift+M)
  - 375px, 768px, 1024px 등에서 레이아웃·버튼·텍스트가 깨지지 않는지 확인

---

## 6. (선택) 웹 컴포넌트 AppHeader / AppFooter

이미 8단계에서 `app.js`에 `AppHeader`, `AppFooter`를 import 해 두었다면, 각 HTML에서는 아래처럼만 사용하면 됩니다.

### 6-1. 사용 방법

- **헤더**

  ```html
  <app-header></app-header>
  ```

  - 로그인 페이지: `<app-header show-auth-link="login"></app-header>`
  - 회원가입 페이지: `<app-header show-auth-link="signup"></app-header>`

- **푸터**
  ```html
  <app-footer></app-footer>
  ```

### 6-2. app.js에서 로드

```javascript
import "./components/AppHeader.js";
import "./components/AppFooter.js";
```

이렇게 하면 모든 페이지에서 `<app-header>`, `<app-footer>`가 정의되며, 각 컴포넌트가 `connectedCallback`에서 DOM을 렌더링합니다.

### 6-3. AppHeader / AppFooter 요약

- **AppHeader**

  - 로고, 검색창(선택), 네비 링크, 장바구니, 로그인/회원가입 또는 사용자 메뉴
  - `getCurrentUser()`, `getCartCount()` 등 storage 연동
  - 속성: `show-search`, `show-auth-link`

- **AppFooter**
  - 회사 정보, 고객센터, 저작권 문구
  - `footer.footer` > `container` > `footer-content`, `footer-bottom`

기존에 `<header>`, `<footer>`를 직접 마크업했다면, 이들을 `<app-header>`, `<app-footer>`로 교체하고, `css/style.css`의 `.header`, `.footer` 스타일을 그대로 쓰면 됩니다.

---

## 7. 최종 체크리스트

- [ ] 로컬 서버로 전체 페이지 접속 가능
- [ ] 메인 → 강의 목록 → 상세 → 장바구니 → 결제 플로우 동작
- [ ] 로그인 → 대시보드 → 수강 재생 플로우 동작
- [ ] 회원가입 → 로그인 동작
- [ ] CORS/모듈 로드 에러 없음
- [ ] 키보드 포커스·이미지 alt·폼 label 등 접근성 확인
- [ ] 375px / 768px / 1024px에서 반응형 확인
- [ ] (선택) 모든 페이지에 `<app-header>`, `<app-footer>` 적용

---

## 완료

가이드를 처음부터 따라 오면 여기까지 진행한 결과가 현재 프로젝트와 동일한 수준이 됩니다.

- 추가 문의: [README-REVIEW.md](./README-REVIEW.md) 및 프로젝트 [README](../../README.md) 참고
- 실습 인덱스: [00-practice-guide-index.md](./00-practice-guide-index.md)
