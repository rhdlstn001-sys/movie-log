// 작성자 본인 인증(로그인) 로직
// 비밀번호는 사이트 소유자가 아래 값을 직접 원하는 값으로 바꿔서 사용하세요.
const AUTH_PASSWORD = 'change-me-1234';
const AUTH_SESSION_KEY = 'movieLog.isAuthor';

function isAuthor() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
}

function loginAsAuthor(password) {
  if (password === AUTH_PASSWORD) {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function logoutAuthor() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
