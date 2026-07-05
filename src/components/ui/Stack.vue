<script setup lang="ts">
withDefaults(defineProps<{ gap?: number }>(), { gap: 16 })
</script>

<template>
  <div class="stack" :style="{ gap: `${gap}px` }">
    <slot />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
}
</style>
