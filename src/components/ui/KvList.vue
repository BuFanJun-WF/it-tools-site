<script setup lang="ts">
defineProps<{
  items: { label: string; value: string | number }[]
}>()
</script>

<template>
  <dl class="kv">
    <template v-for="item in items" :key="item.label">
      <dt>{{ item.label }}</dt>
      <dd>{{ item.value }}</dd>
    </template>
  </dl>
</template>

<style scoped>
.kv {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: var(--sp-2) var(--sp-4);
  margin: 0;
}
.kv dt {
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.kv dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text);
  word-break: break-all;
}
@media (max-width: 560px) {
  .kv { grid-template-columns: 1fr; gap: 2px var(--sp-4); }
  .kv dd { margin-bottom: var(--sp-2); }
}
</style>
