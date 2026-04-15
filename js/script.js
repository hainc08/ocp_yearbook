// ─── Data ───────────────────────────────────────────────────────
const CLASSES = ['9A1','9A2','9A3','9A4','9A5','9A6','9A7','9A8','9B1'];
const STAR_COLORS = [
  { fill: '#e8a0b0', stroke: '#c07080', outline: '#f0d0d8', style: 'solid' },
  { fill: '#5060c0', stroke: '#304090', outline: '#9090e0', style: 'solid' },
  { fill: '#d040a0', stroke: '#a02080', outline: '#f080d0', style: 'solid' },
  { fill: 'none',    stroke: '#40c0b0', outline: '#40c0b0', style: 'outline' },
  { fill: '#c08878', stroke: '#906858', outline: '#e0b0a0', style: 'solid' },
  { fill: 'none',    stroke: '#60c890', outline: '#60c890', style: 'outline2' },
  { fill: '#d04060', stroke: '#a02040', outline: '#f08090', style: 'dotted' },
  { fill: 'none',    stroke: '#6070a0', outline: '#6070a0', style: 'outline' },
  { fill: '#e8e0c0', stroke: '#c0b090', outline: '#f8f0e0', style: 'sketch' },
];

const STUDENTS = [
  'Nguyễn Văn A','Trần Thị B','Lê Văn C','Phạm Thị D','Hoàng Văn E',
  'Vũ Thị F','Đặng Văn G','Bùi Thị H','Đỗ Văn I','Ngô Thị K',
];

let currentClass = '9A1';
let lbIndex = 0;
const studentList = STUDENTS;

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
  currentClass = cls;
  document.getElementById('tab-classname').textContent = cls;
  buildPhotoGrid();
  showScreen('s-classview');
}

// ─── Build class picker ──────────────────────────────────────────
function starSVG(c, size=90) {
  const pts = '50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35';
  let fill = c.fill;
  let sw = 2.5;
  let dash = '';
  if (c.style === 'dotted') { fill = 'none'; dash = '4,3'; }
  if (c.style === 'outline2') { sw = 3; }
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 95">
    <polygon points="${pts}" fill="${fill}" stroke="${c.stroke}" stroke-width="${sw}" stroke-dasharray="${dash}"/>
    ${c.style==='sketch' ? `<polygon points="${pts}" fill="none" stroke="${c.stroke}" stroke-width="1.5" transform="translate(2,-2) rotate(3,50,47)"/>` : ''}
  </svg>`;
}

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
  const c = STAR_COLORS[i % STAR_COLORS.length];
  const div = document.createElement('div');
  div.className = 'class-item';
  div.style.setProperty('--i', i);
  div.innerHTML = starSVG(c, 88) + `<div class="class-pill">${cls}</div>`;
  div.onclick = () => goClassView(cls);
  return div;
}

// ─── Build photo grid ────────────────────────────────────────────
function buildPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = '';
  const names = [...studentList].sort(() => Math.random()-.5);
  // 10 students
  names.slice(0,10).forEach((name, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML = `
      <div class="polaroid" onclick="openLightbox(${i})">
        <div class="photo-placeholder"></div>
      </div>
      <div class="student-name" onclick="openLightbox(${i})">${name}</div>`;
    grid.appendChild(card);
  });
}

// ─── Lightbox ────────────────────────────────────────────────────
function openLightbox(idx) {
  lbIndex = idx;
  renderLbPhoto();
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function lbMove(dir) {
  lbIndex = (lbIndex + dir + 10) % 10;
  renderLbPhoto();
}

function renderLbPhoto() {
  const names = [...studentList].slice(0,10);
  const lb = document.getElementById('lb-photo');
  lb.title = names[lbIndex];
}

function downloadPhoto() {
  alert('Chức năng tải ảnh sẽ hoạt động khi kết nối với backend có ảnh thực tế!');
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