import { ref, computed } from 'vue'
import { Line, Player, Board } from '@/types'
import { setByIndex, swap } from '@/utils'

const LINES: Line[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const check = (board: Board, player: Player): Line | null =>
  LINES.find((l) => l.every((i) => board[i] === player)) ?? null

const createBoard = (): Board => Array(9).fill(null)

const randomPlayer = (): Player => [Player.X, Player.O][Math.round(Math.random())]

const isFull = (board: Board): boolean => !board.includes(null)

const next = (player: Player): Player => swap(player, Player.X, Player.O)

const move = (index: number, player: Player, board: Board): Board =>
  board[index] || isFull(board) ? board : setByIndex(index, player, board)

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
      winLine.value = check(board.value, player.value)
    }
  }
}
