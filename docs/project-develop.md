# 3단계: 개발 - 온라인 강의 플랫폼 프로젝트

## 📚 학습 목표

이 단계를 완료하면 다음을 할 수 있습니다:

- HTML 구조 설계 및 작성 (페이지 공통 레이아웃 포함)
- CSS 스타일링 및 반응형 디자인 구현 (컴포넌트 분리 포함)
- JavaScript로 인터랙션 구현 (검색/필터/정렬/이벤트 위임)
- 비디오 플레이어 구현 (HTML5 video, 재생 위치 저장)
- 학습 진도 관리 시스템 구현 (진행률 계산, 완료 처리)
- GitHub로 버전 관리 (커밋 전략 포함)

---

## 0. 이 단계에서 자주 막히는 포인트(먼저 체크)

✅ 이 문서에서 반드시 해결해주는 핵심 문제들입니다.

### 문제1) 여러 페이지에서 localStorage를 제각각 다루면 유지보수가 어려움

- 각 파일에서 `localStorage.getItem/setItem`을 직접 호출하면 키 이름이 달라서 버그가 생길 수 있습니다.
- 해결: **`storage.js`로 데이터 레이어 분리** (단일 진실의 원천)

### 문제2) 동적으로 생성된 강의 카드에 이벤트가 안 먹는 경우

- `innerHTML`로 렌더링하면 기존 DOM이 갈아끼워져서 이벤트가 사라질 수 있습니다.
- 해결: **이벤트 위임(Event Delegation)** 적용

### 문제3) 비디오 재생 위치가 저장되지 않는 경우

- 비디오 이벤트를 제대로 감지하지 못하거나 저장 타이밍이 잘못되었을 수 있습니다.
- 해결: **`timeupdate` 이벤트로 주기적으로 저장** 또는 **일시정지 시 저장**

### 문제4) 학습 진도 계산이 정확하지 않은 경우

- 완료한 레슨 수와 전체 레슨 수를 제대로 비교하지 못했을 수 있습니다.
- 해결: **완료한 레슨 배열(`completedLessons`)과 전체 레슨 수를 비교하여 진행률 계산**

### 문제5) 비디오 로딩 실패 시 대체 메시지가 표시되지 않는 경우

- `video` 요소의 `onerror` 이벤트를 처리하지 않았을 수 있습니다.
- 해결: **`video.addEventListener('error', ...)`로 오류 처리**

---

## 1. 프로젝트 구조 설정

### 1.1 폴더 구조 생성

#### 실습 1-1: 프로젝트 폴더 구조 만들기

```
online-course-platform/
├── index.html
├── courses.html
├── course-detail.html
├── course-player.html
├── dashboard.html
├── login.html
├── signup.html
├── profile.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── storage.js        ✅ (데이터 레이어 분리)
│   ├── utils.js          ✅ (공용 함수)
│   ├── main.js
│   ├── courses.js
│   ├── course-detail.js
│   ├── course-player.js  ✅ (비디오 플레이어 + 진도 관리)
│   └── dashboard.js
├── videos/               ✅ (비디오 파일 디렉토리)
│   └── lessons/
└── README.md
```

**보완 포인트**

- `storage.js`는 localStorage 접근을 통합하는 파일입니다. `getCourses()`, `saveCourse()`, `getEnrollments()`, `saveEnrollment()` 같은 함수를 사용합니다.
- `utils.js`는 날짜 포맷팅, 텍스트 이스케이프, 가격 포맷팅 등 공용 함수를 모아놓은 파일입니다.
- `videos/` 디렉토리는 테스트용 비디오 파일을 저장합니다. (실제 서비스에서는 외부 URL 사용)

**체크리스트:**

- [ ] 프로젝트 폴더 구조 생성 완료
- [ ] `js/storage.js` 파일 생성 준비
- [ ] `videos/` 디렉토리 생성 (선택)

---

## 2. HTML 구조 작성

### 2.1 메인 페이지 HTML

#### 실습 2-1: `index.html` 작성

