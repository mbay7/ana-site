const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const Motion = window.Motion;

/* ---- canvas particle field (the night sky) ---- */
const canvas = document.getElementById('bg');
if (canvas && !reduced) {
  const ctx = canvas.getContext('2d');
  let W, H, parts = [];
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(Math.floor((W * H) / 14000), 140);
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.28 + 0.06,
      a: Math.random() * 0.45 + 0.15,
      tw: Math.random() * Math.PI * 2,
      amber: Math.random() < 0.14
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y -= p.vy; p.tw += 0.02;
      if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
      const o = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      const col = p.amber ? '226,103,42' : '150,165,200';
      ctx.fillStyle = `rgba(${col},${o})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ---- elements ---- */
const els = {
  dot: document.querySelector('.wake-dot'),
  wordmark: document.querySelector('.wordmark'),
  heroLine: document.querySelector('.hero-line'),
  sub: document.getElementById('sub'),
  actions: document.getElementById('heroActions'),
  demo: document.getElementById('demo'),
  stream: document.getElementById('stream'),
  answer: document.getElementById('answer'),
  sources: document.getElementById('sources')
};
const headline = 'Every brand. Its own I.';
const answer = 'Yes — the Hydra-Rich Cream. It\'s our best for dry skin, with hyaluronic acid and shea butter, and it\'s in stock.';

function typeInto(el, text, onDone) {
  const words = text.split(' ');
  let i = 0;
  (function step() {
    if (i < words.length) {
      el.textContent = words.slice(0, i + 1).join(' ');
      i += 1;
      setTimeout(step, 150);
    } else if (onDone) onDone();
  })();
}

/* cursor blink (transition, not keyframes) */
const cursors = document.querySelectorAll('.cursor');
if (!reduced) setInterval(() => cursors.forEach(c => c.classList.toggle('off')), 520);

const spring = (el, kf, opts) => Motion && Motion.animate(el, kf, { type: 'spring', stiffness: 170, damping: 26, ...opts });

/* ---- play ---- */
if (reduced || !Motion) {
  els.stream.textContent = headline;
  els.answer.textContent = answer;
  document.querySelectorAll('[data-motion]').forEach(el => el.style.opacity = 1);
  els.sources.style.opacity = 1;
} else {
  els.sources.style.opacity = 0;
  spring(els.dot, { opacity: [0.25, 1], scale: [0.4, 1] }, { stiffness: 200, damping: 22 });
  setTimeout(() => spring(els.wordmark, { opacity: [0, 1], y: [18, 0] }), 220);
  setTimeout(() => {
    spring(els.heroLine, { opacity: [0, 1] });
    typeInto(els.stream, headline, onHeadline);
  }, 850);
  setTimeout(() => spring(els.demo, { opacity: [0, 1], y: [22, 0] }), 1000);

  function onHeadline() {
    spring(els.sub, { opacity: [0, 1] });
    spring(els.actions, { opacity: [0, 1] });
    setTimeout(() => typeInto(els.answer, answer, () => {
      Motion.animate(els.sources, { opacity: [0, 1] });
    }), 600);
  }
}
