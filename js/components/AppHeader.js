/**
 * AppHeader.js - 공통 헤더 웹 컴포넌트
 *
 * 이 컴포넌트는 모든 페이지에서 공통으로 사용되는 헤더를 제공합니다.
 * 로고, 검색창, 사용자 메뉴를 포함합니다.
 *
 * 사용 방법:
 * <app-header></app-header>
 *
 * 속성:
 * - show-search: 검색창 표시 여부 (기본값: true)
 * - show-auth-link: 인증 버튼 타입 ('login' | 'signup' | 'both' | 'none')
 *
 * @module components/AppHeader
 */

import {
 getCurrentUser,
 setCurrentUser,
 getRecentSearches,
 addRecentSearch,
 removeRecentSearch,
 clearRecentSearches,
 getCartCount,
} from "../modules/storage.js";
import { escapeHtml, showToast } from "../modules/utils.js";

// ============================================================================
// AppHeader 웹 컴포넌트 클래스
// ============================================================================

/**
 * 공통 헤더 웹 컴포넌트
 * Shadow DOM을 사용하지 않아 외부 CSS와 호환됩니다.
 */
class AppHeader extends HTMLElement {
 /**
  * 컴포넌트 생성자
  * 초기 상태를 설정합니다.
  */
 constructor() {
  super();

  // 상태 관리
  this._currentUser = null;
  this._isDropdownOpen = false;
  this._isUserDropdownOpen = false;

  // 이벤트 핸들러 바인딩 (이벤트 제거 시 참조 유지를 위해)
  this._handleDocumentClick = this._handleDocumentClick.bind(this);
 }

 // ==========================================================================
 // 라이프사이클 메서드
 // ==========================================================================

 /**
  * 컴포넌트가 DOM에 연결될 때 호출됩니다.
  * 초기 렌더링과 이벤트 리스너 설정을 수행합니다.
  */
 connectedCallback() {
  this._currentUser = getCurrentUser();
  this.render();
  this._setupEventListeners();
 }

 /**
  * 컴포넌트가 DOM에서 제거될 때 호출됩니다.
  * 이벤트 리스너를 정리합니다.
  */
 disconnectedCallback() {
  document.removeEventListener("click", this._handleDocumentClick);
 }

 /**
  * 관찰할 속성 목록을 반환합니다.
  * 이 속성들이 변경되면 attributeChangedCallback이 호출됩니다.
  */
 static get observedAttributes() {
  return ["show-search", "show-auth-link"];
 }

 /**
  * 관찰 중인 속성이 변경될 때 호출됩니다.
  */
 attributeChangedCallback(name, oldValue, newValue) {
  if (oldValue !== newValue) {
   this.render();
  }
 }

 // ==========================================================================
 // 렌더링 메서드
 // ==========================================================================

 /**
  * 컴포넌트의 HTML을 렌더링합니다.
  */
 render() {
  const showSearch = this.getAttribute("show-search") !== "false";
  const authLinkType = this.getAttribute("show-auth-link") || "default";

  this.innerHTML = `
      <header class="header">
        <div class="container">
          <div class="header-content">
            ${this._renderLogo()}
            ${showSearch ? this._renderSearchBox() : '<div class="header-center"></div>'}
            ${this._renderActions(authLinkType)}
          </div>
        </div>
      </header>
    `;
 }

 /**
  * 로고 영역을 렌더링합니다.
  * @returns {string} 로고 HTML
  */
 _renderLogo() {
  return `
      <div class="logo">
        <a href="index.html">
          <span class="logo-icon">E</span>
          <span class="logo-text">EduEdu</span>
        </a>
      </div>
    `;
 }

 /**
  * 검색창 영역을 렌더링합니다.
  * @returns {string} 검색창 HTML
  */
 _renderSearchBox() {
  return `
      <div class="header-center">
        <div class="search-box">
          <label class="sr-only" for="searchInput">강의 검색</label>
          <span class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            id="searchInput"
            type="text"
            placeholder="강의를 검색해보세요"
            autocomplete="off"
          />
          <div class="search-dropdown" id="searchDropdown" style="display: none">
            <div class="search-dropdown-header">
              <span>최근 검색어</span>
              <button class="clear-search" id="clearSearch" type="button">전체 삭제</button>
            </div>
            <div class="recent-searches" id="recentSearches"></div>
            <div class="search-dropdown-header">
              <span>추천 검색어</span>
            </div>
            <div class="recommended-searches">
              <a href="courses.html?query=UX/UI 디자인">UX/UI 디자인</a>
              <a href="courses.html?query=웹퍼블리싱">웹퍼블리싱</a>
              <a href="courses.html?query=웹디자인">웹디자인</a>
            </div>
          </div>
        </div>
      </div>
    `;
 }

