(function () {
  'use strict';

  const canvas = document.getElementById('catchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('catchScore');
  const timeEl = document.getElementById('catchTime');
  const bestEl = document.getElementById('catchBest');
  const statusEl = document.getElementById('catchStatus');
  const startBtn = document.getElementById('catchStart');
  const pauseBtn = document.getElementById('catchPause');
  const restartBtn = document.getElementById('catchRestart');
  const leftBtn = document.getElementById('catchLeft');
  const rightBtn = document.getElementById('catchRight');

  const W = canvas.width;
  const H = canvas.height;
  const tray = { x: W / 2 - 75, y: H - 78, w: 150, h: 32, speed: 520 };
  let items = [];
  let score = 0;
  let remaining = 30;
  let running = false;
  let gameOver = false;
  let raf = 0;
  let last = 0;
  let spawnClock = 0;
  let leftPressed = false;
  let rightPressed = false;
  let best = readBest();

  function readBest() { try { return Number(localStorage.getItem('bantacoCatchBest')) || 0; } catch { return 0; } }
  function saveBest() { try { localStorage.setItem('bantacoCatchBest', String(best)); } catch {} }
  function sync() {
    scoreEl.textContent = score;
    timeEl.textContent = Math.max(0, Math.ceil(remaining));
    bestEl.textContent = best;
  }

  function reset() {
    cancelAnimationFrame(raf);
    running = false;
    gameOver = false;
    score = 0;
    remaining = 30;
    items = [];
    tray.x = W / 2 - tray.w / 2;
    spawnClock = 0;
    pauseBtn.textContent = 'Pausar';
    statusEl.textContent = 'Presiona Iniciar para comenzar.';
    sync();
    draw();
  }

  function start() {
    if (gameOver || remaining <= 0) reset();
    if (running) return;
    running = true;
    last = performance.now();
    startBtn.textContent = 'Continuar';
    pauseBtn.textContent = 'Pausar';
    statusEl.textContent = '¡Atrapa todos los tacos que puedas!';
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

  function togglePause() { running ? pause() : start(); }

  function finish() {
    running = false;
    gameOver = true;
    if (score > best) { best = score; saveBest(); }
    sync();
    statusEl.textContent = `Partida terminada. Conseguistes ${score} puntos.`.replace('Conseguistes', 'Conseguiste');
    draw(true);
  }

  function spawn() {
    const burnt = Math.random() < .22;
    items.push({ x: 36 + Math.random() * (W - 92), y: -45, r: 28, vy: 170 + Math.random() * 95, burnt, spin: Math.random() * Math.PI });
  }

  function update(dt) {
    remaining -= dt;
    if (remaining <= 0) { remaining = 0; finish(); return; }
    if (leftPressed) tray.x -= tray.speed * dt;
    if (rightPressed) tray.x += tray.speed * dt;
    tray.x = Math.max(8, Math.min(W - tray.w - 8, tray.x));
    spawnClock += dt;
    if (spawnClock >= .62) { spawnClock = 0; spawn(); }

    items.forEach((item) => { item.y += item.vy * dt; item.spin += dt * 2; });
    items = items.filter((item) => {
      const hit = item.y + item.r > tray.y && item.y - item.r < tray.y + tray.h && item.x > tray.x - item.r && item.x < tray.x + tray.w + item.r;
      if (hit) { score += item.burnt ? -1 : 1; score = Math.max(0, score); return false; }
      return item.y - item.r < H + 20;
    });
    sync();
  }

  function drawTaco(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.sin(item.spin) * .16);
    ctx.lineWidth = 5;
    ctx.strokeStyle = item.burnt ? '#24120e' : '#9b5218';
    ctx.fillStyle = item.burnt ? '#4a261b' : '#f4c04f';
    ctx.beginPath();
    ctx.arc(0, 8, item.r, Math.PI, 0);
    ctx.lineTo(item.r, 10);
    ctx.quadraticCurveTo(0, 32, -item.r, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = item.burnt ? '#0b0908' : '#7c2d19';
    for (let i = -17; i <= 17; i += 11) ctx.fillRect(i, 0 + Math.abs(i) * .08, 7, 9);
    if (!item.burnt) {
      ctx.fillStyle = '#3f9a45';
      ctx.fillRect(-17, -4, 7, 8);
      ctx.fillRect(8, -5, 7, 8);
    } else {
      ctx.fillStyle = '#ff7a28';
      ctx.beginPath(); ctx.arc(0, -10, 6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function draw(finished = false) {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#ffe29a');
    gradient.addColorStop(1, '#f09a45');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255,255,255,.23)';
    for (let i = 0; i < W; i += 120) ctx.fillRect(i, 86, 70, 5);
    ctx.fillStyle = '#b02b20';
    ctx.fillRect(0, H - 44, W, 44);

    items.forEach(drawTaco);
    ctx.fillStyle = '#c8c8c8';
    ctx.strokeStyle = '#3a302d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(tray.x, tray.y, tray.w, tray.h, 12);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef7b21';
    ctx.fillRect(tray.x + 18, tray.y + 9, tray.w - 36, 8);

    if (!running) {
      ctx.fillStyle = 'rgba(20,10,7,.42)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = '900 44px Trebuchet MS, sans-serif';
      ctx.fillText(finished ? '¡Tiempo!' : 'Atrapa los tacos', W / 2, H / 2 - 10);
      ctx.font = '700 22px system-ui, sans-serif';
      ctx.fillText(finished ? `Puntuación: ${score}` : 'Presiona Iniciar', W / 2, H / 2 + 34);
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

  function setDirection(direction, pressed) {
    if (direction === 'left') leftPressed = pressed;
    if (direction === 'right') rightPressed = pressed;
  }
  [['pointerdown', true], ['pointerup', false], ['pointercancel', false], ['pointerleave', false]].forEach(([eventName, value]) => {
    leftBtn.addEventListener(eventName, (event) => { event.preventDefault(); setDirection('left', value); });
    rightBtn.addEventListener(eventName, (event) => { event.preventDefault(); setDirection('right', value); });
  });
  window.addEventListener('keydown', (event) => {
    if (document.getElementById('catchGamePanel').hidden) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setDirection(event.key === 'ArrowLeft' ? 'left' : 'right', true);
    }
  }, { passive: false });
  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') setDirection('left', false);
    if (event.key === 'ArrowRight') setDirection('right', false);
  });
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', togglePause);
  restartBtn.addEventListener('click', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause('Juego pausado porque cambiaste de pestaña.'); });
  window.addEventListener('bantaco:game-close', (event) => { if (event.detail.game === 'catch') pause('Juego pausado al cerrar el panel.'); });

  bestEl.textContent = best;
  reset();
})();
