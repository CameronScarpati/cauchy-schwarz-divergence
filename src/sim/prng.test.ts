import { describe, expect, it } from 'vitest'
import { mulberry32 } from './prng.ts'

describe('mulberry32', () => {
  it('reproduces the exact golden sequence for seed 42', () => {
    const rng = mulberry32(42)
    expect(Array.from({ length: 8 }, rng)).toEqual([
      0.6011037519201636, 0.44829055899754167, 0.8524657934904099, 0.6697340414393693,
      0.17481389874592423, 0.5265925421845168, 0.2732279943302274, 0.6247446539346129,
    ])
  })

  it('reproduces the exact golden sequence for seed 2026', () => {
    const rng = mulberry32(2026)
    expect(Array.from({ length: 4 }, rng)).toEqual([
      0.45540769933722913, 0.30849614599719644, 0.6611574492417276, 0.6184752183035016,
    ])
  })

  it('produces identical streams from identical seeds', () => {
    const a = mulberry32(123)
    const b = mulberry32(123)
    expect(Array.from({ length: 100 }, a)).toEqual(Array.from({ length: 100 }, b))
  })

  it('produces different streams from different seeds', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = Array.from({ length: 8 }, a)
    const seqB = Array.from({ length: 8 }, b)
    expect(seqA).not.toEqual(seqB)
  })

  it('stays inside [0, 1)', () => {
    const rng = mulberry32(999)
    for (let i = 0; i < 10000; i++) {
      const u = rng()
      expect(u).toBeGreaterThanOrEqual(0)
      expect(u).toBeLessThan(1)
    }
  })
})
