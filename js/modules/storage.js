/**
 * storage.js - 로컬 스토리지 및 세션 스토리지 관리 모듈
 *
 * 이 모듈은 브라우저의 localStorage와 sessionStorage를 추상화하여
 * 강의, 수강 정보, 사용자 데이터를 관리하는 함수들을 제공합니다.
 *
 * @module storage
 */

// ============================================================================
// 상수 정의 (스토리지 키)
// ============================================================================

/** @constant {string} 강의 데이터 저장 키 */
const COURSES_KEY = "courses";

/** @constant {string} 수강 정보 저장 키 */
const ENROLLMENTS_KEY = "enrollments";

/** @constant {string} 사용자 목록 저장 키 */
const USERS_KEY = "users";

/** @constant {string} 후기 데이터 저장 키 */
const REVIEWS_KEY = "reviews";

/** @constant {string} 현재 로그인 사용자 저장 키 (세션) */
const CURRENT_USER_KEY = "currentUser";

/** @constant {string} 최근 검색어 저장 키 */
const RECENT_SEARCHES_KEY = "recentSearches";

/** @constant {string} 장바구니 저장 키 */
const CART_KEY = "cart";

/** @constant {string} 주문 내역 저장 키 */
const ORDERS_KEY = "orders";

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * localStorage에서 JSON 데이터를 안전하게 가져옵니다.
 * 파싱 실패 시 기본값을 반환합니다.
 *
 * @param {string} key - 스토리지 키
 * @param {*} defaultValue - 파싱 실패 시 반환할 기본값
 * @returns {*} 파싱된 데이터 또는 기본값
 */
function getFromStorage(key, defaultValue = null) {
 try {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
 } catch (error) {
  console.error(`[Storage] ${key} 데이터 파싱 실패:`, error);
  return defaultValue;
 }
}

/**
 * localStorage에 JSON 데이터를 저장합니다.
 *
 * @param {string} key - 스토리지 키
 * @param {*} value - 저장할 데이터 (JSON으로 직렬화됨)
 */
function setToStorage(key, value) {
 try {
  localStorage.setItem(key, JSON.stringify(value));
 } catch (error) {
  console.error(`[Storage] ${key} 데이터 저장 실패:`, error);
 }
}

// ============================================================================
// 강의 데이터 관련 함수
// ============================================================================

/**
 * 모든 강의 목록을 가져옵니다.
 *
 * @returns {Array<Object>} 강의 객체 배열
 * @example
 * const courses = getCourses();
 * console.log(courses[0].title); // "JavaScript 기초부터 실전까지"
 */
export function getCourses() {
 return getFromStorage(COURSES_KEY, []);
}

/**
 * 강의 목록을 저장합니다.
 *
 * @param {Array<Object>} courses - 저장할 강의 배열
 */
export function saveCourses(courses) {
 setToStorage(COURSES_KEY, courses);
}

/**
 * ID로 특정 강의를 찾습니다.
 *
 * @param {number} courseId - 찾을 강의의 ID
 * @returns {Object|undefined} 강의 객체 또는 undefined
 */
export function getCourseById(courseId) {
 const courses = getCourses();
 return courses.find((course) => course.id === courseId);
}

// ============================================================================
// 수강 정보 관련 함수
// ============================================================================

/**
 * 모든 수강 정보를 가져옵니다.
 *
 * @returns {Array<Object>} 수강 정보 객체 배열
 */
export function getEnrollments() {
 return getFromStorage(ENROLLMENTS_KEY, []);
}

/**
 * 수강 정보 목록을 저장합니다.
 *
 * @param {Array<Object>} enrollments - 저장할 수강 정보 배열
 */
export function saveEnrollments(enrollments) {
 setToStorage(ENROLLMENTS_KEY, enrollments);
}

/**
 * 특정 사용자의 특정 강의 수강 정보를 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @returns {Object|undefined} 수강 정보 객체 또는 undefined
 * @example
 * const enrollment = getEnrollment(1, 2);
 * if (enrollment) {
 *   console.log(`진행률: ${enrollment.progress}%`);
 * }
 */
