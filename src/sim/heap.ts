export interface Heap {
  /* Backing array in heap order. Mutated in place by the helpers below;
     state stays explicit so callers own it and tests stay deterministic. */
  items: number[]
  compare: (a: number, b: number) => number
}

export function createHeap(compare: (a: number, b: number) => number): Heap {
  return { items: [], compare }
}

export function heapSize(heap: Heap): number {
  return heap.items.length
}

export function heapPeek(heap: Heap): number | undefined {
  return heap.items[0]
}

export function heapPush(heap: Heap, value: number): void {
  const { items, compare } = heap
  items.push(value)
  let i = items.length - 1
  while (i > 0) {
    const parent = (i - 1) >> 1
    if (compare(items[i], items[parent]) >= 0) break
    ;[items[i], items[parent]] = [items[parent], items[i]]
    i = parent
  }
}

export function heapPop(heap: Heap): number | undefined {
  const { items, compare } = heap
  if (items.length === 0) return undefined
  const top = items[0]
  const last = items.pop() as number
  if (items.length === 0) return top
  items[0] = last
  let i = 0
  for (;;) {
    const left = 2 * i + 1
    const right = left + 1
    let smallest = i
    if (left < items.length && compare(items[left], items[smallest]) < 0) smallest = left
    if (right < items.length && compare(items[right], items[smallest]) < 0) smallest = right
    if (smallest === i) break
    ;[items[i], items[smallest]] = [items[smallest], items[i]]
    i = smallest
  }
  return top
}
