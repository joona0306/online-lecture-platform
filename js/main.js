/**
 * main.js
 * - 메인 페이지 로직
 */

// 로그인 상태 확인 및 UI 업데이트
function updateAuthUI() {
 const currentUser = getCurrentUser();
 const loginBtn = document.getElementById("loginBtn");
 const userProfileWrapper = document.getElementById("userProfileWrapper");
 const userName = document.getElementById("userName");

 if (currentUser) {
  if (loginBtn) loginBtn.style.display = "none";
  if (userProfileWrapper) {
   userProfileWrapper.style.display = "block";
   if (userName) userName.textContent = `${currentUser.name} 님`;
  }
 } else {
  if (loginBtn) loginBtn.style.display = "block";
  if (userProfileWrapper) userProfileWrapper.style.display = "none";
 }

 // UI 업데이트 후 드롭다운 이벤트 다시 설정
 initUserDropdown();
}

// 로그아웃
function handleLogout() {
 setCurrentUser(null);
 updateAuthUI();
 showToast("로그아웃되었습니다.");
 window.location.href = "index.html";
}

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

// 검색 기능
function handleSearch() {
 const searchInput = document.getElementById("searchInput");
 const searchDropdown = document.getElementById("searchDropdown");
 const recentSearches = document.getElementById("recentSearches");
 const clearSearch = document.getElementById("clearSearch");

 // 최근 검색어 가져오기
 function getRecentSearches() {
  try {
   return JSON.parse(localStorage.getItem("recentSearches")) || [];
  } catch {
   return [];
  }
 }

 // 최근 검색어 저장
 function saveRecentSearch(query) {
  let recent = getRecentSearches();
  recent = recent.filter((q) => q !== query);
  recent.unshift(query);
  recent = recent.slice(0, 5); // 최대 5개만 저장
  localStorage.setItem("recentSearches", JSON.stringify(recent));
 }

 // 최근 검색어 렌더링
 function renderRecentSearches() {
  const recent = getRecentSearches();
  if (!recentSearches) return;

  if (recent.length === 0) {
   recentSearches.innerHTML = "";
   return;
  }

  recentSearches.innerHTML = recent
   .map(
    (query) => `
      <div class="recent-search-tag">
        <span onclick="performSearch('${query}')">${escapeHtml(query)}</span>
        <button class="remove-btn" onclick="removeRecentSearch('${query}')">×</button>
      </div>
    `
   )
   .join("");
 }

 // 검색어 제거
 window.removeRecentSearch = function (query) {
  let recent = getRecentSearches();
  recent = recent.filter((q) => q !== query);
  localStorage.setItem("recentSearches", JSON.stringify(recent));
  renderRecentSearches();
 };

 // 검색 실행
 window.performSearch = function (query) {
  if (query) {
   saveRecentSearch(query);
   window.location.href = `courses.html?query=${encodeURIComponent(query)}`;
  }
 };

 // 검색 입력 이벤트
 if (searchInput) {
  searchInput.addEventListener("focus", () => {
   if (searchDropdown) {
    searchDropdown.style.display = "block";
    renderRecentSearches();
   }
  });

  searchInput.addEventListener("blur", (e) => {
   // 드롭다운 클릭 시에는 닫히지 않도록
   setTimeout(() => {
    if (searchDropdown && !searchDropdown.contains(document.activeElement)) {
     searchDropdown.style.display = "none";
    }
   }, 200);
  });

  searchInput.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
     performSearch(query);
    }
   }
  });
 }

 // 전체 삭제
 if (clearSearch) {
  clearSearch.addEventListener("click", () => {
   localStorage.removeItem("recentSearches");
   renderRecentSearches();
  });
 }
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

// 사용자 드롭다운
let userDropdownHandler = null;

function initUserDropdown() {
 const userProfileBtn = document.getElementById("userProfileBtn");
 const userDropdown = document.getElementById("userDropdown");
 const logoutLink = document.getElementById("logoutLink");

 // 기존 이벤트 리스너 제거
 if (userDropdownHandler && userProfileBtn) {
  userProfileBtn.removeEventListener("click", userDropdownHandler);
 }

 if (userProfileBtn && userDropdown) {
  // 클릭 이벤트 핸들러
  userDropdownHandler = function (e) {
   e.stopPropagation();
   const isVisible = userDropdown.style.display === "block";
   userDropdown.style.display = isVisible ? "none" : "block";
  };

  userProfileBtn.addEventListener("click", userDropdownHandler);
 }

 // 외부 클릭 시 닫기 (전역 이벤트는 한 번만 등록)
 if (!window.userDropdownGlobalHandler) {
  window.userDropdownGlobalHandler = function (e) {
   const userProfileBtn = document.getElementById("userProfileBtn");
   const userDropdown = document.getElementById("userDropdown");
   if (userProfileBtn && userDropdown) {
    if (
     !userProfileBtn.contains(e.target) &&
     !userDropdown.contains(e.target)
    ) {
     userDropdown.style.display = "none";
    }
   }
  };
  document.addEventListener("click", window.userDropdownGlobalHandler);
 }

 if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
   e.preventDefault();
   handleLogout();
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
