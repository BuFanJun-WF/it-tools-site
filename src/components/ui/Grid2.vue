<script setup lang="ts">
withDefaults(defineProps<{
  gap?: number
  uneven?: boolean
}>(), {
  gap: 20,
  uneven: false,
})
</script>

<template>
  <div class="grid-2" :class="{ uneven }" :style="{ gap: `${gap}px` }">
    <slot />
  </div>
</template>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.grid-2.uneven {
  grid-template-columns: 1.4fr 1fr;
}
@media (max-width: 920px) {
  .grid-2,
  .grid-2.uneven {
    grid-template-columns: 1fr;
  }
}
</style>
