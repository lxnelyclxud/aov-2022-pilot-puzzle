<script setup lang="ts">
const { board, finished, winLine, player, move, restart } = useGame()
</script>

<template>
  <div class="flex h-full flex-col justify-center items-center" @click.right.prevent>
    <GameBoard v-bind="{ board, finished, winLine, player }" @move="move" />

    <button
      :class="{ 'animate-bounce': finished }"
      class="border-green mt-8 border-2 border-dashed uppercase text-green tracking-wide px-6 py-3 rounded-lg"
      @click="restart()"
    >
      Restart
    </button>
  </div>
</template>
