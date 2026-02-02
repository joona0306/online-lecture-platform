# 8단계: 메인 페이지 기능

`js/modules/modal.js`, `js/components/CourseCard.js`, `js/app.js`, `js/pages/main.js`를 작성하여 데이터 초기화, 히어로 Swiper, 인기/신규 강의 렌더링, 카테고리 클릭을 구현합니다.

---

## 학습 목표

- app.js: initializeData(), 현재 페이지 감지, main 페이지 init 로드
- CourseCard.js: renderCourseCard(), renderCourseCardsAsSlides()
- main.js: renderPopularCourses(), renderNewCourses(), initHeroCarousel(), setupCarouselControls(), initPopularCoursesSwiper(), initNewCoursesSwiper(), setupCategoryCards(), initMainPage()

---

## 실습 단계

### 1단계: js/modules/modal.js (최소 버전)

임시 링크 처리용으로, 나중에 9단계에서 확장할 수 있습니다.

`js/modules/modal.js` 파일을 만들고 아래만 작성합니다.

```javascript
/**
 * modal.js - 모달/임시 링크 처리 (최소 버전)
 */

export function setupPlaceholderLinks() {
 // 나중에 href="#" 클릭 시 "준비 중" 모달 표시 등 추가 가능
}
```

---

### 2단계: js/components/CourseCard.js

강의 카드 HTML을 만드는 함수만 넣습니다. (웹 컴포넌트 등록은 10단계에서 선택)

`js/components/CourseCard.js` 파일을 만들고 아래를 작성합니다.

```javascript
/**
 * CourseCard.js - 강의 카드 렌더링
 */

import { formatPrice, renderStars, escapeHtml } from "../modules/utils.js";

export function renderCourseCard(course, enrollment = null) {
 const progress = enrollment?.progress || 0;
 const showProgress = enrollment !== null;
 const linkUrl =
  showProgress && progress > 0
   ? `course-player.html?courseId=${course.id}&lessonId=1`
   : `course-detail.html?id=${course.id}`;

 const students = course.students != null ? course.students : 0;

 return `
  <a href="${linkUrl}" class="course-card">
    <img
      src="${course.thumbnail || "https://picsum.photos/400/225?random=0"}"
      alt="${escapeHtml(course.title)}"
      class="course-card-thumbnail"
      loading="lazy"
    />
    <div class="course-card-content">
      <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
      <p class="course-card-instructor">${escapeHtml(course.instructor)}</p>
      <div class="course-card-meta">
        <div class="course-card-rating">
          ${renderStars(course.rating || 0)}
          <span>${course.rating || 0}</span>
        </div>
        <span class="course-card-students">${students.toLocaleString()}명</span>
      </div>
      <div class="course-card-price">${formatPrice(course.price || 0)}</div>
    </div>
  </a>
  `;
}

export function renderCourseCardsAsSlides(courses) {
 return courses
  .map(
   (course) => `
    <div class="swiper-slide">
      ${renderCourseCard(course)}
    </div>
  `
  )
  .join("");
}
```

---

### 3단계: js/app.js

실습에서는 3단계에서 만든 **일반 HTML 헤더/푸터**를 사용하므로, AppHeader/AppFooter는 import하지 않습니다.

`js/app.js` 파일을 **아래 내용으로 통째로 교체**합니다.

```javascript
/**
 * app.js - 앱 진입점
 */

import { initializeData } from "./modules/api.js";
import { setupPlaceholderLinks } from "./modules/modal.js";

async function initializePage(pageName) {
 try {
  switch (pageName) {
   case "main": {
    const { initMainPage } = await import("./pages/main.js");
    initMainPage();
    break;
   }
   default:
    console.warn("[App] 알 수 없는 페이지:", pageName);
  }
 } catch (error) {
  console.error("[App] 페이지 초기화 실패:", error);
 }
}

function detectCurrentPage() {
 const script = document.querySelector("script[data-page]");
 if (script) return script.dataset.page;
 const path = window.location.pathname;
 const filename = path.split("/").pop().replace(".html", "") || "index";
 const pageMap = {
  index: "main",
  "": "main",
  courses: "courses",
  "course-detail": "course-detail",
  dashboard: "dashboard",
  login: "login",
  signup: "signup",
  cart: "cart",
  profile: "profile",
  checkout: "checkout",
  orders: "orders",
 };
 return pageMap[filename] || "main";
}

async function initializeApp() {
 try {
  await initializeData();
  setupPlaceholderLinks();
  const currentPage = detectCurrentPage();
  await initializePage(currentPage);
 } catch (error) {
  console.error("[App] 초기화 실패:", error);
 }
}

if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", initializeApp);
} else {
 initializeApp();
}
```

---

### 4단계: js/pages/main.js

`js/pages/main.js` 파일을 만들고 아래를 작성합니다.

