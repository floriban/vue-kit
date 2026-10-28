export function rangeBounds(min: number, max: number, step: number) {
  const start = Number.isFinite(min) ? min : 0
  const end = Number.isFinite(max) ? Math.max(start, max) : Math.max(start, 100)
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  return { min: start, max: end, step: increment }
}

export function snapRange(value: number, min: number, max: number, step: number) {
  const finite = Number.isFinite(value) ? value : min
  const lastStep = Math.floor((max - min) / step + 1e-9)
  const position = Math.max(0, Math.min(lastStep, Math.round((finite - min) / step)))
  return Number((min + position * step).toFixed(10))
}
