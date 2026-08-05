import { describe, expect, it } from 'vitest'
import { PRESETS } from './config.ts'

/* Presets bypass the sliders, so they must stay inside the ranges the
   sliders can express or the controls desync from the running config. */
describe('classroom presets', () => {
  it('has unique labels', () => {
    const labels = PRESETS.map((p) => p.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  it.each(PRESETS.map((p) => [p.label, p] as const))('%s stays in control range', (_, preset) => {
    const { config } = preset
    expect(config.location).toBeGreaterThanOrEqual(-5)
    expect(config.location).toBeLessThanOrEqual(5)
    expect(config.scale).toBeGreaterThanOrEqual(0.1)
    expect(config.scale).toBeLessThanOrEqual(5)
    expect([25, 50, 100, 250, 500, 1000, 2000]).toContain(config.samplesPerSecond)
    expect(config.runs).toBeGreaterThanOrEqual(1)
    expect(config.runs).toBeLessThanOrEqual(5)
    expect(config.seed).toBeGreaterThanOrEqual(0)
    expect(config.maxSamples).toBeGreaterThan(0)
  })

  it('pairs each distribution with its natural axis', () => {
    for (const preset of PRESETS) {
      expect(preset.config.yMode).toBe(
        preset.config.distribution === 'normal' ? 'linear' : 'symlog',
      )
    }
  })
})
