/**
 * storage.js
 * - localStorage 접근 통합
 * - 강의, 수강 정보, 사용자 데이터 관리
 */

// 강의 데이터
function getCourses() {
 try {
  return JSON.parse(localStorage.getItem("courses")) || [];
 } catch {
  return [];
 }
}

function saveCourses(courses) {
 localStorage.setItem("courses", JSON.stringify(courses));
}

// 수강 정보
function getEnrollments() {
 try {
  return JSON.parse(localStorage.getItem("enrollments")) || [];
 } catch {
  return [];
 }
}

function saveEnrollments(enrollments) {
 localStorage.setItem("enrollments", JSON.stringify(enrollments));
}

function getEnrollment(userId, courseId) {
 const enrollments = getEnrollments();
 return enrollments.find((e) => e.userId === userId && e.courseId === courseId);
}

function saveEnrollment(enrollment) {
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
function getVideoProgress(userId, courseId) {
 const enrollment = getEnrollment(userId, courseId);
 return enrollment?.videoProgress || {};
}

function saveVideoProgress(userId, courseId, lessonId, time) {
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
function getCurrentUser() {
 try {
  return JSON.parse(sessionStorage.getItem("currentUser"));
 } catch {
  return null;
 }
}

function setCurrentUser(user) {
 if (user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
 } else {
  sessionStorage.removeItem("currentUser");
 }
}

function getUsers() {
 try {
  return JSON.parse(localStorage.getItem("users")) || [];
 } catch {
  return [];
 }
}

function saveUsers(users) {
 localStorage.setItem("users", JSON.stringify(users));
}

// 후기 데이터
function getReviews() {
 try {
  return JSON.parse(localStorage.getItem("reviews")) || [];
 } catch {
  return [];
 }
}

function saveReviews(reviews) {
 localStorage.setItem("reviews", JSON.stringify(reviews));
}

function getReviewsByCourse(courseId) {
 const reviews = getReviews();
 return reviews.filter((r) => r.courseId === courseId);
}

function saveReview(review) {
 const reviews = getReviews();
 reviews.push(review);
 saveReviews(reviews);
}

// 초기 데이터 설정 (데이터가 없을 때만)
function initializeData() {
 const courses = getCourses();
 if (courses.length === 0) {
  const initialCourses = [
   {
    id: 1,
    title: "JavaScript 기초부터 실전까지",
    instructorId: 1,
    instructor: "홍길동",
    category: "programming",
    price: 49000,
    thumbnail: "https://picsum.photos/400/225?random=1",
    description:
     "JavaScript의 기초부터 실전 프로젝트까지 체계적으로 학습합니다. 변수, 함수, 객체, 비동기 처리 등 핵심 개념을 다룹니다.",
    curriculum: [
     {
      id: 1,
      title: "섹션 1: JavaScript 기초",
      order: 1,
      lessons: [
       {
        id: 1,
        title: "변수와 데이터 타입",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 1200,
        order: 1,
        isPreview: true,
       },
       {
        id: 2,
        title: "함수와 스코프",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: 1800,
        order: 2,
        isPreview: false,
       },
       {
        id: 3,
        title: "객체와 배열",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: 1500,
        order: 3,
        isPreview: false,
       },
      ],
     },
     {
      id: 2,
      title: "섹션 2: 실전 프로젝트",
      order: 2,
      lessons: [
       {
        id: 4,
        title: "DOM 조작",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: 2000,
        order: 1,
        isPreview: false,
       },
       {
        id: 5,
        title: "이벤트 처리",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        duration: 1600,
        order: 2,
        isPreview: false,
       },
      ],
     },
    ],
    duration: 8100,
    level: "beginner",
    rating: 4.6,
    reviews: 120,
    students: 1500,
    createdAt: "2024-01-15T10:30:00",
   },
   {
    id: 2,
    title: "React 완벽 가이드",
    instructorId: 1,
    instructor: "홍길동",
    category: "programming",
    price: 69000,
    thumbnail: "https://picsum.photos/400/225?random=2",
    description:
     "React의 핵심 개념부터 고급 패턴까지 학습합니다. Hooks, Context API, 상태 관리 등을 다룹니다.",
    curriculum: [
     {
      id: 3,
      title: "섹션 1: React 기초",
      order: 1,
      lessons: [
       {
        id: 6,
        title: "컴포넌트 기초",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        duration: 1800,
        order: 1,
        isPreview: true,
       },
       {
        id: 7,
        title: "Props와 State",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        duration: 2000,
        order: 2,
        isPreview: false,
       },
      ],
     },
    ],
    duration: 3800,
    level: "intermediate",
    rating: 4.8,
    reviews: 89,
    students: 2100,
    createdAt: "2024-01-20T10:30:00",
   },
   {
    id: 3,
    title: "UI/UX 디자인 기초",
    instructorId: 2,
    instructor: "이영희",
    category: "design",
    price: 39000,
    thumbnail: "https://picsum.photos/400/225?random=3",
    description:
     "UI/UX 디자인의 기본 원칙과 실무 프로세스를 학습합니다. 사용자 중심 디자인을 이해합니다.",
    curriculum: [
     {
      id: 4,
      title: "섹션 1: 디자인 원칙",
      order: 1,
      lessons: [
       {
        id: 8,
        title: "색상과 타이포그래피",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        duration: 1500,
        order: 1,
        isPreview: true,
       },
      ],
     },
    ],
    duration: 1500,
    level: "beginner",
    rating: 4.5,
    reviews: 67,
    students: 980,
    createdAt: "2024-01-25T10:30:00",
   },
   {
    id: 4,
    title: "디지털 마케팅 전략",
    instructorId: 3,
    instructor: "박강사",
    category: "marketing",
    price: 0,
    thumbnail: "https://picsum.photos/400/225?random=4",
    description:
     "디지털 마케팅의 핵심 전략과 실무 노하우를 학습합니다. SEO, SNS 마케팅 등을 다룹니다.",
    curriculum: [
     {
      id: 5,
      title: "섹션 1: 마케팅 기초",
      order: 1,
      lessons: [
       {
        id: 9,
        title: "마케팅 전략 수립",
        videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreet.mp4",
        duration: 1400,
        order: 1,
        isPreview: true,
       },
      ],
     },
    ],
    duration: 1400,
    level: "beginner",
    rating: 4.3,
    reviews: 45,
    students: 750,
    createdAt: "2024-01-28T10:30:00",
   },
  ];
  saveCourses(initialCourses);
 }

 // 초기 사용자 데이터 (테스트용)
 const users = getUsers();
 if (users.length === 0) {
  const initialUsers = [
   {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    password: "1234",
    role: "instructor",
    avatar: "",
    createdAt: "2024-01-01",
    bio: "10년차 개발자입니다.",
   },
   {
    id: 2,
    name: "이영희",
    email: "lee@example.com",
    password: "1234",
    role: "instructor",
    avatar: "",
    createdAt: "2024-01-01",
    bio: "UI/UX 디자이너입니다.",
   },
   {
    id: 3,
    name: "박강사",
    email: "park@example.com",
    password: "1234",
    role: "instructor",
    avatar: "",
    createdAt: "2024-01-01",
    bio: "마케팅 전문가입니다.",
   },
  ];
  saveUsers(initialUsers);
 }
}

// 기존 강의 데이터의 썸네일 업데이트 (via.placeholder -> picsum)
function updateCourseThumbnails() {
 const courses = getCourses();
 if (courses.length === 0) return;

 let updated = false;
 const thumbnailMap = {
  1: "https://picsum.photos/400/225?random=1", // JavaScript
  2: "https://picsum.photos/400/225?random=2", // React
  3: "https://picsum.photos/400/225?random=3", // UI/UX
  4: "https://picsum.photos/400/225?random=4", // Marketing
 };

 const updatedCourses = courses.map((course) => {
  // via.placeholder.com URL이 있거나 썸네일이 없는 경우 업데이트
  if (
   course.thumbnail &&
   (course.thumbnail.includes("via.placeholder") ||
    course.thumbnail.includes("placeholder.com") ||
    !course.thumbnail.startsWith("http"))
  ) {
   // ID에 맞는 썸네일이 있으면 사용, 없으면 기본값
   const newThumbnail =
    thumbnailMap[course.id] ||
    `https://picsum.photos/400/225?random=${course.id}`;
   updated = true;
   return { ...course, thumbnail: newThumbnail };
  }
  return course;
 });

 if (updated) {
  saveCourses(updatedCourses);
 }
}

// 페이지 로드 시 초기 데이터 설정
if (typeof window !== "undefined") {
 initializeData();
 updateCourseThumbnails(); // 기존 데이터의 썸네일도 업데이트
}
