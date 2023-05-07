<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import { useGame } from '@/composables/game'

const { board, finished, winLine, move, restart } = useGame()
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <GameBoard v-bind="{ board, finished, winLine }" @move="move" />

    <button
      :class="{ 'animate-bounce': finished }"
      class="border-green mt-8 border-2 border-dashed uppercase text-green tracking-wide px-6 py-3 rounded-lg"
      @click="restart()"
    >
      Restart
    </button>
  </div>
</template>
