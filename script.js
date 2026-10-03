const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- canvas particle field (the night sky waking) ---- */
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

/* ---- streaming ---- */
const stream = document.getElementById('stream');
const sub = document.getElementById('sub');
const actions = document.getElementById('heroActions');
const demo = document.getElementById('demo');
const userMsg = document.getElementById('userMsg');
const answerEl = document.getElementById('answer');
const sources = document.getElementById('sources');

const headline = 'Every brand. Its own I.';
const answer = 'Yes — the Hydra-Rich Cream. It\'s our best for dry skin, with hyaluronic acid and shea butter, and it\'s in stock.';

function reveal(el) { if (el) el.classList.add('reveal'); }

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

if (reduced) {
  stream.textContent = headline;
  answerEl.textContent = answer;
  ['sub', 'heroActions', 'demo', 'userMsg', 'sources'].forEach(id => reveal(document.getElementById(id)));
  document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('in'));
} else {
  setTimeout(() => {
    typeInto(stream, headline, () => {
      reveal(sub); reveal(actions); reveal(demo);
      setTimeout(() => {
        reveal(userMsg);
        setTimeout(() => typeInto(answerEl, answer, () => reveal(sources)), 500);
      }, 550);
    });
  }, 1500);
}

/* ---- reveal on scroll ---- */
if (!reduced && 'IntersectionObserver' in window) {
  document.querySelectorAll('.card, .usp, .tier, .steps li, .kicker, h2, .lede').forEach(el => el.classList.add('reveal-on-scroll'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-on-scroll').forEach(el => io.observe(el));
}
