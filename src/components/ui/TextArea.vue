<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  mono?: boolean
  minHeight?: number
}>(), {
  placeholder: undefined,
  mono: true,
  minHeight: 140,
})
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <textarea
    class="textarea"
    :class="{ mono }"
    :value="modelValue"
    :placeholder="placeholder"
    spellcheck="false"
    :style="{ minHeight: `${minHeight}px` }"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped>
.textarea {
  display: block;
  width: 100%;
  padding: var(--sp-3);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  line-height: 1.55;
  resize: vertical;
  transition:
    border-color var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
}
.textarea::placeholder { color: var(--muted-2); }
.textarea:hover { border-color: var(--border-strong); }
.textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.textarea.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
</style>
