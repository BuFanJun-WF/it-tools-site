<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  mono?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    :type="type ?? 'text'"
    class="input"
    :class="{ mono }"
    :value="modelValue"
    :placeholder="placeholder"
    spellcheck="false"
    autocomplete="off"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.input {
  width: 100%;
  height: 40px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  transition:
    border-color var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}
.input::placeholder { color: var(--muted-2); }
.input:hover { border-color: var(--border-strong); }
.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  background: var(--surface);
}
.input.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
</style>
