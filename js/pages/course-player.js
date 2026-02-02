/**
 * course-player.js - 강의 플레이어 페이지 (course-player.html) 모듈
 *
 * 이 모듈은 강의 플레이어 페이지의 기능을 담당합니다:
 * - 비디오 재생 및 제어
 * - 학습 진도 관리
 * - 레슨 네비게이션
 * - 재생 위치 저장/복원
 *
 * @module pages/course-player
 */

import {
 getCourseById,
 getCurrentUser,
 getEnrollment,
 saveEnrollment,
 getVideoProgress,
 saveVideoProgress,
 addStudyTime,
} from "../modules/storage.js";
import { escapeHtml, showToast, getQueryParam } from "../modules/utils.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {Object|null} 현재 강의 데이터 */
let currentCourse = null;

/** @type {Object|null} 현재 레슨 데이터 */
let currentLesson = null;

/** @type {Object|null} 현재 수강 정보 */
let currentEnrollment = null;

/** @type {Object|null} 현재 로그인 사용자 */
let currentUser = null;

/** @type {number|null} 재생 위치 저장 타이머 */
let saveProgressTimeout = null;

/** @type {number|null} 학습 시간 저장 인터벌 */
let studyTimeInterval = null;

/** @type {number} 마지막 학습 시간 저장 시점 (timestamp) */
let lastStudyTimeSave = 0;

// ============================================================================
// 강의/레슨 로드 함수
// ============================================================================

/**
 * 강의와 레슨을 로드합니다.
 *
 * @param {number} courseId - 강의 ID
 * @param {number} lessonId - 레슨 ID
 * @returns {boolean} 로드 성공 여부
 */
function loadCourse(courseId, lessonId) {
 currentCourse = getCourseById(courseId);

 if (!currentCourse) {
  alert("강의를 찾을 수 없습니다.");
  window.location.href = "courses.html";
  return false;
 }

 // 수강 정보 가져오기
 currentEnrollment = getEnrollment(currentUser.id, courseId);

 if (!currentEnrollment) {
  alert("수강 신청이 필요합니다.");
  window.location.href = `course-detail.html?id=${courseId}`;
  return false;
 }

 // 레슨 찾기 (지정된 ID가 없으면 첫 번째 레슨 사용)
 let lesson = findLesson(currentCourse, lessonId);
 if (!lesson) {
  lesson = getFirstLesson(currentCourse);
  if (!lesson) {
   alert("레슨을 찾을 수 없습니다.");
   return false;
  }
 }

 currentLesson = lesson;
 return true;
}

/**
 * 강의에서 특정 레슨을 찾습니다.
 *
 * @param {Object} course - 강의 객체
 * @param {number} lessonId - 찾을 레슨 ID
 * @returns {Object|null} 레슨 객체 또는 null
 */
function findLesson(course, lessonId) {
 if (!course?.curriculum) return null;
 for (const section of course.curriculum) {
  const lesson = section.lessons?.find((l) => l.id === lessonId);
  if (lesson) return lesson;
 }
 return null;
}

/**
 * 강의의 첫 번째 레슨을 반환합니다.
 *
 * @param {Object} course - 강의 객체
 * @returns {Object|null} 첫 번째 레슨 또는 null
 */
function getFirstLesson(course) {
 if (!course?.curriculum?.length) return null;
 for (const section of course.curriculum) {
  if (section.lessons?.length) {
   return section.lessons[0];
  }
 }
 return null;
}

/**
 * 이전 레슨을 찾습니다.
 *
 * @returns {Object|null} 이전 레슨 또는 null
 */
function findPreviousLesson() {
 if (!currentCourse || !currentLesson) return null;

 let previousLesson = null;

 for (const section of currentCourse.curriculum) {
  for (const lesson of section.lessons) {
   if (lesson.id === currentLesson.id) {
    return previousLesson;
   }
   previousLesson = lesson;
  }
 }

 return null;
}

/**
 * 다음 레슨을 찾습니다.
 *
 * @returns {Object|null} 다음 레슨 또는 null
 */
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

// ============================================================================
// UI 업데이트 함수
// ============================================================================

/**
 * 강의 정보 UI를 업데이트합니다.
 */
function updateCourseInfo() {
 const courseTitle = document.getElementById("courseTitle");
 const courseInstructor = document.getElementById("courseInstructor");

 if (courseTitle) courseTitle.textContent = currentCourse.title;
 if (courseInstructor) courseInstructor.textContent = currentCourse.instructor;
}

/**
 * 커리큘럼 UI를 업데이트합니다.
 */
