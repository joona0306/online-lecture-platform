/**
 * profile.js
 * - 프로필 페이지 로직 (헤더/검색/드롭다운은 header.js 사용)
 */

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

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
 updateAuthUI();
 renderProfile();
 handleSearch();
});
