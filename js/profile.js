/**
 * profile.js
 * - 프로필 페이지 로직
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

// 프로필 렌더링
function renderProfile() {
 const currentUser = getCurrentUser();
 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

 const container = document.getElementById("profileContainer");
 if (!container) return;

 // 통계 계산
 const enrollments = getEnrollments().filter(
  (e) => e.userId === currentUser.id
 );
 const courses = getCourses();
 const enrolledCourses = enrollments
  .map((e) => {
   const course = courses.find((c) => c.id === e.courseId);
   return course ? { course, enrollment: e } : null;
  })
  .filter(Boolean);

 const completedCount = enrollments.filter((e) => e.progress === 100).length;
 const inProgressCount = enrollments.filter(
  (e) => e.progress < 100 && e.progress > 0
 ).length;

 let html = `
    <div class="profile-header">
      <div class="profile-avatar">
        <div class="avatar-circle">${currentUser.name.charAt(0)}</div>
      </div>
      <div class="profile-info">
        <h1>${escapeHtml(currentUser.name)}</h1>
        <p class="profile-email">${escapeHtml(currentUser.email)}</p>
        <p class="profile-role">${
         currentUser.role === "instructor" ? "강사" : "수강생"
        }</p>
        <p class="profile-joined">가입일: ${formatDate(
         currentUser.createdAt
        )}</p>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-card">
        <h3>수강 중인 강의</h3>
        <div class="stat-value">${inProgressCount}개</div>
      </div>
      <div class="stat-card">
        <h3>완료한 강의</h3>
        <div class="stat-value">${completedCount}개</div>
      </div>
      <div class="stat-card">
        <h3>총 수강 강의</h3>
        <div class="stat-value">${enrollments.length}개</div>
      </div>
    </div>

    <div class="profile-courses">
      <h2>내 강의 목록</h2>
      <div class="courses-grid" id="profileCourses">
        ${
         enrolledCourses.length === 0
          ? '<div class="empty-state"><p>수강 중인 강의가 없습니다.</p></div>'
          : enrolledCourses
             .map(
              ({ course, enrollment }) => `
                <a href="course-player.html?courseId=${
                 course.id
                }&lessonId=1" class="course-card">
                  <img src="${course.thumbnail}" alt="${escapeHtml(
               course.title
              )}" class="course-card-thumbnail" />
                  <div class="course-card-content">
                    <h3 class="course-card-title">${escapeHtml(
                     course.title
                    )}</h3>
                    <p class="course-card-instructor">${escapeHtml(
                     course.instructor
                    )}</p>
                    <div class="course-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${
                         enrollment.progress
                        }%"></div>
                      </div>
                      <span class="progress-text">${
                       enrollment.progress
                      }% 완료</span>
                    </div>
                  </div>
                </a>
              `
             )
             .join("")
        }
      </div>
    </div>
  `;

 container.innerHTML = html;
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
 updateAuthUI();
 renderProfile();
 handleSearch();
});
