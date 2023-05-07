import { ref, computed } from 'vue'
import { Line, Player, Board } from '@/types'

function swap<T>(v: T, o1: T, o2: T): T {
  return v === o1 ? o2 : o1
}

function setByIndex<T>(index: number, value: T, arr: T[]): T[] {
  return arr.map((v, i) => (i === index ? value : v))
}

export function createBoard(): Board {
  return Array(9).fill(null)
}

export function randomPlayer(): Player {
  return [Player.X, Player.O][Math.round(Math.random())]
}

export function isFull(grid: Board): boolean {
  return grid.every(Boolean)
}

export function check(player: Player, grid: Board): Line | null {
  const lines: Line[] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  return lines.find((l) => l.every((i) => grid[i] === player)) ?? null
}

export function next(player: Player): Player {
  return swap(player, Player.X, Player.O)
}

export function move(index: number, player: Player, grid: Board): Board {
  if (grid[index] || isFull(grid)) return grid

  return setByIndex(index, player, grid)
}

export const useGame = () => {
  const board = ref<Board>(createBoard())
  const player = ref<Player>(randomPlayer())
  const winLine = ref<Line | null>(null)
  const finished = computed(() => isFull(board.value) || !!winLine.value)

  return {
    finished,
    board: computed(() => board.value),
    player: computed(() => player.value),
    winLine: computed(() => winLine.value),
    restart: () => {
      board.value = createBoard()
      player.value = randomPlayer()
      winLine.value = null
    },
    move: (index: number) => {
      if (finished.value) return
      player.value = next(player.value)
      board.value = move(index, player.value, board.value)
      winLine.value = check(player.value, board.value)
    }
  }
}
