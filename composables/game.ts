import { Board, Line, Player } from '~/types'

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
  LINES.find(l => l.every(i => board[i] === player)) ?? null

const createBoard = (): Board => Array(9).fill(null)

const isFull = (board: Board): boolean => !board.includes(null)

const swapPlayer = (player: Player): Player => swap(player, Player.X, Player.O)

const makeMove = (index: number, player: Player, board: Board): Board =>
  board[index] || isFull(board) ? board : setByIndex(index, player, board)

const minimax = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
): number => {
  if (check(board, Player.X)) { return -1 }

  if (check(board, Player.O)) { return 1 }

  if (isFull(board)) { return 0 }

  if (isMaximizingPlayer) {
    let bestScore = Number.NEGATIVE_INFINITY

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = Player.O
        const score = minimax(board, depth + 1, false, alpha, beta)
        board[i] = null
        bestScore = Math.max(score, bestScore)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) { break }
      }
    }

    return bestScore
  } else {
    let bestScore = Number.POSITIVE_INFINITY

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = Player.X
        const score = minimax(board, depth + 1, true, alpha, beta)
        board[i] = null
        bestScore = Math.min(score, bestScore)
        beta = Math.min(beta, score)
        if (beta <= alpha) { break }
      }
    }

    return bestScore
  }
}

const findBestMove = (board: Board): number => {
  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove = -1
  let alpha = Number.NEGATIVE_INFINITY
  const beta = Number.POSITIVE_INFINITY

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = Player.O
      const score = minimax(board, 0, false, alpha, beta)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
      alpha = Math.max(alpha, score)
    }
  }

  return bestMove
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export type GameState = {
  board: Board
  turn: Player
  moveInProgress: boolean
  finished: boolean
  winner: Player | null
  winLine: Line | null
}

const useGame = ({ delay = 600 }: { delay?: number } = {}) => {
  const board = ref<Board>(createBoard())
  const turn = ref<Player>(Player.X)
  const winLine = ref<Line | null>(null)
  const finished = computed(() => isFull(board.value) || !!winLine.value)
  const winner = computed(() => (winLine.value ? board.value[winLine.value[0]] : null))
  const moveInProgress = ref(false)
  const state: GameState = reactive({ board, turn, winLine, finished, winner, moveInProgress })

  const restart = () => {
    board.value = createBoard()
    turn.value = Player.X
    winLine.value = null
  }

  const move = async (index: number, player: Player) => {
    if (finished.value || moveInProgress.value) { return }
    moveInProgress.value = true
    board.value = makeMove(index, player, board.value)
    winLine.value = check(board.value, player)
    await sleep(delay)
    moveInProgress.value = false
    turn.value = !winLine.value ? swapPlayer(turn.value) : turn.value
  }

  return {
    restart,
    move,
    state,
    finished,
    winner,
    board: computed(() => board.value),
    turn: computed(() => turn.value),
    winLine: computed(() => winLine.value),
    moveInProgress: computed(() => moveInProgress.value)
  }
}

export const useLocalGame = (options: { delay?: number } = {}) => {
  const { move, turn, ...game } = useGame(options)

  return {
    ...game,
    turn,
    move: (index: number) => move(index, turn.value)
  }
}

export const useAiGame = (options: { delay?: number } = {}) => {
  const { move, restart, turn, board, ...rest } = useGame(options)

  let ac: AbortController | undefined

  const handleMove = async (index: number) => {
    ac = new AbortController()
    await move(index, Player.X)
    if (!ac?.signal.aborted) {
      await move(findBestMove(board.value), Player.O)
    }
  }

  const handleRestart = () => {
    restart()
    ac?.abort()
  }

  return {
    ...rest,
    turn,
    board,
    restart: handleRestart,
    move: handleMove
  }
}
