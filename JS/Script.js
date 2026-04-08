// ── Custom Cursor ──────────────────────────────────────────
// Uses direct style assignment — no mix-blend-mode interference
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cur.style.left  = e.clientX + 'px';
  cur.style.top   = e.clientY + 'px';
  // Ring follows with a slight delay for trailing effect
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  }, 60);
});

// ── Navbar Scroll Effect ────────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll Reveal ───────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => revealObserver.observe(r));

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
  do
  cument.getElementById('lightbox').classList.remove('active');
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