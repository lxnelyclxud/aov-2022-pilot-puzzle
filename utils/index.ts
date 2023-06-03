export const swap = <T>(v: T, o1: T, o2: T): T => (v === o1 ? o2 : o1)

export const setByIndex = <T>(index: number, value: T, arr: T[]): T[] =>
  arr.map((v, i) => (i === index ? value : v))

export const random = (min = 0, max = min + 1): number => Math.random() * (max - min) + min
