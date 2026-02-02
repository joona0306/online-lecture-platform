/**
 * utils.js - 공용 유틸리티 함수 모듈
 * 
 * 이 모듈은 여러 페이지에서 공통으로 사용되는 유틸리티 함수들을 제공합니다.
 * 포맷팅, 변환, UI 헬퍼 함수 등이 포함되어 있습니다.
 * 
 * @module utils
 */

// ============================================================================
// 가격 포맷팅 함수
// ============================================================================

/**
 * 숫자 가격을 한국 원화 형식 문자열로 변환합니다.
 * 0원인 경우 "무료"를 반환합니다.
 * 
 * @param {number} price - 변환할 가격 (원)
 * @returns {string} 포맷된 가격 문자열
 * @example
 * formatPrice(49000);  // "₩49,000"
 * formatPrice(0);      // "무료"
 */
export function formatPrice(price) {
  if (price === 0) {
    return '무료';
  }
  return `₩${price.toLocaleString('ko-KR')}`;
}

// ============================================================================
// 날짜 포맷팅 함수
// ============================================================================

/**
 * ISO 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환합니다.
 * 
 * @param {string} dateString - ISO 형식의 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 * @example
 * formatDate("2024-01-15T10:30:00");  // "2024.01.15"
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 날짜를 상대적인 시간 문자열로 변환합니다.
 * 예: "오늘", "어제", "3일 전", "2주 전", "1개월 전"
 * 
 * @param {string} dateString - ISO 형식의 날짜 문자열
 * @returns {string} 상대적 시간 문자열
 * @example
 * formatRelativeTime("2024-01-14T10:00:00");  // "어제" (오늘이 2024-01-15인 경우)
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // 밀리초를 일수로 변환
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

// ============================================================================
// 시간/재생 시간 포맷팅 함수
// ============================================================================

/**
 * 초 단위 시간을 "X시간 Y분" 형식으로 변환합니다.
 * 1시간 미만인 경우 "Y분" 형식으로 반환합니다.
 * 
 * @param {number} seconds - 변환할 시간 (초)
 * @returns {string} 포맷된 시간 문자열
 * @example
 * formatDuration(3661);  // "1시간 1분"
 * formatDuration(1800);  // "30분"
 * formatDuration(90);    // "1분"
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
}

/**
 * 초 단위 시간을 "MM:SS" 또는 "HH:MM:SS" 형식으로 변환합니다.
 * 
 * @param {number} seconds - 변환할 시간 (초)
 * @returns {string} 포맷된 시간 문자열
 * @example
 * formatVideoTime(125);   // "02:05"
 * formatVideoTime(3661);  // "01:01:01"
 */
export function formatVideoTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ============================================================================
// 문자열 처리 함수
// ============================================================================

/**
 * 문자열의 HTML 특수문자를 이스케이프하여 XSS 공격을 방지합니다.
 * 
 * @param {string} text - 이스케이프할 문자열
 * @returns {string} 이스케이프된 문자열
 * @example
 * escapeHtml('<script>alert("xss")</script>');
 * // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') {
    return text;
  }
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 긴 문자열을 지정된 길이로 자르고 말줄임표를 추가합니다.
 * 
 * @param {string} text - 자를 문자열
 * @param {number} maxLength - 최대 길이
 * @returns {string} 잘린 문자열
 * @example
 * truncateText("이것은 긴 문자열입니다", 10);  // "이것은 긴 문..."
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

// ============================================================================
// 별점 렌더링 함수
// ============================================================================

/**
 * 평점을 별 아이콘 HTML 문자열로 변환합니다.
 * 꽉 찬 별, 반 별, 빈 별로 총 5개의 별을 렌더링합니다.
 * 
 * @param {number} rating - 평점 (0-5)
 * @returns {string} 별 아이콘 HTML 문자열
 * @example
 * renderStars(4.5);  // "★★★★★" (4개 채워진 별 + 1개 반 별)
 */
export function renderStars(rating) {
  const fullStars = Math.floor(rating);      // 꽉 찬 별 개수
  const hasHalfStar = rating % 1 >= 0.5;     // 반 별 여부
  let html = '';

  // 꽉 찬 별 추가
  for (let i = 0; i < fullStars; i++) {
    html += '<span class="star filled">★</span>';
  }

  // 반 별 추가
  if (hasHalfStar) {
    html += '<span class="star half">★</span>';
  }

  // 빈 별 추가 (총 5개가 되도록)
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    html += '<span class="star">★</span>';
  }

  return html;
}

// ============================================================================
// 카테고리/난이도 변환 함수
// ============================================================================

/**
 * 카테고리 영문 코드를 한글명으로 변환합니다.
 * 
 * @param {string} category - 카테고리 코드
 * @returns {string} 카테고리 한글명
 * @example
 * getCategoryName('programming');  // "프로그래밍"
 * getCategoryName('design');       // "디자인"
 */
export function getCategoryName(category) {
  const categoryMap = {
    programming: '프로그래밍',
    design: '디자인',
    marketing: '마케팅',
    others: '기타'
  };
  return categoryMap[category] || category;
}

