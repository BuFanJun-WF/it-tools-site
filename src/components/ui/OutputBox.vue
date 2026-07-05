<script setup lang="ts">
withDefaults(defineProps<{
  scroll?: boolean
  empty?: boolean
  /** Render as preformatted text (default). */
  mono?: boolean
}>(), {
  scroll: false,
  empty: false,
  mono: true,
})
</script>

<template>
  <div class="output-box" :class="{ scroll, empty, mono }">
    <slot />
  </div>
</template>

<style scoped>
.output-box {
  padding: var(--sp-3);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.55;
}
.output-box.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
.output-box.scroll {
  max-height: 420px;
  overflow: auto;
}
.output-box.empty {
  font-style: italic;
  color: var(--muted-2);
  white-space: normal;
}
</style>
