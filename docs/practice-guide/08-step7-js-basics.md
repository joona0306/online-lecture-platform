# 7단계: JavaScript 기초

데이터 구조를 정의하고, `data/` JSON 파일과 `js/modules/storage.js`, `utils.js`, `api.js`를 작성합니다.

---

## 학습 목표

- 강의·사용자 데이터 스키마 이해
- data/courses.json, data/users.json 작성
- storage.js: localStorage 읽기/쓰기 (getCourses, getUsers, getCart 등)
- utils.js: formatPrice, formatDate, escapeHtml, showToast, renderStars
- api.js: initializeData, loadCoursesData, loadUsersData, getPopularCourses, getNewCourses

---

## 실습 단계

### 1단계: 폴더 구조 생성

`js/` 폴더 안에 다음 폴더를 만듭니다.

- `js/modules/` — 공용 모듈 (storage, utils, api)
- `js/components/` — 웹 컴포넌트 (8단계에서 CourseCard 등 사용)
- `js/pages/` — 페이지별 로직 (8단계에서 main.js)

---

### 2단계: data/courses.json 작성

`data/courses.json` 파일을 만들고 아래 **최소 2개** 강의 데이터를 넣습니다. (실제 프로젝트는 더 많음)

```json
[
 {
  "id": 1,
  "title": "JavaScript 기초부터 실전까지",
  "instructor": "홍길동",
  "category": "programming",
  "price": 49000,
  "thumbnail": "https://picsum.photos/400/225?random=1",
  "rating": 4.6,
  "students": 1500,
  "createdAt": "2024-01-15T10:30:00"
 },
 {
  "id": 2,
  "title": "React 완벽 가이드",
  "instructor": "홍길동",
  "category": "programming",
  "price": 69000,
  "thumbnail": "https://picsum.photos/400/225?random=2",
  "rating": 4.8,
  "students": 2300,
  "createdAt": "2024-01-20T09:00:00"
 }
]
```

나중에 curriculum, description, level 등은 프로젝트의 `data/courses.json`을 참고해 추가할 수 있습니다.

---

### 3단계: data/users.json 작성

`data/users.json` 파일을 만들고 아래 **최소 2명** 사용자 데이터를 넣습니다.

```json
[
 {
  "id": 1,
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "1234",
  "role": "instructor"
 },
 {
  "id": 2,
  "name": "김수강",
  "email": "student@example.com",
  "password": "1234",
  "role": "student"
 }
]
```

---

### 4단계: js/modules/storage.js 작성

`js/modules/storage.js` 파일을 만들고 아래 내용을 작성합니다.

```javascript
/**
 * storage.js - localStorage 관리
 */

const COURSES_KEY = "courses";
const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const CART_KEY = "cart";

function getFromStorage(key, defaultValue = null) {
 try {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
 } catch (error) {
  console.error(`[Storage] ${key} 파싱 실패:`, error);
  return defaultValue;
 }
}

function setToStorage(key, value) {
 try {
  localStorage.setItem(key, JSON.stringify(value));
 } catch (error) {
  console.error(`[Storage] ${key} 저장 실패:`, error);
 }
}

// 강의
export function getCourses() {
 return getFromStorage(COURSES_KEY, []);
}

export function saveCourses(courses) {
 setToStorage(COURSES_KEY, courses);
}

export function getCourseById(courseId) {
 const courses = getCourses();
 return courses.find((c) => c.id === courseId);
}

// 사용자
export function getUsers() {
 return getFromStorage(USERS_KEY, []);
}

export function saveUsers(users) {
 setToStorage(USERS_KEY, users);
}

export function getCurrentUser() {
 const item = sessionStorage.getItem(CURRENT_USER_KEY);
 return item ? JSON.parse(item) : null;
}

export function setCurrentUser(user) {
 if (user) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
 } else {
  sessionStorage.removeItem(CURRENT_USER_KEY);
 }
}

// 장바구니
export function getCart(userId) {
 const allCarts = getFromStorage(CART_KEY, {});
 return allCarts[userId] || [];
}

export function addToCart(userId, courseId) {
 const allCarts = getFromStorage(CART_KEY, {});
 const userCart = allCarts[userId] || [];
 if (userCart.some((item) => item.courseId === courseId)) {
  return false;
 }
 userCart.push({ courseId, addedAt: new Date().toISOString() });
 allCarts[userId] = userCart;
 setToStorage(CART_KEY, allCarts);
 return true;
}

export function getCartCount(userId) {
 return getCart(userId).length;
}
```

---

### 5단계: js/modules/utils.js 작성

`js/modules/utils.js` 파일을 만들고 아래 내용을 작성합니다.

