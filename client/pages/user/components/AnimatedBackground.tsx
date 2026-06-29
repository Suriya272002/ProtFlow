/* ── AnimatedBackground ── */

const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  top: `${(i * 53) % 100}%`,
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 12) * 0.4}s`,
}));

export function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="orb o3" />
      <div className="orb o4" />
      <div className="grid-overlay" />
      <div className="sparkles">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          />
        ))}
      </div>
    </div>
  );
}