function updateCurriculum() {
 const curriculumList = document.getElementById("curriculumList");
 if (!curriculumList || !currentCourse) return;

 let html = "";

 for (const section of currentCourse.curriculum) {
  html += `
      <div class="curriculum-section">
        <h4>${escapeHtml(section.title)}</h4>
        <ul class="lesson-list">
    `;

  for (const lesson of section.lessons) {
   const isCompleted = currentEnrollment?.completedLessons?.includes(lesson.id);
   const isCurrent = lesson.id === currentLesson.id;

   // CSS에서 .completed 클래스에 ::after로 체크마크를 표시하므로
   // 텍스트로는 추가하지 않음 (중복 방지)
   html += `
        <li class="lesson-item ${isCurrent ? "active" : ""} ${isCompleted ? "completed" : ""}">
          <a href="course-player.html?courseId=${currentCourse.id}&lessonId=${lesson.id}">
            ${escapeHtml(lesson.title)}
          </a>
        </li>
      `;
  }

  html += "</ul></div>";
 }

 curriculumList.innerHTML = html;
}

/**
 * 진행률 UI를 업데이트합니다.
 */
function updateProgress() {
 if (!currentCourse || !currentEnrollment) return;

 // 전체 레슨 수 계산
 const totalLessons = currentCourse.curriculum.reduce(
  (sum, section) => sum + section.lessons.length,
  0
 );

 // 완료된 레슨 수
 const completedCount = currentEnrollment.completedLessons?.length || 0;

 // 진행률 계산
 const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

 currentEnrollment.progress = progress;

 // UI 업데이트
 const progressPercentage = document.getElementById("progressPercentage");
 const progressFill = document.getElementById("progressFill");
 const completedLessonsEl = document.getElementById("completedLessons");
 const totalLessonsEl = document.getElementById("totalLessons");

 if (progressPercentage) progressPercentage.textContent = `${progress}%`;
 if (progressFill) progressFill.style.width = `${progress}%`;
 if (completedLessonsEl) completedLessonsEl.textContent = completedCount;
 if (totalLessonsEl) totalLessonsEl.textContent = totalLessons;
}

/**
 * 네비게이션 버튼 상태를 업데이트합니다.
 */
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

// ============================================================================
// 비디오 플레이어 함수
// ============================================================================

/**
 * 비디오를 로드합니다.
 *
 * @param {Object} lesson - 레슨 객체
 */
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

 video.addEventListener("loadedmetadata", function onLoaded() {
  if (savedTime > 0 && savedTime < video.duration - 5) {
   video.currentTime = savedTime;
  }
  video.removeEventListener("loadedmetadata", onLoaded);
 });

 // 비디오 오류 처리
 video.addEventListener("error", function onError() {
  video.style.display = "none";
  videoError.style.display = "block";
  video.removeEventListener("error", onError);
 });

 // 재생 위치 저장 (timeupdate 이벤트)
 video.addEventListener("timeupdate", () => {
  if (video.currentTime > 0) {
   // 디바운스: 1초마다 저장
   clearTimeout(saveProgressTimeout);
   saveProgressTimeout = setTimeout(() => {
    saveVideoProgress(currentUser.id, currentCourse.id, lesson.id, video.currentTime);
   }, 1000);
  }
 });

 // 비디오 재생 시작 - 학습 시간 추적 시작
 video.addEventListener("play", () => {
  startStudyTimeTracking();
 });

 // 일시정지 시 즉시 저장 및 학습 시간 저장
 video.addEventListener("pause", () => {
  clearTimeout(saveProgressTimeout);
  saveVideoProgress(currentUser.id, currentCourse.id, lesson.id, video.currentTime);
  stopStudyTimeTracking();
 });

 // 비디오 종료 시 레슨 완료 처리 및 학습 시간 저장
 video.addEventListener("ended", () => {
  stopStudyTimeTracking();
  const checkbox = document.getElementById("lessonCompleteCheck");
  if (checkbox && !checkbox.checked) {
   checkbox.checked = true;
   completeLesson();
  }
 });
}

/**
 * 학습 시간 추적을 시작합니다.
 * 5초마다 학습 시간을 저장합니다.
 */
function startStudyTimeTracking() {
 // 이미 추적 중이면 중복 시작 방지
 if (studyTimeInterval) return;

 lastStudyTimeSave = Date.now();

 // 5초마다 학습 시간 저장
 studyTimeInterval = setInterval(() => {
  saveCurrentStudyTime();
 }, 5000);
}

/**
 * 학습 시간 추적을 중지하고 남은 시간을 저장합니다.
 */
function stopStudyTimeTracking() {
 if (studyTimeInterval) {
  clearInterval(studyTimeInterval);
  studyTimeInterval = null;
 }

 // 마지막 저장 이후 경과 시간 저장
 saveCurrentStudyTime();
}

