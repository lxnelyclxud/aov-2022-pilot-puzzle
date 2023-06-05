<script setup lang="ts">
const { move, restart, state } = useLocalGame()
</script>

<template>
  <div class="flex h-full flex-col justify-center items-center" @click.right.prevent>
    <GameBoard v-bind="state" @move="move" />

    <button
      :class="{ 'animate-bounce': state.finished }"
      class="border-green mt-8 border-2 border-dashed uppercase text-green tracking-wide py-4 px-6 rounded-lg"
      @click="restart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m7 21l-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21m9 0H7M5 11l9 9"
        />
      </svg>
    </button>
  </div>
</template>
