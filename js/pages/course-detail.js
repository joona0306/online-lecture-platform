/**
 * course-detail.js - 강의 상세 페이지 (course-detail.html) 모듈
 *
 * 이 모듈은 강의 상세 페이지의 기능을 담당합니다:
 * - 강의 정보 표시
 * - 커리큘럼 표시
 * - 수강 신청 처리
 * - 후기 작성 및 표시
 *
 * @module pages/course-detail
 */

import {
 getCourseById,
 getCurrentUser,
 getEnrollment,
 saveEnrollment,
 createEnrollment,
 getReviewsByCourse,
 saveReview,
 getCourses,
 saveCourses,
 addToCart,
 isInCart,
} from "../modules/storage.js";
import {
 getQueryParam,
 formatPrice,
 formatDuration,
 formatRelativeTime,
 renderStars,
 getCategoryName,
 getLevelName,
 escapeHtml,
 showToast,
} from "../modules/utils.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {Object|null} 현재 강의 데이터 */
let currentCourse = null;

/** @type {Object|null} 현재 수강 정보 */
let currentEnrollment = null;

// ============================================================================
// 강의 로드 함수
// ============================================================================

/**
 * URL 파라미터에서 강의 ID를 읽어 강의 정보를 로드합니다.
 *
 * @returns {boolean} 로드 성공 여부
 */
function loadCourse() {
 const courseId = parseInt(getQueryParam("id"));

 // 상태 초기화
 currentCourse = null;
 currentEnrollment = null;

 if (!courseId) {
  showError("강의를 찾을 수 없습니다.");
  return false;
 }

 currentCourse = getCourseById(courseId);

 if (!currentCourse) {
  showError("강의를 찾을 수 없습니다.");
  return false;
 }

 // 수강 정보 확인 (로그인 상태일 때만)
 const currentUser = getCurrentUser();
 if (currentUser) {
  currentEnrollment = getEnrollment(currentUser.id, courseId);
 }

 return true;
}

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 강의 상세 정보를 렌더링합니다.
 */
export function renderCourseDetail() {
 const container = document.getElementById("courseDetailContent");
 if (!container || !currentCourse) return;

 // null과 undefined 모두 체크 (비로그인 시 null, 미수강 시 undefined)
 const isEnrolled = currentEnrollment != null;

 container.innerHTML = `
    <nav class="breadcrumb" aria-label="페이지 경로">
      <a href="courses.html" class="breadcrumb-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        강의 목록
      </a>
    </nav>
    <div class="course-detail-header">
      ${renderThumbnail()}
      ${renderCourseInfo(isEnrolled)}
    </div>
    <div class="course-detail-body">
      ${renderDescription()}
      ${renderCurriculum()}
      ${renderReviewsSection(isEnrolled)}
    </div>
  `;

 // 이벤트 리스너 설정
 setupEventListeners(isEnrolled);
}

/**
 * 강의 썸네일을 렌더링합니다.
 * @returns {string} HTML 문자열
 */
function renderThumbnail() {
 return `
    <div class="course-detail-thumbnail">
      <img src="${currentCourse.thumbnail}" alt="${escapeHtml(currentCourse.title)}" />
    </div>
  `;
}

/**
 * 강의 기본 정보를 렌더링합니다.
 * @param {boolean} isEnrolled - 수강 중 여부
 * @returns {string} HTML 문자열
 */
function renderCourseInfo(isEnrolled) {
 return `
    <div class="course-detail-info">
      <h1>${escapeHtml(currentCourse.title)}</h1>
      <p class="course-instructor">강사: ${escapeHtml(currentCourse.instructor)}</p>
      
      <div class="course-meta">
        <div class="course-rating">
          ${renderStars(currentCourse.rating)}
          <span>${currentCourse.rating}</span>
          <span class="course-reviews">(${currentCourse.reviews}개 후기)</span>
        </div>
        <div class="course-students">${currentCourse.students.toLocaleString()}명 수강</div>
      </div>
      
      <div class="course-details">
        <span class="course-category">${getCategoryName(currentCourse.category)}</span>
        <span class="course-level">${getLevelName(currentCourse.level)}</span>
        <span class="course-duration">${formatDuration(currentCourse.duration)}</span>
      </div>
      
      <div class="course-price">${formatPrice(currentCourse.price)}</div>
      
      <div class="course-actions">
        ${isEnrolled ? renderEnrolledStatus() : renderPurchaseButtons()}
      </div>
    </div>
  `;
}

/**
 * 구매 버튼들을 렌더링합니다.
 * 무료 강의, 유료 강의, 장바구니 상태에 따라 다르게 표시합니다.
 * @returns {string} HTML 문자열
 */
