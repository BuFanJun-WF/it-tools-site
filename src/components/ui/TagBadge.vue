<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'add' | 'del'
}>(), {
  variant: 'default',
})
</script>

<template>
  <span :class="['tag', `tag-${variant}`]"><slot /></span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  background: var(--surface-2);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.tag-accent {
  background: var(--accent-soft);
  color: var(--accent-text);
}
.tag-add {
  background: var(--diff-add-bg);
  color: var(--diff-add-fg);
}
.tag-del {
  background: var(--diff-del-bg);
  color: var(--diff-del-fg);
}
</style>
