import { describe, expect, it } from 'vitest'
import {
  SYMLOG_LIMIT,
  formatReadout,
  formatTick,
  isOffScale,
  makeXScale,
  makeYScale,
  yTickValues,
} from './scales.ts'

describe('makeXScale', () => {
  it('maps sample 1 to the left edge and the max to the right edge', () => {
    const x = makeXScale(5000, [0, 800])
    expect(x(1)).toBe(0)
    expect(x(5000)).toBe(800)
  })
})

describe('makeYScale symlog', () => {
  const y = makeYScale('symlog', 0, 1, [400, 0])

  it('is symmetric about the vertical center', () => {
    expect(y(0)).toBe(200)
    expect(y(50) + y(-50)).toBeCloseTo(400, 9)
  })

  it('is monotone from bottom to top', () => {
    expect(y(10)).toBeLessThan(y(1))
    expect(y(-10)).toBeGreaterThan(y(-1))
  })

  it('clamps astronomical draws to the range edge', () => {
    expect(y(1e15)).toBe(0)
    expect(y(-1e15)).toBe(400)
  })

  it('keeps typical draws in a usable band rather than crushed at center', () => {
    const px = 200 - y(1)
    expect(px).toBeGreaterThan(10)
  })
})

describe('makeYScale linear', () => {
  const y = makeYScale('linear', -1, 0.5, [400, 0])

  it('centers the location parameter and spans ten scale units each way', () => {
    expect(y(-1)).toBe(200)
    expect(y(4)).toBe(0)
    expect(y(-6)).toBe(400)
  })

  it('clamps beyond the span', () => {
    expect(y(1000)).toBe(0)
    expect(y(-1000)).toBe(400)
  })
})

describe('isOffScale', () => {
  it('flags values outside the domain in either mode', () => {
    const sym = makeYScale('symlog', 0, 1, [400, 0])
    expect(isOffScale(sym, SYMLOG_LIMIT * 2)).toBe(true)
    expect(isOffScale(sym, -SYMLOG_LIMIT * 2)).toBe(true)
    expect(isOffScale(sym, 500)).toBe(false)

    const lin = makeYScale('linear', 0, 1, [400, 0])
    expect(isOffScale(lin, 11)).toBe(true)
    expect(isOffScale(lin, -11)).toBe(true)
    expect(isOffScale(lin, 9)).toBe(false)
  })
})

describe('yTickValues', () => {
  it('returns signed decades plus zero for symlog', () => {
    const sym = makeYScale('symlog', 0, 1, [400, 0])
    expect(yTickValues('symlog', sym)).toEqual([
      -1e6, -1e4, -100, -10, -1, 0, 1, 10, 100, 1e4, 1e6,
    ])
  })

  it('returns nice linear ticks covering the domain', () => {
    const lin = makeYScale('linear', 0, 1, [400, 0])
    const ticks = yTickValues('linear', lin)
    expect(ticks.length).toBeGreaterThan(3)
    expect(Math.min(...ticks)).toBeGreaterThanOrEqual(-10)
    expect(Math.max(...ticks)).toBeLessThanOrEqual(10)
  })
})

describe('formatting', () => {
  it('formats ticks compactly', () => {
    expect(formatTick(0)).toBe('0')
    expect(formatTick(-100)).toBe('-100')
    expect(formatTick(1e6)).toBe('1e6')
    expect(formatTick(-1e4)).toBe('-1e4')
    expect(formatTick(0.5)).toBe('0.5')
    expect(formatTick(5000)).toBe('5000')
  })

  it('formats readouts with fixed digits and scientific fallback', () => {
    expect(formatReadout(Number.NaN)).toBe('n/a')
    expect(formatReadout(1.5)).toBe('1.500')
    expect(formatReadout(0)).toBe('0.000')
    expect(formatReadout(123456)).toBe('1.23e+5')
    expect(formatReadout(-0.0004)).toBe('-4.00e-4')
  })
})
