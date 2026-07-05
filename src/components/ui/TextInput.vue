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
    class="field input"
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
  height: 40px;
  padding: 0 var(--sp-3);
}
.input.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
</style>
