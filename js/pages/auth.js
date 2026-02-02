/**
 * auth.js - 인증 페이지 (login.html, signup.html) 모듈
 *
 * 이 모듈은 로그인 및 회원가입 페이지의 기능을 담당합니다:
 * - 로그인 폼 유효성 검사 및 처리
 * - 회원가입 폼 유효성 검사 및 처리
 * - 에러 메시지 표시
 *
 * @module pages/auth
 */

import { getUsers, saveUsers, getUserByEmail, setCurrentUser } from "../modules/storage.js";
import { validateEmail, validatePassword, getQueryParam, showToast } from "../modules/utils.js";

// ============================================================================
// 에러 메시지 헬퍼 함수
// ============================================================================

/**
 * 특정 필드에 에러 메시지를 표시합니다.
 *
 * @param {string} elementId - 에러 메시지를 표시할 요소 ID
 * @param {string} message - 표시할 에러 메시지
 */
function showError(elementId, message) {
 const errorElement = document.getElementById(elementId);
 if (errorElement) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
 }
}

/**
 * 모든 에러 메시지를 초기화합니다.
 */
function clearErrors() {
 const errorElements = document.querySelectorAll(".form-error");
 errorElements.forEach((el) => {
  el.textContent = "";
  el.style.display = "none";
 });
}

// ============================================================================
// 로그인 관련 함수
// ============================================================================

/**
 * 로그인 폼을 검증하고 처리합니다.
 *
 * @param {Event} e - 폼 제출 이벤트
 */
function handleLogin(e) {
 e.preventDefault();
 clearErrors();

 // 입력값 가져오기
 const email = document.getElementById("email").value.trim();
 const password = document.getElementById("password").value;

 // 유효성 검사
 if (!email) {
  showError("emailError", "이메일을 입력해주세요.");
  return;
 }

 if (!validateEmail(email)) {
  showError("emailError", "올바른 이메일 형식을 입력해주세요.");
  return;
 }

 if (!password) {
  showError("passwordError", "비밀번호를 입력해주세요.");
  return;
 }

 // 사용자 확인
 const users = getUsers();
 const user = users.find((u) => u.email === email && u.password === password);

 if (!user) {
  showError("passwordError", "이메일 또는 비밀번호가 올바르지 않습니다.");
  return;
 }

 // 로그인 성공
 setCurrentUser(user);
 showToast("로그인 성공!");

 // 리다이렉트 처리
 const redirect = getQueryParam("redirect");
 if (redirect) {
  window.location.href = redirect;
 } else {
  window.location.href = "index.html";
 }
}

/**
 * 로그인 폼 이벤트를 설정합니다.
 */
function setupLoginForm() {
 const loginForm = document.getElementById("loginForm");

 if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);

  // 엔터 키 처리
  loginForm.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
    handleLogin(e);
   }
  });
 }
}

// ============================================================================
// 회원가입 관련 함수
// ============================================================================

/**
 * 회원가입 폼을 검증하고 처리합니다.
 *
 * @param {Event} e - 폼 제출 이벤트
 */
function handleSignup(e) {
 e.preventDefault();
 clearErrors();

 // 입력값 가져오기
 const name = document.getElementById("name").value.trim();
 const email = document.getElementById("email").value.trim();
 const password = document.getElementById("password").value;
 const passwordConfirm = document.getElementById("passwordConfirm").value;
 const role = document.getElementById("role").value;

 // 유효성 검사 - 이름
 if (!name) {
  showError("nameError", "이름을 입력해주세요.");
  return;
 }

 if (name.length < 2) {
  showError("nameError", "이름은 2자 이상이어야 합니다.");
  return;
 }

 // 유효성 검사 - 이메일
 if (!email) {
  showError("emailError", "이메일을 입력해주세요.");
  return;
 }

 if (!validateEmail(email)) {
  showError("emailError", "올바른 이메일 형식을 입력해주세요.");
  return;
 }

 // 중복 이메일 확인
 const existingUser = getUserByEmail(email);
 if (existingUser) {
  showError("emailError", "이미 가입된 이메일입니다.");
  return;
 }

 // 유효성 검사 - 비밀번호
 if (!password) {
  showError("passwordError", "비밀번호를 입력해주세요.");
  return;
 }

 if (!validatePassword(password)) {
  showError("passwordError", "비밀번호는 최소 4자 이상이어야 합니다.");
  return;
 }

 // 유효성 검사 - 비밀번호 확인
 if (password !== passwordConfirm) {
  showError("passwordConfirmError", "비밀번호가 일치하지 않습니다.");
  return;
 }

 // 사용자 생성
 const newUser = {
  id: Date.now(),
  name: name,
  email: email,
  password: password, // 주의: 실제 서비스에서는 해시 처리 필요
  role: role,
  avatar: "",
  createdAt: new Date().toISOString(),
  bio: "",
 };

 // 사용자 저장
 const users = getUsers();
 users.push(newUser);
 saveUsers(users);

 showToast("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");

 // 로그인 페이지로 이동
 setTimeout(() => {
  window.location.href = "login.html";
 }, 1500);
}

/**
 * 회원가입 폼 이벤트를 설정합니다.
 */
function setupSignupForm() {
 const signupForm = document.getElementById("signupForm");

 if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);

  // 실시간 비밀번호 확인 검증
  const passwordConfirm = document.getElementById("passwordConfirm");
  if (passwordConfirm) {
   passwordConfirm.addEventListener("input", () => {
    const password = document.getElementById("password").value;
    const confirmValue = passwordConfirm.value;

    if (confirmValue && password !== confirmValue) {
     showError("passwordConfirmError", "비밀번호가 일치하지 않습니다.");
    } else {
     const errorEl = document.getElementById("passwordConfirmError");
     if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
     }
    }
   });
  }
 }
}

// ============================================================================
// 페이지 초기화
// ============================================================================

/**
 * 로그인 페이지를 초기화합니다.
 */
export function initLoginPage() {
 setupLoginForm();
}

/**
 * 회원가입 페이지를 초기화합니다.
 */
export function initSignupPage() {
 setupSignupForm();
}

/**
 * 인증 페이지를 초기화합니다.
 * 로그인/회원가입 페이지 여부에 따라 적절한 초기화 함수를 호출합니다.
 */
export function initAuthPage() {
 const loginForm = document.getElementById("loginForm");
 const signupForm = document.getElementById("signupForm");

 if (loginForm) {
  initLoginPage();
 }

 if (signupForm) {
  initSignupPage();
 }
}

// ============================================================================
// 모듈 내보내기
// ============================================================================

export default {
 initAuthPage,
 initLoginPage,
 initSignupPage,
};
