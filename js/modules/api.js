/**
 * api.js - 데이터 API 모듈
 *
 * 이 모듈은 JSON 파일에서 초기 데이터를 로드하고,
 * 로컬 스토리지와 연동하여 데이터를 관리합니다.
 * 실제 서버 API가 있다면 이 모듈에서 fetch 호출을 관리합니다.
 *
 * @module api
 */

import { getCourses, saveCourses, getUsers, saveUsers } from "./storage.js";

// ============================================================================
// 상수 정의
// ============================================================================

/** @constant {string} 강의 데이터 JSON 파일 경로 */
const COURSES_DATA_PATH = "./data/courses.json";

/** @constant {string} 사용자 데이터 JSON 파일 경로 */
const USERS_DATA_PATH = "./data/users.json";

/** @constant {boolean} 데이터 초기화 완료 여부 */
let isInitialized = false;

// ============================================================================
// 데이터 로드 함수
// ============================================================================

/**
 * JSON 파일에서 데이터를 비동기적으로 로드합니다.
 *
 * @param {string} path - JSON 파일 경로
 * @returns {Promise<*>} 파싱된 JSON 데이터
 * @throws {Error} 파일 로드 또는 파싱 실패 시 에러
 * @example
 * const data = await fetchJSON('./data/courses.json');
 */
async function fetchJSON(path) {
 try {
  const response = await fetch(path);

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
 } catch (error) {
  console.error(`[API] JSON 파일 로드 실패 (${path}):`, error);
  throw error;
 }
}

/**
 * 강의 데이터를 JSON 파일에서 로드합니다.
 * JSON 파일의 데이터가 더 많으면 업데이트합니다.
 *
 * @returns {Promise<Array>} 강의 데이터 배열
 */
export async function loadCoursesData() {
 try {
  const jsonCourses = await fetchJSON(COURSES_DATA_PATH);
  const existingCourses = getCourses();

  // JSON 데이터가 더 많거나, localStorage가 비어있으면 업데이트
  if (jsonCourses.length > existingCourses.length || existingCourses.length === 0) {
   saveCourses(jsonCourses);
   return jsonCourses;
  }

  return existingCourses;
 } catch (error) {
  console.error("[API] 강의 데이터 로드 실패:", error);
  return getCourses();
 }
}

/**
 * 사용자 데이터를 JSON 파일에서 로드합니다.
 * JSON 파일의 데이터가 더 많으면 업데이트합니다.
 *
 * @returns {Promise<Array>} 사용자 데이터 배열
 */
export async function loadUsersData() {
 try {
  const jsonUsers = await fetchJSON(USERS_DATA_PATH);
  const existingUsers = getUsers();

  // JSON 데이터가 더 많거나, localStorage가 비어있으면 업데이트
  if (jsonUsers.length > existingUsers.length || existingUsers.length === 0) {
   saveUsers(jsonUsers);
   return jsonUsers;
  }

  return existingUsers;
 } catch (error) {
  console.error("[API] 사용자 데이터 로드 실패:", error);
  return getUsers();
 }
}

// ============================================================================
// 데이터 초기화 함수
// ============================================================================

/**
 * 애플리케이션 시작 시 필요한 모든 초기 데이터를 로드합니다.
 * 이 함수는 앱 시작 시 한 번만 호출되어야 합니다.
 *
 * @returns {Promise<Object>} 로드된 데이터 객체 { courses, users }
 * @example
 * // 앱 시작 시
 * await initializeData();
 * console.log('데이터 초기화 완료!');
 */
export async function initializeData() {
 // 이미 초기화되었으면 스킵
 if (isInitialized) {
  return {
   courses: getCourses(),
   users: getUsers(),
  };
 }

 try {
  // 병렬로 데이터 로드
  const [courses, users] = await Promise.all([loadCoursesData(), loadUsersData()]);

  // 기존 데이터의 썸네일 업데이트 (필요한 경우)
  updateCourseThumbnails();

  isInitialized = true;

  return { courses, users };
 } catch (error) {
  console.error("[API] 데이터 초기화 실패:", error);
  throw error;
 }
}

// ============================================================================
// 데이터 마이그레이션/업데이트 함수
// ============================================================================

/**
 * 기존 강의 데이터의 썸네일 URL을 업데이트합니다.
 * via.placeholder.com 등의 URL을 picsum.photos로 변경합니다.
 *
 * @returns {boolean} 업데이트가 수행되었으면 true
 */
