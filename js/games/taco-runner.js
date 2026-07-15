(function () {
  'use strict';

  const canvas = document.getElementById('runnerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('runnerScore');
  const distanceEl = document.getElementById('runnerDistance');
  const bestEl = document.getElementById('runnerBest');
  const statusEl = document.getElementById('runnerStatus');
  const startBtn = document.getElementById('runnerStart');
  const pauseBtn = document.getElementById('runnerPause');
  const restartBtn = document.getElementById('runnerRestart');
  const jumpBtn = document.getElementById('runnerJump');

  const W = canvas.width;
  const H = canvas.height;
  const ground = 438;
  const taco = { x: 130, y: ground - 72, w: 82, h: 72, vy: 0, grounded: true };
  let obstacles = [];
  let lemons = [];
  let running = false;
  let gameOver = false;
  let raf = 0;
  let last = 0;
  let obstacleClock = 0;
  let lemonClock = 0;
  let distance = 0;
  let score = 0;
  let speed = 330;
  let best = readBest();

  function readBest() { try { return Number(localStorage.getItem('bantacoRunnerBest')) || 0; } catch { return 0; } }
  function saveBest() { try { localStorage.setItem('bantacoRunnerBest', String(best)); } catch {} }
  function sync() {
    scoreEl.textContent = score;
    distanceEl.textContent = `${Math.floor(distance)} m`;
    bestEl.textContent = `${best} m`;
  }

  function reset() {
    cancelAnimationFrame(raf);
    running = false;
    gameOver = false;
    obstacles = [];
    lemons = [];
    distance = 0;
    score = 0;
    speed = 330;
    taco.y = ground - taco.h;
    taco.vy = 0;
    taco.grounded = true;
    obstacleClock = 0;
    lemonClock = 0;
    pauseBtn.textContent = 'Pausar';
    statusEl.textContent = 'Presiona Iniciar para comenzar.';
    sync();
    draw();
  }

  function start() {
    if (gameOver) reset();
    if (running) return;
    running = true;
    last = performance.now();
    pauseBtn.textContent = 'Pausar';
    statusEl.textContent = 'Salta obstáculos y recoge los limones amarillos.';
    raf = requestAnimationFrame(loop);
  }

  function pause(message = 'Juego pausado.') {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    pauseBtn.textContent = 'Continuar';
    statusEl.textContent = message;
    draw();
  }

  function jump() {
    if (!running) start();
    if (taco.grounded && running) {
      taco.vy = -760;
      taco.grounded = false;
    }
  }

  function finish() {
    running = false;
    gameOver = true;
    const meters = Math.floor(distance);
    if (meters > best) { best = meters; saveBest(); }
    sync();
    statusEl.textContent = `Fin de la carrera: ${meters} m y ${score} limones.`;
    draw(true);
  }

  function spawnObstacle() {
    const h = 55 + Math.random() * 45;
    obstacles.push({ x: W + 40, y: ground - h, w: 42 + Math.random() * 28, h });
  }

  function spawnLemon() {
    const high = Math.random() < .45;
    lemons.push({ x: W + 55, y: high ? ground - 165 : ground - 82, r: 24, collected: false, bob: Math.random() * Math.PI * 2 });
  }

  function overlaps(a, b, pad = 0) {
    return a.x + pad < b.x + b.w && a.x + a.w - pad > b.x && a.y + pad < b.y + b.h && a.y + a.h - pad > b.y;
  }

  function update(dt) {
    distance += dt * speed / 15;
    speed = Math.min(520, 330 + distance * .48);
    taco.vy += 1900 * dt;
    taco.y += taco.vy * dt;
    if (taco.y >= ground - taco.h) { taco.y = ground - taco.h; taco.vy = 0; taco.grounded = true; }

    obstacleClock += dt;
    lemonClock += dt;
    if (obstacleClock > Math.max(.92, 1.65 - speed / 900)) { obstacleClock = 0; spawnObstacle(); }
    if (lemonClock > 1.05) { lemonClock = 0; spawnLemon(); }

    obstacles.forEach((item) => { item.x -= speed * dt; });
    lemons.forEach((item) => { item.x -= speed * dt; item.bob += dt * 5; });

    const tacoBox = { x: taco.x + 8, y: taco.y + 7, w: taco.w - 16, h: taco.h - 10 };
    for (const obstacle of obstacles) {
      if (overlaps(tacoBox, obstacle, 6)) { finish(); return; }
    }
    lemons.forEach((lemon) => {
      const lemonBox = { x: lemon.x - lemon.r, y: lemon.y - lemon.r, w: lemon.r * 2, h: lemon.r * 2 };
      if (!lemon.collected && overlaps(tacoBox, lemonBox, 4)) { lemon.collected = true; score += 1; }
    });
    obstacles = obstacles.filter((item) => item.x + item.w > -30);
    lemons = lemons.filter((item) => !item.collected && item.x + item.r > -30);
    sync();
  }

  function drawTaco() {
    ctx.save();
    ctx.translate(taco.x + taco.w / 2, taco.y + taco.h / 2);
    ctx.rotate(Math.sin(distance * .08) * .05);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#8b4716';
    ctx.fillStyle = '#f5c54f';
    ctx.beginPath();
    ctx.arc(0, 12, 36, Math.PI, 0);
    ctx.lineTo(36, 14);
    ctx.quadraticCurveTo(0, 38, -36, 14);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7e2a19';
    ctx.fillRect(-24, 2, 12, 13); ctx.fillRect(-6, -1, 12, 15); ctx.fillRect(14, 2, 11, 12);
    ctx.fillStyle = '#3e9b48';
    ctx.fillRect(-18, -6, 8, 9); ctx.fillRect(9, -7, 8, 9);
    ctx.fillStyle = '#1d120d';
    ctx.beginPath(); ctx.arc(-13, 20, 3, 0, Math.PI * 2); ctx.arc(13, 20, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1d120d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 19, 8, .2, Math.PI - .2); ctx.stroke();
    ctx.restore();
  }

  function drawLemon(lemon) {
    const y = lemon.y + Math.sin(lemon.bob) * 7;
    ctx.save();
    ctx.shadowColor = '#fff36a';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ffe43d';
    ctx.strokeStyle = '#604f00';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(lemon.x, y, 28, 22, -.18, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff7a0';
    ctx.beginPath(); ctx.ellipse(lemon.x - 8, y - 7, 8, 5, -.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#299346';
    ctx.strokeStyle = '#155b2c';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(lemon.x + 18, y - 21, 11, 6, -.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function draw(finished = false) {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#7dd6f3'); sky.addColorStop(.68, '#fff0b0'); sky.addColorStop(1, '#f2a34c');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.beginPath(); ctx.arc(160, 100, 38, 0, Math.PI * 2); ctx.arc(205, 105, 52, 0, Math.PI * 2); ctx.arc(260, 108, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8fc86a'; ctx.fillRect(0, ground - 22, W, 22);
    ctx.fillStyle = '#b92e21'; ctx.fillRect(0, ground, W, H - ground);
    ctx.fillStyle = '#f2c64c';
    for (let x = -((distance * 12) % 100); x < W; x += 100) ctx.fillRect(x, ground + 47, 58, 7);

    obstacles.forEach((item) => {
      ctx.fillStyle = '#3f2820'; ctx.strokeStyle = '#1d120f'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.roundRect(item.x, item.y, item.w, item.h, 9); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f07a23'; ctx.fillRect(item.x + 8, item.y + 11, item.w - 16, 10);
    });
    lemons.forEach(drawLemon);
    drawTaco();

    if (!running) {
      ctx.fillStyle = 'rgba(18,10,7,.38)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = '900 44px Trebuchet MS, sans-serif';
      ctx.fillText(finished ? '¡Cuidado con el obstáculo!' : 'Taco Runner', W / 2, H / 2 - 10);
      ctx.font = '700 22px system-ui, sans-serif';
      ctx.fillText(finished ? `${Math.floor(distance)} m · ${score} limones` : 'Presiona Iniciar', W / 2, H / 2 + 34);
    }
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, .04);
    last = now;
    update(dt);
    draw();
    if (running) raf = requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', () => running ? pause() : start());
  restartBtn.addEventListener('click', reset);
  jumpBtn.addEventListener('click', jump);
  canvas.addEventListener('pointerdown', (event) => { event.preventDefault(); jump(); });
  window.addEventListener('keydown', (event) => {
    if (document.getElementById('runnerGamePanel').hidden) return;
    if (event.code === 'Space' || event.key === 'ArrowUp') { event.preventDefault(); jump(); }
  }, { passive: false });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause('Juego pausado porque cambiaste de pestaña.'); });
  window.addEventListener('bantaco:game-close', (event) => { if (event.detail.game === 'runner') pause('Juego pausado al cerrar el panel.'); });

  bestEl.textContent = `${best} m`;
  reset();
})();
