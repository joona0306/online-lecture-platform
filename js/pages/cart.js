/**
 * cart.js - 장바구니 페이지 (cart.html) 모듈
 *
 * 이 모듈은 장바구니 페이지의 기능을 담당합니다:
 * - 장바구니 아이템 표시
 * - 아이템 삭제
 * - 결제 페이지로 이동
 *
 * @module pages/cart
 */

import { getCurrentUser, getCart, removeFromCart, getCourseById } from "../modules/storage.js";
import { formatPrice, escapeHtml, showToast } from "../modules/utils.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {Object|null} 현재 로그인 사용자 */
let currentUser = null;

/** @type {Array} 장바구니 아이템 (강의 정보 포함) */
let cartItems = [];

// ============================================================================
// 데이터 로드 함수
// ============================================================================

/**
 * 장바구니 데이터를 로드합니다.
 */
function loadCartData() {
 const cart = getCart(currentUser.id);

 cartItems = cart
  .map((item) => {
   const course = getCourseById(item.courseId);
   return course ? { ...item, course } : null;
  })
  .filter(Boolean);
}

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 장바구니 아이템 목록을 렌더링합니다.
 */
function renderCartItems() {
 const container = document.getElementById("cartItems");
 if (!container) return;

 if (cartItems.length === 0) {
  container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2>장바구니가 비어있습니다</h2>
        <p>관심 있는 강의를 장바구니에 담아보세요!</p>
        <a href="courses.html" class="btn btn-primary">강의 둘러보기</a>
      </div>
    `;
  return;
 }

 container.innerHTML = `
    <div class="cart-header">
      <span class="cart-count">총 ${cartItems.length}개의 강의</span>
    </div>
    <div class="cart-list">
      ${cartItems.map((item) => renderCartItem(item)).join("")}
    </div>
  `;

 // 삭제 버튼 이벤트 설정
 container.querySelectorAll(".remove-item-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
   // SVG 클릭 시에도 버튼을 찾을 수 있도록 closest 사용
   const button = e.target.closest(".remove-item-btn");
   if (button) {
    const courseId = parseInt(button.dataset.courseId);
    handleRemoveItem(courseId);
   }
  });
 });
}

/**
 * 장바구니 아이템 하나를 렌더링합니다.
 *
 * @param {Object} item - 장바구니 아이템
 * @returns {string} HTML 문자열
 */
function renderCartItem(item) {
 const { course } = item;

 return `
    <div class="cart-item" data-course-id="${course.id}">
      <div class="cart-item-thumbnail">
        <img src="${course.thumbnail}" alt="${escapeHtml(course.title)}" />
      </div>
      <div class="cart-item-info">
        <h3 class="cart-item-title">
          <a href="course-detail.html?id=${course.id}">${escapeHtml(course.title)}</a>
        </h3>
        <p class="cart-item-instructor">${escapeHtml(course.instructor)}</p>
        <div class="cart-item-meta">
          <span class="cart-item-rating">${course.rating}</span>
          <span class="cart-item-students">${course.students.toLocaleString()}명</span>
        </div>
      </div>
      <div class="cart-item-price">
        <span class="price">${formatPrice(course.price)}</span>
      </div>
      <button class="remove-item-btn" data-course-id="${course.id}" title="장바구니에서 삭제">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </button>
    </div>
  `;
}

/**
 * 주문 요약을 렌더링합니다.
 */
function renderCartSummary() {
 const container = document.getElementById("cartSummary");
 if (!container) return;

 if (cartItems.length === 0) {
  container.style.display = "none";
  return;
 }

 container.style.display = "block";

 const totalPrice = cartItems.reduce((sum, item) => sum + item.course.price, 0);

 container.innerHTML = `
    <div class="summary-card">
      <h2>주문 요약</h2>
      
      <div class="summary-row">
        <span>강의 ${cartItems.length}개</span>
        <span>${formatPrice(totalPrice)}</span>
      </div>
      
      <div class="summary-divider"></div>
      
      <div class="summary-row total">
        <span>총 결제금액</span>
        <span class="total-price">${formatPrice(totalPrice)}</span>
      </div>
      
      <a href="checkout.html" class="btn btn-primary btn-block checkout-btn">
        결제하기
      </a>
      
      <a href="courses.html" class="btn btn-secondary btn-block">
        계속 쇼핑하기
      </a>
    </div>
  `;
}

// ============================================================================
// 이벤트 핸들러
// ============================================================================

/**
 * 장바구니에서 아이템을 제거합니다.
 *
 * @param {number} courseId - 제거할 강의 ID
 */
function handleRemoveItem(courseId) {
 removeFromCart(currentUser.id, courseId);
 loadCartData();
 renderCartItems();
 renderCartSummary();

 // 헤더의 장바구니 카운트 업데이트
 updateHeaderCartCount();

 showToast("장바구니에서 삭제되었습니다.");
}

/**
 * 헤더의 장바구니 카운트를 업데이트합니다.
 */
function updateHeaderCartCount() {
 const header = document.querySelector("app-header");
 if (header && header.updateCartCount) {
  header.updateCartCount();
 }
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 장바구니 페이지를 초기화합니다.
 */
export function initCartPage() {
 // 로그인 확인
 currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html?redirect=cart.html";
  return;
 }

 // 데이터 로드
 loadCartData();

 // 렌더링
 renderCartItems();
 renderCartSummary();
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initCartPage,
};
