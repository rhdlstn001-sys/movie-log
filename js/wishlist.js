function onAuthChange() {
  refreshAuthUI();
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function refreshAuthUI() {
  const writePanel = document.getElementById('write-panel');
  const guestNote = document.getElementById('guest-note');
  const author = isAuthor();
  writePanel.style.display = author ? 'block' : 'none';
  guestNote.style.display = author ? 'none' : 'block';
  renderList();
}

function populateGenreOptions() {
  const select = document.getElementById('wishGenre');
  GENRES.forEach((g) => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    select.appendChild(opt);
  });
}

function ratingOptionsHtml() {
  let html = '<option value="">평점 선택</option>';
  for (let i = 10; i >= 1; i--) html += `<option value="${i}">${i}점</option>`;
  return html;
}

function renderList() {
  const listEl = document.getElementById('wish-list');
  const emptyMsg = document.getElementById('empty-msg');
  const author = isAuthor();
  const items = getWishlist().sort((a, b) => b.createdAt - a.createdAt);

  listEl.innerHTML = '';
  emptyMsg.style.display = items.length ? 'none' : 'block';

  items.forEach((w) => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-info">
        <h4>${escapeHtml(w.title)}</h4>
        <p>${escapeHtml(w.genre || '미분류')}${w.memo ? ' · ' + escapeHtml(w.memo) : ''}</p>
      </div>
      ${author ? `
        <div class="wish-actions">
          <button type="button" class="primary complete-toggle-btn">시청 완료</button>
          <button type="button" class="danger delete-btn">삭제</button>
        </div>
        <form class="complete-form">
          <div class="form-grid">
            <div class="field">
              <label>시청일자 *</label>
              <input type="date" class="c-date" required>
            </div>
            <div class="field">
              <label>평점 (10점 만점) *</label>
              <select class="c-rating" required>${ratingOptionsHtml()}</select>
            </div>
            <div class="field span-2">
              <label>한줄평</label>
              <input type="text" class="c-oneliner" maxlength="60">
            </div>
            <div class="field span-2">
              <label>감상평</label>
              <textarea class="c-content" rows="4"></textarea>
            </div>
          </div>
          <button type="submit" class="primary">게시판으로 전환</button>
          <button type="button" class="cancel-complete-btn">취소</button>
        </form>
      ` : ''}
    `;

    if (author) {
      const completeForm = card.querySelector('.complete-form');
      card.querySelector('.complete-toggle-btn').addEventListener('click', () => {
        completeForm.classList.toggle('open');
      });
      card.querySelector('.cancel-complete-btn').addEventListener('click', () => {
        completeForm.classList.remove('open');
      });
      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('볼 영화 목록에서 삭제할까요?')) {
          deleteWish(w.id);
          renderList();
        }
      });
      completeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addMovie({
          title: w.title,
          genre: w.genre || '기타',
          watchDate: completeForm.querySelector('.c-date').value,
          rating: Number(completeForm.querySelector('.c-rating').value),
          oneLiner: completeForm.querySelector('.c-oneliner').value.trim(),
          content: completeForm.querySelector('.c-content').value.trim(),
        });
        deleteWish(w.id);
        alert('게시판으로 전환되었습니다.');
        renderList();
      });
    }

    listEl.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateGenreOptions();
  refreshAuthUI();

  document.getElementById('wish-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAuthor()) return;
    addWish({
      title: document.getElementById('wishTitle').value.trim(),
      genre: document.getElementById('wishGenre').value,
      memo: document.getElementById('wishMemo').value.trim(),
    });
    document.getElementById('wish-form').reset();
    renderList();
  });
});
