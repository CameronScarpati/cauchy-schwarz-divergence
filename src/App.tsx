import { DEFAULT_CONFIG } from './config.ts'
import { ConvergenceCanvas } from './viz/ConvergenceCanvas.tsx'

function App() {
  return (
    <main>
      <h1>Cauchy Convergence</h1>
      <p>
        Watch the running mean of Cauchy samples refuse to settle while the running median
        converges. Solid trace is the mean, dashed trace is the median.
      </p>
      <ConvergenceCanvas config={DEFAULT_CONFIG} />
    </main>
  )
}

export default App
