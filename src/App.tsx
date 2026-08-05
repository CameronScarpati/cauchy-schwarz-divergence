import { useCallback, useState } from 'react'
import { DEFAULT_CONFIG, type Readout, type SimConfig } from './config.ts'
import { Controls } from './ui/Controls.tsx'
import { ConvergenceCanvas } from './viz/ConvergenceCanvas.tsx'
import { formatReadout } from './viz/scales.ts'

function App() {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG)
  const [restartToken, setRestartToken] = useState(0)
  const [readout, setReadout] = useState<Readout | null>(null)

  const handleChange = useCallback((patch: Partial<SimConfig>) => {
    setConfig((current) => ({ ...current, ...patch }))
  }, [])

  const handleRestart = useCallback(() => {
    setRestartToken((token) => token + 1)
  }, [])

  const handleReseed = useCallback(() => {
    /* Seeds stay visible and re-enterable, so a reseed just picks a fresh
       small number from the clock rather than touching Math.random. */
    setConfig((current) => ({ ...current, seed: Date.now() % 1_000_000 }))
  }, [])

  return (
    <main>
      <h1>Cauchy Convergence</h1>
      <p>
        Watch the running mean of Cauchy samples refuse to settle while the running median
        converges. Solid trace is the mean, dashed trace is the median.
      </p>
      <ConvergenceCanvas config={config} restartToken={restartToken} onReadout={setReadout} />
      <dl className="readouts">
        <div>
          <dt>n</dt>
          <dd>{readout ? readout.n : 0}</dd>
        </div>
        <div>
          <dt>mean</dt>
          <dd>{readout ? formatReadout(readout.mean) : 'n/a'}</dd>
        </div>
        <div>
          <dt>median</dt>
          <dd>{readout ? formatReadout(readout.median) : 'n/a'}</dd>
        </div>
        <div>
          <dt>last draw</dt>
          <dd>{readout ? formatReadout(readout.lastValue) : 'n/a'}</dd>
        </div>
        <div>
          <dt>off scale</dt>
          <dd>{readout ? readout.offScaleCount : 0}</dd>
        </div>
      </dl>
      <Controls
        config={config}
        onChange={handleChange}
        onRestart={handleRestart}
        onReseed={handleReseed}
      />
    </main>
  )
}

export default App
