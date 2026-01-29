/**
 * dashboard.js
 * - 학습 대시보드 로직 (헤더/검색/드롭다운은 header.js 사용)
 */

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
