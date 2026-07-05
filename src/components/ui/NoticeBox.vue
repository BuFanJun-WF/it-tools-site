<template>
  <div class="notice">
    <slot name="icon" />
    <div class="notice-body"><slot /></div>
  </div>
</template>

<style scoped>
.notice {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  background: var(--amber-soft);
  border-left: 3px solid var(--amber);
  color: var(--text);
  font-size: var(--fs-sm);
}
.notice-body { flex: 1; min-width: 0; }
.notice :deep(svg) {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--amber);
  margin-top: 1px;
}
</style>