```html
<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>온라인 강의 플랫폼 - 메인</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/responsive.css" />
 </head>
 <body>
  <!-- 헤더 -->
  <header class="header">
   <div class="container">
    <div class="header-content">
     <div class="logo">
      <a href="index.html">LEARN</a>
     </div>

     <nav class="nav" aria-label="주요 메뉴">
      <ul class="nav-menu">
       <li><a href="index.html">홈</a></li>
       <li><a href="courses.html">강의</a></li>
       <li><a href="dashboard.html">학습 대시보드</a></li>
      </ul>
     </nav>

     <div class="header-actions">
      <!-- 검색 -->
      <div class="search-box">
       <label class="sr-only" for="searchInput">강의 검색</label>
       <input
        id="searchInput"
        type="text"
        placeholder="강의 검색..."
        autocomplete="off"
       />
       <button class="search-btn" type="button">검색</button>
      </div>

      <!-- 사용자 -->
      <div class="user-menu">
       <a href="login.html" class="btn btn-secondary" id="loginBtn">로그인</a>
       <a
        href="profile.html"
        class="user-profile"
        id="profileBtn"
        style="display: none;"
       >
        <span id="userName"></span>
       </a>
      </div>
     </div>
    </div>
   </div>
  </header>

  <!-- 히어로 섹션 -->
  <section class="hero">
   <div class="hero-content">
    <h1>당신의 성장을 위한 온라인 강의</h1>
    <p>전문가가 만든 실전 강의로 스킬을 업그레이드하세요</p>
    <a href="courses.html" class="btn btn-primary">강의 둘러보기</a>
   </div>
  </section>

  <!-- 인기 강의 섹션 -->
  <section class="popular-courses">
   <div class="container">
    <h2 class="section-title">인기 강의</h2>
    <div class="courses-grid" id="popularCourses">
     <!-- 강의 카드가 여기에 동적으로 추가됩니다 -->
    </div>
   </div>
  </section>

  <!-- 신규 강의 섹션 -->
  <section class="new-courses">
   <div class="container">
    <h2 class="section-title">신규 강의</h2>
    <div class="courses-grid" id="newCourses">
     <!-- 강의 카드가 여기에 동적으로 추가됩니다 -->
    </div>
   </div>
  </section>

  <!-- 카테고리 섹션 -->
  <section class="categories" id="categories">
   <div class="container">
    <h2 class="section-title">카테고리</h2>
    <div class="categories-grid">
     <div class="category-card" data-category="programming">
      <img src="images/category-programming.jpg" alt="프로그래밍" />
      <h3>프로그래밍</h3>
     </div>
     <div class="category-card" data-category="design">
      <img src="images/category-design.jpg" alt="디자인" />
      <h3>디자인</h3>
     </div>
     <div class="category-card" data-category="marketing">
      <img src="images/category-marketing.jpg" alt="마케팅" />
      <h3>마케팅</h3>
     </div>
    </div>
   </div>
  </section>

  <!-- 푸터 -->
  <footer class="footer">
   <div class="container">
    <div class="footer-content">
     <div class="footer-section">
      <h3>회사 정보</h3>
      <p>온라인 강의 플랫폼</p>
     </div>
     <div class="footer-section">
      <h3>고객센터</h3>
      <p>전화: 1588-0000</p>
      <p>이메일: support@learn.com</p>
     </div>
    </div>
   </div>
  </footer>

  <!-- ✅ 로딩 순서 중요: 공용 → 페이지 -->
  <script src="js/storage.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
 </body>
</html>
```

**체크리스트:**

- [ ] `index.html`에 `storage.js`, `utils.js`가 `main.js`보다 먼저 로드됨
- [ ] `searchInput` id 추가됨
- [ ] 로그인 상태에 따른 UI 변경 준비 완료

---

### 2.2 강의 수강 페이지 HTML (핵심)

#### 실습 2-2: `course-player.html` 작성

