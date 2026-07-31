document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const msg = document.getElementById('login-msg');

  if (isAuthor()) {
    msg.textContent = '이미 작성자로 로그인되어 있습니다.';
    msg.className = 'login-msg success';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (loginAsAuthor(password)) {
      msg.textContent = '로그인되었습니다. 게시판으로 이동합니다...';
      msg.className = 'login-msg success';
      setTimeout(() => { window.location.href = 'board.html'; }, 600);
    } else {
      msg.textContent = '비밀번호가 올바르지 않습니다.';
      msg.className = 'login-msg error';
    }
  });
});
