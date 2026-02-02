/**
 * app.js - 애플리케이션 진입점 모듈
 *
 * 이 모듈은 애플리케이션의 메인 진입점입니다.
 * 각 페이지에 필요한 모듈을 로드하고 초기화합니다.
 *
 * 사용 방법:
 * HTML 파일에서 다음과 같이 로드합니다:
 * <script type="module" src="js/app.js" data-page="main"></script>
 *
 * data-page 속성 값:
 * - main: 메인 페이지 (index.html)
 * - courses: 강의 목록 페이지 (courses.html)
 * - course-detail: 강의 상세 페이지 (course-detail.html)
 * - course-player: 강의 플레이어 페이지 (course-player.html)
 * - dashboard: 대시보드 페이지 (dashboard.html)
 * - login: 로그인 페이지 (login.html)
 * - signup: 회원가입 페이지 (signup.html)
 * - profile: 프로필 페이지 (profile.html)
 * - cart: 장바구니 페이지 (cart.html)
 * - checkout: 결제 페이지 (checkout.html)
 * - orders: 거래 내역 페이지 (orders.html)
 *
 * @module app
 */

// ============================================================================
// 컴포넌트 임포트 (자동 등록됨)
// ============================================================================

import "./components/AppHeader.js";
import "./components/AppFooter.js";
import "./components/CourseCard.js";

// ============================================================================
// 모듈 임포트
// ============================================================================

import { initializeData } from "./modules/api.js";
import { setupPlaceholderLinks } from "./modules/modal.js";

// ============================================================================
// 페이지 초기화 함수 맵핑
// ============================================================================

/**
 * 페이지별 초기화 함수를 동적으로 로드하고 실행합니다.
 *
 * @param {string} pageName - 페이지 이름
 */
async function initializePage(pageName) {
 try {
  switch (pageName) {
   case "main": {
    const { initMainPage } = await import("./pages/main.js");
    initMainPage();
    break;
   }

   case "courses": {
    const { initCoursesPage } = await import("./pages/courses.js");
    initCoursesPage();
    break;
   }

   case "course-detail": {
    const { initCourseDetailPage } = await import("./pages/course-detail.js");
    initCourseDetailPage();
    break;
   }

   case "course-player": {
    const { initCoursePlayerPage } = await import("./pages/course-player.js");
    initCoursePlayerPage();
    break;
   }

   case "dashboard": {
    const { initDashboardPage } = await import("./pages/dashboard.js");
    initDashboardPage();
    break;
   }

   case "login":
   case "signup": {
    const { initAuthPage } = await import("./pages/auth.js");
    initAuthPage();
    break;
   }

   case "profile": {
    const { initProfilePage } = await import("./pages/profile.js");
    initProfilePage();
    break;
   }

   case "cart": {
    const { initCartPage } = await import("./pages/cart.js");
    initCartPage();
    break;
   }

   case "checkout": {
    const { initCheckoutPage } = await import("./pages/checkout.js");
    initCheckoutPage();
    break;
   }

   case "orders": {
    const { initOrdersPage } = await import("./pages/orders.js");
    initOrdersPage();
    break;
   }

   default:
    console.warn(`[App] 알 수 없는 페이지: ${pageName}`);
  }
 } catch (error) {
  console.error(`[App] 페이지 초기화 실패 (${pageName}):`, error);
 }
}

// ============================================================================
// 현재 페이지 감지
// ============================================================================

/**
 * 현재 페이지를 자동으로 감지합니다.
 * data-page 속성이 없을 경우 URL 경로에서 페이지 이름을 추출합니다.
 *
 * @returns {string} 페이지 이름
 */
function detectCurrentPage() {
 // data-page 속성에서 페이지 이름 가져오기
 const script = document.querySelector("script[data-page]");
 if (script) {
  return script.dataset.page;
 }

 // URL 경로에서 페이지 이름 추출
 const path = window.location.pathname;
 const filename = path.split("/").pop().replace(".html", "");

 // 파일명을 페이지 이름으로 매핑
 const pageMap = {
  index: "main",
  "": "main",
  courses: "courses",
  "course-detail": "course-detail",
  "course-player": "course-player",
  dashboard: "dashboard",
  login: "login",
  signup: "signup",
  profile: "profile",
  cart: "cart",
  checkout: "checkout",
  orders: "orders",
 };

 return pageMap[filename] || "main";
}

// ============================================================================
// 애플리케이션 초기화
// ============================================================================

/**
 * 애플리케이션을 초기화합니다.
 * DOM 로드 완료 후 실행됩니다.
 */
async function initializeApp() {
 try {
  // 1. 데이터 초기화 (JSON에서 localStorage로 로드)
  await initializeData();

  // 2. 임시 링크(href="#") 처리 설정
  // 클릭 시 "준비 중인 페이지" 모달 표시
  setupPlaceholderLinks();

  // 3. 현재 페이지 감지
  const currentPage = detectCurrentPage();

  // 4. 페이지별 초기화
  await initializePage(currentPage);
 } catch (error) {
  console.error("[App] 초기화 실패:", error);
 }
}

// ============================================================================
// DOM 로드 이벤트 리스너
// ============================================================================

// DOM이 준비되면 애플리케이션 초기화
if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", initializeApp);
} else {
 // DOM이 이미 로드된 경우
 initializeApp();
}

// ============================================================================
// 전역 에러 핸들러
// ============================================================================

// 처리되지 않은 Promise 에러 처리
window.addEventListener("unhandledrejection", (event) => {
 console.error("[App] 처리되지 않은 Promise 에러:", event.reason);
});

// ============================================================================
// 모듈 내보내기 (디버깅용)
// ============================================================================

export { initializeApp, initializePage, detectCurrentPage };
