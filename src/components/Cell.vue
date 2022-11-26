<template>
  <button :disabled="disabled" :class="[value?.toLowerCase(), highlighted && 'bg-green/10']" class="cell" />
</template>

<script setup lang="ts">
import { Cell } from '../types';

type Props = {
  value: Cell;
  highlighted?: boolean;
  disabled?: boolean;
};

defineProps<Props>();
</script>

<style scoped>
.cell {
  @apply p-3 text-green border-gray-dark cursor-crosshair transition duration-100 disabled:cursor-not-allowed;
}

.cell:nth-child(3n + 2) {
  @apply border-x-2;
}

.cell:nth-child(n + 4):nth-child(-n + 6) {
  @apply border-y-2;
}

.x,
.o {
  @apply cursor-not-allowed;
}

.x {
  @apply relative;
}

.x::before,
.x::after {
  content: '';
  @apply absolute top-0 h-full w-1 bg-current;
}

.x::before {
  @apply rotate-45;
}

.x::after {
  @apply -rotate-45;
}

.o::before {
  content: '';
  @apply border-current border-4 w-full h-full block rounded-full;
}
</style>
