/**
 * checkout.js - 결제 페이지 (checkout.html) 모듈
 *
 * 이 모듈은 결제 페이지의 기능을 담당합니다:
 * - 주문 상품 표시
 * - 결제 수단 선택
 * - 결제 처리
 *
 * @module pages/checkout
 */

import { getCurrentUser, getCart, getCourseById, createOrder } from "../modules/storage.js";
import { formatPrice, escapeHtml, showToast } from "../modules/utils.js";
import { showModal, closeModal } from "../modules/modal.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {Object|null} 현재 로그인 사용자 */
let currentUser = null;

/** @type {Array} 주문할 아이템 (강의 정보 포함) */
let orderItems = [];

// ============================================================================
// 데이터 로드 함수
// ============================================================================

/**
 * 장바구니에서 주문 데이터를 로드합니다.
 */
function loadOrderData() {
 const cart = getCart(currentUser.id);

 orderItems = cart
  .map((item) => {
   const course = getCourseById(item.courseId);
   return course
    ? {
       courseId: course.id,
       title: course.title,
       instructor: course.instructor,
       thumbnail: course.thumbnail,
       price: course.price,
      }
    : null;
  })
  .filter(Boolean);
}

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 주문 상품 목록을 렌더링합니다.
 */
function renderOrderItems() {
 const container = document.getElementById("orderItems");
 if (!container) return;

 if (orderItems.length === 0) {
  window.location.href = "cart.html";
  return;
 }

 container.innerHTML = orderItems
  .map(
   (item) => `
    <div class="order-item">
      <div class="order-item-thumbnail">
        <img src="${item.thumbnail}" alt="${escapeHtml(item.title)}" />
      </div>
      <div class="order-item-info">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.instructor)}</p>
      </div>
      <div class="order-item-price">
        ${formatPrice(item.price)}
      </div>
    </div>
  `
  )
  .join("");
}

/**
 * 결제 요약을 렌더링합니다.
 */
function renderCheckoutSummary() {
 const container = document.getElementById("checkoutSummary");
 if (!container) return;

 const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

 container.innerHTML = `
    <div class="summary-card sticky">
      <h2>결제 금액</h2>
      
      <div class="summary-row">
        <span>상품 금액</span>
        <span>${formatPrice(totalPrice)}</span>
      </div>
      
      <div class="summary-row">
        <span>할인 금액</span>
        <span class="discount">-${formatPrice(0)}</span>
      </div>
      
      <div class="summary-divider"></div>
      
      <div class="summary-row total">
        <span>총 결제금액</span>
        <span class="total-price">${formatPrice(totalPrice)}</span>
      </div>
      
      <button class="btn btn-primary btn-block pay-btn" id="payButton">
        ${formatPrice(totalPrice)} 결제하기
      </button>
      
      <p class="checkout-notice">
        위 내용을 확인하였으며, 결제에 동의합니다.
      </p>
    </div>
  `;

 // 결제 버튼 이벤트
 document.getElementById("payButton").addEventListener("click", handlePayment);
}

// ============================================================================
// 이벤트 핸들러
// ============================================================================

/**
 * 약관 전체 동의 이벤트를 설정합니다.
 */
function setupTermsAgreement() {
 const agreeAllCheckbox = document.getElementById("agreeAll");
 const termCheckboxes = document.querySelectorAll(".term-checkbox");

 if (agreeAllCheckbox) {
  agreeAllCheckbox.addEventListener("change", (e) => {
   termCheckboxes.forEach((checkbox) => {
    checkbox.checked = e.target.checked;
   });
  });
 }

 termCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
   const allChecked = Array.from(termCheckboxes).every((cb) => cb.checked);
   if (agreeAllCheckbox) {
    agreeAllCheckbox.checked = allChecked;
   }
  });
 });
}

/**
 * 필수 약관 동의 여부를 확인합니다.
 *
 * @returns {boolean} 모든 필수 약관에 동의했으면 true
 */
function checkRequiredTerms() {
 const requiredCheckboxes = document.querySelectorAll('.term-checkbox[data-required="true"]');
 return Array.from(requiredCheckboxes).every((cb) => cb.checked);
}

/**
 * 결제를 처리합니다.
 */
function handlePayment() {
 // 필수 약관 동의 확인
 if (!checkRequiredTerms()) {
  showToast("필수 약관에 동의해주세요.", "error");
  return;
 }

 // 결제 수단 확인
 const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
 if (!paymentMethod) {
  showToast("결제 수단을 선택해주세요.", "error");
  return;
 }

 // 결제 처리 중 모달 표시
 showPaymentProcessingModal();

 // 결제 시뮬레이션 (실제로는 PG사 연동)
 setTimeout(() => {
  processPayment(paymentMethod.value);
 }, 2000);
}

/**
 * 결제 처리 중 모달을 표시합니다.
 */
function showPaymentProcessingModal() {
 showModal({
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
  title: "결제 처리 중",
  message: "잠시만 기다려주세요...",
  buttons: [],
 });
}

/**
 * 결제를 처리하고 주문을 생성합니다.
 *
 * @param {string} paymentMethod - 결제 수단
 */
function processPayment(paymentMethod) {
 // 주문 생성
 const order = createOrder(currentUser.id, orderItems, { method: paymentMethod });

 // 결제 완료 모달 표시
 closeModal();

 showPaymentCompleteModal(order);
}

/**
 * 결제 완료 모달을 표시합니다.
 *
 * @param {Object} order - 생성된 주문 객체
 */
function showPaymentCompleteModal(order) {
 const totalPrice = order.items.reduce((sum, item) => sum + item.price, 0);

 showModal({
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-success)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  title: "결제가 완료되었습니다!",
  message: `
      <div class="payment-complete-info">
        <p>주문번호: <strong>${order.id}</strong></p>
        <p>결제금액: <strong>${formatPrice(totalPrice)}</strong></p>
        <p>구매한 강의 ${order.items.length}개가<br>내 강의에 추가되었습니다.</p>
      </div>
    `,
  className: "payment-complete-modal",
  buttons: [
   {
    text: "주문 내역 보기",
    primary: false,
    action: () => {
     closeModal();
     window.location.href = "orders.html";
    },
   },
   {
    text: "학습 시작하기",
    primary: true,
    action: () => {
     closeModal();
     window.location.href = "dashboard.html";
    },
   },
  ],
 });
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 결제 페이지를 초기화합니다.
 */
export function initCheckoutPage() {
 // 로그인 확인
 currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html?redirect=checkout.html";
  return;
 }

 // 데이터 로드
 loadOrderData();

 // 장바구니가 비어있으면 리다이렉트
 if (orderItems.length === 0) {
  window.location.href = "cart.html";
  return;
 }

 // 렌더링
 renderOrderItems();
 renderCheckoutSummary();

 // 이벤트 설정
 setupTermsAgreement();
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initCheckoutPage,
};
