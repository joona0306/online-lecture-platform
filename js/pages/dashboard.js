/**
 * dashboard.js - 학습 대시보드 페이지 (dashboard.html) 모듈
 *
 * 이 모듈은 학습 대시보드 페이지의 기능을 담당합니다:
 * - 학습 진도 요약 표시
 * - 수강 중인 강의 목록
 * - 완료한 강의 목록
 * - 최근 학습한 강의 목록
 *
 * @module pages/dashboard
 */

import { getCurrentUser, getEnrollments, getCourses } from "../modules/storage.js";
import { formatDuration } from "../modules/utils.js";
import { renderCourseCardsWithProgress } from "../components/CourseCard.js";

// ============================================================================
// 상태 관리 (캐시)
// ============================================================================

/** @type {Object|null} 캐시된 사용자 강의 데이터 */
let cachedUserData = null;

// ============================================================================
// 헬퍼 함수
// ============================================================================

/**
 * 빈 상태 메시지와 링크 버튼을 표시합니다.
 *
 * @param {HTMLElement} container - 대상 컨테이너
 * @param {string} message - 빈 상태 메시지
 * @param {string} linkText - 링크 버튼 텍스트
 * @param {string} linkUrl - 링크 URL
 */
function showEmptyStateWithLink(container, message, linkText, linkUrl) {
 container.innerHTML = `
    <div class="empty-state">
      <p>${message}</p>
      <a href="${linkUrl}" class="btn btn-secondary">${linkText}</a>
    </div>
  `;
}

// ============================================================================
// 데이터 가져오기 함수
// ============================================================================

/**
 * 현재 사용자의 수강 정보와 강의 데이터를 가져옵니다.
 * 중복 호출을 방지하기 위해 캐시를 사용합니다.
 *
 * @param {boolean} forceRefresh - 캐시를 무시하고 새로 로드할지 여부
 * @returns {Object} { enrollments, courses } 또는 null (로그인 필요 시)
 */
function getUserCoursesData(forceRefresh = false) {
 // 캐시가 있고 강제 새로고침이 아니면 캐시 반환
 if (cachedUserData && !forceRefresh) {
  return cachedUserData;
 }

 const currentUser = getCurrentUser();

 if (!currentUser) {
  return null;
 }

 const enrollments = getEnrollments().filter((e) => e.userId === currentUser.id);
 const courses = getCourses();

 // 캐시 저장
 cachedUserData = { enrollments, courses };

 return cachedUserData;
}

/**
 * 캐시를 초기화합니다.
 * 데이터가 변경되었을 때 호출합니다.
 */
export function clearCache() {
 cachedUserData = null;
}

/**
 * 수강 정보를 강의 데이터와 매핑합니다.
 *
 * @param {Array} enrollments - 수강 정보 배열
 * @param {Array} courses - 강의 배열
 * @returns {Array} { course, enrollment } 객체 배열
 */
function mapEnrollmentsToCourses(enrollments, courses) {
 return enrollments
  .map((enrollment) => {
   const course = courses.find((c) => c.id === enrollment.courseId);
   return course ? { course, enrollment } : null;
  })
  .filter(Boolean);
}

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 학습 진도 요약 섹션을 렌더링합니다.
 */
