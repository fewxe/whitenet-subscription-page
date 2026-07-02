const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let W,
  H,
  stars = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.6 + 0.3,
    a: Math.random() * 0.6 + 0.2,
    speed: 0.2 + Math.random() * 0.5,
    phase: Math.random() * 6.28,
  });
}

let t = 0;

function draw() {
  t += 0.01;
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    const flicker = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${s.a * flicker})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();
