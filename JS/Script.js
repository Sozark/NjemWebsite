// ══════════════════════════════════════════
//  NJEM — Script.js
// ══════════════════════════════════════════

// ── Custom Cursor ──────────────────────────────────────────
//
//  FIX: Previously we set `left` and `top` in JS while CSS also
//  had `transform: translate(-50%,-50%)`. Some browsers apply the
//  CSS transform BEFORE the JS overrides land, causing a one-frame
//  offset that makes the dot invisible at (0,0).
//
//  New approach: cursor starts off-screen via transform in CSS.
//  JS only ever touches `transform: translate(x, y)` — no left/top.
//  This is also GPU-accelerated and flicker-free.
//
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  const x = e.clientX;
  const y = e.clientY;

  // Centre the 10px dot on the cursor tip
  cur.style.transform = `translate(${x - 5}px, ${y - 5}px)`;

  // Ring follows with a slight lag (trailing effect)
  // Centre the 34px ring (half = 17px)
  setTimeout(() => {
    ring.style.transform = `translate(${x - 17}px, ${y - 17}px)`;
  }, 60);
});

// ── Navbar Scroll Effect ────────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll Reveal ───────────────────────────────────────────
//
//  FIX 1: threshold changed from 0.1 to 0 so the callback fires
//          the instant even 1px of an element enters the viewport.
//
//  FIX 2: removed the `i * 80` batch-index stagger. The `i` inside
//          forEach was the index within that *one batch* of observer
//          entries — when multiple sections entered at once they all
//          got near-identical delays and appeared to flash in or
//          never trigger. Now each element gets a small fixed delay
//          based on a global counter instead.
//
let revealCount = 0;

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = revealCount * 80;
      revealCount++;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0,
  rootMargin: '0px 0px -40px 0px'   // trigger 40px before the bottom edge
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Safety net: if the observer never fires (e.g. unsupported browser),
// make every reveal element visible after 2 seconds automatically.
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 2000);

// ── Track Hover (show play icon) ────────────────────────────
document.querySelectorAll('.track').forEach(track => {
  const numEl  = track.querySelector('.track-num');
  const playEl = track.querySelector('.track-play');

  track.addEventListener('mouseenter', () => {
    if (numEl)  numEl.style.opacity  = '0';
    if (playEl) playEl.style.opacity = '1';
  });
  track.addEventListener('mouseleave', () => {
    if (numEl)  numEl.style.opacity  = '';
    if (playEl) playEl.style.opacity = '';
  });
});

// ── Lightbox ────────────────────────────────────────────────
function openLightbox(label) {
  const lb    = document.getElementById('lightbox');
  const lbLbl = document.getElementById('lightboxLabel');
  if (lbLbl && label) lbLbl.textContent = label;
  lb.classList.add('active');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Contact Form Submit ─────────────────────────────────────
function handleSubmit() {
  const btn = document.querySelector('.btn-submit');
  if (!btn) return;
  btn.textContent       = 'Message Sent ✓';
  btn.style.borderColor = '#00e5ff';
  btn.style.color       = '#00e5ff';
  btn.style.boxShadow   = '0 0 20px rgba(0,229,255,0.3)';
  setTimeout(() => {
    btn.textContent   = 'Send Message →';
    btn.style.cssText = '';
  }, 3000);
}

// ── Smooth Scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});