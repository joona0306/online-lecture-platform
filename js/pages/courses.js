/**
 * courses.js - 강의 목록 페이지 (courses.html) 모듈
 *
 * 이 모듈은 강의 목록 페이지의 기능을 담당합니다:
 * - 강의 필터링 (카테고리, 가격, 난이도)
 * - 강의 정렬
 * - 페이지네이션
 * - 검색 결과 표시
 *
 * @module pages/courses
 */

import { getFilteredCourses, sortCourses } from "../modules/api.js";
import { getQueryParam, showEmptyState, escapeHtml } from "../modules/utils.js";
import { renderCourseCards } from "../components/CourseCard.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {number} 현재 페이지 번호 */
let currentPage = 1;

/** @constant {number} 페이지당 표시할 강의 수 */
const ITEMS_PER_PAGE = 12;

// ============================================================================
// 필터 관련 함수
// ============================================================================

/**
 * 현재 선택된 필터 값들을 가져옵니다.
 *
 * @returns {Object} 필터 객체
 * @returns {string} returns.category - 선택된 카테고리
 * @returns {string} returns.price - 선택된 가격 필터
 * @returns {string} returns.level - 선택된 난이도
 * @returns {string} returns.query - 검색어
 */
function getFilters() {
 const category = document.querySelector('input[name="category"]:checked')?.value || "";
 const price = document.querySelector('input[name="price"]:checked')?.value || "";
 const level = document.querySelector('input[name="level"]:checked')?.value || "";
 const query = getQueryParam("query") || "";

 return { category, price, level, query };
}

/**
 * URL 파라미터에서 필터 값을 읽어와 UI에 적용합니다.
 */
function applyFiltersFromURL() {
 // 카테고리 필터
 const categoryParam = getQueryParam("category");
 if (categoryParam) {
  const categoryInput = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
  if (categoryInput) {
   categoryInput.checked = true;
  }
 }

 // 검색어
 const queryParam = getQueryParam("query");
 if (queryParam) {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
   searchInput.value = queryParam;
  }
 }
}

/**
 * 모든 필터를 초기화합니다.
 */
function resetFilters() {
 // 카테고리 초기화
 const categoryAll = document.querySelector('input[name="category"][value=""]');
 if (categoryAll) categoryAll.checked = true;

 // 가격 초기화
 const priceAll = document.querySelector('input[name="price"][value=""]');
 if (priceAll) priceAll.checked = true;

 // 난이도 초기화
 const levelAll = document.querySelector('input[name="level"][value=""]');
 if (levelAll) levelAll.checked = true;

 // 페이지 초기화
 currentPage = 1;

 // 강의 목록 다시 렌더링
 renderCourses();
}

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 검색어에 따라 페이지 타이틀을 업데이트합니다.
 * @param {string} query - 검색어
 */
function updatePageTitle(query) {
 const titleElement = document.querySelector(".courses-section .section-title");
 if (!titleElement) return;

 if (query) {
  titleElement.innerHTML = `
      <span>"${escapeHtml(query)}" 검색 결과</span>
      <a href="courses.html" class="back-to-all-link">
        전체 강의 보기
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    `;
 } else {
  titleElement.innerHTML = "전체 강의";
 }
}

/**
 * 강의 목록을 렌더링합니다.
 * 필터링, 정렬, 페이지네이션이 적용됩니다.
 */
export function renderCourses() {
 const coursesGrid = document.getElementById("coursesGrid");
 const resultsCount = document.getElementById("resultsCount");

 if (!coursesGrid) return;

 // 필터 및 정렬 가져오기
 const filters = getFilters();
 const sortSelect = document.getElementById("sortSelect");
 const sortBy = sortSelect ? sortSelect.value : "popular";

 // 검색어가 있으면 페이지 타이틀 변경
 updatePageTitle(filters.query);

 // 필터링 및 정렬
 let filteredCourses = getFilteredCourses(filters);
 filteredCourses = sortCourses(filteredCourses, sortBy);

 // 결과 개수 표시
 if (resultsCount) {
  resultsCount.textContent = filteredCourses.length;
 }

 // 페이지네이션 계산
 const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
 const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
 const endIndex = startIndex + ITEMS_PER_PAGE;
 const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

 // 빈 결과 처리
 if (paginatedCourses.length === 0) {
  showEmptyState(coursesGrid, "조건에 맞는 강의가 없습니다.");
  renderPagination(0);
  return;
 }

 // 강의 카드 렌더링
 coursesGrid.innerHTML = renderCourseCards(paginatedCourses);

 // 페이지네이션 렌더링
 renderPagination(totalPages);
}

