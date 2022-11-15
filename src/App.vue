<script setup lang="ts">
import { ref, computed } from 'vue'

enum Move {
  X = 'X',
  O = 'O',
}

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
const move = ref<Move>(Move.X)
const finished = computed(() => board.value.every(row => row.every(Boolean)))

function allEqual<T>(arr: T): boolean {
  return arr.every(v => v === arr[0])
}

function hasWon(row: number, col: number): boolean {
  return allEqual(board.value[row])
}

function swap(): void {
  move.value = move.value === Move.X ? Move.O : Move.X
}

function makeMove(row: number, col: number): void {
  if (board.value[row][col]) return
  board.value[row][col] = move.value
  swap()
}

function restart(): void {
  board.value = initBoard()
}

const emoji = ['🅾️', '❎']
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
          :class="[cell ? 'cursor-not-allowed' : 'hover:bg-green/10 transition duration-100']"
          class="grid place-items-center w-28 h-28 cursor-crosshair even:border-l-2 even:border-r-2"
          @click="makeMove(i, j)"
        >
          {{ cell }}
        </div>
      </div>
    </div>

    <div class="mt-10 h-32">
      <Transition enter-from-class="opacity-0 translate-y-10" leave-to-class="opacity-0 translate-y-10">
        <button
          v-if="finished"
          class="
            border border-green border-2 border-dashed
            uppercase
            text-green
            tracking-wide
            px-6
            py-3
            rounded-lg
            transition
          "
          @click="restart"
        >
          Restart
        </button>
      </Transition>
    </div>
  </div>
</template>
