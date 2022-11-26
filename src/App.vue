<script setup lang="ts">
import { computed, ref } from 'vue'

enum Player {
  X = 'X',
  O = 'O',
}

type Cell = Player | null
type Board = Cell[]
type Line = [number, number, number]

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

function createBoard(): Board {
  return Array(9).fill(null)
}

function randomPlayer(): Player {
  return [Player.X, Player.O][Math.round(Math.random())]
}

const board = ref(createBoard())
const player = ref(randomPlayer())
const winnerLine = ref<Line | null>(null)
const finished = computed(() => board.value.every(Boolean) || winnerLine.value)

function restart(): void {
  board.value = createBoard()
  player.value = randomPlayer()
  winnerLine.value = null
}

function check(): boolean {
  winnerLine.value = LINES.find(l => l.every(i => board.value[i] === player.value)) ?? null
  return !!winnerLine.value
}

function move(index: number): void {
  if (board.value[index] || finished.value) return
  board.value[index] = player.value
  if (check()) return
  player.value = player.value === Player.X ? Player.O : Player.X
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <div class="w-full max-w-lg aspect-square grid grid-rows-3 grid-cols-3 select-none p-6">
      <button
        v-for="(value, index) in board"
        :key="index"
        :class="[
          value?.toLowerCase(),
          winnerLine?.includes(index) && 'bg-green/10',
          value || finished ? 'cursor-not-allowed' : `cursor-crosshair`,
        ]"
        class="cell"
        @click="move(index)"
      />
    </div>

    <button
      :class="{ 'animate-bounce': finished }"
      class="border-green mt-8 border-2 border-dashed uppercase text-green tracking-wide px-6 py-3 rounded-lg"
      @click="restart()"
    >
      Restart
    </button>
  </div>
</template>

<style scoped>
.cell {
  @apply p-3 outline-none text-green border-gray-dark transition duration-100;
}

.cell:nth-child(3n + 2) {
  @apply border-x-2;
}

.cell:nth-child(n + 4):nth-child(-n + 6) {
  @apply border-y-2;
}

.x {
  @apply relative;
}

.x::before,
.x::after {
  content: '';
  @apply absolute top-0 h-full w-1 bg-current;
}

.x::before {
  @apply rotate-45;
}

.x::after {
  @apply -rotate-45;
}

.o::before {
  content: '';
  @apply border-current border-4 w-full h-full block rounded-full;
}
</style>
