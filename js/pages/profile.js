/**
 * profile.js - 프로필 페이지 (profile.html) 모듈
 *
 * 이 모듈은 프로필 페이지의 기능을 담당합니다:
 * - 사용자 프로필 정보 표시
 * - 수강 통계 표시
 * - 내 강의 목록 표시
 *
 * @module pages/profile
 */

import { getCurrentUser, getEnrollments, getCourses } from "../modules/storage.js";
import { formatDate, escapeHtml } from "../modules/utils.js";
import { renderCourseCardsWithProgress } from "../components/CourseCard.js";

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 프로필 페이지 전체를 렌더링합니다.
 */
export function renderProfile() {
 const currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

 const container = document.getElementById("profileContainer");
 if (!container) return;

 // 수강 정보 및 통계 계산
 const enrollments = getEnrollments().filter((e) => e.userId === currentUser.id);
 const courses = getCourses();

 const enrolledCourses = enrollments
  .map((e) => {
   const course = courses.find((c) => c.id === e.courseId);
   return course ? { course, enrollment: e } : null;
  })
  .filter(Boolean);

 // 통계 계산
 const completedCount = enrollments.filter((e) => e.progress === 100).length;
 const inProgressCount = enrollments.filter((e) => e.progress < 100 && e.progress > 0).length;

 // HTML 렌더링
 container.innerHTML = `
    ${renderProfileHeader(currentUser)}
    ${renderProfileStats(enrollments.length, inProgressCount, completedCount)}
    ${renderProfileCourses(enrolledCourses)}
  `;
}

/**
 * 프로필 헤더 (아바타, 이름, 이메일 등)를 렌더링합니다.
 *
 * @param {Object} user - 사용자 객체
 * @returns {string} HTML 문자열
 */
function renderProfileHeader(user) {
 // 이름의 첫 글자를 아바타로 사용
 const avatarInitial = user.name.charAt(0).toUpperCase();
 const roleName = user.role === "instructor" ? "강사" : "수강생";

 return `
    <div class="profile-header">
      <div class="profile-avatar">
        <div class="avatar-circle" aria-label="프로필 아바타">${avatarInitial}</div>
      </div>
      <div class="profile-info">
        <h1>${escapeHtml(user.name)}</h1>
        <p class="profile-email">${escapeHtml(user.email)}</p>
        <p class="profile-role">
          <span class="role-badge ${user.role}">${roleName}</span>
        </p>
        <p class="profile-joined">
          <span class="label">가입일:</span> ${formatDate(user.createdAt)}
        </p>
        ${user.bio ? `<p class="profile-bio">${escapeHtml(user.bio)}</p>` : ""}
      </div>
    </div>
  `;
}

/**
 * 프로필 통계 카드를 렌더링합니다.
 *
 * @param {number} totalCount - 총 수강 강의 수
 * @param {number} inProgressCount - 수강 중인 강의 수
 * @param {number} completedCount - 완료한 강의 수
 * @returns {string} HTML 문자열
 */
function renderProfileStats(totalCount, inProgressCount, completedCount) {
 return `
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
        <div class="stat-value">${totalCount}개</div>
      </div>
    </div>
  `;
}

/**
 * 내 강의 목록 섹션을 렌더링합니다.
 *
 * @param {Array} coursesWithEnrollments - { course, enrollment } 객체 배열
 * @returns {string} HTML 문자열
 */
function renderProfileCourses(coursesWithEnrollments) {
 const coursesHtml =
  coursesWithEnrollments.length === 0
   ? '<div class="empty-state"><p>수강 중인 강의가 없습니다.</p><a href="courses.html" class="btn btn-primary">강의 둘러보기</a></div>'
   : renderCourseCardsWithProgress(coursesWithEnrollments);

 return `
    <div class="profile-courses">
      <h2>내 강의 목록</h2>
      <div class="courses-grid" id="profileCourses">
        ${coursesHtml}
      </div>
    </div>
  `;
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 프로필 페이지를 초기화합니다.
 */
export function initProfilePage() {
 renderProfile();
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initProfilePage,
 renderProfile,
};
