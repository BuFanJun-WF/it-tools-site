<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@/composables/useClipboard'
import AppIcon from './AppIcon.vue'

const props = withDefaults(defineProps<{
  /** Static text to copy, or a getter for live values. */
  text: string | (() => string)
  label?: string
}>(), {
  label: undefined,
})

const { t } = useI18n()
const { copied, copy } = useClipboard()

async function onClick() {
  await copy(props.text)
}
</script>

<template>
  <button class="copy-btn" :class="{ copied }" type="button" @click="onClick">
    <AppIcon :name="copied ? 'check' : 'copy'" :size="14" />
    <span>{{ copied ? t('common.copied') : (label ?? t('common.copy')) }}</span>
  </button>
</template>

<style scoped>
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--muted);
  font-size: var(--fs-xs);
  font-weight: 500;
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}
.copy-btn:hover {
  color: var(--text);
  border-color: var(--border-strong);
}
.copy-btn.copied {
  color: var(--diff-add-fg);
  border-color: color-mix(in srgb, var(--lime) 40%, transparent);
  background: var(--diff-add-bg);
}
</style>
