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
    class="field textarea"
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
  padding: var(--sp-3);
  line-height: 1.55;
  resize: vertical;
}
.textarea.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
</style>
