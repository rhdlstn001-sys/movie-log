function onAuthChange() {
  refreshAuthUI();
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });
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

function populateStaticOptions() {
  const ratingSelect = document.getElementById('rating');
  for (let i = 10; i >= 1; i--) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${i}점`;
    ratingSelect.appendChild(opt);
  }

  const genreSelect = document.getElementById('genre');
  const filterGenre = document.getElementById('filter-genre');
  GENRES.forEach((g) => {
    const opt1 = document.createElement('option');
    opt1.value = g;
    opt1.textContent = g;
    genreSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = g;
    opt2.textContent = g;
    filterGenre.appendChild(opt2);
  });
}

function resetForm() {
  document.getElementById('editing-id').value = '';
  document.getElementById('movie-form').reset();
  document.getElementById('genre-custom-field').style.display = 'none';
  document.getElementById('form-title').textContent = '새 기록 작성';
  document.getElementById('submit-btn').textContent = '등록하기';
  document.getElementById('cancel-edit-btn').style.display = 'none';
}

function startEdit(id) {
  const movie = getMovies().find((m) => m.id === id);
  if (!movie) return;
  document.getElementById('editing-id').value = id;
  document.getElementById('title').value = movie.title;
  document.getElementById('watchDate').value = movie.watchDate;
  document.getElementById('rating').value = movie.rating;
  document.getElementById('oneLiner').value = movie.oneLiner || '';
  document.getElementById('content').value = movie.content || '';

  const genreSelect = document.getElementById('genre');
  const customField = document.getElementById('genre-custom-field');
  if (GENRES.includes(movie.genre)) {
    genreSelect.value = movie.genre;
    customField.style.display = 'none';
  } else {
    genreSelect.value = '기타';
    customField.style.display = 'block';
    document.getElementById('genreCustom').value = movie.genre;
  }

  document.getElementById('form-title').textContent = '기록 수정';
  document.getElementById('submit-btn').textContent = '수정 완료';
  document.getElementById('cancel-edit-btn').style.display = 'inline-block';
  switchTab('write');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderList() {
  const list = document.getElementById('movie-list');
  const emptyMsg = document.getElementById('empty-msg');
  const search = document.getElementById('search-input').value.trim().toLowerCase();
  const genreFilter = document.getElementById('filter-genre').value;
  const sortMode = document.getElementById('sort-select').value;
  const author = isAuthor();

  let movies = getMovies();

  if (search) {
    movies = movies.filter((m) => m.title.toLowerCase().includes(search));
  }
  if (genreFilter) {
    movies = movies.filter((m) => m.genre === genreFilter);
  }

  movies.sort((a, b) => {
    switch (sortMode) {
      case 'dateAsc': return a.watchDate.localeCompare(b.watchDate);
      case 'ratingDesc': return b.rating - a.rating || b.watchDate.localeCompare(a.watchDate);
      case 'ratingAsc': return a.rating - b.rating || b.watchDate.localeCompare(a.watchDate);
      case 'dateDesc':
      default: return b.watchDate.localeCompare(a.watchDate);
    }
  });

  list.innerHTML = '';
  emptyMsg.style.display = movies.length ? 'none' : 'block';

  movies.forEach((m) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <div class="movie-card-top">
        <h3 class="movie-title">${escapeHtml(m.title)}</h3>
        <span class="movie-rating">★ ${m.rating}/10</span>
      </div>
      <div class="movie-meta">
        <span class="tag">${escapeHtml(m.genre)}</span>
        <span>시청일자: ${escapeHtml(m.watchDate)}</span>
      </div>
      ${m.oneLiner ? `<p class="one-liner">"${escapeHtml(m.oneLiner)}"</p>` : ''}
      ${m.content ? `
        <button type="button" class="review-toggle">감상평 더보기</button>
        <div class="review-content">${escapeHtml(m.content)}</div>
      ` : ''}
      ${author ? `
        <div class="card-actions">
          <button type="button" class="edit-btn">수정</button>
          <button type="button" class="danger delete-btn">삭제</button>
        </div>
      ` : ''}
    `;

    const toggleBtn = card.querySelector('.review-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const content = card.querySelector('.review-content');
        const open = content.classList.toggle('open');
        toggleBtn.textContent = open ? '감상평 접기' : '감상평 더보기';
      });
    }

    if (author) {
      card.querySelector('.edit-btn').addEventListener('click', () => startEdit(m.id));
      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('이 기록을 삭제할까요?')) {
          deleteMovie(m.id);
          renderList();
        }
      });
    }

    list.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateStaticOptions();
  refreshAuthUI();

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('genre').addEventListener('change', (e) => {
    document.getElementById('genre-custom-field').style.display = e.target.value === '기타' ? 'block' : 'none';
  });

  document.getElementById('movie-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAuthor()) return;

    const genreSelect = document.getElementById('genre').value;
    const genre = genreSelect === '기타'
      ? (document.getElementById('genreCustom').value.trim() || '기타')
      : genreSelect;

    const data = {
      title: document.getElementById('title').value.trim(),
      watchDate: document.getElementById('watchDate').value,
      rating: Number(document.getElementById('rating').value),
      genre,
      oneLiner: document.getElementById('oneLiner').value.trim(),
      content: document.getElementById('content').value.trim(),
    };

    const editingId = document.getElementById('editing-id').value;
    if (editingId) {
      updateMovie(editingId, data);
    } else {
      addMovie(data);
    }

    resetForm();
    renderList();
    switchTab('list');
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    resetForm();
    switchTab('list');
  });
  document.getElementById('search-input').addEventListener('input', renderList);
  document.getElementById('filter-genre').addEventListener('change', renderList);
  document.getElementById('sort-select').addEventListener('change', renderList);
});
