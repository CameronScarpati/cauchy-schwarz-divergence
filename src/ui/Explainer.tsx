import { motion, useReducedMotion } from 'motion/react'
import { MathBlock, MathInline } from './Math.tsx'

export function Explainer() {
  const reduced = useReducedMotion() === true
  return (
    <motion.section
      className="explainer"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2>What you are seeing</h2>
      <p>
        Draw random numbers from a Cauchy distribution and watch the running average. It never
        converges. Draw from a Normal distribution instead and the running average settles
        quickly. The Cauchy has no mean for the average to converge to, so no matter how many
        samples arrive, one rare but enormous value can throw the average off again.
      </p>
      <p>
        The running median is different. The median is a stable estimate of where the
        distribution is centered, so its trace settles on the location parameter.
      </p>
      <p>
        In Normal mode a shaded band marks where the running mean should sit 95 percent of
        the time. It tightens like one over the square root of n, and the trace threads it.
        The Cauchy chart has no band on purpose: with no variance there is no shrinking
        funnel to draw, and the spread of its mean never tightens at all.
      </p>

      <h2>Why it happens</h2>
      <p>
        The Cauchy density has tails so heavy that the integral defining its mean does not
        exist, and without a mean the Law of Large Numbers simply does not apply.
      </p>
      <MathBlock tex="f(x;\, x_0, \gamma) = \frac{1}{\pi\gamma\left[1 + \left(\frac{x - x_0}{\gamma}\right)^{2}\right]}" />
      <p>
        There is a cleaner way to say it. By stability, the average of{' '}
        <MathInline tex="n" /> independent Cauchy samples has exactly the same Cauchy
        distribution as a single sample. Averaging buys you nothing.
      </p>
      <MathBlock tex="\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i \;\sim\; \mathrm{Cauchy}(x_0, \gamma)" />
      <p>
        The sample median, by contrast, is a consistent estimator of the location parameter{' '}
        <MathInline tex="x_0" /> and its running trace converges. That is the whole story of
        the chart: the solid mean keeps wandering, the dashed median locks on.
      </p>
    </motion.section>
  )
}