 /**
  * 액션 버튼 영역(로그인/사용자 메뉴)을 렌더링합니다.
  * @param {string} authLinkType - 표시할 인증 링크 타입
  * @returns {string} 액션 버튼 HTML
  */
 _renderActions(authLinkType) {
  const cartIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
  const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

  // 로그인 상태일 때
  if (this._currentUser) {
   const cartCount = getCartCount(this._currentUser.id);
   const cartBadge = cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : "";

   return `
        <div class="header-actions">
          <a href="cart.html" class="cart-icon-link" title="장바구니">
            <span class="cart-icon">${cartIconSvg}</span>
            ${cartBadge}
          </a>
          <div class="user-menu">
            <div class="user-profile-wrapper" id="userProfileWrapper">
              <button class="user-profile-btn" id="userProfileBtn" type="button">
                <img
                  src="https://picsum.photos/40/40?random=100"
                  alt="프로필"
                  class="user-avatar"
                  id="userAvatar"
                />
                <span id="userName">${escapeHtml(this._currentUser.name)} 님</span>
                <span class="dropdown-icon">${chevronSvg}</span>
              </button>
              <div class="user-dropdown" id="userDropdown" style="display: none">
                <a href="profile.html">마이 페이지</a>
                <a href="dashboard.html">내 강의보기</a>
                <a href="orders.html">거래내역</a>
                <a href="#" id="logoutLink">로그아웃</a>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  // 비로그인 상태일 때 - 인증 링크 타입에 따라 다르게 렌더링
  switch (authLinkType) {
   case "login":
    return `
          <div class="header-actions">
            <a href="signup.html" class="btn btn-ghost">회원가입</a>
          </div>
        `;
   case "signup":
    return `
          <div class="header-actions">
            <a href="login.html" class="btn btn-ghost">로그인</a>
          </div>
        `;
   case "none":
    return '<div class="header-actions"></div>';
   default:
    return `
          <div class="header-actions">
            <a href="cart.html" class="cart-icon-link" title="장바구니">
              <span class="cart-icon">${cartIconSvg}</span>
            </a>
            <div class="user-menu">
              <a href="login.html" class="btn btn-ghost" id="loginBtn">로그인</a>
            </div>
          </div>
        `;
  }
 }

 /**
  * 장바구니 카운트를 업데이트합니다.
  */
 updateCartCount() {
  if (!this._currentUser) return;

  const cartCount = getCartCount(this._currentUser.id);
  const cartLink = this.querySelector(".cart-icon-link");

  if (cartLink) {
   const existingBadge = cartLink.querySelector(".cart-badge");
   if (existingBadge) {
    existingBadge.remove();
   }

   if (cartCount > 0) {
    const badge = document.createElement("span");
    badge.className = "cart-badge";
    badge.textContent = cartCount;
    cartLink.appendChild(badge);
   }
  }
 }

 // ==========================================================================
 // 이벤트 리스너 설정
 // ==========================================================================

 /**
  * 모든 이벤트 리스너를 설정합니다.
  */
 _setupEventListeners() {
  // 검색 기능 설정
  this._setupSearch();

  // 사용자 드롭다운 설정
  this._setupUserDropdown();

  // 문서 전체 클릭 이벤트 (드롭다운 닫기용)
  document.addEventListener("click", this._handleDocumentClick);
 }

 /**
  * 검색 기능 관련 이벤트 리스너를 설정합니다.
  */
 _setupSearch() {
  const searchInput = this.querySelector("#searchInput");
  const searchDropdown = this.querySelector("#searchDropdown");
  const clearSearchBtn = this.querySelector("#clearSearch");

  if (!searchInput) return;

  // 검색창 포커스 시 드롭다운 표시
  searchInput.addEventListener("focus", () => {
   if (searchDropdown) {
    searchDropdown.style.display = "block";
    this._renderRecentSearches();
   }
  });

  // 검색창 블러 시 드롭다운 숨김 (약간의 지연)
  searchInput.addEventListener("blur", () => {
   setTimeout(() => {
    if (searchDropdown && !searchDropdown.contains(document.activeElement)) {
     searchDropdown.style.display = "none";
    }
   }, 200);
  });

  // 엔터 키로 검색
  searchInput.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
     this._performSearch(query);
    }
   }
  });

  // 전체 삭제 버튼
  if (clearSearchBtn) {
   clearSearchBtn.addEventListener("click", () => {
    clearRecentSearches();
    this._renderRecentSearches();
   });
  }
 }

 /**
  * 사용자 드롭다운 관련 이벤트 리스너를 설정합니다.
  */
 _setupUserDropdown() {
  const userProfileBtn = this.querySelector("#userProfileBtn");
  const userDropdown = this.querySelector("#userDropdown");
  const logoutLink = this.querySelector("#logoutLink");

  // 사용자 프로필 버튼 클릭 시 드롭다운 토글
  if (userProfileBtn && userDropdown) {
   userProfileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    this._isUserDropdownOpen = !this._isUserDropdownOpen;
    userDropdown.style.display = this._isUserDropdownOpen ? "block" : "none";
   });
  }

  // 로그아웃 링크 클릭
  if (logoutLink) {
   logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    this._handleLogout();
   });
  }
 }

 /**
  * 문서 클릭 시 드롭다운을 닫습니다.
  * @param {Event} e - 클릭 이벤트
  */
 _handleDocumentClick(e) {
  const userProfileBtn = this.querySelector("#userProfileBtn");
  const userDropdown = this.querySelector("#userDropdown");

  // 드롭다운 외부 클릭 시 닫기
  if (userProfileBtn && userDropdown) {
   if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
    this._isUserDropdownOpen = false;
    userDropdown.style.display = "none";
   }
  }
 }

 // ==========================================================================
 // 검색 관련 메서드
 // ==========================================================================

 /**
  * 최근 검색어 목록을 렌더링합니다.
  */
 _renderRecentSearches() {
  const recentSearchesContainer = this.querySelector("#recentSearches");
  if (!recentSearchesContainer) return;

  const recent = getRecentSearches();

  if (recent.length === 0) {
   recentSearchesContainer.innerHTML = '<p class="no-recent">최근 검색어가 없습니다.</p>';
   return;
  }

  recentSearchesContainer.innerHTML = recent
   .map(
    (query) => `
        <div class="recent-search-tag">
          <span class="search-query" data-query="${escapeHtml(query)}">${escapeHtml(query)}</span>
          <button class="remove-btn" type="button" data-query="${escapeHtml(query)}">×</button>
        </div>
      `
   )
   .join("");

  // 검색어 클릭 이벤트
  recentSearchesContainer.querySelectorAll(".search-query").forEach((el) => {
   el.addEventListener("click", () => {
    this._performSearch(el.dataset.query);
   });
  });

  // 삭제 버튼 클릭 이벤트
  recentSearchesContainer.querySelectorAll(".remove-btn").forEach((btn) => {
   btn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeRecentSearch(btn.dataset.query);
    this._renderRecentSearches();
   });
  });
 }

 /**
  * 검색을 실행합니다.
  * @param {string} query - 검색어
  */
 _performSearch(query) {
  if (query) {
   addRecentSearch(query);
   window.location.href = `courses.html?query=${encodeURIComponent(query)}`;
  }
 }

 // ==========================================================================
 // 인증 관련 메서드
 // ==========================================================================

 /**
  * 로그아웃을 처리합니다.
  */
 _handleLogout() {
  setCurrentUser(null);
  showToast("로그아웃되었습니다.");
  window.location.href = "index.html";
 }

 /**
  * 인증 UI를 업데이트합니다.
  * 외부에서 로그인 상태가 변경되었을 때 호출할 수 있습니다.
  */
 updateAuthUI() {
  this._currentUser = getCurrentUser();
  this.render();
  this._setupEventListeners();
 }
}

// ============================================================================
// 웹 컴포넌트 등록
// ============================================================================

// 커스텀 엘리먼트 등록 (아직 등록되지 않은 경우에만)
if (!customElements.get("app-header")) {
 customElements.define("app-header", AppHeader);
}

export default AppHeader;
