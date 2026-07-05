<script setup lang="ts">
withDefaults(defineProps<{ gap?: number; wrap?: boolean; justify?: string }>(), {
  gap: 12,
  wrap: true,
  justify: undefined,
})
</script>

<template>
  <div
    class="row"
    :class="{ nowrap: !wrap }"
    :style="{ gap: `${gap}px`, justifyContent: justify }"
  >
    <slot />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
}
.row.nowrap { flex-wrap: nowrap; }
</style>