export function getEnrollment(userId, courseId) {
 const enrollments = getEnrollments();
 return enrollments.find(
  (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
 );
}

/**
 * 수강 정보를 저장하거나 업데이트합니다.
 * 이미 존재하는 수강 정보면 업데이트하고, 없으면 새로 추가합니다.
 *
 * @param {Object} enrollment - 저장할 수강 정보 객체
 * @param {number} enrollment.userId - 사용자 ID
 * @param {number} enrollment.courseId - 강의 ID
 * @param {number} enrollment.progress - 진행률 (0-100)
 * @param {Array<number>} enrollment.completedLessons - 완료한 레슨 ID 배열
 */
export function saveEnrollment(enrollment) {
 const enrollments = getEnrollments();
 const index = enrollments.findIndex(
  (e) => e.userId === enrollment.userId && e.courseId === enrollment.courseId
 );

 if (index >= 0) {
  // 기존 수강 정보 업데이트
  enrollments[index] = enrollment;
 } else {
  // 새로운 수강 정보 추가
  enrollments.push(enrollment);
 }

 saveEnrollments(enrollments);
}

/**
 * 새로운 수강 등록 정보를 생성합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @returns {Object} 생성된 수강 정보 객체
 */
export function createEnrollment(userId, courseId) {
 return {
  userId,
  courseId,
  progress: 0,
  completedLessons: [],
  enrolledAt: new Date().toISOString(),
  lastAccessedAt: new Date().toISOString(),
  videoProgress: {},
  totalStudyTime: 0, // 총 학습 시간 (초 단위)
 };
}

// ============================================================================
// 비디오 재생 위치 관련 함수
// ============================================================================

/**
 * 특정 사용자의 특정 강의 비디오 재생 위치 정보를 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @returns {Object} 레슨별 재생 위치 객체 { lessonId: seconds }
 */
export function getVideoProgress(userId, courseId) {
 const enrollment = getEnrollment(userId, courseId);
 return enrollment?.videoProgress || {};
}

/**
 * 비디오 재생 위치를 저장합니다.
 * 수강 정보가 없으면 새로 생성합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @param {number} lessonId - 레슨 ID
 * @param {number} time - 재생 위치 (초)
 */
export function saveVideoProgress(userId, courseId, lessonId, time) {
 let enrollment = getEnrollment(userId, courseId);

 // 수강 정보가 없으면 새로 생성
 if (!enrollment) {
  enrollment = createEnrollment(userId, courseId);
 }

 // videoProgress 객체 초기화
 if (!enrollment.videoProgress) {
  enrollment.videoProgress = {};
 }

 // 재생 위치 저장
 enrollment.videoProgress[lessonId] = time;
 enrollment.lastAccessedAt = new Date().toISOString();

 saveEnrollment(enrollment);
}

// ============================================================================
// 학습 시간 관련 함수
// ============================================================================

/**
 * 특정 사용자의 특정 강의 총 학습 시간을 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @returns {number} 총 학습 시간 (초)
 */
export function getStudyTime(userId, courseId) {
 const enrollment = getEnrollment(userId, courseId);
 return enrollment?.totalStudyTime || 0;
}

/**
 * 학습 시간을 추가합니다.
 * 기존 학습 시간에 새로운 시간을 더합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @param {number} seconds - 추가할 학습 시간 (초)
 */
export function addStudyTime(userId, courseId, seconds) {
 let enrollment = getEnrollment(userId, courseId);

 if (!enrollment) {
  enrollment = createEnrollment(userId, courseId);
 }

 // totalStudyTime 필드 초기화 (기존 데이터 호환)
 if (typeof enrollment.totalStudyTime !== "number") {
  enrollment.totalStudyTime = 0;
 }

 // 학습 시간 추가
 enrollment.totalStudyTime += seconds;
 enrollment.lastAccessedAt = new Date().toISOString();

 saveEnrollment(enrollment);
}

/**
 * 특정 사용자의 모든 강의 총 학습 시간을 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @returns {number} 모든 강의의 총 학습 시간 (초)
 */
export function getTotalStudyTimeByUser(userId) {
 const enrollments = getEnrollments().filter((e) => e.userId === userId);
 return enrollments.reduce((total, e) => total + (e.totalStudyTime || 0), 0);
}

// ============================================================================
// 사용자 데이터 관련 함수
// ============================================================================

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * 세션 스토리지에서 가져오므로 브라우저 탭을 닫으면 사라집니다.
 *
 * @returns {Object|null} 사용자 객체 또는 null
 */
export function getCurrentUser() {
 try {
  const user = sessionStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
 } catch (error) {
  console.error("[Storage] 현재 사용자 정보 파싱 실패:", error);
  return null;
 }
}

/**
 * 현재 로그인한 사용자 정보를 설정합니다.
 * null을 전달하면 로그아웃 처리됩니다.
 *
 * @param {Object|null} user - 사용자 객체 또는 null (로그아웃)
 */
export function setCurrentUser(user) {
 if (user) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
 } else {
  sessionStorage.removeItem(CURRENT_USER_KEY);
 }
}

/**
 * 모든 사용자 목록을 가져옵니다.
 *
 * @returns {Array<Object>} 사용자 객체 배열
 */
export function getUsers() {
 return getFromStorage(USERS_KEY, []);
}

/**
 * 사용자 목록을 저장합니다.
 *
 * @param {Array<Object>} users - 저장할 사용자 배열
 */
