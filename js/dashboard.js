/**
 * dashboard.js
 * - 학습 대시보드 로직
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

// 강의 카드 렌더링 (진행률 포함)
function renderCourseCardWithProgress(course, enrollment) {
 const progress = enrollment?.progress || 0;
 return `
    <a href="course-player.html?courseId=${
     course.id
    }&lessonId=1" class="course-card">
      <img src="${course.thumbnail}" alt="${escapeHtml(
  course.title
 )}" class="course-card-thumbnail" />
      <div class="course-card-content">
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <p class="course-card-instructor">${escapeHtml(course.instructor)}</p>
        <div class="course-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${progress}% 완료</span>
        </div>
        <div class="course-card-meta">
          <div class="course-card-rating">
            ${renderStars(course.rating)}
            <span>${course.rating}</span>
          </div>
        </div>
      </div>
    </a>
  `;
}

// 학습 진도 요약 렌더링
function renderDashboardSummary() {
 const currentUser = getCurrentUser();
 if (!currentUser) return;

 const enrollments = getEnrollments().filter(
  (e) => e.userId === currentUser.id
 );
 const courses = getCourses();

 let totalProgress = 0;
 let completedCount = 0;
 let totalDuration = 0;

 enrollments.forEach((enrollment) => {
  const course = courses.find((c) => c.id === enrollment.courseId);
  if (course) {
   totalProgress += enrollment.progress;
   totalDuration += course.duration;
   if (enrollment.progress === 100) {
    completedCount++;
   }
  }
 });

 const averageProgress =
  enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

 const summary = document.getElementById("dashboardSummary");
 if (!summary) return;

 summary.innerHTML = `
    <div class="summary-card">
      <h3>전체 진행률</h3>
      <div class="summary-value">${averageProgress}%</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${averageProgress}%"></div>
      </div>
    </div>
    <div class="summary-card">
      <h3>완료 강의</h3>
      <div class="summary-value">${completedCount}개</div>
    </div>
    <div class="summary-card">
      <h3>수강 중인 강의</h3>
      <div class="summary-value">${enrollments.length}개</div>
    </div>
    <div class="summary-card">
      <h3>총 학습 시간</h3>
      <div class="summary-value">${formatDuration(totalDuration)}</div>
    </div>
  `;
}

// 수강 중인 강의 렌더링
function renderEnrolledCourses() {
 const currentUser = getCurrentUser();
 if (!currentUser) return;

 const enrollments = getEnrollments()
  .filter((e) => e.userId === currentUser.id && e.progress < 100)
  .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));

 const courses = getCourses();
 const container = document.getElementById("enrolledCourses");
 if (!container) return;

 if (enrollments.length === 0) {
  showEmptyState(container, "수강 중인 강의가 없습니다.");
  return;
 }

 const enrolledCourses = enrollments
  .map((enrollment) => {
   const course = courses.find((c) => c.id === enrollment.courseId);
   return course ? { course, enrollment } : null;
  })
  .filter(Boolean);

 container.innerHTML = enrolledCourses
  .map(({ course, enrollment }) =>
   renderCourseCardWithProgress(course, enrollment)
  )
  .join("");
}

// 완료한 강의 렌더링
function renderCompletedCourses() {
 const currentUser = getCurrentUser();
 if (!currentUser) return;

 const enrollments = getEnrollments()
  .filter((e) => e.userId === currentUser.id && e.progress === 100)
  .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));

 const courses = getCourses();
 const container = document.getElementById("completedCourses");
 if (!container) return;

 if (enrollments.length === 0) {
  showEmptyState(container, "완료한 강의가 없습니다.");
  return;
 }

 const completedCourses = enrollments
  .map((enrollment) => {
   const course = courses.find((c) => c.id === enrollment.courseId);
   return course ? { course, enrollment } : null;
  })
  .filter(Boolean);

 container.innerHTML = completedCourses
  .map(({ course, enrollment }) =>
   renderCourseCardWithProgress(course, enrollment)
  )
  .join("");
}

// 최근 학습한 강의 렌더링
function renderRecentCourses() {
 const currentUser = getCurrentUser();
 if (!currentUser) return;

 const enrollments = getEnrollments()
  .filter((e) => e.userId === currentUser.id)
  .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
  .slice(0, 4);

 const courses = getCourses();
 const container = document.getElementById("recentCourses");
 if (!container) return;

 if (enrollments.length === 0) {
  showEmptyState(container, "최근 학습한 강의가 없습니다.");
  return;
 }

 const recentCourses = enrollments
  .map((enrollment) => {
   const course = courses.find((c) => c.id === enrollment.courseId);
   return course ? { course, enrollment } : null;
  })
  .filter(Boolean);

 container.innerHTML = recentCourses
  .map(({ course, enrollment }) =>
   renderCourseCardWithProgress(course, enrollment)
  )
  .join("");
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
  recent = recent.slice(0, 5);
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

 // 외부 클릭 시 닫기
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
 const currentUser = getCurrentUser();
 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

 updateAuthUI();
 renderDashboardSummary();
 renderEnrolledCourses();
 renderCompletedCourses();
 renderRecentCourses();
 handleSearch();
});
