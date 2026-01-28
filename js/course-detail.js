/**
 * course-detail.js
 * - 강의 상세 페이지 로직
 */

let currentCourse = null;
let currentEnrollment = null;

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

// 강의 로드
function loadCourse() {
 const courseId = parseInt(getQueryParam("id"));
 if (!courseId) {
  showError("강의를 찾을 수 없습니다.");
  return;
 }

 const courses = getCourses();
 currentCourse = courses.find((c) => c.id === courseId);

 if (!currentCourse) {
  showError("강의를 찾을 수 없습니다.");
  return;
 }

 // 수강 정보 확인
 const currentUser = getCurrentUser();
 if (currentUser) {
  currentEnrollment = getEnrollment(currentUser.id, courseId);
 }

 renderCourseDetail();
}

// 강의 상세 렌더링
function renderCourseDetail() {
 const container = document.getElementById("courseDetailContent");
 if (!container || !currentCourse) return;

 const totalLessons = currentCourse.curriculum.reduce(
  (sum, section) => sum + section.lessons.length,
  0
 );

 const isEnrolled = currentEnrollment !== undefined;

 let html = `
    <div class="course-detail-header">
      <div class="course-detail-thumbnail">
        <img src="${currentCourse.thumbnail}" alt="${escapeHtml(
  currentCourse.title
 )}" />
      </div>
      <div class="course-detail-info">
        <h1>${escapeHtml(currentCourse.title)}</h1>
        <p class="course-instructor">강사: ${escapeHtml(
         currentCourse.instructor
        )}</p>
        <div class="course-meta">
          <div class="course-rating">
            ${renderStars(currentCourse.rating)}
            <span>${currentCourse.rating}</span>
            <span class="course-reviews">(${
             currentCourse.reviews
            }개 후기)</span>
          </div>
          <div class="course-students">${currentCourse.students.toLocaleString()}명 수강</div>
        </div>
        <div class="course-details">
          <span class="course-category">${getCategoryName(
           currentCourse.category
          )}</span>
          <span class="course-level">${getLevelName(currentCourse.level)}</span>
          <span class="course-duration">${formatDuration(
           currentCourse.duration
          )}</span>
        </div>
        <div class="course-price">${formatPrice(currentCourse.price)}</div>
        <div class="course-actions">
          ${
           isEnrolled
            ? `<a href="course-player.html?courseId=${currentCourse.id}&lessonId=1" class="btn btn-primary">수강하기</a>`
            : `<button class="btn btn-primary" id="enrollBtn">${
               currentCourse.price === 0 ? "무료로 수강하기" : "수강 신청"
              }</button>`
          }
        </div>
      </div>
    </div>

    <div class="course-detail-body">
      <div class="course-description">
        <h2>강의 소개</h2>
        <p>${escapeHtml(currentCourse.description)}</p>
      </div>

      <div class="course-curriculum">
        <h2>커리큘럼</h2>
        <div class="curriculum-content">
          ${renderCurriculum()}
        </div>
      </div>

      <div class="course-reviews-section">
        <h2>수강 후기</h2>
        <div class="reviews-summary">
          <div class="reviews-average">
            <span class="reviews-rating">${currentCourse.rating}</span>
            <div class="reviews-stars">${renderStars(
             currentCourse.rating
            )}</div>
            <span class="reviews-count">${currentCourse.reviews}개 후기</span>
          </div>
        </div>
        <div class="reviews-list" id="reviewsList">
          ${renderReviews()}
        </div>
        ${
         isEnrolled
          ? `<button class="btn btn-primary" id="writeReviewBtn">후기 작성하기</button>`
          : ""
        }
      </div>
    </div>
  `;

 container.innerHTML = html;

 // 수강 신청 버튼 이벤트
 if (!isEnrolled) {
  const enrollBtn = document.getElementById("enrollBtn");
  if (enrollBtn) {
   enrollBtn.addEventListener("click", handleEnroll);
  }
 }

 // 후기 작성 버튼 이벤트
 const writeReviewBtn = document.getElementById("writeReviewBtn");
 if (writeReviewBtn) {
  writeReviewBtn.addEventListener("click", showReviewForm);
 }
}

// 커리큘럼 렌더링
function renderCurriculum() {
 if (!currentCourse || !currentCourse.curriculum) return "";

 let html = "";
 for (const section of currentCourse.curriculum) {
  html += `
      <div class="curriculum-section">
        <h3>${escapeHtml(section.title)}</h3>
        <ul class="curriculum-lessons">
    `;

  for (const lesson of section.lessons) {
   const previewBadge = lesson.isPreview
    ? '<span class="preview-badge">미리보기</span>'
    : "";
   html += `
        <li class="curriculum-lesson">
          <span class="lesson-icon">▶</span>
          <span class="lesson-title">${escapeHtml(lesson.title)}</span>
          <span class="lesson-duration">${formatDuration(
           lesson.duration
          )}</span>
          ${previewBadge}
        </li>
      `;
  }

  html += `
        </ul>
      </div>
    `;
 }

 return html;
}