export function updateCourseThumbnails() {
 const courses = getCourses();

 if (courses.length === 0) {
  return false;
 }

 let updated = false;

 // 강의 ID별 썸네일 매핑
 const thumbnailMap = {
  1: "https://picsum.photos/400/225?random=1",
  2: "https://picsum.photos/400/225?random=2",
  3: "https://picsum.photos/400/225?random=3",
  4: "https://picsum.photos/400/225?random=4",
 };

 const updatedCourses = courses.map((course) => {
  // 오래된 placeholder URL이거나 유효하지 않은 썸네일인 경우 업데이트
  if (
   course.thumbnail &&
   (course.thumbnail.includes("via.placeholder") ||
    course.thumbnail.includes("placeholder.com") ||
    !course.thumbnail.startsWith("http"))
  ) {
   const newThumbnail =
    thumbnailMap[course.id] || `https://picsum.photos/400/225?random=${course.id}`;
   updated = true;
   return { ...course, thumbnail: newThumbnail };
  }
  return course;
 });

 if (updated) {
  saveCourses(updatedCourses);
 }

 return updated;
}

/**
 * 모든 로컬 스토리지 데이터를 초기화합니다.
 * 주의: 모든 사용자 데이터(수강 정보, 후기 등)가 삭제됩니다.
 *
 * @param {boolean} confirmReset - true일 때만 초기화 실행
 * @returns {Promise<boolean>} 초기화 성공 여부
 */
export async function resetAllData(confirmReset = false) {
 if (!confirmReset) {
  return false;
 }

 // 모든 관련 키 삭제
 const keysToRemove = ["courses", "users", "enrollments", "reviews", "recentSearches"];

 keysToRemove.forEach((key) => {
  localStorage.removeItem(key);
 });

 // 세션 스토리지도 초기화
 sessionStorage.removeItem("currentUser");

 // 초기화 상태 리셋
 isInitialized = false;

 // 데이터 다시 로드
 await initializeData();

 return true;
}

// ============================================================================
// 강의 관련 API 함수
// ============================================================================

/**
 * 필터 조건에 맞는 강의 목록을 가져옵니다.
 *
 * @param {Object} filters - 필터 옵션
 * @param {string} filters.category - 카테고리 필터
 * @param {string} filters.price - 가격 필터 ('free' | 'paid' | '')
 * @param {string} filters.level - 난이도 필터
 * @param {string} filters.query - 검색어
 * @returns {Array} 필터링된 강의 배열
 */
export function getFilteredCourses(filters = {}) {
 const courses = getCourses();

 return courses.filter((course) => {
  // 검색어 필터
  if (filters.query) {
   const query = filters.query.toLowerCase();
   const matchesTitle = course.title.toLowerCase().includes(query);
   const matchesInstructor = course.instructor.toLowerCase().includes(query);
   const matchesDescription = course.description.toLowerCase().includes(query);

   if (!matchesTitle && !matchesInstructor && !matchesDescription) {
    return false;
   }
  }

  // 카테고리 필터
  if (filters.category && course.category !== filters.category) {
   return false;
  }

  // 가격 필터
  if (filters.price === "free" && course.price !== 0) {
   return false;
  }
  if (filters.price === "paid" && course.price === 0) {
   return false;
  }

  // 난이도 필터
  if (filters.level && course.level !== filters.level) {
   return false;
  }

  return true;
 });
}

/**
 * 강의 목록을 정렬합니다.
 *
 * @param {Array} courses - 정렬할 강의 배열
 * @param {string} sortBy - 정렬 기준
 *   - 'popular': 인기순 (학생 수)
 *   - 'newest': 최신순
 *   - 'price-low': 가격 낮은순
 *   - 'price-high': 가격 높은순
 *   - 'rating': 평점순
 * @returns {Array} 정렬된 강의 배열
 */
export function sortCourses(courses, sortBy) {
 const sorted = [...courses];

 switch (sortBy) {
  case "popular":
   return sorted.sort((a, b) => b.students - a.students);
  case "newest":
   return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  case "price-low":
   return sorted.sort((a, b) => a.price - b.price);
  case "price-high":
   return sorted.sort((a, b) => b.price - a.price);
  case "rating":
   return sorted.sort((a, b) => b.rating - a.rating);
  default:
   return sorted;
 }
}

/**
 * 인기 강의 목록을 가져옵니다.
 *
 * @param {number} limit - 가져올 강의 수 (기본값: 4)
 * @returns {Array} 인기 강의 배열
 */
export function getPopularCourses(limit = 4) {
 const courses = getCourses();
 return sortCourses(courses, "popular").slice(0, limit);
}

/**
 * 신규 강의 목록을 가져옵니다.
 *
 * @param {number} limit - 가져올 강의 수 (기본값: 4)
 * @returns {Array} 신규 강의 배열
 */
export function getNewCourses(limit = 4) {
 const courses = getCourses();
 return sortCourses(courses, "newest").slice(0, limit);
}