export function renderDashboardSummary() {
 const data = getUserCoursesData();
 if (!data) return;

 const { enrollments, courses } = data;
 const summary = document.getElementById("dashboardSummary");
 if (!summary) return;

 // 통계 계산
 let totalProgress = 0;
 let completedCount = 0;
 let totalStudyTime = 0; // 실제 학습 시간 (초)

 enrollments.forEach((enrollment) => {
  const course = courses.find((c) => c.id === enrollment.courseId);
  if (course) {
   totalProgress += enrollment.progress || 0;
   // 실제 학습 시간 합산 (enrollment에 저장된 totalStudyTime 사용)
   totalStudyTime += enrollment.totalStudyTime || 0;
   if (enrollment.progress === 100) {
    completedCount++;
   }
  }
 });

 const averageProgress =
  enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

 // HTML 렌더링
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
      <div class="summary-value">${enrollments.length - completedCount}개</div>
    </div>
    <div class="summary-card">
      <h3>총 학습 시간</h3>
      <div class="summary-value">${formatStudyTime(totalStudyTime)}</div>
    </div>
  `;
}

/**
 * 학습 시간을 사람이 읽기 쉬운 형태로 포맷합니다.
 *
 * @param {number} seconds - 학습 시간 (초)
 * @returns {string} 포맷된 학습 시간 문자열
 */
function formatStudyTime(seconds) {
 if (seconds === 0) return "0분";

 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);

 if (hours > 0) {
  return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
 }
 return `${minutes}분`;
}

/**
 * 수강 중인 강의 섹션을 렌더링합니다.
 * 진행 중(0% < progress < 100%)인 강의만 표시합니다.
 */
export function renderEnrolledCourses() {
 const data = getUserCoursesData();
 if (!data) return;

 const { enrollments, courses } = data;
 const container = document.getElementById("enrolledCourses");
 if (!container) return;

 // 수강 중인 강의 필터링 (완료되지 않은 강의)
 const inProgressEnrollments = enrollments
  .filter((e) => e.progress < 100)
  .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));

 if (inProgressEnrollments.length === 0) {
  showEmptyStateWithLink(
   container,
   "수강 중인 강의가 없습니다.",
   "새 강의 둘러보기",
   "courses.html"
  );
  return;
 }

 const coursesWithEnrollments = mapEnrollmentsToCourses(inProgressEnrollments, courses);
 container.innerHTML = renderCourseCardsWithProgress(coursesWithEnrollments);
}

/**
 * 완료한 강의 섹션을 렌더링합니다.
 * 진행률이 100%인 강의만 표시합니다.
 */
export function renderCompletedCourses() {
 const data = getUserCoursesData();
 if (!data) return;

 const { enrollments, courses } = data;
 const container = document.getElementById("completedCourses");
 if (!container) return;

 // 완료된 강의 필터링
 const completedEnrollments = enrollments
  .filter((e) => e.progress === 100)
  .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));

 if (completedEnrollments.length === 0) {
  showEmptyStateWithLink(
   container,
   "완료한 강의가 없습니다.",
   "강의 계속 학습하기",
   "courses.html"
  );
  return;
 }

 const coursesWithEnrollments = mapEnrollmentsToCourses(completedEnrollments, courses);
 container.innerHTML = renderCourseCardsWithProgress(coursesWithEnrollments);
}

/**
 * 최근 학습한 강의 섹션을 렌더링합니다.
 * 최근 접근한 순으로 최대 4개까지 표시합니다.
 */
export function renderRecentCourses() {
 const data = getUserCoursesData();
 if (!data) return;

 const { enrollments, courses } = data;
 const container = document.getElementById("recentCourses");
 if (!container) return;

 // 최근 학습한 강의 정렬 (최대 4개)
 const recentEnrollments = enrollments
  .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
  .slice(0, 4);

 if (recentEnrollments.length === 0) {
  showEmptyStateWithLink(
   container,
   "최근 학습한 강의가 없습니다.",
   "강의 둘러보기",
   "courses.html"
  );
  return;
 }

 const coursesWithEnrollments = mapEnrollmentsToCourses(recentEnrollments, courses);
 container.innerHTML = renderCourseCardsWithProgress(coursesWithEnrollments);
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 대시보드 페이지를 초기화합니다.
 */
export function initDashboardPage() {
 // 로그인 확인
 const currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

 // 각 섹션 렌더링
 renderDashboardSummary();
 renderEnrolledCourses();
 renderCompletedCourses();
 renderRecentCourses();
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initDashboardPage,
 renderDashboardSummary,
 renderEnrolledCourses,
 renderCompletedCourses,
 renderRecentCourses,
 clearCache,
};