export function saveUsers(users) {
 setToStorage(USERS_KEY, users);
}

/**
 * 이메일로 사용자를 찾습니다.
 *
 * @param {string} email - 찾을 이메일 주소
 * @returns {Object|undefined} 사용자 객체 또는 undefined
 */
export function getUserByEmail(email) {
 const users = getUsers();
 return users.find((user) => user.email === email);
}

// ============================================================================
// 후기 데이터 관련 함수
// ============================================================================

/**
 * 모든 후기 목록을 가져옵니다.
 *
 * @returns {Array<Object>} 후기 객체 배열
 */
export function getReviews() {
 return getFromStorage(REVIEWS_KEY, []);
}

/**
 * 후기 목록을 저장합니다.
 *
 * @param {Array<Object>} reviews - 저장할 후기 배열
 */
export function saveReviews(reviews) {
 setToStorage(REVIEWS_KEY, reviews);
}

/**
 * 특정 강의의 후기 목록을 가져옵니다.
 *
 * @param {number} courseId - 강의 ID
 * @returns {Array<Object>} 해당 강의의 후기 배열
 */
export function getReviewsByCourse(courseId) {
 const reviews = getReviews();
 return reviews.filter((review) => review.courseId === courseId);
}

/**
 * 새로운 후기를 저장합니다.
 *
 * @param {Object} review - 저장할 후기 객체
 * @param {number} review.courseId - 강의 ID
 * @param {number} review.userId - 작성자 ID
 * @param {string} review.userName - 작성자 이름
 * @param {number} review.rating - 평점 (1-5)
 * @param {string} review.content - 후기 내용
 */
export function saveReview(review) {
 const reviews = getReviews();
 reviews.push({
  ...review,
  id: Date.now(),
  createdAt: new Date().toISOString(),
 });
 saveReviews(reviews);
}

// ============================================================================
// 검색 관련 함수
// ============================================================================

/**
 * 최근 검색어 목록을 가져옵니다.
 *
 * @returns {Array<string>} 최근 검색어 배열
 */
export function getRecentSearches() {
 return getFromStorage(RECENT_SEARCHES_KEY, []);
}

/**
 * 검색어를 최근 검색어 목록에 추가합니다.
 * 중복 검색어는 맨 앞으로 이동하고, 최대 5개까지만 유지합니다.
 *
 * @param {string} query - 추가할 검색어
 */
export function addRecentSearch(query) {
 let recent = getRecentSearches();

 // 중복 제거 후 맨 앞에 추가
 recent = recent.filter((q) => q !== query);
 recent.unshift(query);

 // 최대 5개까지만 유지
 recent = recent.slice(0, 5);

 setToStorage(RECENT_SEARCHES_KEY, recent);
}

/**
 * 특정 검색어를 최근 검색어 목록에서 제거합니다.
 *
 * @param {string} query - 제거할 검색어
 */
export function removeRecentSearch(query) {
 const recent = getRecentSearches().filter((q) => q !== query);
 setToStorage(RECENT_SEARCHES_KEY, recent);
}

/**
 * 모든 최근 검색어를 삭제합니다.
 */
export function clearRecentSearches() {
 localStorage.removeItem(RECENT_SEARCHES_KEY);
}

// ============================================================================
// 장바구니 관련 함수
// ============================================================================

/**
 * 장바구니 목록을 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @returns {Array<Object>} 장바구니 아이템 배열
 */
export function getCart(userId) {
 const allCarts = getFromStorage(CART_KEY, {});
 return allCarts[userId] || [];
}

/**
 * 장바구니에 강의를 추가합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @returns {boolean} 추가 성공 여부 (이미 있으면 false)
 */
export function addToCart(userId, courseId) {
 const allCarts = getFromStorage(CART_KEY, {});
 const userCart = allCarts[userId] || [];

 // 이미 장바구니에 있는지 확인
 if (userCart.some((item) => item.courseId === courseId)) {
  return false;
 }

 // 이미 수강 중인지 확인
 const enrollment = getEnrollment(userId, courseId);
 if (enrollment) {
  return false;
 }

 userCart.push({
  courseId,
  addedAt: new Date().toISOString(),
 });

 allCarts[userId] = userCart;
 setToStorage(CART_KEY, allCarts);
 return true;
}

/**
 * 장바구니에서 강의를 제거합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 */
export function removeFromCart(userId, courseId) {
 const allCarts = getFromStorage(CART_KEY, {});
 const userCart = allCarts[userId] || [];

 allCarts[userId] = userCart.filter((item) => item.courseId !== courseId);
 setToStorage(CART_KEY, allCarts);
}

/**
 * 장바구니를 비웁니다.
 *
 * @param {number} userId - 사용자 ID
 */
