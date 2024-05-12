export const PlayerValue = {
  X: "X",
  O: "O",
} as const;

export type Player = (typeof PlayerValue)[keyof typeof PlayerValue];

export type Cell = Player | null;

export type Board = Cell[];

export type Line = [number, number, number];

export type GameState = {
  board: Board;
  turn: Player;
  difficulty: Difficulty;
  moveInProgress: boolean;
  finished: boolean;
  winner: Player | null;
  winLine: Line | null;
};

export type Difficulty = "easy" | "medium" | "hard";

export const useLocalGame = (options: { delay?: number } = {}) => {
  const { move, turn, ...game } = useGame(options);

  return {
    ...game,
    turn,
    move: (index: number) => move(index, turn.value),
  };
};

export const useAiGame = (options: { delay?: number } = {}) => {
  const { move, restart, turn, board, difficulty, finished, ...rest } = useGame(options);

  let ac: AbortController | undefined;

  const handleMove = async (index: number) => {
    ac = new AbortController();
    await move(index, PlayerValue.X);
    if (!ac?.signal.aborted && !finished.value) {
      await move(makeAIMove(board.value, difficulty.value), PlayerValue.O);
    }
  };

  const handleRestart = () => {
    restart();
    ac?.abort();
  };

  return {
    ...rest,
    turn,
    board,
    finished,
    restart: handleRestart,
    move: handleMove,
  };
};

const useGame = ({ delay = 600 }: { delay?: number } = {}) => {
  const board = ref<Board>(createBoard());
  const difficulty = useLocalStorage<Difficulty>("difficulty", "medium");
  const turn = ref<Player>(PlayerValue.X);
  const winLine = ref<Line | null>(null);
  const finished = computed(() => isFull(board.value) || !!winLine.value);
  const winner = computed(() => (winLine.value ? board.value[winLine.value[0]] : null));
  const moveInProgress = ref(false);
  const state: GameState = reactive({
    board,
    difficulty,
    turn,
    winLine,
    finished,
    winner,
    moveInProgress,
  });

  const restart = () => {
    board.value = createBoard();
    turn.value = PlayerValue.X;
    winLine.value = null;
  };

  const move = async (index: number, player: Player) => {
    if (finished.value || moveInProgress.value) return;
    moveInProgress.value = true;
    board.value = makeMove(index, player, board.value);
    winLine.value = check(board.value, player);
    await sleep(delay);
    moveInProgress.value = false;
    turn.value = !winLine.value ? swapPlayer(turn.value) : turn.value;
  };

  return {
    restart,
    move,
    state,
    finished,
    winner,
    difficulty,
    board: computed(() => board.value),
    turn: computed(() => turn.value),
    winLine: computed(() => winLine.value),
    moveInProgress: computed(() => moveInProgress.value),
  };
};

const check = (board: Board, player: Player): Line | null => {
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

  return lines.find((l) => l.every((i) => board[i] === player)) ?? null;
};

const createBoard = (): Board => Array(9).fill(null);

const isFull = (board: Board): boolean => !board.includes(null);

const swapPlayer = (player: Player): Player => swap(player, PlayerValue.X, PlayerValue.O);

const makeMove = (index: number, player: Player, board: Board): Board =>
  board[index] || isFull(board) ? board : setByIndex(index, player, board);

const makeAIMove = (board: Board, difficulty: Difficulty): number => {
  const aiPlayer = PlayerValue.O;
  const humanPlayer = PlayerValue.X;

  if (difficulty === "easy") {
    return easyMove(board);
  }

  if (difficulty === "medium") {
    return mediumMove({ board, aiPlayer, humanPlayer });
  }

  return hardMove({ board, aiPlayer, humanPlayer });
};

const getEmptyPositions = (board: Board): number[] =>
  board.map((v, i) => (v === null ? i : null)).filter((v): v is number => v !== null);

const easyMove = (board: Board): number => {
  const emptyPositions = getEmptyPositions(board);

  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
};

const mediumMove = ({
  board,
  aiPlayer,
  humanPlayer,
}: {
  board: Board;
  aiPlayer: Player;
  humanPlayer: Player;
}) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = aiPlayer;
      if (check(board, aiPlayer)) return i;
      board[i] = null;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = humanPlayer;
      if (check(board, humanPlayer)) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  return easyMove(board);
};

const hardMove = ({
  board,
  aiPlayer,
  humanPlayer,
}: {
  board: Board;
  aiPlayer: Player;
  humanPlayer: Player;
}) => {
  return minimax({ board, depth: 0, isMaximizing: true, aiPlayer, humanPlayer }).move!;
};

const minimax = ({
  board,
  depth,
  isMaximizing,
  humanPlayer,
  aiPlayer,
}: {
  board: Board;
  depth: number;
  isMaximizing: boolean;
  aiPlayer: Player;
  humanPlayer: Player;
}): { score: number; move?: number } => {
  if (check(board, aiPlayer)) return { score: 10 - depth };
  if (check(board, humanPlayer)) return { score: depth - 10 };
  if (isFull(board)) return { score: 0 };

  let bestScore = isMaximizing ? -Infinity : Infinity;
  let bestMove: number | null = null;
  board.forEach((cell, index) => {
    if (cell === null) {
      board[index] = isMaximizing ? aiPlayer : humanPlayer;
      let result = minimax({
        board,
        depth: depth + 1,
        isMaximizing: !isMaximizing,
        aiPlayer,
        humanPlayer,
      });
      board[index] = null;
      let score = result.score;
      if (isMaximizing ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  });

  if (depth == 0 && Math.random() < 0.15) {
    const nonOptimalMoves = board
      .map((cell, index) => ({ index, cell }))
      .filter((x) => x.cell === null && x.index !== bestMove)
      .map((x) => x.index);

    if (nonOptimalMoves.length > 0) {
      bestMove = nonOptimalMoves[Math.floor(Math.random() * nonOptimalMoves.length)];
    }
  }

  if (bestMove === null) {
    throw new Error("No move found");
  }

  return { score: bestScore, move: bestMove };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