```javascript
/**
 * utils.js - 공용 유틸리티
 */

export function formatPrice(price) {
 if (price === 0) return "무료";
 return `₩${price.toLocaleString("ko-KR")}`;
}

export function formatDate(dateString) {
 const date = new Date(dateString);
 const y = date.getFullYear();
 const m = String(date.getMonth() + 1).padStart(2, "0");
 const d = String(date.getDate()).padStart(2, "0");
 return `${y}.${m}.${d}`;
}

export function escapeHtml(text) {
 if (typeof text !== "string") return text;
 const div = document.createElement("div");
 div.textContent = text;
 return div.innerHTML;
}

export function renderStars(rating) {
 const full = Math.floor(rating);
 const hasHalf = rating % 1 >= 0.5;
 let html = "";
 for (let i = 0; i < full; i++) html += '<span class="star filled">★</span>';
 if (hasHalf) html += '<span class="star half">★</span>';
 const empty = 5 - full - (hasHalf ? 1 : 0);
 for (let i = 0; i < empty; i++) html += '<span class="star">★</span>';
 return html;
}

export function showToast(message, type = "success") {
 const toast = document.createElement("div");
 toast.className = `toast toast-${type}`;
 toast.textContent = message;
 toast.setAttribute("role", "alert");
 document.body.appendChild(toast);
 requestAnimationFrame(() => toast.classList.add("show"));
 setTimeout(() => {
  toast.classList.remove("show");
  setTimeout(() => toast.parentNode && document.body.removeChild(toast), 300);
 }, 3000);
}

/** 빈 상태 메시지 (메인/강의 목록 등에서 사용) */
export function showEmptyState(element, message) {
 if (!element) return;
 element.innerHTML = `<div class="empty-state" role="status"><p>${escapeHtml(message)}</p></div>`;
}
```

토스트 스타일은 `style.css`에 이미 있을 수 있습니다. 없으면 5단계(components) 또는 4단계(style)에서 `.toast`, `.toast.show` 스타일을 추가합니다.

---

### 6단계: js/modules/api.js 작성

`js/modules/api.js` 파일을 만들고 아래 내용을 작성합니다.

```javascript
/**
 * api.js - JSON 로드 및 강의 API
 */

import { getCourses, saveCourses, getUsers, saveUsers } from "./storage.js";

const COURSES_DATA_PATH = "./data/courses.json";
const USERS_DATA_PATH = "./data/users.json";
let isInitialized = false;

async function fetchJSON(path) {
 const response = await fetch(path);
 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
 return await response.json();
}

export async function loadCoursesData() {
 try {
  const jsonCourses = await fetchJSON(COURSES_DATA_PATH);
  const existing = getCourses();
  if (jsonCourses.length > existing.length || existing.length === 0) {
   saveCourses(jsonCourses);
   return jsonCourses;
  }
  return existing;
 } catch (error) {
  console.error("[API] 강의 로드 실패:", error);
  return getCourses();
 }
}

export async function loadUsersData() {
 try {
  const jsonUsers = await fetchJSON(USERS_DATA_PATH);
  const existing = getUsers();
  if (jsonUsers.length > existing.length || existing.length === 0) {
   saveUsers(jsonUsers);
   return jsonUsers;
  }
  return existing;
 } catch (error) {
  console.error("[API] 사용자 로드 실패:", error);
  return getUsers();
 }
}

export async function initializeData() {
 if (isInitialized) {
  return { courses: getCourses(), users: getUsers() };
 }
 try {
  const [courses, users] = await Promise.all([loadCoursesData(), loadUsersData()]);
  isInitialized = true;
  return { courses, users };
 } catch (error) {
  console.error("[API] 초기화 실패:", error);
  throw error;
 }
}

export function sortCourses(courses, sortBy) {
 const sorted = [...courses];
 switch (sortBy) {
  case "popular":
   return sorted.sort((a, b) => (b.students || 0) - (a.students || 0));
  case "newest":
   return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  default:
   return sorted;
 }
}

export function getPopularCourses(limit = 100) {
 const courses = getCourses();
 return sortCourses(courses, "popular").slice(0, limit);
}

export function getNewCourses(limit = 100) {
 const courses = getCourses();
 return sortCourses(courses, "newest").slice(0, limit);
}
```

---

## 체크리스트

- [ ] js/modules/, js/components/, js/pages/ 폴더 생성
- [ ] data/courses.json 최소 2개 강의 작성
- [ ] data/users.json 최소 2명 사용자 작성
- [ ] storage.js (getCourses, getUsers, getCurrentUser, getCart, addToCart, getCartCount) 작성
- [ ] utils.js (formatPrice, formatDate, escapeHtml, renderStars, showToast) 작성
- [ ] api.js (initializeData, loadCoursesData, loadUsersData, getPopularCourses, getNewCourses) 작성

---

## 확인 사항

- 브라우저에서 아직 데이터를 사용하는 페이지가 없으므로, 8단계에서 app.js와 main.js를 연결한 뒤 `initializeData()`가 호출되면 localStorage에 courses, users가 채워집니다.
- 나중에 수강 정보(enrollments), 비디오 재생 위치, 주문(orders) 등이 필요하면 프로젝트의 `js/modules/storage.js`를 참고해 추가합니다.

---

**다음**: [09-step8-js-main.md](./09-step8-js-main.md) - 메인 페이지 기능 (app.js, main.js, Swiper)
