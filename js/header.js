/**
 * header.js
 * - 공통 헤더: 로그인 상태, 검색 드롭다운, 사용자 드롭다운
 * - 모든 페이지에서 공통 사용
 */

let userDropdownHandler = null;

// 로그인 상태 확인 및 UI 업데이트
function updateAuthUI() {
 const currentUser = getCurrentUser();
 const loginBtn = document.getElementById("loginBtn");
 const userProfileWrapper = document.getElementById("userProfileWrapper");
 const userName = document.getElementById("userName");

 if (currentUser) {
  if (loginBtn) loginBtn.style.display = "none";
  if (userProfileWrapper) {
   userProfileWrapper.style.display = "block";
   if (userName) userName.textContent = `${currentUser.name} 님`;
  }
 } else {
  if (loginBtn) loginBtn.style.display = "block";
  if (userProfileWrapper) userProfileWrapper.style.display = "none";
 }

 initUserDropdown();
}

// 로그아웃
function handleLogout() {
 setCurrentUser(null);
 updateAuthUI();
 showToast("로그아웃되었습니다.");
 window.location.href = "index.html";
}

// 검색 기능 (최근 검색어 드롭다운 포함)
function handleSearch() {
 const searchInput = document.getElementById("searchInput");
 const searchDropdown = document.getElementById("searchDropdown");
 const recentSearches = document.getElementById("recentSearches");
 const clearSearch = document.getElementById("clearSearch");

 if (!searchInput) return;

 function getRecentSearches() {
  try {
   return JSON.parse(localStorage.getItem("recentSearches")) || [];
  } catch {
   return [];
  }
 }

 function saveRecentSearch(query) {
  let recent = getRecentSearches();
  recent = recent.filter((q) => q !== query);
  recent.unshift(query);
  recent = recent.slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(recent));
 }

 function renderRecentSearches() {
  if (!recentSearches) return;
  const recent = getRecentSearches();
  if (recent.length === 0) {
   recentSearches.innerHTML = "";
   return;
  }
  recentSearches.innerHTML = recent
   .map(
    (q) =>
     `<div class="recent-search-tag">
            <span data-query="${escapeHtml(q)}">${escapeHtml(q)}</span>
            <button class="remove-btn" type="button" data-query="${escapeHtml(
             q
            )}">×</button>
          </div>`
   )
   .join("");

  recentSearches.querySelectorAll("[data-query]").forEach((el) => {
   el.addEventListener("click", (e) => {
    if (el.classList.contains("remove-btn")) {
     const q = el.getAttribute("data-query");
     let recent = getRecentSearches().filter((r) => r !== q);
     localStorage.setItem("recentSearches", JSON.stringify(recent));
     renderRecentSearches();
    } else {
     performSearch(el.getAttribute("data-query"));
    }
   });
  });
 }

 function performSearch(query) {
  if (query) {
   saveRecentSearch(query);
   window.location.href = `courses.html?query=${encodeURIComponent(query)}`;
  }
 }

 window.performSearch = performSearch;

 searchInput.addEventListener("focus", () => {
  if (searchDropdown) {
   searchDropdown.style.display = "block";
   renderRecentSearches();
  }
 });

 searchInput.addEventListener("blur", () => {
  setTimeout(() => {
   if (searchDropdown && !searchDropdown.contains(document.activeElement)) {
    searchDropdown.style.display = "none";
   }
  }, 200);
 });

 searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
   const query = searchInput.value.trim();
   if (query) performSearch(query);
  }
 });

 if (clearSearch) {
  clearSearch.addEventListener("click", () => {
   localStorage.removeItem("recentSearches");
   renderRecentSearches();
  });
 }
}

// 사용자 드롭다운
function initUserDropdown() {
 const userProfileBtn = document.getElementById("userProfileBtn");
 const userDropdown = document.getElementById("userDropdown");
 const logoutLink = document.getElementById("logoutLink");

 if (userDropdownHandler && userProfileBtn) {
  userProfileBtn.removeEventListener("click", userDropdownHandler);
 }

 if (userProfileBtn && userDropdown) {
  userDropdownHandler = function (e) {
   e.stopPropagation();
   userDropdown.style.display =
    userDropdown.style.display === "block" ? "none" : "block";
  };
  userProfileBtn.addEventListener("click", userDropdownHandler);
 }

 if (!window._userDropdownGlobalBound) {
  window._userDropdownGlobalBound = true;
  document.addEventListener("click", (e) => {
   const btn = document.getElementById("userProfileBtn");
   const dd = document.getElementById("userDropdown");
   if (btn && dd && !btn.contains(e.target) && !dd.contains(e.target)) {
    dd.style.display = "none";
   }
  });
 }

 if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
   e.preventDefault();
   handleLogout();
  });
 }
}
