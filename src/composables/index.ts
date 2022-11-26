import { ref, computed, watch } from 'vue';
import { Line, Player, Grid } from '../types';
import * as core from '../core';

export function useGame() {
  const grid = ref<Grid>(core.createGrid());
  const player = ref<Player>(core.randomPlayer());
  const winnerLine = ref<Line | null>(null);
  const finished = computed(() => core.isFull(grid.value) || !!winnerLine.value);

  function restart(): void {
    grid.value = core.createGrid();
    player.value = core.randomPlayer();
    winnerLine.value = null;
  }

  function move(index: number): void {
    if (finished.value) return;

    player.value = core.next(player.value);
    grid.value = core.move(index, player.value, grid.value);
    winnerLine.value = core.check(player.value, grid.value);
  }

  return {
    grid: computed(() => grid.value),
    player: computed(() => player.value),
    winnerLine: computed(() => winnerLine.value),
    finished,
    move,
    restart,
  };
}
