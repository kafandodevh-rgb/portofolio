// ===== CURSEUR CUSTOM =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Ring suit avec lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover sur éléments cliquables
document.querySelectorAll('a, button, .competence-card, .projet-card, .moment-card, .meta-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    ring.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    ring.classList.remove('hover');
  });
});

document.addEventListener('mousedown', () => {
  cursor.classList.add('click');
  ring.classList.add('click');
});
document.addEventListener('mouseup', () => {
  cursor.classList.remove('click');
  ring.classList.remove('click');
});

// ===== CANVAS FOND INTERACTIF =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h;
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const colors = ['#00D4FF', '#FF6B2B', '#FFB800', '#00E676', '#FF4FA3'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life = 1;
  }
  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      this.x += dx * 0.015;
      this.y += dy * 0.015;
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
    }
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Init particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

// Connexions entre particules proches
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 80) * 0.15;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

// Effet ripple au clic
let ripples = [];
document.addEventListener('click', e => {
  ripples.push({
    x: e.clientX,
    y: e.clientY,
    r: 0,
    alpha: 0.6,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
});

function animateCanvas() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();

  // Ripples
  ripples = ripples.filter(r => r.alpha > 0);
  ripples.forEach(r => {
    ctx.save();
    ctx.globalAlpha = r.alpha;
    ctx.strokeStyle = r.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    r.r += 4;
    r.alpha -= 0.025;
  });

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ===== SCROLL FADE =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
