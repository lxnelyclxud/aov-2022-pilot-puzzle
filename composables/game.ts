import { Board, Line, Player } from "~/types"

const LINES: Line[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const check = (board: Board, player: Player): Line | null =>
  LINES.find((l) => l.every((i) => board[i] === player)) ?? null

const createBoard = (): Board => Array(9).fill(null)

const randomPlayer = (): Player => [Player.X, Player.O][Math.round(Math.random())]

const isFull = (board: Board): boolean => !board.includes(null)

const next = (player: Player): Player => swap(player, Player.X, Player.O)

const move = (index: number, player: Player, board: Board): Board =>
  board[index] || isFull(board) ? board : setByIndex(index, player, board)

const minimax = (board: Board, depth: number, isMaximizingPlayer: boolean): number => {
  if (check(board, Player.X)) return -1

  if (check(board, Player.O)) return 1

  if (isFull(board)) return 0

  if (isMaximizingPlayer) {
    let bestScore = Number.NEGATIVE_INFINITY

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = Player.O
        const score = minimax(board, depth + 1, false)
        board[i] = null
        bestScore = Math.max(score, bestScore)
      }
    }

    return bestScore
  } else {
    let bestScore = Number.POSITIVE_INFINITY

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = Player.X
        const score = minimax(board, depth + 1, true)
        board[i] = null
        bestScore = Math.min(score, bestScore)
      }
    }

    return bestScore
  }
}

const findBestMove = (board: Board): number => {
  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove = -1

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = Player.O
      const score = minimax(board, 0, false)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }

  return bestMove
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useGame = () => {
  const board = ref<Board>(createBoard())
  const player = ref<Player>(randomPlayer())
  const winLine = ref<Line | null>(null)
  const finished = computed(() => isFull(board.value) || !!winLine.value)
  const makeMove = (index: number) => {
    if (finished.value) return
    player.value = next(player.value)
    board.value = move(index, player.value, board.value)
    winLine.value = check(board.value, player.value)
  }

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
    move: async (index: number) => {
      makeMove(index)
      await sleep(600)
      if (!finished.value) {
        makeMove(findBestMove(board.value))
      }
    },
  }
}
