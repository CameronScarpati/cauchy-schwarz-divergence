import type { Rng } from './prng.ts'

/*
 * Inverse-CDF sampling: U = 0.5 maps exactly to the location x0, and the
 * heavy tails come from tan approaching its poles near U = 0 and U = 1.
 */
export function cauchySample(rng: Rng, x0: number, gamma: number): number {
  return x0 + gamma * Math.tan(Math.PI * (rng() - 0.5))
}

/*
 * Box-Muller, cosine branch only, so every call consumes exactly two
 * uniforms and stays stateless. 1 - rng() shifts [0, 1) to (0, 1] and
 * keeps Math.log finite.
 */
export function normalSample(rng: Rng, mu: number, sigma: number): number {
  const u = 1 - rng()
  const v = rng()
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
