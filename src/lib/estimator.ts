/**
 * Calculate estimated wait times (in weeks) for queued students.
 *
 * Uses a min-heap of active students' remaining lessons.
 * When the earliest slot opens (min popped), the next queued student
 * fills it and adds defaultLessons to the heap.
 */
export function calculateETAs(
  remainingLessons: number[],
  queueLength: number,
  defaultLessons: number
): number[] {
  if (queueLength === 0 || remainingLessons.length === 0) return [];

  const heap = new MinHeap(remainingLessons);
  const etas: number[] = [];

  for (let i = 0; i < queueLength; i++) {
    const min = heap.pop();
    etas.push(min);
    heap.push(min + defaultLessons);
  }

  return etas;
}

class MinHeap {
  private data: number[];

  constructor(values: number[]) {
    this.data = [...values];
    // Build heap from bottom up
    for (let i = Math.floor(this.data.length / 2) - 1; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  pop(): number {
    const min = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return min;
  }

  push(value: number) {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
  }

  private siftDown(i: number) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && this.data[left] < this.data[smallest]) smallest = left;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;

      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }

  private siftUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[parent] <= this.data[i]) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }
}
