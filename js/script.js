// ─── Helpers ──────────────────────────────────────────────────────
function cleanStudentName(name) {
  // Remove leading numbers followed by dot and space (e.g., "01. mai văn hải" -> "mai văn hải")
  return name.replace(/^\d+\.\s*/, '').trim();
}

// ─── State ──────────────────────────────────────────────────────
let currentClass = '9a1';       // Normalizes to lowercase matching data.js
let currentStudentList = [];    // List of original student folder names for the current class
let activeAlbum = [];           // Photos of the student currently being viewed in Lightbox
let lbIndex = 0;                // Index within the activeAlbum



// ─── Constants ──────────────────────────────────────────────────
const CLASSES = ['9A1', '9A2', '9A3', '9A4', '9A5', '9A6', '9A7', '9A8', '9B1'];
const STAR_FILES = ['star2.png', 'star3.png', 'star4.png', 'star5.png', 'star6.png', 'star7.png', 'star8.png', 'star9.png'];
const P4_STICKERS = ['p4_stick_1.png', 'p4_stick_2.png', 'p4_stick_3.png', 'p4_stick_4.png', 'p4_stick_5.png'];

// ─── Screens ────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goLoading() {
  showScreen('s-loading');
  setTimeout(() => { buildClasses(); showScreen('s-classes'); }, 1800);
}

function goClasses() { showScreen('s-classes'); }

function goClassView(cls) {
  currentClass = cls.toLowerCase();
  document.getElementById('tab-classname').textContent = cls.toUpperCase();
  buildPhotoGrid();
  renderBoardStickers();
  showScreen('s-classview');
}

// ─── Build class picker ──────────────────────────────────────────


function buildClasses() {
  const grid = document.getElementById('classGrid');
  grid.innerHTML = '';
  // row 1: 5 items, row 2: 4 items
  const row1 = CLASSES.slice(0,5);
  const row2 = CLASSES.slice(5);

  // We'll make it 5-col grid but span second row center
  row1.forEach((cls, i) => {
    grid.appendChild(makeClassItem(cls, i));
  });

  // For row2 we create a full-width container
  const row2wrap = document.createElement('div');
  row2wrap.style.cssText = 'grid-column:1/-1;display:flex;justify-content:center;gap:20px;margin-top:8px;';
  row2.forEach((cls, i) => {
    row2wrap.appendChild(makeClassItem(cls, i+5));
  });
  grid.appendChild(row2wrap);
}

function makeClassItem(cls, i) {
  const randomStar = STAR_FILES[Math.floor(Math.random() * STAR_FILES.length)];
  const div = document.createElement('div');
  div.className = 'class-item';
  div.style.setProperty('--i', i);
  div.innerHTML = `<img src="images/${randomStar}" class="star-sticker" alt="Star">` + `<div class="class-pill">${cls}</div>`;
  div.onclick = () => goClassView(cls);
  return div;
}

// ─── Render dynamic stickers ───────────────────────────────────
function renderBoardStickers() {
  const container = document.getElementById('stickerContainer');
  if (!container) return;
  container.innerHTML = '';

  // Safe corner positions that don't overlap photo grid
  const points = [
    { top: '10px',   left:  '10px',  size: '90px'  },  // Top Left
    { top: '10px',   right: '10px',  size: '90px'  },  // Top Right
    { bottom: '10px', left:  '10px', size: '100px' },  // Bottom Left
    { bottom: '10px', right: '10px', size: '100px' },  // Bottom Right
  ];

  // Shuffle & pick 4 unique stickers
  const shuffled = [...P4_STICKERS].sort(() => Math.random() - 0.5);

  points.forEach((pt, i) => {
    const file = shuffled[i % shuffled.length];
    const div = document.createElement('div');
    div.className = 'board-sticker';
    if (pt.top)    div.style.top    = pt.top;
    if (pt.bottom) div.style.bottom = pt.bottom;
    if (pt.left)   div.style.left   = pt.left;
    if (pt.right)  div.style.right  = pt.right;
    div.style.width = pt.size;

    const rot = Math.floor(Math.random() * 30) - 15;
    div.style.transform = `rotate(${rot}deg)`;
    div.innerHTML = `<img src="images/${file}" alt="sticker">`;
    container.appendChild(div);
  });
}


// ─── Build photo grid ────────────────────────────────────────────
function buildPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = '';

  const classData = STUDENT_DATA[currentClass] || {};
  currentStudentList = Object.keys(classData);

  // Randomize students for a dynamic feel
  const displayList = [...currentStudentList].sort(() => Math.random() - 0.5);

  displayList.forEach((originalName) => {
    const photos = classData[originalName] || [];
    const displayName = cleanStudentName(originalName);
    const coverPhoto = photos.length > 0 ? photos[0] : '';

    const card = document.createElement('div');
    card.className = 'photo-card';

    card.innerHTML = `
      <div class="polaroid-tape"></div>
      <div class="polaroid" onclick="openLightboxForStudent('${originalName}')">
        <div class="photo-placeholder">
          ${coverPhoto ? `<img src="${coverPhoto}" onerror="this.style.display='none'" alt="">` : ''}
        </div>
      </div>
      <div class="student-name" onclick="openLightboxForStudent('${originalName}')">${displayName}</div>`;
    grid.appendChild(card);
  });
}

// ─── Lightbox ────────────────────────────────────────────────────
function openLightboxForStudent(originalName) {
  const photos = STUDENT_DATA[currentClass][originalName] || [];
  if (photos.length === 0) return;

  activeAlbum = photos;
  currentStudentName = cleanStudentName(originalName);
  lbIndex = 0;

  renderLbPhoto();
  document.getElementById('lightbox').classList.add('open');
}

function openLightbox(idx) {
  // Legacy function support if needed
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function lbMove(dir) {
  lbIndex = (lbIndex + dir + activeAlbum.length) % activeAlbum.length;
  renderLbPhoto();
}

function renderLbPhoto() {
  const imgPath = activeAlbum[lbIndex];

  const lbPhoto = document.getElementById('lb-photo');
  const lbName = document.getElementById('lb-name');
  const lbCounter = document.getElementById('lb-counter');

  lbName.textContent = currentStudentName;
  lbCounter.textContent = `Ảnh ${lbIndex + 1} / ${activeAlbum.length}`;
  lbPhoto.innerHTML = `<img src="${imgPath}" onerror="this.style.opacity='0'" alt="${currentStudentName}">`;

  // Pre-load next
  if (activeAlbum.length > 1) {
    const nextIdx = (lbIndex + 1) % activeAlbum.length;
    new Image().src = activeAlbum[nextIdx];
  }
}

function downloadPhoto() {
  const imgPath = activeAlbum[lbIndex];
  const link = document.createElement('a');
  link.href = imgPath;
  link.download = `${currentStudentName}_${lbIndex + 1}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// close lightbox on backdrop click
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// keyboard nav
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowLeft') lbMove(-1);
  if (e.key === 'ArrowRight') lbMove(1);
  if (e.key === 'Escape') closeLightbox();
});

// init classes (in case already built)
buildClasses();