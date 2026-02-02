/**
 * CourseCard.js - 강의 카드 웹 컴포넌트
 *
 * 이 컴포넌트는 강의 정보를 카드 형태로 표시합니다.
 * 강의 목록, 메인 페이지, 대시보드 등에서 사용됩니다.
 *
 * 사용 방법:
 * <course-card
 *   course-id="1"
 *   title="JavaScript 기초"
 *   instructor="홍길동"
 *   thumbnail="https://..."
 *   price="49000"
 *   rating="4.6"
 *   students="1500"
 *   progress="50"
 *   show-progress="true"
 * ></course-card>
 *
 * 또는 JavaScript로:
 * const card = document.createElement('course-card');
 * card.setCourse(courseObject, enrollmentObject);
 *
 * @module components/CourseCard
 */

import { formatPrice, renderStars, escapeHtml } from "../modules/utils.js";

// ============================================================================
// CourseCard 웹 컴포넌트 클래스
// ============================================================================

/**
 * 강의 카드 웹 컴포넌트
 * Shadow DOM을 사용하지 않아 외부 CSS와 호환됩니다.
 */
class CourseCard extends HTMLElement {
 /**
  * 컴포넌트 생성자
  * 초기 상태를 설정합니다.
  */
 constructor() {
  super();

  // 강의 데이터 저장
  this._course = null;
  this._enrollment = null;
 }

 // ==========================================================================
 // 라이프사이클 메서드
 // ==========================================================================

 /**
  * 컴포넌트가 DOM에 연결될 때 호출됩니다.
  * 초기 렌더링을 수행합니다.
  */
 connectedCallback() {
  this.render();
 }

 /**
  * 관찰할 속성 목록을 반환합니다.
  */
 static get observedAttributes() {
  return [
   "course-id",
   "title",
   "instructor",
   "thumbnail",
   "price",
   "rating",
   "students",
   "progress",
   "show-progress",
  ];
 }

 /**
  * 관찰 중인 속성이 변경될 때 호출됩니다.
  */
 attributeChangedCallback(name, oldValue, newValue) {
  if (oldValue !== newValue && this.isConnected) {
   this.render();
  }
 }

 // ==========================================================================
 // 데이터 설정 메서드
 // ==========================================================================

 /**
  * 강의 객체로 카드 데이터를 설정합니다.
  * 속성을 하나씩 설정하는 것보다 효율적입니다.
  *
  * @param {Object} course - 강의 객체
  * @param {Object} enrollment - 수강 정보 객체 (선택적)
  * @example
  * const card = document.createElement('course-card');
  * card.setCourse({
  *   id: 1,
  *   title: 'JavaScript 기초',
  *   instructor: '홍길동',
  *   thumbnail: 'https://...',
  *   price: 49000,
  *   rating: 4.6,
  *   students: 1500
  * });
  */
 setCourse(course, enrollment = null) {
  this._course = course;
  this._enrollment = enrollment;
  this.render();
 }

 // ==========================================================================
 // 렌더링 메서드
 // ==========================================================================

 /**
  * 컴포넌트의 HTML을 렌더링합니다.
  * 공용 함수 renderCourseCard를 재사용하여 중복을 제거합니다.
  */
 render() {
  // 강의 데이터 가져오기 (객체 또는 속성에서)
  const course = this._getCourseData();
  const enrollment = this._enrollment;

  if (!course.id) {
   this.innerHTML = '<div class="course-card-error">강의 정보를 불러올 수 없습니다.</div>';
   return;
  }

  // 공용 렌더링 함수 사용 (중복 코드 제거)
  this.innerHTML = renderCourseCard(course, enrollment);
 }

 /**
  * 강의 데이터를 객체 또는 속성에서 가져옵니다.
  * @returns {Object} 강의 데이터 객체
  */
 _getCourseData() {
  // 객체로 설정된 경우 객체 사용
  if (this._course) {
   return this._course;
  }

  // 속성에서 데이터 구성
  return {
   id: this.getAttribute("course-id"),
   title: this.getAttribute("title") || "",
   instructor: this.getAttribute("instructor") || "",
   thumbnail: this.getAttribute("thumbnail") || "",
   price: parseInt(this.getAttribute("price")) || 0,
   rating: parseFloat(this.getAttribute("rating")) || 0,
   students: parseInt(this.getAttribute("students")) || 0,
  };
 }
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 강의 객체 배열을 CourseCard HTML 문자열로 변환합니다.
 * 컴포넌트를 직접 생성하는 것보다 빠른 렌더링이 필요할 때 사용합니다.
 *
 * @param {Array<Object>} courses - 강의 객체 배열
 * @param {Object} enrollments - 사용자별 수강 정보 맵 (courseId -> enrollment)
 * @returns {string} HTML 문자열
 * @example
 * container.innerHTML = renderCourseCards(courses);
 */
/**
 * 강의의 첫 번째 레슨 ID를 반환합니다.
 * @param {Object} course - 강의 객체
 * @returns {number} 첫 번째 레슨 ID (없으면 1)
 */
function getFirstLessonId(course) {
 if (!course?.curriculum?.length) return 1;
 for (const section of course.curriculum) {
  if (section.lessons?.length) {
   return section.lessons[0].id;
  }
 }
 return 1;
}

export function renderCourseCard(course, enrollment = null) {
 const progress = enrollment?.progress || 0;
 const showProgress = enrollment !== null;

 const linkUrl =
  showProgress && progress > 0
   ? `course-player.html?courseId=${course.id}&lessonId=${getFirstLessonId(course)}`
   : `course-detail.html?id=${course.id}`;

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
        ${
         showProgress
          ? `
          <div class="course-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="progress-text">${progress}% 완료</span>
          </div>
        `
          : ""
        }
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

/**
 * 강의 목록을 HTML 문자열로 변환합니다.
 *
 * @param {Array<Object>} courses - 강의 객체 배열
 * @returns {string} HTML 문자열
 */
export function renderCourseCards(courses) {
 return courses.map((course) => renderCourseCard(course)).join("");
}

/**
 * 강의 목록을 Swiper 슬라이드 형태의 HTML 문자열로 변환합니다.
 *
 * @param {Array<Object>} courses - 강의 객체 배열
 * @returns {string} HTML 문자열 (swiper-slide로 감싸진)
 */
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

/**
 * 수강 정보가 포함된 강의 목록을 HTML 문자열로 변환합니다.
 *
 * @param {Array<Object>} coursesWithEnrollments - { course, enrollment } 객체 배열
 * @returns {string} HTML 문자열
 */
export function renderCourseCardsWithProgress(coursesWithEnrollments) {
 return coursesWithEnrollments
  .map(({ course, enrollment }) => renderCourseCard(course, enrollment))
  .join("");
}

// ============================================================================
// 웹 컴포넌트 등록
// ============================================================================

// 커스텀 엘리먼트 등록 (아직 등록되지 않은 경우에만)
if (!customElements.get("course-card")) {
 customElements.define("course-card", CourseCard);
}

export default CourseCard;
