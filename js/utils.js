/**
 * utils.js
 * - 공용 유틸리티 함수
 */

// 가격 포맷팅
function formatPrice(price) {
 if (price === 0) {
  return "무료";
 }
 return `₩${price.toLocaleString()}`;
}

// 날짜 포맷팅
function formatDate(dateString) {
 const date = new Date(dateString);
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, "0");
 const day = String(date.getDate()).padStart(2, "0");
 return `${year}.${month}.${day}`;
}

// 상대 시간 포맷팅 (예: "3일 전")
function formatRelativeTime(dateString) {
 const date = new Date(dateString);
 const now = new Date();
 const diff = now - date;
 const days = Math.floor(diff / (1000 * 60 * 60 * 24));

 if (days === 0) return "오늘";
 if (days === 1) return "어제";
 if (days < 7) return `${days}일 전`;
 if (days < 30) return `${Math.floor(days / 7)}주 전`;
 if (days < 365) return `${Math.floor(days / 30)}개월 전`;
 return `${Math.floor(days / 365)}년 전`;
}

// 시간 포맷팅 (초 → "1시간 30분")
function formatDuration(seconds) {
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);

 if (hours > 0) {
  return `${hours}시간 ${minutes}분`;
 }
 return `${minutes}분`;
}

// 텍스트 이스케이프 (XSS 방지)
function escapeHtml(text) {
 const div = document.createElement("div");
 div.textContent = text;
 return div.innerHTML;
}

// 별점 표시 HTML 생성
function renderStars(rating) {
 const fullStars = Math.floor(rating);
 const hasHalfStar = rating % 1 >= 0.5;
 let html = "";

 for (let i = 0; i < fullStars; i++) {
  html += '<span class="star filled">★</span>';
 }

 if (hasHalfStar) {
  html += '<span class="star half">★</span>';
 }

 const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
 for (let i = 0; i < emptyStars; i++) {
  html += '<span class="star">★</span>';
 }

 return html;
}

// 카테고리 한글명 변환
function getCategoryName(category) {
 const categoryMap = {
  programming: "프로그래밍",
  design: "디자인",
  marketing: "마케팅",
  others: "기타",
 };
 return categoryMap[category] || category;
}

// 난이도 한글명 변환
function getLevelName(level) {
 const levelMap = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
 };
 return levelMap[level] || level;
}

// URL 쿼리 파라미터 가져오기
function getQueryParam(name) {
 const urlParams = new URLSearchParams(window.location.search);
 return urlParams.get(name);
}

// URL 쿼리 파라미터 설정
function setQueryParam(name, value) {
 const urlParams = new URLSearchParams(window.location.search);
 if (value) {
  urlParams.set(name, value);
 } else {
  urlParams.delete(name);
 }
 window.history.replaceState(
  {},
  "",
  `${window.location.pathname}?${urlParams.toString()}`
 );
}

// 토스트 메시지 표시
function showToast(message, type = "success") {
 const toast = document.createElement("div");
 toast.className = `toast toast-${type}`;
 toast.textContent = message;
 document.body.appendChild(toast);

 setTimeout(() => {
  toast.classList.add("show");
 }, 10);

 setTimeout(() => {
  toast.classList.remove("show");
  setTimeout(() => {
   document.body.removeChild(toast);
  }, 300);
 }, 3000);
}

// 로딩 스피너 표시
function showLoading(element) {
 if (element) {
  element.innerHTML =
   '<div class="loading-spinner"><div class="spinner"></div></div>';
 }
}

// 빈 상태 메시지 표시
function showEmptyState(element, message) {
 if (element) {
  element.innerHTML = `<div class="empty-state"><p>${message}</p></div>`;
 }
}
