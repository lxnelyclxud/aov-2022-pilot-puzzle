<script setup lang="ts">
import { ref } from 'vue'

enum Player {
  X = 'X',
  O = 'O',
}

type Cell = Player | null
type Row = [Cell, Cell, Cell]
type Board = [Row, Row, Row]
type Address = { row: number; col: number }

function createBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
}

function randomPlayer(): Player {
  return [Player.X, Player.O][Math.round(Math.random())]
}

const board = ref<Board>(createBoard())
const player = ref<Player>(randomPlayer())

function restart(): void {
  board.value = createBoard()
  player.value = randomPlayer()
}

function get({ row, col }: Address): Cell {
  return board.value[row][col]
}

function set({ row, col }: Address, value: Cell): void {
  board.value[row][col] = value
}

function swap(): void {
  player.value = player.value === Player.X ? Player.O : Player.X
}

function move(address: Address): void {
  if (get(address)) return
  set(address, player.value)
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
        <button
          v-for="(cell, j) in row"
          :key="j"
          :class="[
            cell
              ? 'cursor-not-allowed'
              : 'cursor-crosshair transition duration-100 hover:bg-green/10 focus:bg-green/10',
          ]"
          class="grid place-items-center w-28 h-28 outline-none even:border-l-2 even:border-r-2"
          @click="move({ row: i, col: j })"
        >
          {{ cell }}
        </button>
      </div>
    </div>

    <div class="mt-10 h-32">
      <button
        class="
          border border-green border-2 border-dashed
          uppercase
          text-green
          tracking-wide
          px-6
          py-3
          rounded-lg
          transition
          hover:scale-105
        "
        @click="restart()"
      >
        Restart
      </button>
    </div>
  </div>
</template>