```javascript
/**
 * main.js - 메인 페이지
 */

import { getPopularCourses, getNewCourses } from "../modules/api.js";
import { showEmptyState } from "../modules/utils.js";
import { renderCourseCardsAsSlides } from "../components/CourseCard.js";

let heroSwiperInstance = null;
let popularSwiperInstance = null;
let newSwiperInstance = null;

export function renderPopularCourses() {
 const container = document.getElementById("popularCourses");
 if (!container) return;
 const courses = getPopularCourses(100);
 if (courses.length === 0) {
  showEmptyState(container, "인기 강의가 없습니다.");
  return;
 }
 container.innerHTML = renderCourseCardsAsSlides(courses);
}

export function renderNewCourses() {
 const container = document.getElementById("newCourses");
 if (!container) return;
 const courses = getNewCourses(100);
 if (courses.length === 0) {
  showEmptyState(container, "신규 강의가 없습니다.");
  return;
 }
 container.innerHTML = renderCourseCardsAsSlides(courses);
}

export function setupCategoryCards() {
 document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
   const category = card.dataset.category;
   if (category) window.location.href = `courses.html?category=${category}`;
  });
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
 });
}

function updateCounter(swiper) {
 const currentEl = document.querySelector(".swiper-counter-current");
 const totalEl = document.querySelector(".swiper-counter-total");
 if (currentEl && swiper) currentEl.textContent = swiper.realIndex + 1;
 if (totalEl && swiper) totalEl.textContent = swiper.slides.length;
}

function setupCarouselControls() {
 const prevBtn = document.querySelector(".swiper-button-prev-custom");
 const nextBtn = document.querySelector(".swiper-button-next-custom");
 const playPauseBtn = document.querySelector(".swiper-button-play-pause");

 if (prevBtn) {
  prevBtn.addEventListener("click", () => heroSwiperInstance?.slidePrev());
 }
 if (nextBtn) {
  nextBtn.addEventListener("click", () => heroSwiperInstance?.slideNext());
 }
 if (playPauseBtn) {
  let isPlaying = true;
  playPauseBtn.addEventListener("click", () => {
   if (!heroSwiperInstance) return;
   if (isPlaying) {
    heroSwiperInstance.autoplay.stop();
    playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    playPauseBtn.setAttribute("aria-label", "캐러셀 재생");
   } else {
    heroSwiperInstance.autoplay.start();
    playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    playPauseBtn.setAttribute("aria-label", "캐러셀 일시정지");
   }
   isPlaying = !isPlaying;
  });
 }
}

export function initHeroCarousel() {
 const heroSwiper = document.querySelector(".hero-swiper");
 if (!heroSwiper || typeof Swiper === "undefined") return;
 if (heroSwiperInstance) heroSwiperInstance.destroy(true, true);

 heroSwiperInstance = new Swiper(".hero-swiper", {
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  effect: "fade",
  fadeEffect: { crossFade: true },
  on: { init: updateCounter, slideChange: updateCounter },
 });
 setupCarouselControls();
}

export function initPopularCoursesSwiper() {
 const el = document.getElementById("popularCoursesSwiper");
 if (!el || typeof Swiper === "undefined") return;
 if (popularSwiperInstance) popularSwiperInstance.destroy(true, true);
 const prevBtn = document.querySelector(".popular-prev");
 const nextBtn = document.querySelector(".popular-next");
 popularSwiperInstance = new Swiper("#popularCoursesSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  watchOverflow: false,
  navigation: { prevEl: prevBtn, nextEl: nextBtn },
  breakpoints: {
   480: { slidesPerView: 2, spaceBetween: 16 },
   768: { slidesPerView: 3, spaceBetween: 20 },
   1024: { slidesPerView: 4, spaceBetween: 24 },
  },
 });
}

export function initNewCoursesSwiper() {
 const el = document.getElementById("newCoursesSwiper");
 if (!el || typeof Swiper === "undefined") return;
 if (newSwiperInstance) newSwiperInstance.destroy(true, true);
 const prevBtn = document.querySelector(".new-prev");
 const nextBtn = document.querySelector(".new-next");
 newSwiperInstance = new Swiper("#newCoursesSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  watchOverflow: false,
  navigation: { prevEl: prevBtn, nextEl: nextBtn },
  breakpoints: {
   480: { slidesPerView: 2, spaceBetween: 16 },
   768: { slidesPerView: 3, spaceBetween: 20 },
   1024: { slidesPerView: 4, spaceBetween: 24 },
  },
 });
}

function waitForSwiper(timeout = 5000) {
 return new Promise((resolve, reject) => {
  if (typeof Swiper !== "undefined") {
   resolve();
   return;
  }
  const start = Date.now();
  const id = setInterval(() => {
   if (typeof Swiper !== "undefined") {
    clearInterval(id);
    resolve();
   } else if (Date.now() - start > timeout) {
    clearInterval(id);
    reject(new Error("Swiper 로딩 타임아웃"));
   }
  }, 100);
 });
}

export async function initMainPage() {
 renderPopularCourses();
 renderNewCourses();
 setupCategoryCards();
 try {
  await waitForSwiper();
  initHeroCarousel();
  initPopularCoursesSwiper();
  initNewCoursesSwiper();
 } catch (error) {
  console.error("[Main] 캐러셀 초기화 실패:", error);
 }
}
```

---

## 체크리스트

- [ ] js/modules/modal.js (setupPlaceholderLinks) 작성
- [ ] js/components/CourseCard.js (renderCourseCard, renderCourseCardsAsSlides) 작성
- [ ] js/app.js (initializeData, detectCurrentPage, initializePage, main만) 작성
- [ ] js/pages/main.js (렌더링, Swiper 초기화, 카테고리, initMainPage) 작성
- [ ] **로컬 서버**로 index.html 열기 (file:// 아님)
- [ ] 메인 페이지에서 인기/신규 강의 카드가 슬라이드로 보이는지 확인
- [ ] 히어로 이전/다음/일시정지 버튼 동작 확인
- [ ] 카테고리 카드 클릭 시 courses.html?category= 값으로 이동하는지 확인

---

## 확인 사항

- data/courses.json에 최소 2개 강의가 있어야 인기/신규 섹션에 카드가 채워집니다.
- Swiper 스크립트가 index.html에 포함되어 있어야 합니다: `<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>`
- 스크립트 태그에 `data-page="main"`이 있어야 합니다: `<script type="module" src="js/app.js" data-page="main"></script>`

---

**다음**: [10-step9-more-pages.md](./10-step9-more-pages.md) - 추가 페이지 (courses, course-detail, 로그인 등)