// 후기 렌더링
function renderReviews() {
 const reviews = getReviewsByCourse(currentCourse.id);
 if (reviews.length === 0) {
  return '<div class="empty-state"><p>아직 후기가 없습니다.</p></div>';
 }

 return reviews
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map(
   (review) => `
      <div class="review-card">
        <div class="review-header">
          <span class="review-author">${escapeHtml(review.userName)}</span>
          <span class="review-date">${formatRelativeTime(
           review.createdAt
          )}</span>
        </div>
        <div class="review-rating">${renderStars(review.rating)}</div>
        <div class="review-content">${escapeHtml(review.content)}</div>
      </div>
    `
  )
  .join("");
}

// 수강 신청
function handleEnroll() {
 const currentUser = getCurrentUser();
 if (!currentUser) {
  if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
   window.location.href = `login.html?redirect=course-detail.html?id=${currentCourse.id}`;
  }
  return;
 }

 // 이미 수강 중인지 확인
 if (currentEnrollment) {
  showToast("이미 수강 중인 강의입니다.");
  return;
 }

 // 수강 정보 생성
 const enrollment = {
  userId: currentUser.id,
  courseId: currentCourse.id,
  progress: 0,
  completedLessons: [],
  enrolledAt: new Date().toISOString(),
  lastAccessedAt: new Date().toISOString(),
  videoProgress: {},
 };

 saveEnrollment(enrollment);
 currentEnrollment = enrollment;

 showToast("수강 신청이 완료되었습니다!");

 // 페이지 새로고침하여 UI 업데이트
 setTimeout(() => {
  window.location.reload();
 }, 1000);
}

// 후기 작성 폼 표시
function showReviewForm() {
 const reviewsList = document.getElementById("reviewsList");
 if (!reviewsList) return;

 const formHtml = `
    <div class="review-form" id="reviewForm">
      <h3>후기 작성</h3>
      <div class="form-group">
        <label>평점</label>
        <div class="rating-input">
          ${[5, 4, 3, 2, 1]
           .map(
            (rating) => `
            <input type="radio" name="reviewRating" id="rating-${rating}" value="${rating}" />
            <label for="rating-${rating}" class="star-label">★</label>
          `
           )
           .join("")}
        </div>
      </div>
      <div class="form-group">
        <label for="reviewContent">후기 내용</label>
        <textarea id="reviewContent" placeholder="후기를 작성해주세요..."></textarea>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" id="submitReviewBtn">작성하기</button>
        <button class="btn btn-secondary" id="cancelReviewBtn">취소</button>
      </div>
    </div>
  `;

 reviewsList.insertAdjacentHTML("beforebegin", formHtml);

 // 제출 버튼 이벤트
 const submitBtn = document.getElementById("submitReviewBtn");
 if (submitBtn) {
  submitBtn.addEventListener("click", submitReview);
 }

 // 취소 버튼 이벤트
 const cancelBtn = document.getElementById("cancelReviewBtn");
 if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
   const form = document.getElementById("reviewForm");
   if (form) form.remove();
  });
 }
}

// 후기 제출
function submitReview() {
 const currentUser = getCurrentUser();
 if (!currentUser) {
  showToast("로그인이 필요합니다.", "error");
  return;
 }

 const rating = document.querySelector(
  'input[name="reviewRating"]:checked'
 )?.value;
 const content = document.getElementById("reviewContent")?.value.trim();

 if (!rating) {
  showToast("평점을 선택해주세요.", "error");
  return;
 }

 if (!content) {
  showToast("후기 내용을 입력해주세요.", "error");
  return;
 }

 // 후기 저장
 const review = {
  id: Date.now(),
  courseId: currentCourse.id,
  userId: currentUser.id,
  userName: currentUser.name,
  rating: parseInt(rating),
  content: content,
  createdAt: new Date().toISOString(),
 };

 saveReview(review);

 // 강의 평점 업데이트
 updateCourseRating();

 showToast("후기가 작성되었습니다!");

 // 폼 제거 및 후기 목록 새로고침
 const form = document.getElementById("reviewForm");
 if (form) form.remove();

 const reviewsList = document.getElementById("reviewsList");
 if (reviewsList) {
  reviewsList.innerHTML = renderReviews();
 }
}

// 강의 평점 업데이트
function updateCourseRating() {
 const reviews = getReviewsByCourse(currentCourse.id);
 if (reviews.length === 0) return;

 const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
 const averageRating = totalRating / reviews.length;

 const courses = getCourses();
 const courseIndex = courses.findIndex((c) => c.id === currentCourse.id);
 if (courseIndex >= 0) {
  courses[courseIndex].rating = Math.round(averageRating * 10) / 10;
  courses[courseIndex].reviews = reviews.length;
  saveCourses(courses);
  currentCourse = courses[courseIndex];
 }
}

// 에러 표시
function showError(message) {
 const container = document.getElementById("courseDetailContent");
 if (container) {
  container.innerHTML = `
      <div class="empty-state">
        <p>${message}</p>
        <a href="courses.html" class="btn btn-primary">강의 목록으로</a>
      </div>
    `;
 }
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
 handleSearch();
 loadCourse();
});
