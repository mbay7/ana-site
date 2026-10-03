const stream = document.getElementById('stream');
const sub = document.getElementById('sub');
const actions = document.getElementById('heroActions');
const words = ['Every', 'brand.', 'Its', 'own', 'I.'];

function reveal() {
  sub.classList.add('reveal');
  actions.classList.add('reveal');
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  stream.textContent = words.join(' ');
  reveal();
} else {
  setTimeout(() => {
    let i = 0;
    const step = () => {
      if (i < words.length) {
        stream.textContent = words.slice(0, i + 1).join(' ');
        i += 1;
        setTimeout(step, 270);
      } else {
        reveal();
      }
    };
    step();
  }, 1500);
}
