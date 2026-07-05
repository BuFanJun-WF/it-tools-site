<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'md' | 'sm'
  type?: 'button' | 'submit'
  disabled?: boolean
  title?: string
}>(), {
  variant: 'default',
  size: 'md',
  type: 'button',
  disabled: false,
  title: undefined,
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`, size === 'sm' && 'btn-sm']"
    :disabled="disabled"
    :title="title"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  height: 38px;
  padding: 0 var(--sp-4);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: 600;
  letter-spacing: -0.005em;
  white-space: nowrap;
  transition:
    background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}
.btn:hover { background: var(--surface-hover); }
.btn:active { transform: translateY(0.5px); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn :deep(svg) { width: 16px; height: 16px; }

.btn-primary {
  background: var(--accent);
  border-color: transparent;
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent-hover);
  color: #fff;
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--muted);
}
.btn-ghost:hover {
  background: var(--surface-2);
  color: var(--text);
}

.btn-sm {
  height: 32px;
  padding: 0 var(--sp-3);
  font-size: var(--fs-xs);
}
</style>
