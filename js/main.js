/**
 * main.js
 * - 메인 페이지 로직 (헤더/검색/드롭다운은 header.js 사용)
 */

// 강의 카드 렌더링
function renderCourseCard(course) {
 return `
    <a href="course-detail.html?id=${course.id}" class="course-card">
      <img src="${course.thumbnail}" alt="${escapeHtml(
  course.title
 )}" class="course-card-thumbnail" />
      <div class="course-card-content">
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <p class="course-card-instructor">${escapeHtml(course.instructor)}</p>
        <div class="course-card-meta">
          <div class="course-card-rating">
            ${renderStars(course.rating)}
            <span>${course.rating}</span>
          </div>
          <span class="course-card-students">${course.students.toLocaleString()}명</span>
        </div>
        <div class="course-card-price">${formatPrice(course.price)}</div>
      </div>
    </a>
  `;
}

// 인기 강의 렌더링
function renderPopularCourses() {
 const courses = getCourses();
 const popularCourses = [...courses]
  .sort((a, b) => b.students - a.students)
  .slice(0, 4);

 const container = document.getElementById("popularCourses");
 if (!container) return;

 if (popularCourses.length === 0) {
  showEmptyState(container, "인기 강의가 없습니다.");
  return;
 }

 container.innerHTML = popularCourses.map(renderCourseCard).join("");
}

// 신규 강의 렌더링
function renderNewCourses() {
 const courses = getCourses();
 const newCourses = [...courses]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 4);

 const container = document.getElementById("newCourses");
 if (!container) return;

 if (newCourses.length === 0) {
  showEmptyState(container, "신규 강의가 없습니다.");
  return;
 }

 container.innerHTML = newCourses.map(renderCourseCard).join("");
}

// 카테고리 클릭
function handleCategoryClick() {
 const categoryCards = document.querySelectorAll(".category-card");
 categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
   const category = card.dataset.category;
   window.location.href = `courses.html?category=${category}`;
  });
 });
}

// Swiper 캐러셀 초기화
let swiperInstance = null;

function initCarousel() {
 const heroSwiper = document.querySelector(".hero-swiper");
 if (!heroSwiper) return;

 // 카운터 업데이트 함수
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

 // Swiper 인스턴스 생성
 swiperInstance = new Swiper(".hero-swiper", {
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
   init: function (swiper) {
    updateCounter(swiper);
   },
   slideChange: function (swiper) {
    updateCounter(swiper);
   },
  },
 });

 // 초기 카운터 설정
 updateCounter(swiperInstance);

 // 커스텀 네비게이션 버튼
 const prevBtn = document.querySelector(".swiper-button-prev-custom");
 const nextBtn = document.querySelector(".swiper-button-next-custom");
 const playPauseBtn = document.querySelector(".swiper-button-play-pause");

 if (prevBtn) {
  prevBtn.addEventListener("click", () => {
   if (swiperInstance) {
    swiperInstance.slidePrev();
   }
  });
 }

 if (nextBtn) {
  nextBtn.addEventListener("click", () => {
   if (swiperInstance) {
    swiperInstance.slideNext();
   }
  });
 }

 // 재생/일시정지 버튼
 if (playPauseBtn) {
  let isPlaying = true;
  playPauseBtn.addEventListener("click", () => {
   if (!swiperInstance) return;
   if (isPlaying) {
    swiperInstance.autoplay.stop();
    playPauseBtn.textContent = "▶";
    isPlaying = false;
   } else {
    swiperInstance.autoplay.start();
    playPauseBtn.textContent = "❚❚";
    isPlaying = true;
   }
  });
 }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
 updateAuthUI();
 renderPopularCourses();
 renderNewCourses();
 handleSearch();
 handleCategoryClick();
 initUserDropdown();

 // Swiper가 로드될 때까지 대기
 if (typeof Swiper !== "undefined") {
  initCarousel();
 } else {
  // Swiper가 아직 로드되지 않았다면 대기
  const checkSwiper = setInterval(() => {
   if (typeof Swiper !== "undefined") {
    clearInterval(checkSwiper);
    initCarousel();
   }
  }, 100);

  // 최대 5초 대기
  setTimeout(() => {
   clearInterval(checkSwiper);
   if (typeof Swiper !== "undefined") {
    initCarousel();
   } else {
    console.error("Swiper library failed to load");
   }
  }, 5000);
 }
});
