<script setup lang="ts">
import { computed } from 'vue'
import { icons } from '@/data/icons'

const props = withDefaults(defineProps<{
  name: string
  /** Size in px — applied to width/height. */
  size?: number | string
}>(), {
  size: undefined,
})

const svg = computed(() => icons[props.name] || icons.grid)
const style = computed(() => {
  if (props.size === undefined) return undefined
  const v = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: v, height: v }
})
</script>

<template>
  <span class="app-icon" :style="style" v-html="svg" />
</template>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
.app-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
