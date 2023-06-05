<script setup lang="ts">
import { Motion } from '@motionone/vue'
import { Board, Line, Player } from '~/types'

type Props = {
  board: Board
  turn: Player
  finished: boolean
  winLine: Line | null
  winner: Player | null
  moveInProgress: boolean
}

type Emits = {
  (e: 'move', index: number): void
}

defineProps<Props>()

defineEmits<Emits>()

const DURATION = 0.3

const rnd = random

const lines = [
  [100 / 3, 0, 100 / 3, 100],
  [(100 / 3) * 2, 0, (100 / 3) * 2, 100],
  [0, 100 / 3, 100, 100 / 3],
  [0, (100 / 3) * 2, 100, (100 / 3) * 2]
].map(line => line.map(v => rnd(v - 2, v + 2)))

const drawing = ref(0)

const indexToCoords = (idx: number) =>
  [idx % 3, Math.floor(idx / 3)].map(v => (v / 2) * 100) as [number, number]

const centered = (x1: number, x2: number) => {
  if (x1 !== x2 || (x1 !== 0 && x1 !== 100)) { return [x1, x2] }
  const centered = x1 === 0 ? 100 / 6 : (100 / 6) * 5
  return [centered, centered]
}

const winLineCoords = (line: Line) => {
  const [x1, y1] = indexToCoords(line[0])
  const [x2, y2] = indexToCoords(line[2])
  const [cx1, cx2] = centered(x1, x2).map(v => rnd(v - 3, v + 3))
  const [cy1, cy2] = centered(y1, y2).map(v => rnd(v - 3, v + 3))
  return { x1: cx1, y1: cy1, x2: cx2, y2: cy2 }
}
</script>

<template>
  <div class="w-full max-w-lg aspect-square select-none">
    <div class="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="0.8"
        class="absolute text-gray inset-0"
      >
        <TransitionGroup>
          <Motion
            v-for="([x1, y1, x2, y2], idx) in lines"
            v-bind="{ x1, y1, x2, y2 }"
            :key="idx"
            :initial="{
              visibility: 'hidden',
              strokeDasharray: 1,
              strokeDashoffset: 1,
            }"
            :animate="{
              visibility: 'visible',
              strokeDashoffset: 0,
            }"
            :transition="{
              duration: DURATION,
              delay: DURATION * idx,
              easing: 'ease-out',
            }"
            tag="line"
            pathLength="1"
            @motionstart="drawing++"
            @motioncomplete="drawing--"
          />
        </TransitionGroup>
      </svg>

      <div class="grid relative gap-0.5 grid-rows-3 grid-cols-3">
        <GameBoardCell
          v-for="(value, index) in board"
          :key="index"
          :value="value"
          :disabled="finished || drawing > 0 || moveInProgress"
          @click="$emit('move', index)"
        />
      </div>

      <Transition leave-active-class="opacity-0 transition duration-300">
        <svg
          v-if="winLine"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="absolute inset-0"
          :class="winner === Player.X ? 'text-green' : 'text-red'"
        >
          <Motion
            v-bind="winLineCoords(winLine)"
            :initial="{
              visibility: 'hidden',
              strokeDasharray: 1,
              strokeDashoffset: 1,
            }"
            :animate="{
              visibility: 'visible',
              strokeDashoffset: 0,
            }"
            :transition="{
              duration: DURATION,
              delay: DURATION,
              easing: 'ease-out',
            }"
            tag="line"
            pathLength="1"
          />
        </svg>
      </Transition>
    </div>
  </div>
</template>
