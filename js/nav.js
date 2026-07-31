// 공통 네비게이션의 로그인 상태 표시 처리
document.addEventListener('DOMContentLoaded', () => {
  const authEl = document.getElementById('nav-auth');
  if (!authEl) return;

  function render() {
    if (isAuthor()) {
      authEl.innerHTML = '작성자 모드 <button id="nav-logout-btn">로그아웃</button>';
      document.getElementById('nav-logout-btn').addEventListener('click', () => {
        logoutAuthor();
        render();
        if (typeof onAuthChange === 'function') onAuthChange();
      });
    } else {
      authEl.innerHTML = '<a href="login.html">로그인</a>';
    }
  }

  render();
});
