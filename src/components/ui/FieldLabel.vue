<script setup lang="ts">
defineProps<{ for?: string }>()
</script>

<template>
  <label class="field-label" :for="$props.for">
    <slot />
  </label>
</template>

<style scoped>
.field-label {
  display: block;
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: var(--sp-2);
}
</style>
