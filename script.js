const SLIDE_SIZE = 900;
const AUTO_DELAY = 3000;
const SWIPE_DISTANCE = 80;

const pictures = [
  'img/slide1.jpg',
  'img/slide2.jpg',
  'img/slide3.jpg',
  'img/slide4.jpg'
];

const track = document.querySelector('.slider-track');
const btnLeft = document.querySelector('.arrow-left');
const btnRight = document.querySelector('.arrow-right');
const dotsBox = document.querySelector('.dots');

let position = 0;
let timer = null;
let dots = [];

let touchX = 0;
let dragging = false;
let baseOffset = 0;

setupSlider();

/* ---------- INIT ---------- */

function setupSlider() {
  addImages();
  addDots();
  highlightDot(0);
  addEvents();
}

/* ---------- EVENTS ---------- */

function addEvents() {
  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  document.getElementById('start').addEventListener('click', startAuto);
  document.getElementById('stop').addEventListener('click', stopAuto);

  track.addEventListener('touchstart', onTouchStart, { passive: true });
  track.addEventListener('touchmove', onTouchMove, { passive: true });
  track.addEventListener('touchend', onTouchEnd);
}

/* ---------- CREATE ---------- */

function addImages() {
  let html = '';
  pictures.forEach(src => {
    html += `<img src="${src}" alt="">`;
  });
  html += `<img src="${pictures[0]}" alt="">`;
  track.innerHTML = html;
}

function addDots() {
  pictures.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
      position = i;
      moveSlider(position);
      highlightDot(i);
    });
    dotsBox.appendChild(dot);
    dots.push(dot);
  });
}

/* ---------- NAVIGATION ---------- */

function prevSlide() {
  position--;
  if (position < 0) {
    position = pictures.length;
    jump(position);
    position = pictures.length - 1;
  }
  moveSlider(position);
}

function nextSlide() {
  position++;
  if (position >= pictures.length) {
    moveSlider(position);
    setTimeout(() => {
      position = 0;
      jump(position);
    }, 500);
  }
  moveSlider(position);
}

function moveSlider(index) {
  track.style.transform = `translateX(${-index * SLIDE_SIZE}px)`;
  highlightDot(index % pictures.length);
}

function jump(index) {
  track.classList.remove('slide-anim');
  track.style.transform = `translateX(${-index * SLIDE_SIZE}px)`;
  track.offsetHeight;
  track.classList.add('slide-anim');
}

/* ---------- DOTS ---------- */

function highlightDot(i) {
  dots.forEach(d => d.classList.remove('active'));
  dots[i].classList.add('active');
}

/* ---------- AUTOPLAY ---------- */

function startAuto() {
  if (!timer) {
    timer = setInterval(nextSlide, AUTO_DELAY);
  }
}

function stopAuto() {
  clearInterval(timer);
  timer = null;
}

/* ---------- TOUCH ---------- */

function onTouchStart(e) {
  touchX = e.touches[0].clientX;
  dragging = true;
  stopAuto();
  track.classList.remove('slide-anim');
  baseOffset = -position * SLIDE_SIZE;
}

function onTouchMove(e) {
  if (!dragging) return;
  const diff = e.touches[0].clientX - touchX;
  track.style.transform = `translateX(${baseOffset + diff}px)`;
}

function onTouchEnd(e) {
  if (!dragging) return;
  dragging = false;
  track.classList.add('slide-anim');

  const diff = e.changedTouches[0].clientX - touchX;
  if (Math.abs(diff) > SWIPE_DISTANCE) {
    diff < 0 ? nextSlide() : prevSlide();
  } else {
    moveSlider(position);
  }
}


