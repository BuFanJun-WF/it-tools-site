<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  active?: boolean
  tag?: 'button' | 'a'
  href?: string
  target?: string
}>(), {
  title: undefined,
  active: false,
  tag: 'button',
  href: undefined,
  target: undefined,
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener' : undefined"
    :class="['icon-btn', active && 'active']"
    :title="title"
    :aria-label="title"
    @click="$emit('click', $event as MouseEvent)"
  >
    <slot />
  </component>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}
.icon-btn:hover {
  background: var(--surface-2);
  color: var(--text);
}
.icon-btn.active {
  color: var(--accent-text);
  background: var(--accent-soft);
}
.icon-btn :deep(svg) { width: 18px; height: 18px; }
</style>