function renderPurchaseButtons() {
 const currentUser = getCurrentUser();
 const inCart = currentUser ? isInCart(currentUser.id, currentCourse.id) : false;

 // 무료 강의인 경우
 if (currentCourse.price === 0) {
  return `
   <button class="btn btn-primary" id="enrollBtn">무료로 수강하기</button>
  `;
 }

 // 유료 강의인 경우
 return `
  <div class="purchase-buttons">
   <button class="btn btn-primary" id="enrollBtn">바로 구매</button>
   ${
    inCart
     ? `<a href="cart.html" class="btn btn-secondary">장바구니 보기</a>`
     : `<button class="btn btn-secondary" id="addToCartBtn">장바구니 담기</button>`
   }
  </div>
 `;
}

/**
 * 수강 중인 상태를 렌더링합니다.
 * 진행률과 이어서 학습하기 버튼을 표시합니다.
 * @returns {string} HTML 문자열
 */
function renderEnrolledStatus() {
 // 진행률 계산
 const totalLessons =
  currentCourse.curriculum?.reduce((sum, section) => sum + section.lessons.length, 0) || 0;
 const completedLessons = currentEnrollment?.completedLessons?.length || 0;
 const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

 // 마지막으로 학습한 레슨 ID 찾기 (없으면 첫 번째 레슨)
 const lastLessonId = currentEnrollment?.lastLessonId || 1;

 return `
    <div class="enrolled-status">
      <div class="enrolled-badge">
        <span class="enrolled-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <span class="enrolled-text">수강 중인 강의</span>
      </div>
      <div class="enrolled-progress">
        <div class="progress-info">
          <span>진행률</span>
          <span class="progress-percentage">${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-detail">
          ${completedLessons}/${totalLessons} 레슨 완료
        </div>
      </div>
      <a href="course-player.html?courseId=${
       currentCourse.id
      }&lessonId=${lastLessonId}" class="btn btn-primary">
        ${progress > 0 ? "이어서 학습하기" : "학습 시작하기"}
      </a>
      <a href="dashboard.html" class="btn btn-secondary">내 학습 대시보드</a>
    </div>
  `;
}

/**
 * 강의 설명을 렌더링합니다.
 * @returns {string} HTML 문자열
 */
function renderDescription() {
 return `
    <div class="course-description">
      <h2>강의 소개</h2>
      <p>${escapeHtml(currentCourse.description)}</p>
    </div>
  `;
}

/**
 * 커리큘럼을 렌더링합니다.
 * @returns {string} HTML 문자열
 */
function renderCurriculum() {
 if (!currentCourse.curriculum || currentCourse.curriculum.length === 0) {
  return '<div class="course-curriculum"><h2>커리큘럼</h2><p>커리큘럼 정보가 없습니다.</p></div>';
 }

 let curriculumHtml = "";

 for (const section of currentCourse.curriculum) {
  curriculumHtml += `
      <div class="curriculum-section">
        <h3>${escapeHtml(section.title)}</h3>
        <ul class="curriculum-lessons">
    `;

  for (const lesson of section.lessons) {
   const previewBadge = lesson.isPreview ? '<span class="preview-badge">미리보기</span>' : "";

   curriculumHtml += `
        <li class="curriculum-lesson">
          <span class="lesson-icon">▶</span>
          <span class="lesson-title">${escapeHtml(lesson.title)}</span>
          <span class="lesson-duration">${formatDuration(lesson.duration)}</span>
          ${previewBadge}
        </li>
      `;
  }

  curriculumHtml += "</ul></div>";
 }

 return `
    <div class="course-curriculum">
      <h2>커리큘럼</h2>
      <div class="curriculum-content">${curriculumHtml}</div>
    </div>
  `;
}

/**
 * 후기 섹션을 렌더링합니다.
 * @param {boolean} isEnrolled - 수강 중 여부
 * @returns {string} HTML 문자열
 */
function renderReviewsSection(isEnrolled) {
 return `
    <div class="course-reviews-section">
      <h2>수강 후기</h2>
      <div class="reviews-summary">
        <div class="reviews-average">
          <span class="reviews-rating">${currentCourse.rating}</span>
          <div class="reviews-stars">${renderStars(currentCourse.rating)}</div>
          <span class="reviews-count">${currentCourse.reviews}개 후기</span>
        </div>
      </div>
      <div class="reviews-list" id="reviewsList">
        ${renderReviews()}
      </div>
      ${
       isEnrolled
        ? '<button class="btn btn-secondary" id="writeReviewBtn">후기 작성하기</button>'
        : ""
      }
    </div>
  `;
}

