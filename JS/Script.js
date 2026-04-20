// ══════════════════════════════════════════
//  NJEM — Script.js
// ══════════════════════════════════════════

// ── Custom Cursor ──────────────────────────────────────────
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  const x = e.clientX;
  const y = e.clientY;
  cur.style.transform  = `translate(${x - 5}px, ${y - 5}px)`;
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
let revealCount = 0;
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = revealCount * 80;
      revealCount++;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Safety net — make everything visible after 2 s if observer fails
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

// ── Smooth Scroll ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

(function () {

  const audio        = document.getElementById('audioEngine');
  const bar          = document.getElementById('playerBar');
  const nameEl       = document.getElementById('playerTrackName');
  const metaEl       = document.getElementById('playerTrackMeta');
  const playPauseBtn = document.getElementById('playerPlayPause');
  const prevBtn      = document.getElementById('playerPrev');
  const nextBtn      = document.getElementById('playerNext');
  const progress     = document.getElementById('playerProgress');
  const currentTimeEl= document.getElementById('playerCurrentTime');
  const durationEl   = document.getElementById('playerDuration');
  const volumeEl     = document.getElementById('playerVolume');

  // Only grab tracks that actually have an audio source attached
  const tracks = Array.from(document.querySelectorAll('.track[data-src]'));
  let currentIndex = -1;

  // ── Format seconds → m:ss ──
  function fmt(s) {
    if (isNaN(s) || s < 0) return '0:00';
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  // ── Mark which track row is active ──
  function setActiveTrack(index) {
    tracks.forEach((t, i) => {
      t.classList.toggle('playing', i === index);
      // Also update the number/play icon state
      const num  = t.querySelector('.track-num');
      const play = t.querySelector('.track-play');
      if (num)  num.style.opacity  = (i === index) ? '0'   : '';
      if (play) play.style.opacity = (i === index) ? '1'   : '';
    });
  }

  // ── Load and play a track by index ──
  function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;

    currentIndex = index;
    const t    = tracks[index];
    const src  = t.dataset.src;
    const name = t.querySelector('.track-name')?.textContent ?? '—';
    const meta = t.querySelector('.track-meta')?.textContent ?? '';

    // Update player bar info
    nameEl.textContent = name;
    metaEl.textContent = meta;

    // Set source and volume
    audio.src    = src;
    audio.volume = volumeEl.value / 100;

    // Show the bar before trying to play
    bar.classList.add('visible');
    setActiveTrack(index);

    // FIX: play() returns a Promise — catch any rejection
    // (e.g. file not found, browser autoplay block, codec issue)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback started successfully
          playPauseBtn.innerHTML = '&#9646;&#9646;';
        })
        .catch(err => {
          // Playback failed — log the real reason to the console
          console.error('⚠️  Audio playback failed:', err.message);
          console.error('    File attempted:', src);
          console.error('    Possible causes:');
          console.error('      • File not found — check the Music/ folder path');
          console.error('      • File extension case mismatch (.mp3 vs .MP3)');
          console.error('      • Browser blocked autoplay — user must interact first');

          // Show a visible error state on the button so it's not silent
          playPauseBtn.innerHTML = '&#9888;';  // ⚠ warning symbol
          playPauseBtn.title = 'Playback failed — check console for details';
          setTimeout(() => {
            playPauseBtn.innerHTML = '&#9654;';
            playPauseBtn.title = 'Play';
          }, 3000);
        });
    }
  }

  // ── Click any track row to play ──
  tracks.forEach((t, i) => {
    t.addEventListener('click', () => {
      // If clicking the currently-playing track, toggle pause
      if (i === currentIndex && !audio.paused) {
        audio.pause();
        playPauseBtn.innerHTML = '&#9654;';
        // Keep row highlighted but show a paused indicator
        t.classList.add('paused');
      } else {
        t.classList.remove('paused');
        loadTrack(i);
      }
    });
  });

  // ── Player bar: play/pause button ──
  playPauseBtn.addEventListener('click', () => {
    if (currentIndex === -1) return;  // nothing loaded yet

    if (audio.paused) {
      audio.play()
        .then(() => { playPauseBtn.innerHTML = '&#9646;&#9646;'; })
        .catch(err => console.error('Resume failed:', err.message));
    } else {
      audio.pause();
      playPauseBtn.innerHTML = '&#9654;';
    }
  });

  // ── Prev / Next ──
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) loadTrack(currentIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (currentIndex < tracks.length - 1) loadTrack(currentIndex + 1);
  });

  // ── Auto-advance to next track when one ends ──
  audio.addEventListener('ended', () => {
    if (currentIndex + 1 < tracks.length) {
      loadTrack(currentIndex + 1);
    } else {
      // Reached the end of the playlist
      playPauseBtn.innerHTML = '&#9654;';
      setActiveTrack(-1);
    }
  });

  // ── Progress bar — update while playing ──
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || isNaN(audio.duration)) return;
    progress.value           = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmt(audio.duration);
  });

  // ── Scrubbing ──
  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  // ── Volume ──
  volumeEl.addEventListener('input', () => {
    audio.volume = volumeEl.value / 100;
  });

})();