/**
 * 현재까지의 학습 시간을 저장합니다.
 */
function saveCurrentStudyTime() {
 if (lastStudyTimeSave === 0) return;

 const now = Date.now();
 const elapsedSeconds = Math.floor((now - lastStudyTimeSave) / 1000);

 if (elapsedSeconds > 0) {
  addStudyTime(currentUser.id, currentCourse.id, elapsedSeconds);
  lastStudyTimeSave = now;
 }
}

// ============================================================================
// 레슨 완료 관련 함수
// ============================================================================

/**
 * 레슨을 완료 처리합니다.
 */
function completeLesson() {
 if (!currentEnrollment.completedLessons) {
  currentEnrollment.completedLessons = [];
 }

 if (!currentEnrollment.completedLessons.includes(currentLesson.id)) {
  currentEnrollment.completedLessons.push(currentLesson.id);
  currentEnrollment.lastAccessedAt = new Date().toISOString();

  // 해당 레슨 duration을 총 학습 시간에 추가 (체크박스/비디오 종료 시 모두 반영)
  const lessonDuration = currentLesson.duration || 0;
  if (lessonDuration > 0) {
   currentEnrollment.totalStudyTime = (currentEnrollment.totalStudyTime || 0) + lessonDuration;
  }

  updateProgress();
  saveEnrollment(currentEnrollment);
  updateCurriculum();

  // 모든 레슨 완료 확인
  checkCourseComplete();
 }
}

/**
 * 레슨 완료를 취소합니다.
 */
function uncompleteLesson() {
 if (currentEnrollment.completedLessons) {
  currentEnrollment.completedLessons = currentEnrollment.completedLessons.filter(
   (id) => id !== currentLesson.id
  );
  currentEnrollment.lastAccessedAt = new Date().toISOString();

  // 해당 레슨 duration을 총 학습 시간에서 차감
  const lessonDuration = currentLesson.duration || 0;
  if (lessonDuration > 0) {
   currentEnrollment.totalStudyTime = Math.max(
    0,
    (currentEnrollment.totalStudyTime || 0) - lessonDuration
   );
  }

  updateProgress();
  saveEnrollment(currentEnrollment);
  updateCurriculum();
 }
}

/**
 * 강의 완료 여부를 확인합니다.
 */
function checkCourseComplete() {
 if (!currentCourse || !currentEnrollment) return;

 const totalLessons = currentCourse.curriculum.reduce(
  (sum, section) => sum + section.lessons.length,
  0
 );

 if (currentEnrollment.completedLessons?.length === totalLessons) {
  showToast("축하합니다! 강의를 완료하셨습니다!");
 }
}

// ============================================================================
// 이벤트 핸들러 설정
// ============================================================================

/**
 * 비디오 플레이어 이벤트를 설정합니다.
 */
function setupVideoPlayer() {
 const retryBtn = document.getElementById("retryVideo");

 if (retryBtn) {
  retryBtn.addEventListener("click", () => {
   if (currentLesson) {
    loadVideo(currentLesson);
   }
  });
 }
}

/**
 * 레슨 네비게이션 이벤트를 설정합니다.
 */
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

/**
 * 레슨 완료 체크박스 이벤트를 설정합니다.
 */
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

/**
 * 특정 레슨으로 이동합니다.
 *
 * @param {number} lessonId - 이동할 레슨 ID
 */
function navigateToLesson(lessonId) {
 window.location.href = `course-player.html?courseId=${currentCourse.id}&lessonId=${lessonId}`;
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 강의 플레이어 페이지를 초기화합니다.
 */
export function initCoursePlayerPage() {
 // 로그인 확인
 currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

 // URL에서 courseId, lessonId 가져오기
 const courseId = parseInt(getQueryParam("courseId"));
 const lessonId = parseInt(getQueryParam("lessonId")) || 1;

 if (!courseId) {
  alert("강의를 찾을 수 없습니다.");
  window.location.href = "courses.html";
  return;
 }

 // 강의 로드
 if (!loadCourse(courseId, lessonId)) {
  return;
 }

 // UI 업데이트
 updateCourseInfo();
 updateCurriculum();
 updateProgress();
 updateNavigationButtons();

 // 비디오 로드
 loadVideo(currentLesson);

 // 이벤트 설정
 setupVideoPlayer();
 setupLessonNavigation();
 setupLessonComplete();

 // 페이지 떠날 때 학습 시간 저장
 window.addEventListener("beforeunload", () => {
  stopStudyTimeTracking();
 });

 // visibilitychange 이벤트로 탭 전환 시에도 저장
 document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
   stopStudyTimeTracking();
  }
 });
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initCoursePlayerPage,
};
