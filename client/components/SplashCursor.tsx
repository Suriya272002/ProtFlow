import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

const COLORS = [
  "#d6baff",
  "#00dbe9",
  "#e84393",
  "#7832d9",
  "#a06bff",
  "#26c6da",
  "#ff6fa8",
  "#7df4ff",
];

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnSplash(x: number, y: number, count = 8) {
      const particles = particlesRef.current;
      for (let i = 0; i < count; i++) {
        const angle = randomRange(0, Math.PI * 2);
        const speed = randomRange(1, 5);
        const size = randomRange(2, 8);
        const maxLife = randomRange(30, 70);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          size,
          color: randomColor(),
          alpha: 1,
        });
      }
    }

    function spawnTrail(x: number, y: number) {
      const particles = particlesRef.current;
      for (let i = 0; i < 3; i++) {
        const size = randomRange(1.5, 5);
        const maxLife = randomRange(20, 50);
        particles.push({
          x: x + randomRange(-4, 4),
          y: y + randomRange(-4, 4),
          vx: randomRange(-0.5, 0.5),
          vy: randomRange(-0.5, 0.5),
          life: maxLife,
          maxLife,
          size,
          color: randomColor(),
          alpha: 0.7,
        });
      }
    }

    const onMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.prevX = m.x;
      m.prevY = m.y;
      m.x = e.clientX;
      m.y = e.clientY;

      const dx = m.x - m.prevX;
      const dy = m.y - m.prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn trail particles along the path
      const steps = Math.min(Math.ceil(dist / 6), 10);
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        spawnTrail(m.prevX + dx * t, m.prevY + dy * t);
      }

      // Big splash on fast movement or random chance
      if (dist > 25 || Math.random() > 0.85) {
        spawnSplash(m.x, m.y, Math.min(Math.floor(dist / 8), 12));
      }
    };

    const onClick = (e: MouseEvent) => {
      spawnSplash(e.clientX, e.clientY, 24);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += 0.05; // light gravity
        p.alpha = (p.life / p.maxLife) * (p.life / p.maxLife);
        p.size *= 0.985;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
}