export function clearCart(userId) {
 const allCarts = getFromStorage(CART_KEY, {});
 allCarts[userId] = [];
 setToStorage(CART_KEY, allCarts);
}

/**
 * 장바구니에 특정 강의가 있는지 확인합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} courseId - 강의 ID
 * @returns {boolean} 장바구니에 있으면 true
 */
export function isInCart(userId, courseId) {
 const cart = getCart(userId);
 return cart.some((item) => item.courseId === courseId);
}

/**
 * 장바구니 아이템 수를 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @returns {number} 장바구니 아이템 수
 */
export function getCartCount(userId) {
 return getCart(userId).length;
}

// ============================================================================
// 주문/결제 관련 함수
// ============================================================================

/**
 * 모든 주문 내역을 가져옵니다.
 *
 * @returns {Array<Object>} 주문 내역 배열
 */
export function getOrders() {
 return getFromStorage(ORDERS_KEY, []);
}

/**
 * 특정 사용자의 주문 내역을 가져옵니다.
 *
 * @param {number} userId - 사용자 ID
 * @returns {Array<Object>} 해당 사용자의 주문 내역 배열
 */
export function getOrdersByUser(userId) {
 const orders = getOrders();
 return orders.filter((order) => order.userId === userId);
}

/**
 * 주문 ID로 주문을 조회합니다.
 *
 * @param {string} orderId - 주문 ID
 * @returns {Object|undefined} 주문 객체
 */
export function getOrderById(orderId) {
 const orders = getOrders();
 return orders.find((order) => order.id === orderId);
}

/**
 * 새로운 주문을 생성합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {Array<Object>} items - 주문 아이템 배열 [{courseId, price}]
 * @param {Object} paymentInfo - 결제 정보
 * @returns {Object} 생성된 주문 객체
 */
export function createOrder(userId, items, paymentInfo) {
 const orders = getOrders();

 const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

 const order = {
  id: `ORD-${Date.now()}`,
  userId,
  items: items.map((item) => ({
   courseId: item.courseId,
   title: item.title,
   price: item.price,
   refunded: false,
   refundedAt: null,
  })),
  totalAmount,
  paymentMethod: paymentInfo.method,
  status: "completed", // pending, completed, cancelled, refunded
  createdAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
 };

 orders.push(order);
 setToStorage(ORDERS_KEY, orders);

 // 주문 완료 후 수강 등록 처리
 items.forEach((item) => {
  const enrollment = createEnrollment(userId, item.courseId);
  saveEnrollment(enrollment);
 });

 // 장바구니 비우기
 clearCart(userId);

 return order;
}

/**
 * 주문 아이템을 환불 처리합니다.
 * 수강하지 않은(진행률 0%) 강의만 환불 가능합니다.
 *
 * @param {string} orderId - 주문 ID
 * @param {number} courseId - 환불할 강의 ID
 * @param {number} userId - 사용자 ID
 * @returns {Object} { success: boolean, message: string }
 */
export function refundOrderItem(orderId, courseId, userId) {
 const orders = getOrders();
 const orderIndex = orders.findIndex((o) => o.id === orderId);

 if (orderIndex === -1) {
  return { success: false, message: "주문을 찾을 수 없습니다." };
 }

 const order = orders[orderIndex];

 // 본인 주문인지 확인
 if (order.userId !== userId) {
  return { success: false, message: "권한이 없습니다." };
 }

 // 해당 강의 아이템 찾기
 const itemIndex = order.items.findIndex((item) => item.courseId === courseId);

 if (itemIndex === -1) {
  return { success: false, message: "해당 강의를 찾을 수 없습니다." };
 }

 const item = order.items[itemIndex];

 // 이미 환불된 경우
 if (item.refunded) {
  return { success: false, message: "이미 환불된 강의입니다." };
 }

 // 수강 진행률 확인
 const enrollment = getEnrollment(userId, courseId);

 if (enrollment && enrollment.progress > 0) {
  return { success: false, message: "이미 수강을 시작한 강의는 환불할 수 없습니다." };
 }

 // 환불 처리
 order.items[itemIndex].refunded = true;
 order.items[itemIndex].refundedAt = new Date().toISOString();

 // 모든 아이템이 환불되었는지 확인
 const allRefunded = order.items.every((i) => i.refunded);
 if (allRefunded) {
  order.status = "refunded";
 }

 orders[orderIndex] = order;
 setToStorage(ORDERS_KEY, orders);

 // 수강 정보 삭제
 if (enrollment) {
  const enrollments = getEnrollments();
  const filteredEnrollments = enrollments.filter(
   (e) => !(e.userId === userId && e.courseId === courseId)
  );
  saveEnrollments(filteredEnrollments);
 }

 return { success: true, message: "환불이 완료되었습니다.", refundAmount: item.price };
}
