<script setup lang="ts">
import { useGame } from './composables';
import { Cell } from './components';

const { grid, finished, winnerLine, move, restart } = useGame();
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <div class="w-full max-w-lg aspect-square grid grid-rows-3 grid-cols-3 select-none p-6">
      <Cell
        v-for="(value, index) in grid"
        :key="index"
        :value="value"
        :disabled="finished"
        :highlighted="winnerLine?.includes(index)"
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
