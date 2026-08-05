import { describe, expect, it } from 'vitest'
import { mulberry32 } from './prng.ts'
import { cauchySample, normalSample } from './sampling.ts'

describe('cauchySample', () => {
  it('returns exactly x0 when U is 0.5', () => {
    const half = () => 0.5
    expect(cauchySample(half, 0, 1)).toBe(0)
    expect(cauchySample(half, -3.25, 0.4)).toBe(-3.25)
    expect(cauchySample(half, 7, 12)).toBe(7)
  })

  it('blows up toward the tails as U approaches 1', () => {
    expect(cauchySample(() => 0.999999, 0, 1)).toBeGreaterThan(1e5)
    expect(cauchySample(() => 0.000001, 0, 1)).toBeLessThan(-1e5)
  })

  it('reproduces the exact golden sequence for seed 7', () => {
    const rng = mulberry32(7)
    expect(Array.from({ length: 5 }, () => cauchySample(rng, 0, 1))).toEqual([
      -27.182666880723225, -5.072442301178968, 13.760012615691743,
      0.7218906854577243, 0.06747441837310422,
    ])
  })

  it('has quartiles near x0 - gamma and x0 + gamma on a long seeded run', () => {
    const rng = mulberry32(5)
    const n = 20001
    const draws = Array.from({ length: n }, () => cauchySample(rng, -1, 0.5)).sort((a, b) => a - b)
    expect(draws[Math.floor(n / 2)]).toBeCloseTo(-1, 1)
    expect(draws[Math.floor(n / 4)]).toBeCloseTo(-1.5, 1)
    expect(draws[Math.floor((3 * n) / 4)]).toBeCloseTo(-0.5, 1)
  })
})

describe('normalSample', () => {
  it('reproduces the exact golden sequence for seed 7', () => {
    const rng = mulberry32(7)
    expect(Array.from({ length: 5 }, () => normalSample(rng, 0, 1))).toEqual([
      0.14197043782155663, -0.8642530248729361, -1.006366324094015,
      0.07088442311648852, -0.16052933094006902,
    ])
  })

  it('matches the requested mean and standard deviation on a long seeded run', () => {
    const rng = mulberry32(99)
    const n = 20000
    const draws = Array.from({ length: n }, () => normalSample(rng, 1.5, 2))
    const mean = draws.reduce((s, x) => s + x, 0) / n
    const sd = Math.sqrt(draws.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1))
    expect(mean).toBeCloseTo(1.5, 1)
    expect(sd).toBeCloseTo(2, 1)
  })

  it('consumes exactly two uniforms per draw', () => {
    let calls = 0
    const counting = () => {
      calls += 1
      return 0.25
    }
    normalSample(counting, 0, 1)
    expect(calls).toBe(2)
  })
})