/**
 * 난이도 영문 코드를 한글명으로 변환합니다.
 * 
 * @param {string} level - 난이도 코드
 * @returns {string} 난이도 한글명
 * @example
 * getLevelName('beginner');      // "초급"
 * getLevelName('intermediate');  // "중급"
 * getLevelName('advanced');      // "고급"
 */
export function getLevelName(level) {
  const levelMap = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급'
  };
  return levelMap[level] || level;
}

// ============================================================================
// URL 파라미터 관련 함수
// ============================================================================

/**
 * URL 쿼리 파라미터 값을 가져옵니다.
 * 
 * @param {string} name - 파라미터 이름
 * @returns {string|null} 파라미터 값 또는 null
 * @example
 * // URL: /courses.html?category=programming&query=react
 * getQueryParam('category');  // "programming"
 * getQueryParam('query');     // "react"
 * getQueryParam('foo');       // null
 */
export function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * URL 쿼리 파라미터를 설정합니다.
 * 값이 없거나 null이면 해당 파라미터를 삭제합니다.
 * 
 * @param {string} name - 파라미터 이름
 * @param {string|null} value - 파라미터 값 (null이면 삭제)
 * @example
 * setQueryParam('category', 'design');  // URL에 ?category=design 추가
 * setQueryParam('category', null);       // category 파라미터 삭제
 */
export function setQueryParam(name, value) {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (value) {
    urlParams.set(name, value);
  } else {
    urlParams.delete(name);
  }
  
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

// ============================================================================
// UI 헬퍼 함수
// ============================================================================

/**
 * 토스트 메시지를 화면에 표시합니다.
 * 3초 후 자동으로 사라집니다.
 * 
 * @param {string} message - 표시할 메시지
 * @param {string} type - 토스트 타입 ('success', 'error', 'warning', 'info')
 * @example
 * showToast('저장되었습니다!');                    // 성공 토스트
 * showToast('오류가 발생했습니다.', 'error');      // 에러 토스트
 */
export function showToast(message, type = 'success') {
  // 토스트 엘리먼트 생성
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(toast);

  // 애니메이션을 위해 약간의 지연 후 show 클래스 추가
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // 3초 후 토스트 제거
  setTimeout(() => {
    toast.classList.remove('show');
    
    // 애니메이션 완료 후 DOM에서 제거
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * 로딩 스피너를 표시합니다.
 * 
 * @param {HTMLElement} element - 로딩을 표시할 컨테이너 엘리먼트
 * @example
 * const container = document.getElementById('content');
 * showLoading(container);  // 컨테이너 안에 로딩 스피너 표시
 */
export function showLoading(element) {
  if (element) {
    element.innerHTML = `
      <div class="loading-spinner" role="status" aria-label="로딩 중">
        <div class="spinner"></div>
      </div>
    `;
  }
}

/**
 * 빈 상태 메시지를 표시합니다.
 * 
 * @param {HTMLElement} element - 메시지를 표시할 컨테이너 엘리먼트
 * @param {string} message - 표시할 메시지
 * @example
 * const container = document.getElementById('courses');
 * showEmptyState(container, '조건에 맞는 강의가 없습니다.');
 */
export function showEmptyState(element, message) {
  if (element) {
    element.innerHTML = `
      <div class="empty-state" role="status">
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }
}

// ============================================================================
// 유효성 검사 함수
// ============================================================================

/**
 * 이메일 형식이 올바른지 검사합니다.
 * 
 * @param {string} email - 검사할 이메일 주소
 * @returns {boolean} 유효한 이메일 형식이면 true
 * @example
 * validateEmail('test@example.com');   // true
 * validateEmail('invalid-email');       // false
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호가 요구사항을 충족하는지 검사합니다.
 * 최소 4자 이상이어야 합니다.
 * 
 * @param {string} password - 검사할 비밀번호
 * @returns {boolean} 유효한 비밀번호면 true
 */
export function validatePassword(password) {
  return password && password.length >= 4;
}

// ============================================================================
// 디바운스/쓰로틀 함수
// ============================================================================

/**
 * 함수 호출을 디바운스합니다.
 * 지정된 지연 시간 동안 추가 호출이 없을 때만 함수를 실행합니다.
 * 
 * @param {Function} func - 디바운스할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Function} 디바운스된 함수
 * @example
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching:', query);
 * }, 300);
 * 
 * // 빠르게 연속 호출해도 마지막 호출 후 300ms 후에 한 번만 실행
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc');  // 이것만 실행됨
 */
export function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    // 이전 타이머 취소
    clearTimeout(timeoutId);
    
    // 새 타이머 설정
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 함수 호출을 쓰로틀합니다.
 * 지정된 시간 간격으로만 함수를 실행합니다.
 * 
 * @param {Function} func - 쓰로틀할 함수
 * @param {number} limit - 실행 간격 (밀리초)
 * @returns {Function} 쓰로틀된 함수
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
