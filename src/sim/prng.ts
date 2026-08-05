export type Rng = () => number

/*
 * mulberry32: a tiny 32-bit seeded generator returning uniforms in [0, 1).
 * Deterministic per seed so every run can be replayed exactly. Fine for a
 * visualization, not cryptographically secure. State wraps with >>> 0 each
 * step so long streams never lose integer precision.
 */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
