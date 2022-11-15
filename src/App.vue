<script setup lang="ts">
import { ref } from 'vue'

type Move = 0 | 1
type Cell = Move | null
type Row = [Cell, Cell, Cell]
type Board = [Row, Row, Row]

function initBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
}

const board = ref<Board>(initBoard())
const move = ref<Move>(0)
const finished = ref(false)

function allEqual<T>(arr: T): boolean {
  return arr.every(v => v === arr[0])
}

function hasWon(row: number, col: number): boolean {
  return allEqual(board.value[row])
}

function swap(): void {
  move.value = move.value === 0 ? 1 : 0
}

function makeMove(row: number, col: number): void {
  if (board.value[row][col] !== null) return
  board.value[row][col] = move.value
  swap()
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <div class="grid grid-rows-3 place-items-center select-none">
      <div
        v-for="(row, i) in board"
        :key="i"
        class="grid grid-cols-3 place-items-center border-gray-dark even:border-t-2 even:border-b-2 even:-my-2"
      >
        <div
          v-for="(cell, j) in row"
          :key="j"
          :class="[cell === null && 'hover:bg-green/25 transition duration-100']"
          class="grid place-items-center w-28 h-28 cursor-crosshair even:border-l-2 even:border-r-2"
          @click="makeMove(i, j)"
        >
          {{ cell }}
        </div>
      </div>
    </div>

    <div v-if="finished" class="mt-10">
      <button
        class="border border-green border-2 border-dashed uppercase text-green tracking-wide px-6 py-3 rounded-lg"
      >
        Play
      </button>
    </div>
  </div>
</template>
