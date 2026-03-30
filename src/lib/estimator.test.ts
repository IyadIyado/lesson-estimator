import { describe, it, expect } from "vitest";
import { calculateETAs } from "./estimator";

describe("calculateETAs", () => {
  it("computes correct ETAs for mixed remaining lessons", () => {
    // 3 students finish at week 1, 1 at week 3
    expect(calculateETAs([1, 1, 1, 3, 5], 4, 5)).toEqual([1, 1, 1, 3]);
  });

  it("handles single active student", () => {
    // slot opens at 3, then 3+5=8, then 8+5=13
    expect(calculateETAs([3], 3, 5)).toEqual([3, 8, 13]);
  });

  it("handles all same remaining lessons", () => {
    // all 3 slots open at week 2 simultaneously
    expect(calculateETAs([2, 2, 2], 3, 5)).toEqual([2, 2, 2]);
  });

  it("returns empty array when no active students", () => {
    expect(calculateETAs([], 5, 5)).toEqual([]);
  });

  it("returns empty array when queue is empty", () => {
    expect(calculateETAs([1, 2, 3], 0, 5)).toEqual([]);
  });

  it("handles queue larger than active list", () => {
    // 2 active with [1, 3], queue of 4, default 5
    // Pop 1 -> A at week 1, push 6. Heap: [3, 6]
    // Pop 3 -> B at week 3, push 8. Heap: [6, 8]
    // Pop 6 -> C at week 6, push 11. Heap: [8, 11]
    // Pop 8 -> D at week 8, push 13. Heap: [11, 13]
    expect(calculateETAs([1, 3], 4, 5)).toEqual([1, 3, 6, 8]);
  });

  it("works with different default lesson counts", () => {
    // 1 active with [2], queue of 3, default 3
    // Pop 2, push 5. Pop 5, push 8. Pop 8, push 11.
    expect(calculateETAs([2], 3, 3)).toEqual([2, 5, 8]);
  });

  it("handles remaining lessons of 0 (student done this week)", () => {
    expect(calculateETAs([0, 2], 2, 5)).toEqual([0, 2]);
  });
});
