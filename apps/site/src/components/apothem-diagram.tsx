/** Illustrates the apothem: the segment from a regular polygon's center to the midpoint of one edge. */
export function ApothemDiagram({ className }: { className?: string }) {
  const cx = 100;
  const cy = 100;
  const r = 78;
  const sides = 6;
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
  const [p0, p1] = points;
  const edgeMidpoint: readonly [number, number] = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <polygon
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="var(--apothem-border-strong)"
        strokeWidth="1.5"
      />
      <line
        x1={cx}
        y1={cy}
        x2={edgeMidpoint[0]}
        y2={edgeMidpoint[1]}
        stroke="var(--apothem-accent)"
        strokeWidth="2.5"
      />
      <circle cx={cx} cy={cy} r="4" fill="var(--apothem-accent)" />
      <circle cx={edgeMidpoint[0]} cy={edgeMidpoint[1]} r="3" fill="var(--apothem-accent)" />
    </svg>
  );
}
