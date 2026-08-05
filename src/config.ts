import type { YMode } from './viz/scales.ts'

export type Distribution = 'cauchy' | 'normal'

export interface SimConfig {
  distribution: Distribution
  /* x0 for Cauchy, mu for Normal */
  location: number
  /* gamma for Cauchy, sigma for Normal */
  scale: number
  seed: number
  samplesPerSecond: number
  maxSamples: number
  yMode: YMode
  /* independent overlaid runs, seeded deterministically from the base seed */
  runs: number
}

export const DEFAULT_CONFIG: SimConfig = {
  distribution: 'cauchy',
  location: 0,
  scale: 1,
  seed: 42,
  samplesPerSecond: 250,
  maxSamples: 5000,
  yMode: 'symlog',
  runs: 1,
}

/* Snapshot of the primary run, throttled out of the draw loop for React. */
export interface Readout {
  n: number
  mean: number
  median: number
  lastValue: number
  offScaleCount: number
  done: boolean
}
