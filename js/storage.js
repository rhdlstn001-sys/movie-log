// localStorage 기반 데이터 저장소 (movies: 게시판 기록, wishlist: 볼 영화 목록)

const STORAGE_KEYS = {
  MOVIES: 'movieLog.movies',
  WISHLIST: 'movieLog.wishlist',
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getMovies() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES) || '[]');
}

function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
}

function addMovie(movie) {
  const movies = getMovies();
  movies.push({ id: generateId(), createdAt: Date.now(), ...movie });
  saveMovies(movies);
}

function updateMovie(id, updates) {
  const movies = getMovies();
  const idx = movies.findIndex((m) => m.id === id);
  if (idx === -1) return;
  movies[idx] = { ...movies[idx], ...updates };
  saveMovies(movies);
}

function deleteMovie(id) {
  saveMovies(getMovies().filter((m) => m.id !== id));
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
}

function saveWishlist(list) {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
}

function addWish(item) {
  const list = getWishlist();
  list.push({ id: generateId(), createdAt: Date.now(), ...item });
  saveWishlist(list);
}

function deleteWish(id) {
  saveWishlist(getWishlist().filter((w) => w.id !== id));
}

const GENRES = ['액션', '드라마', '코미디', '로맨스', '스릴러', '공포', 'SF', '애니메이션', '다큐멘터리', '기타'];
