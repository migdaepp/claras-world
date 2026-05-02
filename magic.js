/* Clara's Magical World — shared interactivity (vanilla JS, no React deps) */

(function () {
  // ---------- Click sparkles ----------
  const SPARKLE_CHARS = ['✨', '⭐', '💖', '🌟', '💫', '🦄'];
  const SPARKLE_COLORS = ['#ffb3d9', '#c8b3ff', '#fff3b8', '#cfe9ff', '#ffd4b8'];

  function spawnSparkle(x, y, char) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.textContent = char || SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', (Math.sin(angle) * dist - 30) + 'px');
    el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    el.style.fontSize = (16 + Math.random() * 18) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function burstAt(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnSparkle(x, y), i * 25);
    }
  }

  document.addEventListener('click', (e) => {
    // Don't double-fire on hidden elements
    burstAt(e.clientX, e.clientY, 10);
  });

  window.MagicSparkle = { burstAt, spawnSparkle };

  // ---------- Cursor unicorn ----------
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) {
    const uni = document.createElement('div');
    uni.className = 'cursor-unicorn';
    uni.textContent = '🦄';
    document.body.appendChild(uni);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let ux = mx, uy = my;
    let lastTrail = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      const now = performance.now();
      if (now - lastTrail > 60) {
        lastTrail = now;
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        const colors = ['#ffb3d9', '#c8b3ff', '#fff3b8', '#cfe9ff', '#d4f5e8'];
        trail.style.background = colors[Math.floor(Math.random() * colors.length)];
        trail.style.left = (mx + (Math.random() - 0.5) * 20) + 'px';
        trail.style.top = (my + (Math.random() - 0.5) * 20) + 'px';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 700);
      }
    });

    function follow() {
      ux += (mx - ux) * 0.18;
      uy += (my - uy) * 0.18;
      uni.style.left = ux + 'px';
      uni.style.top = uy + 'px';
      requestAnimationFrame(follow);
    }
    follow();
  }

  // ---------- Floating background sparkles ----------
  const bg = document.createElement('div');
  bg.className = 'bg-sparkles';
  document.body.appendChild(bg);
  const BG_CHARS = ['✨', '⭐', '💖', '🌸', '🌟', '☁️'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div');
    s.className = 'bg-sparkle';
    s.textContent = BG_CHARS[Math.floor(Math.random() * BG_CHARS.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.top = (100 + Math.random() * 50) + '%';
    s.style.animationDuration = (12 + Math.random() * 18) + 's';
    s.style.animationDelay = -(Math.random() * 20) + 's';
    s.style.fontSize = (12 + Math.random() * 16) + 'px';
    bg.appendChild(s);
  }

  // ---------- Find Teddy easter egg ----------
  // place a small Teddy somewhere on the page; clicking it celebrates
  const positions = [
    { top: '85%', left: '4%' },
    { top: '12%', right: '6%' },
    { bottom: '20%', right: '8%' },
  ];
  const pos = positions[Math.floor(Math.random() * positions.length)];
  const findTeddy = document.createElement('div');
  findTeddy.className = 'find-teddy';
  findTeddy.title = "You found Teddy!";
  findTeddy.textContent = '🧸';
  Object.assign(findTeddy.style, pos);
  findTeddy.addEventListener('click', (e) => {
    e.stopPropagation();
    findTeddy.classList.add('found');
    for (let i = 0; i < 30; i++) {
      setTimeout(() => spawnSparkle(
        e.clientX + (Math.random() - 0.5) * 40,
        e.clientY + (Math.random() - 0.5) * 40,
        ['💖', '⭐', '✨', '🌟'][Math.floor(Math.random() * 4)]
      ), i * 30);
    }
    showTeddyMessage();
  });
  // wait for body
  if (document.body) document.body.appendChild(findTeddy);
  else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(findTeddy));

  function showTeddyMessage() {
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%);
      background: white; padding: 24px 36px; border-radius: 24px;
      box-shadow: 0 12px 40px rgba(180,120,200,0.4);
      font-family: 'Fredoka', sans-serif; font-size: 22px; color: #b54a82;
      z-index: 10000; text-align: center; animation: pop-in 400ms ease-out;
    `;
    msg.innerHTML = '🧸 You found Teddy! ⭐<br><span style="font-size:14px;color:#8a78a8;font-family:Quicksand">Great job, hero!</span>';
    document.body.appendChild(msg);
    setTimeout(() => {
      msg.style.transition = 'opacity 400ms, transform 400ms';
      msg.style.opacity = '0';
      msg.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => msg.remove(), 400);
    }, 2200);
  }
})();
