import { line } from 'd3-shape'
import { formatTick, type NumericScale } from './scales.ts'

export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ChartLayout {
  width: number
  height: number
  margin: Margin
}

export interface PlotArea {
  x: number
  y: number
  w: number
  h: number
}

export const DEFAULT_MARGIN: Margin = { top: 18, right: 20, bottom: 30, left: 58 }

export function plotArea(layout: ChartLayout): PlotArea {
  const { width, height, margin } = layout
  return {
    x: margin.left,
    y: margin.top,
    w: Math.max(0, width - margin.left - margin.right),
    h: Math.max(0, height - margin.top - margin.bottom),
  }
}

export interface AxisColors {
  grid: string
  label: string
}

export interface TraceStyle {
  color: string
  width: number
  alpha?: number
  dash?: number[]
}

export function clearCanvas(ctx: CanvasRenderingContext2D, layout: ChartLayout): void {
  ctx.clearRect(0, 0, layout.width, layout.height)
}

/* Half-pixel offset keeps 1px hairlines crisp after the dpr transform. */
function crisp(v: number): number {
  return Math.round(v) + 0.5
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  yScale: NumericScale,
  tickValues: number[],
  color: string,
): void {
  const area = plotArea(layout)
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  for (const t of tickValues) {
    const y = crisp(yScale(t))
    ctx.moveTo(area.x, y)
    ctx.lineTo(area.x + area.w, y)
  }
  ctx.stroke()
  ctx.restore()
}

export function drawAxes(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  xScale: NumericScale,
  yScale: NumericScale,
  yTicks: number[],
  colors: AxisColors,
  font: string,
): void {
  const area = plotArea(layout)
  ctx.save()
  ctx.font = font
  ctx.fillStyle = colors.label
  ctx.strokeStyle = colors.grid
  ctx.lineWidth = 1

  const baseline = crisp(area.y + area.h)
  ctx.beginPath()
  ctx.moveTo(area.x, baseline)
  ctx.lineTo(area.x + area.w, baseline)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (const t of xScale.ticks(6)) {
    if (!Number.isInteger(t)) continue
    const x = xScale(t)
    ctx.beginPath()
    ctx.moveTo(crisp(x), baseline)
    ctx.lineTo(crisp(x), baseline + 4)
    ctx.stroke()
    ctx.fillText(formatTick(t), x, baseline + 7)
  }

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (const t of yTicks) {
    ctx.fillText(formatTick(t), area.x - 8, yScale(t))
  }
  ctx.restore()
}

export function drawTargetLine(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  yScale: NumericScale,
  value: number,
  color: string,
): void {
  const area = plotArea(layout)
  const y = crisp(yScale(value))
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(area.x, y)
  ctx.lineTo(area.x + area.w, y)
  ctx.stroke()
  ctx.restore()
}

/*
 * Trace values are indexed by sample count: values[i] is the statistic
 * after sample i + 1. A subarray view keeps the per-frame path allocation
 * free; d3-shape only emits path commands into the canvas context.
 */
export function drawTrace(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  xScale: NumericScale,
  yScale: NumericScale,
  values: Float64Array,
  count: number,
  style: TraceStyle,
): void {
  if (count < 2) return
  const area = plotArea(layout)
  ctx.save()
  ctx.beginPath()
  ctx.rect(area.x, area.y, area.w, area.h)
  ctx.clip()
  ctx.strokeStyle = style.color
  ctx.lineWidth = style.width
  ctx.globalAlpha = style.alpha ?? 1
  ctx.setLineDash(style.dash ?? [])
  ctx.lineJoin = 'round'
  const path = line<number>()
    .x((_, i) => xScale(i + 1))
    .y((v) => yScale(v))
    .defined((v) => Number.isFinite(v))
    .context(ctx)
  ctx.beginPath()
  path(values.subarray(0, count))
  ctx.stroke()
  ctx.restore()
}

export interface OffScaleEvent {
  n: number
  value: number
}

/*
 * The runaway spike annotation: a small arrow pinned at the clip edge with
 * the actual value printed beside it, so off-scale draws are marked rather
 * than hidden.
 */
export function drawOffScaleMarkers(
  ctx: CanvasRenderingContext2D,
  layout: ChartLayout,
  xScale: NumericScale,
  yScale: NumericScale,
  events: OffScaleEvent[],
  color: string,
  font: string,
  formatValue: (v: number) => string,
): void {
  if (events.length === 0) return
  const area = plotArea(layout)
  const [d0, d1] = yScale.domain()
  const top = Math.max(d0, d1)
  ctx.save()
  ctx.font = font
  ctx.fillStyle = color
  for (const event of events) {
    const x = xScale(event.n)
    const up = event.value > top
    const edgeY = up ? area.y + 3 : area.y + area.h - 3
    const dir = up ? -1 : 1
    ctx.beginPath()
    ctx.moveTo(x, edgeY + dir * 2)
    ctx.lineTo(x - 4, edgeY - dir * 6)
    ctx.lineTo(x + 4, edgeY - dir * 6)
    ctx.closePath()
    ctx.fill()
    ctx.textAlign = x > area.x + area.w - 90 ? 'right' : 'left'
    ctx.textBaseline = up ? 'top' : 'bottom'
    const labelX = x + (ctx.textAlign === 'left' ? 8 : -8)
    ctx.fillText(formatValue(event.value), labelX, up ? area.y + 2 : area.y + area.h - 2)
  }
  ctx.restore()
}
