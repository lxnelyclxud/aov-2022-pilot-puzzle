<script setup lang="ts">
import { Motion } from 'motion/vue'
import { Player, type Cell } from '@/types'

type Props = {
  value: Cell
  highlighted?: boolean
  disabled?: boolean
}

defineProps<Props>()

const motionProps = {
  pathLength: '1',
  initial: {
    visibility: 'hidden',
    strokeDasharray: 1,
    strokeDashoffset: 1
  },
  animate: {
    visibility: 'visible',
    strokeDashoffset: 0
  },
  exit: {
    opacity: 0
  }
}
</script>

<template>
  <button :disabled="disabled || !!value" :class="[highlighted && 'bg-green/10']" class="cell">
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
        <g v-if="value === Player.X">
          <Motion v-bind="motionProps" :transition="{ duration: 0.5 }" tag="path" d="M18 6L6 18" />
          <Motion
            v-bind="motionProps"
            :transition="{ duration: 0.5, delay: 0.5 }"
            tag="path"
            d="M6 6l12 12"
          />
        </g>

        <Motion
          v-else-if="value === Player.O"
          v-bind="motionProps"
          :transition="{ duration: 1 }"
          tag="circle"
          cx="12"
          cy="12"
          r="7"
          class="-rotate-90 origin-center"
        />
      </Transition>
    </svg>
  </button>
</template>

<style scoped>
.cell {
  @apply p-3 text-green cursor-crosshair disabled:cursor-not-allowed;
}

.cell:nth-child(3n + 2) {
  @apply border-x-2;
}

.cell:nth-child(n + 4):nth-child(-n + 6) {
  @apply border-y-2;
}
</style>