```html
<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>강의 수강 - 온라인 강의 플랫폼</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/responsive.css" />
 </head>
 <body>
  <!-- 헤더 -->
  <header class="header">
   <!-- 헤더 복사 -->
  </header>

  <!-- 강의 수강 영역 -->
  <section class="course-player-section">
   <div class="container">
    <div class="player-layout">
     <!-- 비디오 플레이어 영역 -->
     <div class="player-main">
      <!-- 비디오 플레이어 -->
      <div class="video-player-container">
       <video
        id="videoPlayer"
        class="video-player"
        controls
        preload="metadata"
        aria-label="강의 비디오"
       >
        <source src="" type="video/mp4" />
        비디오를 재생할 수 없습니다.
       </video>
       <div class="video-error" id="videoError" style="display: none;">
        <p>비디오를 불러올 수 없습니다.</p>
        <button class="btn btn-primary" id="retryVideo">다시 시도</button>
       </div>
      </div>

      <!-- 학습 진도 표시 -->
      <div class="progress-section">
       <div class="progress-header">
        <h3>학습 진도</h3>
        <span class="progress-percentage" id="progressPercentage">0%</span>
       </div>
       <div class="progress-bar">
        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
       </div>
       <div class="progress-info">
        <span id="completedLessons">0</span> /
        <span id="totalLessons">0</span> 레슨 완료
       </div>
      </div>

      <!-- 레슨 네비게이션 -->
      <div class="lesson-navigation">
       <button class="btn btn-secondary" id="prevLesson" disabled>
        이전 레슨
       </button>
       <button class="btn btn-primary" id="nextLesson">다음 레슨</button>
      </div>

      <!-- 레슨 완료 체크 -->
      <div class="lesson-complete">
       <label>
        <input type="checkbox" id="lessonCompleteCheck" />
        이 레슨을 완료했습니다
       </label>
      </div>
     </div>

     <!-- 강의 정보 사이드바 -->
     <aside class="player-sidebar">
      <div class="course-info">
       <h2 id="courseTitle">강의 제목</h2>
       <p id="courseInstructor">강사명</p>
      </div>

      <!-- 커리큘럼 -->
      <div class="curriculum">
       <h3>커리큘럼</h3>
       <div class="curriculum-list" id="curriculumList">
        <!-- 커리큘럼이 동적으로 추가됩니다 -->
       </div>
      </div>

      <!-- 강의 자료 (선택) -->
      <div class="course-materials" id="courseMaterials" style="display: none;">
       <h3>강의 자료</h3>
       <a href="#" class="btn btn-secondary" download>자료 다운로드</a>
      </div>
     </aside>
    </div>
   </div>
  </section>

  <!-- 푸터 -->
  <footer class="footer">
   <!-- 푸터 복사 -->
  </footer>

  <!-- ✅ 로딩 순서 중요 -->
  <script src="js/storage.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/course-player.js"></script>
 </body>
</html>
```

**체크리스트:**

- [ ] 비디오 플레이어 요소 추가 완료
- [ ] 학습 진도 표시 영역 추가 완료
- [ ] 레슨 네비게이션 버튼 추가 완료
- [ ] 커리큘럼 사이드바 추가 완료

---

## 3. CSS 스타일링

### 3.1 비디오 플레이어 스타일

#### 실습 3-1: 비디오 플레이어 CSS 작성

