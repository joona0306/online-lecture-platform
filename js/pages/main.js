/**
 * main.js - 메인 페이지 (index.html) 모듈
 *
 * 이 모듈은 메인 페이지의 기능을 담당합니다:
 * - 인기 강의 목록 렌더링
 * - 신규 강의 목록 렌더링
 * - 히어로 캐러셀 초기화
 * - 카테고리 카드 클릭 이벤트
 *
 * @module pages/main
 */

import { getPopularCourses, getNewCourses } from "../modules/api.js";
import { showEmptyState } from "../modules/utils.js";
import { renderCourseCardsAsSlides } from "../components/CourseCard.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {Object|null} 히어로 Swiper 인스턴스 */
let heroSwiperInstance = null;

/** @type {Object|null} 인기 강의 Swiper 인스턴스 */
let popularSwiperInstance = null;

/** @type {Object|null} 신규 강의 Swiper 인스턴스 */
let newSwiperInstance = null;

// ============================================================================
// 강의 렌더링 함수
// ============================================================================

/**
 * 인기 강의 섹션을 렌더링합니다.
 * 수강생 수가 많은 순으로 모든 강의를 표시합니다.
 */
export function renderPopularCourses() {
 const container = document.getElementById("popularCourses");
 if (!container) return;

 // 모든 인기 강의 가져오기 (제한 없음)
 const popularCourses = getPopularCourses(100);

 if (popularCourses.length === 0) {
  showEmptyState(container, "인기 강의가 없습니다.");
  return;
 }

 container.innerHTML = renderCourseCardsAsSlides(popularCourses);
}

/**
 * 신규 강의 섹션을 렌더링합니다.
 * 최근에 등록된 순으로 모든 강의를 표시합니다.
 */
export function renderNewCourses() {
 const container = document.getElementById("newCourses");
 if (!container) return;

 // 모든 신규 강의 가져오기 (제한 없음)
 const newCourses = getNewCourses(100);

 if (newCourses.length === 0) {
  showEmptyState(container, "신규 강의가 없습니다.");
  return;
 }

 container.innerHTML = renderCourseCardsAsSlides(newCourses);
}

// ============================================================================
// 카테고리 이벤트 핸들러
// ============================================================================

/**
 * 카테고리 카드 클릭 이벤트를 설정합니다.
 * 클릭 시 해당 카테고리 필터가 적용된 강의 목록 페이지로 이동합니다.
 */
export function setupCategoryCards() {
 const categoryCards = document.querySelectorAll(".category-card");

 categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
   const category = card.dataset.category;
   if (category) {
    window.location.href = `courses.html?category=${category}`;
   }
  });

  // 키보드 접근성 지원
  card.addEventListener("keypress", (e) => {
   if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    card.click();
   }
  });

  // 탭 포커스 가능하도록 설정
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
 });
}

// ============================================================================
// 캐러셀 (Swiper) 초기화
// ============================================================================

/**
 * 히어로 섹션의 Swiper 캐러셀을 초기화합니다.
 * Swiper 라이브러리가 로드된 후에 호출해야 합니다.
 */
export function initHeroCarousel() {
 const heroSwiper = document.querySelector(".hero-swiper");
 if (!heroSwiper) return;

 // Swiper가 로드되지 않았으면 대기
 if (typeof Swiper === "undefined") {
  console.warn("[Main] Swiper 라이브러리가 로드되지 않았습니다.");
  return;
 }

 // 이미 인스턴스가 있으면 제거
 if (heroSwiperInstance) {
  heroSwiperInstance.destroy(true, true);
 }

 // Swiper 인스턴스 생성
 heroSwiperInstance = new Swiper(".hero-swiper", {
  loop: true,
  autoplay: {
   delay: 5000,
   disableOnInteraction: false,
  },
  effect: "fade",
  fadeEffect: {
   crossFade: true,
  },
  on: {
   init: updateCounter,
   slideChange: updateCounter,
  },
 });

 // 커스텀 컨트롤 버튼 이벤트 설정
 setupCarouselControls();
}

/**
 * 인기 강의 섹션의 Swiper를 초기화합니다.
 */
export function initPopularCoursesSwiper() {
 const swiperEl = document.getElementById("popularCoursesSwiper");
 if (!swiperEl) return;

 if (popularSwiperInstance) {
  popularSwiperInstance.destroy(true, true);
 }

 // 네비게이션 버튼 요소 찾기
 const prevBtn = document.querySelector(".popular-prev");
 const nextBtn = document.querySelector(".popular-next");

 popularSwiperInstance = new Swiper("#popularCoursesSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  watchOverflow: false,
  navigation: {
   prevEl: prevBtn,
   nextEl: nextBtn,
  },
  breakpoints: {
   480: {
    slidesPerView: 2,
    spaceBetween: 16,
   },
   768: {
    slidesPerView: 3,
    spaceBetween: 20,
   },
   1024: {
    slidesPerView: 4,
    spaceBetween: 24,
   },
  },
 });
}

