<script setup lang="ts">
import type { Board, Line } from '@/types'
import GameBoardCell from '@/components/GameBoardCell.vue'

type Props = {
  board: Board
  finished: boolean
  winLine: Line | null
}

type Emits = {
  (e: 'move', index: number): void
}

defineProps<Props>()

defineEmits<Emits>()
</script>

<template>
  <div class="w-full max-w-lg aspect-square grid grid-rows-3 grid-cols-3 select-none p-6">
    <GameBoardCell
      v-for="(value, index) in board"
      :key="index"
      :value="value"
      :disabled="finished"
      :highlighted="winLine?.includes(index)"
      @click="$emit('move', index)"
    />
  </div>
</template>
