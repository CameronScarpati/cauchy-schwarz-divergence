import { useCallback, useState } from 'react'
import { DEFAULT_CONFIG, type Readout, type SimConfig } from './config.ts'
import { Controls } from './ui/Controls.tsx'
import { Explainer } from './ui/Explainer.tsx'
import { ThemeToggle } from './ui/ThemeToggle.tsx'
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
    <div className="page">
      <header className="masthead">
        <div>
          <h1>Cauchy Convergence</h1>
          <p className="tagline">
            A running average that never settles, and the median that does.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <main className="layout">
        <section
          className="chart-panel"
          data-distribution={config.distribution}
          aria-label="Convergence simulation"
        >
          <ul className="legend">
            <li>
              <span className="swatch swatch-mean" aria-hidden="true" />
              running mean
            </li>
            <li>
              <span className="swatch swatch-median" aria-hidden="true" />
              running median
            </li>
            <li>
              <span className="swatch swatch-target" aria-hidden="true" />
              location
            </li>
          </ul>
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
        </section>
        <Explainer />
        <Controls
          config={config}
          onChange={handleChange}
          onRestart={handleRestart}
          onReseed={handleReseed}
        />
      </main>
    </div>
  )
}

export default App