/**
 * 신규 강의 섹션의 Swiper를 초기화합니다.
 */
export function initNewCoursesSwiper() {
 const swiperEl = document.getElementById("newCoursesSwiper");
 if (!swiperEl) return;

 if (newSwiperInstance) {
  newSwiperInstance.destroy(true, true);
 }

 // 네비게이션 버튼 요소 찾기
 const prevBtn = document.querySelector(".new-prev");
 const nextBtn = document.querySelector(".new-next");

 newSwiperInstance = new Swiper("#newCoursesSwiper", {
  slidesPerView: 1,
  spaceBetween: 16,
  watchOverflow: false,
  navigation: {
   prevEl: prevBtn,
   nextEl: nextBtn,
  },
  breakpoints: {
   480: {
    slidesPerView: 2,
    spaceBetween: 16,
   },
   768: {
    slidesPerView: 3,
    spaceBetween: 20,
   },
   1024: {
    slidesPerView: 4,
    spaceBetween: 24,
   },
  },
 });
}

/**
 * 캐러셀 카운터를 업데이트합니다.
 * @param {Object} swiper - Swiper 인스턴스
 */
function updateCounter(swiper) {
 const currentEl = document.querySelector(".swiper-counter-current");
 const totalEl = document.querySelector(".swiper-counter-total");

 if (currentEl && swiper) {
  currentEl.textContent = swiper.realIndex + 1;
 }
 if (totalEl && swiper) {
  totalEl.textContent = swiper.slides.length;
 }
}

/**
 * 캐러셀 커스텀 컨트롤 버튼 이벤트를 설정합니다.
 */
function setupCarouselControls() {
 // 이전 버튼
 const prevBtn = document.querySelector(".swiper-button-prev-custom");
 if (prevBtn) {
  prevBtn.addEventListener("click", () => {
   if (heroSwiperInstance) {
    heroSwiperInstance.slidePrev();
   }
  });
 }

 // 다음 버튼
 const nextBtn = document.querySelector(".swiper-button-next-custom");
 if (nextBtn) {
  nextBtn.addEventListener("click", () => {
   if (heroSwiperInstance) {
    heroSwiperInstance.slideNext();
   }
  });
 }

 // 재생/일시정지 버튼
 const playPauseBtn = document.querySelector(".swiper-button-play-pause");
 if (playPauseBtn) {
  let isPlaying = true;

  playPauseBtn.addEventListener("click", () => {
   if (!heroSwiperInstance) return;

   if (isPlaying) {
    heroSwiperInstance.autoplay.stop();
    playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    playPauseBtn.setAttribute("aria-label", "캐러셀 재생");
    isPlaying = false;
   } else {
    heroSwiperInstance.autoplay.start();
    playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    playPauseBtn.setAttribute("aria-label", "캐러셀 일시정지");
    isPlaying = true;
   }
  });
 }
}

/**
 * Swiper 라이브러리 로딩을 대기합니다.
 * @param {number} timeout - 최대 대기 시간 (밀리초)
 * @returns {Promise<void>}
 */
function waitForSwiper(timeout = 5000) {
 return new Promise((resolve, reject) => {
  // 이미 로드되어 있으면 바로 resolve
  if (typeof Swiper !== "undefined") {
   resolve();
   return;
  }

  // 주기적으로 확인
  const startTime = Date.now();
  const checkInterval = setInterval(() => {
   if (typeof Swiper !== "undefined") {
    clearInterval(checkInterval);
    resolve();
   } else if (Date.now() - startTime > timeout) {
    clearInterval(checkInterval);
    reject(new Error("Swiper 라이브러리 로딩 타임아웃"));
   }
  }, 100);
 });
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 메인 페이지를 초기화합니다.
 * DOMContentLoaded 이벤트에서 호출됩니다.
 */
export async function initMainPage() {
 // 강의 섹션 렌더링
 renderPopularCourses();
 renderNewCourses();

 // 카테고리 카드 이벤트 설정
 setupCategoryCards();

 // Swiper 캐러셀 초기화
 try {
  await waitForSwiper();
  initHeroCarousel();
  initPopularCoursesSwiper();
  initNewCoursesSwiper();
 } catch (error) {
  console.error("[Main] 캐러셀 초기화 실패:", error);
 }
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initMainPage,
 renderPopularCourses,
 renderNewCourses,
 setupCategoryCards,
 initHeroCarousel,
 initPopularCoursesSwiper,
 initNewCoursesSwiper,
};
