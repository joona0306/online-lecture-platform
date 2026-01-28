/**
 * course-player.js
 * - 비디오 플레이어 제어
 * - 학습 진도 관리
 * - 레슨 네비게이션
 */

let currentCourse = null;
let currentLesson = null;
let currentEnrollment = null;
let currentUser = null;

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
function loadCourse(courseId, lessonId) {
 const courses = getCourses();
 currentCourse = courses.find((c) => c.id === courseId);

 if (!currentCourse) {
  alert("강의를 찾을 수 없습니다.");
  window.location.href = "courses.html";
  return;
 }

 // 수강 정보 가져오기
 currentEnrollment = getEnrollment(currentUser.id, courseId);

 if (!currentEnrollment) {
  alert("수강 신청이 필요합니다.");
  window.location.href = `course-detail.html?id=${courseId}`;
  return;
 }

 // 레슨 찾기
 const lesson = findLesson(currentCourse, lessonId);
 if (!lesson) {
  alert("레슨을 찾을 수 없습니다.");
  return;
 }

 currentLesson = lesson;

 // UI 업데이트
 updateCourseInfo();
 updateCurriculum();
 updateProgress();
 loadVideo(lesson);
 updateNavigationButtons();
}

// 레슨 찾기
function findLesson(course, lessonId) {
 for (const section of course.curriculum) {
  const lesson = section.lessons.find((l) => l.id === lessonId);
  if (lesson) return lesson;
 }
 return null;
}

// 비디오 로드
function loadVideo(lesson) {
 const video = document.getElementById("videoPlayer");
 const videoError = document.getElementById("videoError");

 if (!video || !videoError) return;

 video.style.display = "block";
 videoError.style.display = "none";

 // 비디오 소스 설정
 video.src = lesson.videoUrl;

 // 저장된 재생 위치 복원
 const videoProgress = getVideoProgress(currentUser.id, currentCourse.id);
 const savedTime = videoProgress[lesson.id] || 0;

 video.addEventListener("loadedmetadata", () => {
  if (savedTime > 0) {
   video.currentTime = savedTime;
  }
 });

 // 비디오 오류 처리
 video.addEventListener("error", () => {
  video.style.display = "none";
  videoError.style.display = "block";
 });

 // 재생 위치 저장 (일시정지 시)
 let saveTimeout;
 video.addEventListener("timeupdate", () => {
  if (video.currentTime > 0) {
   clearTimeout(saveTimeout);
   saveTimeout = setTimeout(() => {
    saveVideoProgress(
     currentUser.id,
     currentCourse.id,
     lesson.id,
     video.currentTime
    );
   }, 1000); // 1초마다 저장
  }
 });

 // 일시정지 시 즉시 저장
 video.addEventListener("pause", () => {
  saveVideoProgress(
   currentUser.id,
   currentCourse.id,
   lesson.id,
   video.currentTime
  );
 });
}

// 비디오 플레이어 설정
function setupVideoPlayer() {
 const video = document.getElementById("videoPlayer");
 const retryBtn = document.getElementById("retryVideo");

 if (retryBtn) {
  retryBtn.addEventListener("click", () => {
   if (currentLesson) {
    loadVideo(currentLesson);
   }
  });
 }
}

// 레슨 네비게이션 설정
function setupLessonNavigation() {
 const prevBtn = document.getElementById("prevLesson");
 const nextBtn = document.getElementById("nextLesson");

 if (prevBtn) {
  prevBtn.addEventListener("click", () => {
   const prevLesson = findPreviousLesson();
   if (prevLesson) {
    navigateToLesson(prevLesson.id);
   }
  });
 }

 if (nextBtn) {
  nextBtn.addEventListener("click", () => {
   const nextLesson = findNextLesson();
   if (nextLesson) {
    navigateToLesson(nextLesson.id);
   }
  });
 }
}

// 이전 레슨 찾기
function findPreviousLesson() {
 if (!currentCourse || !currentLesson) return null;

 let found = false;
 for (const section of currentCourse.curriculum) {
  for (let i = section.lessons.length - 1; i >= 0; i--) {
   if (found) {
    return section.lessons[i];
   }
   if (section.lessons[i].id === currentLesson.id) {
    found = true;
   }
  }
 }
 return null;
}

// 다음 레슨 찾기
function findNextLesson() {
 if (!currentCourse || !currentLesson) return null;

 let found = false;
 for (const section of currentCourse.curriculum) {
  for (const lesson of section.lessons) {
   if (found) {
    return lesson;
   }
   if (lesson.id === currentLesson.id) {
    found = true;
   }
  }
 }
 return null;
}

// 레슨으로 이동
function navigateToLesson(lessonId) {
 window.location.href = `course-player.html?courseId=${currentCourse.id}&lessonId=${lessonId}`;
}

