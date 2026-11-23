// Deterministic force-directed layout: clustered by group, springs on edges, repulsion between nodes.
// ponytail: O(n²) repulsion per tick; fine for ~100 nodes, switch to a quadtree (Barnes-Hut) past ~1,000.
export interface LayoutNode { id: string; group: string }
export interface Point { x: number; y: number }

export function forceLayout(nodes: LayoutNode[], edges: { from: string; to: string; weight?: number }[], opts = { width: 1200, height: 900, ticks: 400 }): Map<string, Point> {
  const { width, height, ticks } = opts;
  const groups = [...new Set(nodes.map((n) => n.group))];
  const cx = width / 2, cy = height / 2;
  const R = Math.min(width, height) * 0.36;
  // Each group gets an anchor on a circle; nodes start near their anchor in a small spiral (deterministic).
  const anchor = new Map(groups.map((g, i) => [g, { x: cx + R * Math.cos((2 * Math.PI * i) / groups.length), y: cy + R * Math.sin((2 * Math.PI * i) / groups.length) }]));
  const pos = nodes.map((n, i) => {
    const a = anchor.get(n.group)!;
    const t = i * 2.399963; // golden angle
    return { x: a.x + 18 * Math.sqrt(i % 15 + 1) * Math.cos(t), y: a.y + 18 * Math.sqrt(i % 15 + 1) * Math.sin(t) };
  });
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  // weight scales a link's spring: cross-group links use a low weight so clusters stay apart.
  const links = edges.map((e) => [index.get(e.from), index.get(e.to), e.weight ?? 1] as const).filter(([a, b]) => a !== undefined && b !== undefined) as [number, number, number][];

  const REPULSE = 2200, SPRING = 0.04, LENGTH = 60, GRAVITY = 0.025;
  for (let t = 0; t < ticks; t++) {
    const cool = 1 - t / ticks;
    const fx = new Float64Array(nodes.length), fy = new Float64Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 0.01) { dx = 0.1 * ((i % 7) - 3); dy = 0.1; d2 = dx * dx + dy * dy; }
        const f = REPULSE / d2;
        const d = Math.sqrt(d2);
        fx[i] += (f * dx) / d; fy[i] += (f * dy) / d;
        fx[j] -= (f * dx) / d; fy[j] -= (f * dy) / d;
      }
    }
    for (const [a, b, w] of links) {
      const dx = pos[b].x - pos[a].x, dy = pos[b].y - pos[a].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = SPRING * w * (d - LENGTH);
      fx[a] += (f * dx) / d; fy[a] += (f * dy) / d;
      fx[b] -= (f * dx) / d; fy[b] -= (f * dy) / d;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = anchor.get(nodes[i].group)!;
      fx[i] += GRAVITY * (a.x - pos[i].x) * 4;
      fy[i] += GRAVITY * (a.y - pos[i].y) * 4;
      const step = 8 * cool + 0.5;
      const mag = Math.sqrt(fx[i] * fx[i] + fy[i] * fy[i]) || 1;
      pos[i].x += (fx[i] / mag) * Math.min(mag, step);
      pos[i].y += (fy[i] / mag) * Math.min(mag, step);
      pos[i].x = Math.max(20, Math.min(width - 20, pos[i].x));
      pos[i].y = Math.max(20, Math.min(height - 20, pos[i].y));
    }
  }
  return new Map(nodes.map((n, i) => [n.id, pos[i]]));
}
