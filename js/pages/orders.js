/**
 * orders.js - 거래 내역 페이지 (orders.html) 모듈
 *
 * 이 모듈은 거래 내역 페이지의 기능을 담당합니다:
 * - 주문 내역 표시
 * - 환불 처리
 *
 * @module pages/orders
 */

import {
 getCurrentUser,
 getOrdersByUser,
 getEnrollment,
 refundOrderItem,
 getCourseById,
} from "../modules/storage.js";
import { formatPrice, formatDate, escapeHtml, showToast } from "../modules/utils.js";
import { showConfirmModal } from "../modules/modal.js";

// ============================================================================
// 상태 관리
// ============================================================================

/** @type {Object|null} 현재 로그인 사용자 */
let currentUser = null;

/** @type {Array} 주문 내역 */
let orders = [];

// ============================================================================
// 데이터 로드 함수
// ============================================================================

/**
 * 주문 내역 데이터를 로드합니다.
 */
function loadOrdersData() {
 orders = getOrdersByUser(currentUser.id).sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
 );
}

// ============================================================================
// 렌더링 함수
// ============================================================================

/**
 * 주문 내역 목록을 렌더링합니다.
 */
function renderOrders() {
 const container = document.getElementById("ordersList");
 if (!container) return;

 if (orders.length === 0) {
  container.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <h2>거래 내역이 없습니다</h2>
        <p>강의를 구매하면 여기에 표시됩니다.</p>
        <a href="courses.html" class="btn btn-primary">강의 둘러보기</a>
      </div>
    `;
  return;
 }

 container.innerHTML = orders.map((order) => renderOrder(order)).join("");

 // 환불 버튼 이벤트 설정
 container.querySelectorAll(".refund-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
   const orderId = e.target.dataset.orderId;
   const courseId = parseInt(e.target.dataset.courseId);
   const courseTitle = e.target.dataset.courseTitle;
   handleRefundClick(orderId, courseId, courseTitle);
  });
 });
}

/**
 * 주문 하나를 렌더링합니다.
 *
 * @param {Object} order - 주문 객체
 * @returns {string} HTML 문자열
 */
function renderOrder(order) {
 const statusText = getStatusText(order.status);
 const statusClass = getStatusClass(order.status);

 return `
    <div class="order-card">
      <div class="order-header">
        <div class="order-info">
          <span class="order-id">주문번호: ${order.id}</span>
          <span class="order-date">${formatDate(order.createdAt)}</span>
        </div>
        <span class="order-status ${statusClass}">${statusText}</span>
      </div>
      
      <div class="order-items">
        ${order.items.map((item) => renderOrderItem(order, item)).join("")}
      </div>
      
      <div class="order-footer">
        <div class="order-payment">
          <span class="payment-method">${getPaymentMethodText(order.paymentMethod)}</span>
        </div>
        <div class="order-total">
          <span>총 결제금액</span>
          <span class="total-amount">${formatPrice(calculateOrderTotal(order))}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 주문 아이템 하나를 렌더링합니다.
 *
 * @param {Object} order - 주문 객체
 * @param {Object} item - 주문 아이템
 * @returns {string} HTML 문자열
 */
function renderOrderItem(order, item) {
 const course = getCourseById(item.courseId);
 const thumbnail = course?.thumbnail || "https://picsum.photos/100/60";

 // 환불 가능 여부 확인
 const canRefund = !item.refunded && canRefundItem(item.courseId);

 // 환불된 경우
 if (item.refunded) {
  return `
      <div class="order-item refunded">
        <div class="order-item-thumbnail">
          <img src="${thumbnail}" alt="${escapeHtml(item.title)}" />
        </div>
        <div class="order-item-info">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="refund-badge">환불됨</span>
          <span class="refund-date">${formatDate(item.refundedAt)}</span>
        </div>
        <div class="order-item-price refunded">
          <span class="original-price">${formatPrice(item.price)}</span>
          <span class="refund-amount">-${formatPrice(item.price)}</span>
        </div>
      </div>
    `;
 }

 return `
    <div class="order-item">
      <div class="order-item-thumbnail">
        <img src="${thumbnail}" alt="${escapeHtml(item.title)}" />
      </div>
      <div class="order-item-info">
        <h3>
          <a href="course-detail.html?id=${item.courseId}">${escapeHtml(item.title)}</a>
        </h3>
        ${
         canRefund
          ? `
          <button class="btn btn-sm btn-danger refund-btn" 
                  data-order-id="${order.id}" 
                  data-course-id="${item.courseId}"
                  data-course-title="${escapeHtml(item.title)}">
            환불 요청
          </button>
        `
          : `
          <span class="no-refund-notice">수강 시작으로 환불 불가</span>
        `
        }
      </div>
      <div class="order-item-price">
        ${formatPrice(item.price)}
      </div>
    </div>
  `;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 주문 상태 텍스트를 반환합니다.
 *
 * @param {string} status - 주문 상태
 * @returns {string} 상태 텍스트
 */
function getStatusText(status) {
 const statusMap = {
  pending: "결제 대기",
  completed: "결제 완료",
  cancelled: "주문 취소",
  refunded: "전체 환불",
 };
 return statusMap[status] || status;
}

/**
 * 주문 상태 CSS 클래스를 반환합니다.
 *
 * @param {string} status - 주문 상태
 * @returns {string} CSS 클래스
 */
function getStatusClass(status) {
 const classMap = {
  pending: "status-pending",
  completed: "status-completed",
  cancelled: "status-cancelled",
  refunded: "status-refunded",
 };
 return classMap[status] || "";
}

/**
 * 결제 수단 텍스트를 반환합니다.
 *
 * @param {string} method - 결제 수단
 * @returns {string} 결제 수단 텍스트
 */
function getPaymentMethodText(method) {
 const methodMap = {
  card: "신용/체크카드",
  bank: "계좌이체",
  phone: "휴대폰 결제",
  kakao: "카카오페이",
 };
 return methodMap[method] || method;
}

/**
 * 주문 총액을 계산합니다 (환불 제외).
 *
 * @param {Object} order - 주문 객체
 * @returns {number} 총액
 */
function calculateOrderTotal(order) {
 return order.items.filter((item) => !item.refunded).reduce((sum, item) => sum + item.price, 0);
}

/**
 * 아이템이 환불 가능한지 확인합니다.
 * 수강을 시작하지 않은 경우에만 환불 가능.
 *
 * @param {number} courseId - 강의 ID
 * @returns {boolean} 환불 가능 여부
 */
function canRefundItem(courseId) {
 const enrollment = getEnrollment(currentUser.id, courseId);
 // 수강 정보가 없거나 진행률이 0%인 경우에만 환불 가능
 return !enrollment || enrollment.progress === 0;
}

// ============================================================================
// 이벤트 핸들러
// ============================================================================

/**
 * 환불 버튼 클릭을 처리합니다.
 *
 * @param {string} orderId - 주문 ID
 * @param {number} courseId - 강의 ID
 * @param {string} courseTitle - 강의 제목
 */
function handleRefundClick(orderId, courseId, courseTitle) {
 showConfirmModal(
  "환불 요청",
  `"${courseTitle}" 강의를 환불하시겠습니까?<br><br>
     <small style="color: #666;">환불 금액은 즉시 처리됩니다.</small>`,
  () => processRefund(orderId, courseId)
 );
}

/**
 * 환불을 처리합니다.
 *
 * @param {string} orderId - 주문 ID
 * @param {number} courseId - 강의 ID
 */
function processRefund(orderId, courseId) {
 const result = refundOrderItem(orderId, courseId, currentUser.id);

 if (result.success) {
  showToast(`환불이 완료되었습니다. (${formatPrice(result.refundAmount)})`);
  // 데이터 새로고침
  loadOrdersData();
  renderOrders();
 } else {
  showToast(result.message, "error");
 }
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 거래 내역 페이지를 초기화합니다.
 */
export function initOrdersPage() {
 // 로그인 확인
 currentUser = getCurrentUser();

 if (!currentUser) {
  alert("로그인이 필요합니다.");
  window.location.href = "login.html?redirect=orders.html";
  return;
 }

 // 데이터 로드
 loadOrdersData();

 // 렌더링
 renderOrders();
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initOrdersPage,
};