// 레슨 완료 설정
function setupLessonComplete() {
 const checkBox = document.getElementById("lessonCompleteCheck");
 if (!checkBox) return;

 // 현재 레슨 완료 상태 확인
 if (currentEnrollment?.completedLessons?.includes(currentLesson.id)) {
  checkBox.checked = true;
 }

 checkBox.addEventListener("change", (e) => {
  if (e.target.checked) {
   completeLesson();
  } else {
   uncompleteLesson();
  }
 });
}

// 레슨 완료 처리
function completeLesson() {
 if (!currentEnrollment.completedLessons) {
  currentEnrollment.completedLessons = [];
 }

 if (!currentEnrollment.completedLessons.includes(currentLesson.id)) {
  currentEnrollment.completedLessons.push(currentLesson.id);
  updateProgress();
  saveEnrollment(currentEnrollment);

  // 모든 레슨 완료 확인
  checkCourseComplete();
 }
}

// 레슨 완료 취소
function uncompleteLesson() {
 if (currentEnrollment.completedLessons) {
  currentEnrollment.completedLessons =
   currentEnrollment.completedLessons.filter((id) => id !== currentLesson.id);
  updateProgress();
  saveEnrollment(currentEnrollment);
 }
}

// 진행률 업데이트
function updateProgress() {
 if (!currentCourse || !currentEnrollment) return;

 const totalLessons = currentCourse.curriculum.reduce(
  (sum, section) => sum + section.lessons.length,
  0
 );

 const completedCount = currentEnrollment.completedLessons?.length || 0;
 const progress =
  totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

 currentEnrollment.progress = progress;

 // UI 업데이트
 const progressPercentage = document.getElementById("progressPercentage");
 const progressFill = document.getElementById("progressFill");
 const completedLessons = document.getElementById("completedLessons");
 const totalLessonsEl = document.getElementById("totalLessons");

 if (progressPercentage) progressPercentage.textContent = `${progress}%`;
 if (progressFill) progressFill.style.width = `${progress}%`;
 if (completedLessons) completedLessons.textContent = completedCount;
 if (totalLessonsEl) totalLessonsEl.textContent = totalLessons;
}

// 강의 완료 확인
function checkCourseComplete() {
 if (!currentCourse || !currentEnrollment) return;

 const totalLessons = currentCourse.curriculum.reduce(
  (sum, section) => sum + section.lessons.length,
  0
 );

 if (currentEnrollment.completedLessons?.length === totalLessons) {
  showToast("축하합니다! 강의를 완료하셨습니다! 🎉", "success");
 }
}

// 강의 정보 업데이트
function updateCourseInfo() {
 const courseTitle = document.getElementById("courseTitle");
 const courseInstructor = document.getElementById("courseInstructor");

 if (courseTitle) courseTitle.textContent = currentCourse.title;
 if (courseInstructor) courseInstructor.textContent = currentCourse.instructor;
}

// 커리큘럼 업데이트
function updateCurriculum() {
 const curriculumList = document.getElementById("curriculumList");
 if (!curriculumList || !currentCourse) return;

 let html = "";

 for (const section of currentCourse.curriculum) {
  html += `<div class="curriculum-section">
        <h4>${escapeHtml(section.title)}</h4>
        <ul class="lesson-list">`;

  for (const lesson of section.lessons) {
   const isCompleted = currentEnrollment?.completedLessons?.includes(lesson.id);
   const isCurrent = lesson.id === currentLesson.id;

   html += `<li class="lesson-item ${isCurrent ? "active" : ""} ${
    isCompleted ? "completed" : ""
   }">
          <a href="course-player.html?courseId=${currentCourse.id}&lessonId=${
    lesson.id
   }">
            ${escapeHtml(lesson.title)}
            ${isCompleted ? " ✓" : ""}
          </a>
        </li>`;
  }

  html += `</ul></div>`;
 }

 curriculumList.innerHTML = html;
}

// 네비게이션 버튼 업데이트
function updateNavigationButtons() {
 const prevBtn = document.getElementById("prevLesson");
 const nextBtn = document.getElementById("nextLesson");

 const prevLesson = findPreviousLesson();
 const nextLesson = findNextLesson();

 if (prevBtn) {
  prevBtn.disabled = !prevLesson;
 }

 if (nextBtn) {
  if (nextLesson) {
   nextBtn.disabled = false;
   nextBtn.textContent = "다음 레슨";
  } else {
   nextBtn.disabled = true;
   nextBtn.textContent = "마지막 레슨";
  }
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
 currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

 updateAuthUI();

 // URL에서 courseId, lessonId 가져오기
 const urlParams = new URLSearchParams(window.location.search);
 const courseId = parseInt(urlParams.get("courseId"));
 const lessonId = parseInt(urlParams.get("lessonId")) || 1;

 if (!courseId) {
  alert("강의를 찾을 수 없습니다.");
  window.location.href = "courses.html";
  return;
 }

 loadCourse(courseId, lessonId);
 setupVideoPlayer();
 setupLessonNavigation();
 setupLessonComplete();
 handleSearch();
});
