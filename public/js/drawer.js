// drawer.js
const openBtn = document.getElementById('material-icons');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const feedTabs = document.getElementById('feedTabs');

// Açma butonu
openBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
  overlay.classList.add('active');
});

// Kapatma butonu
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});

// Sidebar içindeki tab butonlarına veya logolara tıklandığında drawer kapanır
feedTabs.addEventListener('click', (e) => {
  if (e.target.closest('.tab-btn') || e.target.tagName === 'IMG') {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }
});

// Overlay tıklandığında drawer kapanır
overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});