```css
/* 비디오 플레이어 컨테이너 */
.video-player-container {
 position: relative;
 width: 100%;
 background: #000;
 border-radius: 8px;
 overflow: hidden;
 margin-bottom: 24px;
}

.video-player {
 width: 100%;
 height: auto;
 display: block;
}

.video-error {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 text-align: center;
 color: white;
 background: rgba(0, 0, 0, 0.8);
 padding: 24px;
 border-radius: 8px;
}

/* 학습 진도 섹션 */
.progress-section {
 background: #f5f5f5;
 padding: 24px;
 border-radius: 8px;
 margin-bottom: 24px;
}

.progress-header {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 12px;
}

.progress-percentage {
 font-size: 24px;
 font-weight: bold;
 color: var(--primary);
}

.progress-bar {
 width: 100%;
 height: 12px;
 background: #e5e5e5;
 border-radius: 6px;
 overflow: hidden;
 margin-bottom: 8px;
}

.progress-fill {
 height: 100%;
 background: var(--primary);
 transition: width 0.3s ease;
}

.progress-info {
 font-size: 14px;
 color: var(--text-secondary);
}

/* 레슨 네비게이션 */
.lesson-navigation {
 display: flex;
 gap: 12px;
 margin-bottom: 24px;
}

.lesson-navigation button {
 flex: 1;
}

.lesson-navigation button:disabled {
 opacity: 0.5;
 cursor: not-allowed;
}

/* 레슨 완료 체크 */
.lesson-complete {
 padding: 16px;
 background: #f9f9f9;
 border-radius: 8px;
}

.lesson-complete label {
 display: flex;
 align-items: center;
 gap: 8px;
 cursor: pointer;
}

/* 플레이어 레이아웃 */
.player-layout {
 display: grid;
 grid-template-columns: 1fr 320px;
 gap: 24px;
}

.player-main {
 min-width: 0;
}

.player-sidebar {
 min-width: 0;
}

/* 반응형 */
@media (max-width: 768px) {
 .player-layout {
  grid-template-columns: 1fr;
 }

 .player-sidebar {
  order: -1;
 }
}
```

**체크리스트:**

- [ ] 비디오 플레이어 스타일 작성 완료
- [ ] 학습 진도 프로그레스 바 스타일 작성 완료
- [ ] 반응형 레이아웃 적용 완료

---

## 4. JavaScript 기능 구현

### 4.1 `js/storage.js` (데이터 레이어 분리)

#### 실습 4-1: storage.js 작성

```javascript
/**
 * storage.js
 * - localStorage 접근 통합
 * - 강의, 수강 정보, 사용자 데이터 관리
 */

// 강의 데이터
export function getCourses() {
 try {
  return JSON.parse(localStorage.getItem("courses")) || [];
 } catch {
  return [];
 }
}

export function saveCourses(courses) {
 localStorage.setItem("courses", JSON.stringify(courses));
}

// 수강 정보
export function getEnrollments() {
 try {
  return JSON.parse(localStorage.getItem("enrollments")) || [];
 } catch {
  return [];
 }
}

export function saveEnrollments(enrollments) {
 localStorage.setItem("enrollments", JSON.stringify(enrollments));
}

export function getEnrollment(userId, courseId) {
 const enrollments = getEnrollments();
 return enrollments.find((e) => e.userId === userId && e.courseId === courseId);
}

export function saveEnrollment(enrollment) {
 const enrollments = getEnrollments();
 const index = enrollments.findIndex(
  (e) => e.userId === enrollment.userId && e.courseId === enrollment.courseId
 );

 if (index >= 0) {
  enrollments[index] = enrollment;
 } else {
  enrollments.push(enrollment);
 }

 saveEnrollments(enrollments);
}

// 비디오 재생 위치 저장
export function getVideoProgress(userId, courseId) {
 const enrollment = getEnrollment(userId, courseId);
 return enrollment?.videoProgress || {};
}

export function saveVideoProgress(userId, courseId, lessonId, time) {
 const enrollment = getEnrollment(userId, courseId) || {
  userId,
  courseId,
  progress: 0,
  completedLessons: [],
  enrolledAt: new Date().toISOString(),
  lastAccessedAt: new Date().toISOString(),
  videoProgress: {},
 };

 if (!enrollment.videoProgress) {
  enrollment.videoProgress = {};
 }

 enrollment.videoProgress[lessonId] = time;
 enrollment.lastAccessedAt = new Date().toISOString();

 saveEnrollment(enrollment);
}

// 사용자 데이터
export function getCurrentUser() {
 try {
  return JSON.parse(sessionStorage.getItem("currentUser"));
 } catch {
  return null;
 }
}

export function setCurrentUser(user) {
 if (user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
 } else {
  sessionStorage.removeItem("currentUser");
 }
}

export function getUsers() {
 try {
  return JSON.parse(localStorage.getItem("users")) || [];
 } catch {
  return [];
 }
}

export function saveUsers(users) {
 localStorage.setItem("users", JSON.stringify(users));
}
```

