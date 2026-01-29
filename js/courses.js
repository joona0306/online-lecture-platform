/**
 * courses.js
 * - 강의 목록 페이지 로직 (헤더/검색/드롭다운은 header.js 사용)
 * - 필터, 정렬, 페이지네이션
 */

let currentPage = 1;
const itemsPerPage = 12;

// 강의 카드 렌더링
function renderCourseCard(course) {
 return `
    <a href="course-detail.html?id=${course.id}" class="course-card">
      <img src="${course.thumbnail}" alt="${escapeHtml(
  course.title
 )}" class="course-card-thumbnail" />
      <div class="course-card-content">
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <p class="course-card-instructor">${escapeHtml(course.instructor)}</p>
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

// 필터 적용
function getFilters() {
 const category =
  document.querySelector('input[name="category"]:checked')?.value || "";
 const price =
  document.querySelector('input[name="price"]:checked')?.value || "";
 const level =
  document.querySelector('input[name="level"]:checked')?.value || "";
 const query = getQueryParam("query") || "";

 return { category, price, level, query };
}

// 강의 필터링
function filterCourses(courses, filters) {
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

// 강의 정렬
function sortCourses(courses, sortBy) {
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

// 강의 목록 렌더링
function renderCourses() {
 const courses = getCourses();
 const filters = getFilters();
 const sortSelect = document.getElementById("sortSelect");
 const sortBy = sortSelect ? sortSelect.value : "popular";

 // 필터링
 let filteredCourses = filterCourses(courses, filters);

 // 정렬
 filteredCourses = sortCourses(filteredCourses, sortBy);

 // 결과 개수 표시
 const resultsCount = document.getElementById("resultsCount");
 if (resultsCount) {
  resultsCount.textContent = filteredCourses.length;
 }

 // 페이지네이션
 const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
 const startIndex = (currentPage - 1) * itemsPerPage;
 const endIndex = startIndex + itemsPerPage;
 const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

 // 강의 그리드 렌더링
 const coursesGrid = document.getElementById("coursesGrid");
 if (!coursesGrid) return;

 if (paginatedCourses.length === 0) {
  showEmptyState(coursesGrid, "조건에 맞는 강의가 없습니다.");
  return;
 }

 coursesGrid.innerHTML = paginatedCourses.map(renderCourseCard).join("");

 // 페이지네이션 렌더링
 renderPagination(totalPages);
}

// 페이지네이션 렌더링
function renderPagination(totalPages) {
 const pagination = document.getElementById("pagination");
 if (!pagination) return;

 if (totalPages <= 1) {
  pagination.innerHTML = "";
  return;
 }

 let html = "";

 // 이전 버튼
 html += `<button ${currentPage === 1 ? "disabled" : ""} data-page="${
  currentPage - 1
 }">이전</button>`;

 // 페이지 번호
 const maxVisible = 5;
 let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
 let endPage = Math.min(totalPages, startPage + maxVisible - 1);

 if (endPage - startPage < maxVisible - 1) {
  startPage = Math.max(1, endPage - maxVisible + 1);
 }

 if (startPage > 1) {
  html += `<button data-page="1">1</button>`;
  if (startPage > 2) {
   html += `<span>...</span>`;
  }
 }

 for (let i = startPage; i <= endPage; i++) {
  html += `<button ${
   i === currentPage ? "class='active'" : ""
  } data-page="${i}">${i}</button>`;
 }

 if (endPage < totalPages) {
  if (endPage < totalPages - 1) {
   html += `<span>...</span>`;
  }
  html += `<button data-page="${totalPages}">${totalPages}</button>`;
 }

 // 다음 버튼
 html += `<button ${currentPage === totalPages ? "disabled" : ""} data-page="${
  currentPage + 1
 }">다음</button>`;

 pagination.innerHTML = html;

 // 페이지네이션 이벤트
 pagination.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
   const page = parseInt(btn.dataset.page);
   if (page && page !== currentPage) {
    currentPage = page;
    renderCourses();
    window.scrollTo({ top: 0, behavior: "smooth" });
   }
  });
 });
}

// 필터 초기화
function resetFilters() {
 document.querySelector('input[name="category"][value=""]').checked = true;
 document.querySelector('input[name="price"][value=""]').checked = true;
 document.querySelector('input[name="level"][value=""]').checked = true;
 currentPage = 1;
 renderCourses();
}

// 필터 이벤트
function setupFilters() {
 const filterInputs = document.querySelectorAll(
  'input[name="category"], input[name="price"], input[name="level"]'
 );
 filterInputs.forEach((input) => {
  input.addEventListener("change", () => {
   currentPage = 1;
   renderCourses();
  });
 });

 const resetBtn = document.getElementById("resetFilters");
 if (resetBtn) {
  resetBtn.addEventListener("click", resetFilters);
 }
}

// 정렬 이벤트
function setupSort() {
 const sortSelect = document.getElementById("sortSelect");
 if (sortSelect) {
  sortSelect.addEventListener("change", () => {
   currentPage = 1;
   renderCourses();
  });
 }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
 updateAuthUI();
 handleSearch();
 const searchInput = document.getElementById("searchInput");
 const query = getQueryParam("query");
 if (searchInput && query) searchInput.value = query;
 setupFilters();
 setupSort();
 renderCourses();
});
