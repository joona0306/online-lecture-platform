/**
 * auth.js
 * - 로그인 및 회원가입 로직
 */

// 이메일 형식 검증
function validateEmail(email) {
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return emailRegex.test(email);
}

// 에러 메시지 표시
function showError(elementId, message) {
 const errorElement = document.getElementById(elementId);
 if (errorElement) {
  errorElement.textContent = message;
 }
}

// 에러 메시지 초기화
function clearErrors() {
 const errorElements = document.querySelectorAll(".form-error");
 errorElements.forEach((el) => {
  el.textContent = "";
 });
}

// 로그인 처리
function handleLogin(e) {
 e.preventDefault();
 clearErrors();

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

// 회원가입 처리
function handleSignup(e) {
 e.preventDefault();
 clearErrors();

 const name = document.getElementById("name").value.trim();
 const email = document.getElementById("email").value.trim();
 const password = document.getElementById("password").value;
 const passwordConfirm = document.getElementById("passwordConfirm").value;
 const role = document.getElementById("role").value;

 // 유효성 검사
 if (!name) {
  showError("nameError", "이름을 입력해주세요.");
  return;
 }

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

 if (password.length < 4) {
  showError("passwordError", "비밀번호는 최소 4자 이상이어야 합니다.");
  return;
 }

 if (password !== passwordConfirm) {
  showError("passwordConfirmError", "비밀번호가 일치하지 않습니다.");
  return;
 }

 // 중복 이메일 확인
 const users = getUsers();
 if (users.find((u) => u.email === email)) {
  showError("emailError", "이미 가입된 이메일입니다.");
  return;
 }

 // 사용자 생성
 const newUser = {
  id: Date.now(),
  name: name,
  email: email,
  password: password, // ⚠️ 실서비스에서는 해시 처리 필수
  role: role,
  avatar: "",
  createdAt: new Date().toISOString(),
  bio: role === "instructor" ? "" : "",
 };

 users.push(newUser);
 saveUsers(users);

 showToast("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");

 setTimeout(() => {
  window.location.href = "login.html";
 }, 1500);
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
 const loginForm = document.getElementById("loginForm");
 const signupForm = document.getElementById("signupForm");

 if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
 }

 if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
 }
});