/**
 * 페이지네이션 UI를 렌더링합니다.
 *
 * @param {number} totalPages - 전체 페이지 수
 */
function renderPagination(totalPages) {
 const pagination = document.getElementById("pagination");
 if (!pagination) return;

 // 페이지가 1개 이하면 페이지네이션 숨김
 if (totalPages <= 1) {
  pagination.innerHTML = "";
  return;
 }

 let html = "";

 // 이전 버튼
 html += `
    <button 
      ${currentPage === 1 ? "disabled" : ""} 
      data-page="${currentPage - 1}"
      aria-label="이전 페이지"
    >이전</button>
  `;

 // 페이지 번호
 const maxVisible = 5;
 let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
 let endPage = Math.min(totalPages, startPage + maxVisible - 1);

 // 페이지 범위 조정
 if (endPage - startPage < maxVisible - 1) {
  startPage = Math.max(1, endPage - maxVisible + 1);
 }

 // 첫 페이지 버튼 (필요한 경우)
 if (startPage > 1) {
  html += `<button data-page="1">1</button>`;
  if (startPage > 2) {
   html += `<span class="pagination-ellipsis">...</span>`;
  }
 }

 // 페이지 번호 버튼
 for (let i = startPage; i <= endPage; i++) {
  html += `
      <button 
        ${i === currentPage ? 'class="active" aria-current="page"' : ""} 
        data-page="${i}"
      >${i}</button>
    `;
 }

 // 마지막 페이지 버튼 (필요한 경우)
 if (endPage < totalPages) {
  if (endPage < totalPages - 1) {
   html += `<span class="pagination-ellipsis">...</span>`;
  }
  html += `<button data-page="${totalPages}">${totalPages}</button>`;
 }

 // 다음 버튼
 html += `
    <button 
      ${currentPage === totalPages ? "disabled" : ""} 
      data-page="${currentPage + 1}"
      aria-label="다음 페이지"
    >다음</button>
  `;

 pagination.innerHTML = html;

 // 페이지네이션 클릭 이벤트
 pagination.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
   const page = parseInt(btn.dataset.page);
   if (page && page !== currentPage && !btn.disabled) {
    currentPage = page;
    renderCourses();

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
   }
  });
 });
}

// ============================================================================
// 이벤트 설정 함수
// ============================================================================

/**
 * 필터 변경 이벤트를 설정합니다.
 */
function setupFilters() {
 const filterInputs = document.querySelectorAll(
  'input[name="category"], input[name="price"], input[name="level"]'
 );

 filterInputs.forEach((input) => {
  input.addEventListener("change", () => {
   currentPage = 1; // 필터 변경 시 첫 페이지로
   renderCourses();
  });
 });

 // 필터 초기화 버튼
 const resetBtn = document.getElementById("resetFilters");
 if (resetBtn) {
  resetBtn.addEventListener("click", resetFilters);
 }
}

/**
 * 정렬 변경 이벤트를 설정합니다.
 */
function setupSort() {
 const sortSelect = document.getElementById("sortSelect");

 if (sortSelect) {
  sortSelect.addEventListener("change", () => {
   currentPage = 1; // 정렬 변경 시 첫 페이지로
   renderCourses();
  });
 }
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 강의 목록 페이지를 초기화합니다.
 * DOMContentLoaded 이벤트에서 호출됩니다.
 */
export function initCoursesPage() {
 // URL에서 필터 적용
 applyFiltersFromURL();

 // 이벤트 설정
 setupFilters();
 setupSort();

 // 강의 목록 렌더링
 renderCourses();
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initCoursesPage,
 renderCourses,
 resetFilters,
};
