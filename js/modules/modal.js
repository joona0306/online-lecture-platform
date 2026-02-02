/**
 * modal.js - 모달 관련 유틸리티 모듈
 *
 * 이 모듈은 공용 모달 기능을 제공합니다:
 * - 준비 중인 페이지 모달
 * - 임시 링크(href="#") 자동 처리
 * - 확인 모달
 *
 * @module modules/modal
 */

// ============================================================================
// 모달 상태 관리
// ============================================================================

/** @type {HTMLElement|null} 현재 표시 중인 모달 */
let currentModal = null;

// ============================================================================
// 모달 스타일 (동적 삽입)
// ============================================================================

/**
 * 모달 스타일을 문서에 삽입합니다.
 * 이미 삽입되어 있으면 스킵합니다.
 */
function ensureModalStyles() {
 if (document.getElementById("modal-styles")) return;

 const styles = document.createElement("style");
 styles.id = "modal-styles";
 styles.textContent = `
    /* 모달 오버레이 */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .modal-overlay.show {
      opacity: 1;
    }

    /* 모달 컨테이너 */
    .modal-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      transform: scale(0.9);
      transition: transform 0.2s ease;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .modal-overlay.show .modal-container {
      transform: scale(1);
    }

    /* 모달 아이콘 */
    .modal-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    /* 모달 제목 */
    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    /* 모달 메시지 */
    .modal-message {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    /* 모달 버튼 그룹 */
    .modal-buttons {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .modal-buttons .btn {
      min-width: 100px;
    }

    /* 준비 중 페이지 특수 스타일 */
    .modal-coming-soon .modal-icon {
      color: #f59e0b;
    }
  `;

 document.head.appendChild(styles);
}

// ============================================================================
// 모달 표시/숨김 함수
// ============================================================================

/**
 * 모달을 표시합니다.
 *
 * @param {Object} options - 모달 옵션
 * @param {string} options.icon - 표시할 아이콘 (이모지)
 * @param {string} options.title - 모달 제목
 * @param {string} options.message - 모달 메시지
 * @param {Array<Object>} options.buttons - 버튼 배열
 * @param {string} options.className - 추가 CSS 클래스
 * @returns {HTMLElement} 모달 엘리먼트
 */
export function showModal(options) {
 // 기존 모달이 있으면 닫기
 if (currentModal) {
  closeModal();
 }

 // 스타일 삽입
 ensureModalStyles();

 const {
  icon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  title = "알림",
  message = "",
  buttons = [{ text: "확인", primary: true, action: closeModal }],
  className = "",
 } = options;

 // 모달 HTML 생성
 const overlay = document.createElement("div");
 overlay.className = `modal-overlay ${className}`;
 overlay.innerHTML = `
    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-icon">${icon}</div>
      <h2 class="modal-title" id="modal-title">${title}</h2>
      <p class="modal-message">${message}</p>
      <div class="modal-buttons">
        ${buttons
         .map(
          (btn, idx) => `
          <button 
            class="btn ${btn.primary ? "btn-primary" : "btn-secondary"}" 
            data-action="${idx}"
          >
            ${btn.text}
          </button>
        `
         )
         .join("")}
      </div>
    </div>
  `;

 // 버튼 이벤트 설정
 overlay.querySelectorAll("[data-action]").forEach((btn, idx) => {
  btn.addEventListener("click", () => {
   if (buttons[idx]?.action) {
    buttons[idx].action();
   } else {
    closeModal();
   }
  });
 });

 // 오버레이 클릭 시 닫기
 overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
   closeModal();
  }
 });

 // ESC 키로 닫기
 const handleKeydown = (e) => {
  if (e.key === "Escape") {
   closeModal();
   document.removeEventListener("keydown", handleKeydown);
  }
 };
 document.addEventListener("keydown", handleKeydown);

 // DOM에 추가
 document.body.appendChild(overlay);
 currentModal = overlay;

 // 애니메이션을 위한 지연
 requestAnimationFrame(() => {
  overlay.classList.add("show");
 });

 // 포커스 이동
 const firstButton = overlay.querySelector("button");
 if (firstButton) {
  firstButton.focus();
 }

 return overlay;
}

/**
 * 현재 표시 중인 모달을 닫습니다.
 */
export function closeModal() {
 if (!currentModal) return;

 // 로컬 변수에 참조 저장 (새 모달이 열려도 이전 모달만 제거되도록)
 const modalToClose = currentModal;
 currentModal = null;

 modalToClose.classList.remove("show");

 // 애니메이션 후 제거
 setTimeout(() => {
  if (modalToClose && modalToClose.parentNode) {
   modalToClose.parentNode.removeChild(modalToClose);
  }
 }, 200);
}

// ============================================================================
// 특수 모달 함수
// ============================================================================

/**
 * "준비 중인 페이지" 모달을 표시합니다.
 *
 * @param {string} redirectUrl - 리다이렉트 버튼 클릭 시 이동할 URL (기본값: 메인 페이지)
 */
export function showComingSoonModal(redirectUrl = "index.html") {
 showModal({
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-warning)"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  title: "준비 중인 페이지입니다",
  message: "해당 기능은 현재 개발 중입니다.<br>빠른 시일 내에 서비스를 제공해 드리겠습니다.",
  className: "modal-coming-soon",
  buttons: [
   {
    text: "메인으로",
    primary: false,
    action: () => {
     closeModal();
     window.location.href = redirectUrl;
    },
   },
   {
    text: "닫기",
    primary: true,
    action: closeModal,
   },
  ],
 });
}

/**
 * 확인 모달을 표시합니다.
 *
 * @param {string} title - 모달 제목
 * @param {string} message - 모달 메시지
 * @param {Function} onConfirm - 확인 버튼 클릭 시 실행할 함수
 * @param {Function} onCancel - 취소 버튼 클릭 시 실행할 함수 (선택)
 */
export function showConfirmModal(title, message, onConfirm, onCancel = null) {
 showModal({
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  title,
  message,
  buttons: [
   {
    text: "취소",
    primary: false,
    action: () => {
     closeModal();
     if (onCancel) onCancel();
    },
   },
   {
    text: "확인",
    primary: true,
    action: () => {
     closeModal();
     if (onConfirm) onConfirm();
    },
   },
  ],
 });
}

// ============================================================================
// 임시 링크 자동 처리
// ============================================================================

/**
 * 페이지 내 모든 임시 링크(href="#" 또는 빈 href)를 자동으로 처리합니다.
 * 클릭 시 "준비 중인 페이지" 모달을 표시합니다.
 *
 * @param {string} selector - 대상 링크 선택자 (기본값: 'a[href="#"]')
 */
export function setupPlaceholderLinks(selector = 'a[href="#"]') {
 // 임시 링크 클릭 이벤트 위임
 document.addEventListener("click", (e) => {
  const link = e.target.closest(selector);

  if (link) {
   // 로그아웃 링크는 제외 (별도 처리됨)
   if (link.id === "logoutLink") {
    return;
   }

   e.preventDefault();
   showComingSoonModal();
  }
 });
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 showModal,
 closeModal,
 showComingSoonModal,
 showConfirmModal,
 setupPlaceholderLinks,
};
