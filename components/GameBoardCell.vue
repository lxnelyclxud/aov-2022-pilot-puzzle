<script setup lang="ts">
import { Motion } from "motion/vue"
import { Player, Cell } from "~/types"

type Props = {
  value: Cell
  disabled?: boolean
}

defineProps<Props>()

const DURATION = 0.6

const rnd = random

const transition = (duration = DURATION, delay = 0) => ({
  duration,
  delay,
  ease: "ease-out",
})

const draw = (progress = 1) => ({
  pathLength: "1",
  initial: {
    visibility: "hidden",
    strokeDasharray: 1,
    strokeDashoffset: 1,
  },
  animate: {
    visibility: "visible",
    strokeDashoffset: 1 - progress,
  },
})
</script>

<template>
  <button :disabled="disabled || !!value" class="p-3 cursor-crosshair disabled:cursor-not-allowed">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <Transition leave-active-class="opacity-0 transition duration-300">
        <g v-if="value === Player.X" class="text-green">
          <Motion
            v-bind="draw()"
            :transition="transition(DURATION / 2)"
            :d="`M${rnd(17, 19)} ${rnd(5.5)}L${rnd(5.5)} ${rnd(17, 19)}`"
            tag="path"
          />
          <Motion
            v-bind="draw()"
            :transition="transition(DURATION / 2, DURATION / 2)"
            :d="`M${rnd(5, 7)} ${rnd(5.5)}l${rnd(11.5)} ${rnd(11, 13)}`"
            tag="path"
          />
        </g>

        <Motion
          v-else-if="value === Player.O"
          v-bind="draw(rnd(0.92, 1))"
          :rx="`${rnd(6, 8)}`"
          :ry="`${rnd(6, 8)}`"
          :style="{ transform: `rotate(-${rnd(50, 130)}deg)` }"
          :transition="transition()"
          tag="ellipse"
          cx="12"
          cy="12"
          class="origin-center text-red"
        />
      </Transition>
    </svg>
  </button>
</template>