/**
 * 후기 목록을 렌더링합니다.
 * @returns {string} HTML 문자열
 */
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
          <span class="review-date">${formatRelativeTime(review.createdAt)}</span>
        </div>
        <div class="review-rating">${renderStars(review.rating)}</div>
        <div class="review-content">${escapeHtml(review.content)}</div>
      </div>
    `
  )
  .join("");
}

// ============================================================================
// 이벤트 핸들러
// ============================================================================

/**
 * 이벤트 리스너를 설정합니다.
 * @param {boolean} isEnrolled - 수강 중 여부
 */
function setupEventListeners(isEnrolled) {
 // 수강 신청/바로 구매 버튼
 if (!isEnrolled) {
  const enrollBtn = document.getElementById("enrollBtn");
  if (enrollBtn) {
   enrollBtn.addEventListener("click", handleEnroll);
  }

  // 장바구니 담기 버튼
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
   addToCartBtn.addEventListener("click", handleAddToCart);
  }
 }

 // 후기 작성 버튼
 const writeReviewBtn = document.getElementById("writeReviewBtn");
 if (writeReviewBtn) {
  writeReviewBtn.addEventListener("click", showReviewForm);
 }
}

/**
 * 장바구니에 강의를 추가합니다.
 */
function handleAddToCart() {
 const currentUser = getCurrentUser();

 if (!currentUser) {
  if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
   window.location.href = `login.html?redirect=course-detail.html?id=${currentCourse.id}`;
  }
  return;
 }

 const result = addToCart(currentUser.id, currentCourse.id);

 if (result) {
  showToast("장바구니에 추가되었습니다.");
  // 버튼 상태 업데이트
  renderCourseDetail();
  // 헤더 장바구니 카운트 업데이트
  updateHeaderCartCount();
 } else {
  showToast("이미 장바구니에 있거나 수강 중인 강의입니다.", "warning");
 }
}

/**
 * 헤더의 장바구니 카운트를 업데이트합니다.
 */
function updateHeaderCartCount() {
 const header = document.querySelector("app-header");
 if (header && header.updateCartCount) {
  header.updateCartCount();
 }
}

/**
 * 수강 신청/바로 구매를 처리합니다.
 */
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
  showToast("이미 수강 중인 강의입니다.", "warning");
  return;
 }

 // 유료 강의인 경우 장바구니에 담고 결제 페이지로 이동
 if (currentCourse.price > 0) {
  addToCart(currentUser.id, currentCourse.id);
  window.location.href = "checkout.html";
  return;
 }

 // 무료 강의인 경우 바로 수강 등록
 const enrollment = createEnrollment(currentUser.id, currentCourse.id);
 saveEnrollment(enrollment);
 currentEnrollment = enrollment;

 showToast("수강 신청이 완료되었습니다!");

 // 페이지 새로고침
 setTimeout(() => {
  window.location.reload();
 }, 1000);
}

/**
 * 후기 작성 폼을 표시합니다.
 */
function showReviewForm() {
 const reviewsList = document.getElementById("reviewsList");
 if (!reviewsList) return;

 // 이미 폼이 있으면 제거
 const existingForm = document.getElementById("reviewForm");
 if (existingForm) {
  existingForm.remove();
  return;
 }

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
        <textarea id="reviewContent" placeholder="후기를 작성해주세요..." rows="4"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" id="submitReviewBtn" type="button">작성하기</button>
        <button class="btn btn-secondary" id="cancelReviewBtn" type="button">취소</button>
      </div>
    </div>
  `;

 reviewsList.insertAdjacentHTML("beforebegin", formHtml);

 // 폼 이벤트 설정
 document.getElementById("submitReviewBtn").addEventListener("click", submitReview);
 document.getElementById("cancelReviewBtn").addEventListener("click", () => {
  document.getElementById("reviewForm").remove();
 });
}

/**
 * 후기를 제출합니다.
 */
function submitReview() {
 const currentUser = getCurrentUser();

 if (!currentUser) {
  showToast("로그인이 필요합니다.", "error");
  return;
 }

 const ratingInput = document.querySelector('input[name="reviewRating"]:checked');
 const contentInput = document.getElementById("reviewContent");

 if (!ratingInput) {
  showToast("평점을 선택해주세요.", "error");
  return;
 }

 const content = contentInput?.value.trim();
 if (!content) {
  showToast("후기 내용을 입력해주세요.", "error");
  return;
 }

 // 후기 저장
 const review = {
  courseId: currentCourse.id,
  userId: currentUser.id,
  userName: currentUser.name,
  rating: parseInt(ratingInput.value),
  content: content,
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

/**
 * 강의 평점을 업데이트합니다.
 */
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

/**
 * 에러 메시지를 표시합니다.
 * @param {string} message - 에러 메시지
 */
function showError(message) {
 const container = document.getElementById("courseDetailContent");
 if (container) {
  container.innerHTML = `
      <div class="empty-state">
        <p>${escapeHtml(message)}</p>
        <a href="courses.html" class="btn btn-primary">강의 목록으로</a>
      </div>
    `;
 }
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 강의 상세 페이지를 초기화합니다.
 */
export function initCourseDetailPage() {
 if (loadCourse()) {
  renderCourseDetail();
 }
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initCourseDetailPage,
 renderCourseDetail,
};