**체크리스트:**

- [ ] `storage.js` 작성 완료
- [ ] 강의, 수강 정보, 사용자 데이터 함수 정의 완료
- [ ] 비디오 재생 위치 저장 함수 정의 완료

---

### 4.2 `js/course-player.js` (비디오 플레이어 + 진도 관리)

#### 실습 4-2: course-player.js 작성

```javascript
/**
 * course-player.js
 * - 비디오 플레이어 제어
 * - 학습 진도 관리
 * - 레슨 네비게이션
 */

import {
 getCourses,
 getEnrollment,
 saveEnrollment,
 getVideoProgress,
 saveVideoProgress,
 getCurrentUser,
} from "./storage.js";

let currentCourse = null;
let currentLesson = null;
let currentEnrollment = null;
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
 currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html";
  return;
 }

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
});

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

 // 재생 위치 저장
 video.addEventListener("timeupdate", () => {
  if (video.currentTime > 0) {
   saveVideoProgress(
    currentUser.id,
    currentCourse.id,
    lesson.id,
    video.currentTime
   );
  }
 });
}

// 비디오 플레이어 설정
function setupVideoPlayer() {
 const video = document.getElementById("videoPlayer");
 const retryBtn = document.getElementById("retryVideo");

 retryBtn?.addEventListener("click", () => {
  if (currentLesson) {
   loadVideo(currentLesson);
  }
 });
}

// 레슨 네비게이션 설정
function setupLessonNavigation() {
 const prevBtn = document.getElementById("prevLesson");
 const nextBtn = document.getElementById("nextLesson");

 prevBtn?.addEventListener("click", () => {
  const prevLesson = findPreviousLesson();
  if (prevLesson) {
   navigateToLesson(prevLesson.id);
  }
 });

 nextBtn?.addEventListener("click", () => {
  const nextLesson = findNextLesson();
  if (nextLesson) {
   navigateToLesson(nextLesson.id);
  }
 });
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

 // 현재 레슨 완료 상태 확인
 if (currentEnrollment?.completedLessons?.includes(currentLesson.id)) {
  checkBox.checked = true;
 }

 checkBox?.addEventListener("change", (e) => {
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
  alert("축하합니다! 강의를 완료하셨습니다! 🎉");
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
      <h4>${section.title}</h4>
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
          ${lesson.title}
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
  nextBtn.disabled = !nextLesson;
  if (nextLesson) {
   nextBtn.textContent = "다음 레슨";
  } else {
   nextBtn.textContent = "완료";
  }
 }
}
```

**체크리스트:**

- [ ] `course-player.js` 작성 완료
- [ ] 비디오 플레이어 제어 구현 완료
- [ ] 학습 진도 관리 구현 완료
- [ ] 레슨 네비게이션 구현 완료
- [ ] 비디오 재생 위치 저장 구현 완료

---

## 5. 문제 해결 가이드

### Q1. 비디오가 재생되지 않아요

A:

- 비디오 파일 경로가 올바른지 확인하세요.
- 브라우저가 지원하는 비디오 포맷인지 확인하세요 (MP4 권장).
- CORS 문제일 수 있습니다. 로컬 서버를 사용하세요 (예: `python -m http.server`).

### Q2. 학습 진도가 저장되지 않아요

A:

- `localStorage`가 활성화되어 있는지 확인하세요.
- `currentUser`가 올바르게 설정되어 있는지 확인하세요.
- 브라우저 콘솔에서 오류를 확인하세요.

### Q3. 레슨 네비게이션이 작동하지 않아요

A:

- URL 파라미터(`courseId`, `lessonId`)가 올바르게 전달되는지 확인하세요.
- `findPreviousLesson()`, `findNextLesson()` 함수가 올바르게 작동하는지 확인하세요.

---

**작성일**: 2024년  
**버전**: 1.0
