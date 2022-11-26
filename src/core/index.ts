import { Line, Grid, Player } from '../types';

function swap<T>(v: T, o1: T, o2: T): T {
  return v === o1 ? o2 : o1;
}

function setByIndex<T>(index: number, value: T, arr: T[]): T[] {
  return arr.map((v, i) => (i === index ? value : v));
}

export function createGrid(): Grid {
  return Array(9).fill(null);
}

export function randomPlayer(): Player {
  return [Player.X, Player.O][Math.round(Math.random())];
}

export function isFull(grid: Grid): boolean {
  return grid.every(Boolean);
}

export function check(player: Player, grid: Grid): Line | null {
  const lines: Line[] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return lines.find(l => l.every(i => grid[i] === player)) ?? null;
}

export function next(player: Player): Player {
  return swap(player, Player.X, Player.O);
}

export function move(index: number, player: Player, grid: Grid): Grid {
  if (grid[index] || isFull(grid)) return grid;

  return setByIndex(index, player, grid);
}
